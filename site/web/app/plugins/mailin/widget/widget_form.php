<?php

/**
* Class Name : SIB_Widget_Subscribe
* Feature: Add widget for subscribe form
*/

class SIB_Widget_Subscribe extends WP_Widget
{

    // Construction function
    function __construct()
    {
        parent::__construct( 'sib_subscribe_form', 'SendinBlue Widget',
        array( 'description' =>
        'Display SendinBlue Widget' ) );
    }

    /**
    * Function Name : form
    * @param array $instance
    * @return string|void
    */
    function form( $instance )
    {
        // Retrieve previous values from instance
        // or set default values if not present
        if(isset($instance['widget_title']) && $instance['widget_title'] != '') {
            $widget_title = esc_attr( $instance['widget_title'] );
        } else {
            $widget_title = __('SendinBlue Newsletter', 'sib_lang');
        }

        if(isset($instance['button_text']) && $instance['button_text'] != '') {
            $button_text = esc_attr( $instance['button_text'] );
        } else {
            $button_text = __('Subscribe', 'sib_lang');
        }

        if(isset($instance['sib_list'])) {
            $sib_list = esc_attr( $instance['sib_list'] );
        } else {
            $sib_list = SIB_Manager::$list_id;
        }

        $lists = SIB_Page_Home::get_lists();
        $sub_atts = get_option(SIB_Manager::form_subscription_option_name);
        $available_atts = $sub_atts['available_attributes'];

        $displays = array();

        foreach($available_atts as $att)
        {
            if(isset($instance['disp_att_' . $att])) {
                $displays['disp_att_' . $att] = esc_attr( $instance['disp_att_' . $att] );
            } else {
                $displays['disp_att_' . $att] = 'yes';
            }
        }
        ?>
        <p>
            <label for="<?php echo $this->get_field_id( 'widget_title' ); ?>">
                <?php echo __('Widget Title', 'sib_lang') . ':'; ?>
            </label>
             <input type="text" class="widefat" id="<?php echo $this->get_field_id( 'widget_title' ); ?>" name="<?php echo $this->get_field_name( 'widget_title' ); ?>" value="<?php echo $widget_title; ?>" />
        </p>
        <p>
        <?php
        foreach($available_atts as $att)
        {
        ?>
            <p>
                <input type="checkbox" id="<?php echo $this->get_field_id('disp_att_' . $att); ?>" name="<?php echo $this->get_field_name('disp_att_'. $att); ?>" value="yes" <?php
                    checked($displays['disp_att_' . $att], 'yes');
                ?>>
                <label for="<?php echo $this->get_field_id('disp_att_' . $att); ?>"><?php echo __('Display', 'sib_lang') . ' ' . $att . ' ' . __('Input', 'sib_lang'); ?></label>
            </p>
        <?php
        }
        ?>
        </p>
        <p>
            <label for="<?php echo $this->get_field_id( 'button_text' ); ?>">
                <?php echo __('Button Text', 'sib_lang') . ':'; ?>
            </label>
            <input type="text" class="widefat" id="<?php echo $this->get_field_id( 'button_text' ); ?>" name="<?php echo $this->get_field_name( 'button_text' ); ?>" value="<?php echo $button_text; ?>" />
        </p>
        <p>
            <label for="<?php echo $this->get_field_id( 'sib_list' ); ?>">
                <?php echo __('List', 'sib_lang') . ':'; ?>
            </label>
            <select class="widefat" id="<?php echo $this->get_field_id('sib_list'); ?>" name="<?php echo $this->get_field_name('sib_list'); ?>">
            <?php
            foreach($lists as $list)
            {
                ?>
                <option value="<?php echo $list['id']; ?>" <?php selected($sib_list, $list['id']); ?>><?php echo $list['name']; ?></option>
                <?php
            }
            ?>
            </select>
        </p>
        <?php
    }

    /**
     * Function name: update
     * @param array $new_instance
     * @param array $old_instance
     * @return array
     */
    function update( $new_instance, $old_instance )
    {
        $instance = $old_instance;

        $instance['widget_title'] =
            strip_tags( $new_instance['widget_title'] );

        $instance['button_text'] =
            strip_tags( $new_instance['button_text'] );

        $instance['sib_list'] =
            strip_tags( $new_instance['sib_list'] );

        $sub_atts = get_option(SIB_Manager::form_subscription_option_name);
        $available_atts = $sub_atts['available_attributes'];

        foreach($available_atts as $att)
        {
            $instance['disp_att_' . $att] =
                strip_tags( $new_instance['disp_att_'. $att] );
        }

        return $instance;
    }

    /**
     * Function Name : widget
     * @param array $args
     * @param array $instance
     */
    function widget( $args, $instance )
    {

        // Extract members of args array as individual variables
        extract( $args );
        $widget_title = ( !empty( $instance['widget_title'] ) ?
            esc_attr( $instance['widget_title'] ) :
            'SendinBlue Newsletter' );
        // Display widget title
        echo $before_widget;
        echo $before_title;
        echo apply_filters('widget_title', $widget_title);
        echo $after_title;
        SIB_Manager::$instance->generate_form_box($instance);
        echo $after_widget;
    }

}


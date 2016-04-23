<?php
/**
 * Responsible for loading all Cornerstone elements
 */
class Cornerstone_Legacy_Renderer {

	private $manager;
	private static $instance;

	public function __construct( $manager ) {
		self::$instance = $this;
		$this->manager = $manager;
	}

	/**
	 * Return an element that has been rendered with data formatted for saving
	 * @param  array $data  element data
	 * @return string       final shortcode
	 */
	public static function save_element( $data ) {
		$element = self::$instance->manager->get($data['_type']);

		if ( $element->shouldRender() == true ) {
			return '';
		}

		return $element->renderElement( self::$instance->formatData( $data, true ) );
	}

	/**
	 * Return an element that has been rendered with data formatted for the preview window
	 * @param  array $data  element data
	 * @return string       shortcode to be processed for preview window
	 */
	public function renderElement( $data ) {

		$element = $this->manager->get($data['_type']);

		if ( $element == null )
			return $this->renderError( 'Element not registered: <strong>' . $data['_type'] . '</strong>' );

		if ( !is_callable( array( $element, 'render' ) ) )
			return $this->renderError( 'Element missing render method: <strong>' . $data['_type'] . '</strong>' );

		$data = $this->formatData( $data );

		$emptyConditions = $element->emptyCondition();
		$renderEmpty = false;
		if ( is_array( $emptyConditions ) ) {

			$remainingConditions = array();

			foreach ($element->emptyCondition() as $conditionName => $conditionValue) {

				$negate = ( strpos($conditionName, '!') == 0 );

				if ($negate)
					$conditionName = str_replace('!', '', $conditionName);

	  		$controlValue = $data[$conditionName];

	  		$check = ( is_array($controlValue) ) ? in_array( $controlValue, $conditionValue ) : ( $controlValue == $conditionValue );

	  		if ( $negate )
	  			$check = !$check;

	  		if ($check)
	  			$remainingConditions[] = $conditionName;

			}

			$renderEmpty = empty($remainingConditions);

		} elseif ( $emptyConditions == true ) {
			$renderEmpty = true;
		}

		if ( $renderEmpty || !$element->can_preview() )
				return '';

		return $element->renderElement( $data );

	}

	/**
	 * If something goes wrong with a render job, output empty element styling with a message
	 * @param  string $message
	 * @return string
	 */
	private function renderError( $message ) {
		return '<div class="cs-empty-element cs-element-error"><span class="sub-title">' . $message . '</span></div>';
	}

	/**
	 * Process data before it is rendered.
	 * @param  array   $data    Input data
	 * @param  boolean $saving  If the data is meant to be saved (otherwise we're in the preview window)
	 * @param  boolean $child   Flag indicating if we're working recursively
	 * @return [type]           Formatted output data
	 */
	public function formatData( $data, $saving = false, $child = false ) {

		$element = $this->manager->get( $data['_type'] );

		$data = wp_parse_args( $data, $element->get_defaults() );

		// Recursively apply to child collections
		if (isset($data['elements']) && count( $data['elements'] ) > 0 ) {

			$elements = array();
			foreach ($data['elements'] as $key => $item) {
				$elements[] = $this->formatData( $item, $saving, true );
			}
			$data['elements'] = $elements;

		} else {
			$data['elements'] = array();
		}

		if ( isset( $data['custom_id'] ) ) {
			$data['id'] = $data['custom_id'];
			unset($data['custom_id']);
		}

		// Get around id being a reserved keyword. This way we can still use it in render methods for elements
		if ( isset( $data['custom_id'] ) )
			$data['id'] = $data['custom_id'];

		$data['builder'] = !$saving;


		// Format data before rendering
		foreach ($data as $key => $item) {

			if ( is_array($item) && count($item) == 5 && ( $item[4] == 'linked' || $item[4] == 'unlinked' ) ) {
				$data[$key . '_linked' ] = array_pop($item);
				$data[$key] = array_map( 'esc_html', array( $item[0],$item[1],$item[2],$item[3] ) );
				continue;
			}

			// Convert boolean to string
			if ( $item === true ) {
				$data[$key] = 'true';
				continue;
			}

			if ( $item === false ) {
				$data[$key] = 'false';
				continue;
			}

			// Secure HTML from unworthy users
			if ( is_string( $item ) && !current_user_can( 'unfiltered_html' ) ) {

				$data[$key] = wp_kses( $item, $this->ksesTags() );
				continue;
			}

		}

		if ( !isset( $data['content'] ) ) {
			$data['content'] = '';
		}



		return $data;
	}

	public function ksesTags( ) {

		$tags = wp_kses_allowed_html( 'post' );

		$tags['iframe'] = array (
	    'align'       => true,
	    'frameborder' => true,
	    'height'      => true,
	    'width'       => true,
	    'sandbox'     => true,
	    'seamless'    => true,
	    'scrolling'   => true,
	    'srcdoc'      => true,
	    'src'         => true,
	    'class'       => true,
	    'id'          => true,
	    'style'       => true,
	    'border'      => true,
	    'list'        => true //YouTube embeds
		);

		return $tags;
	}
}
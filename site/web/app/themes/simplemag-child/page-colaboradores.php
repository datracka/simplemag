<?php
/**
 * The template for displaying all pages
 *
 * @package SimpleMag
 * @since    SimpleMag 1.2
 **/
get_header();
global $ti_option;
?>
    <section id="content" role="main" class="clearfix anmtd">
        <div id="post-953" class="post-953 page type-page status-publish hentry post-item">
            <div class="page-title wrapper title-with-sep">
                <header class="entry-header page-header">
                    <h1 class="entry-title">Colaboradores</h1>
                </header>
            </div>
            <div class="wrapper">
                <article class="entry-content">
                    <div id="x-section-1" class="x-section bg-image"
                         style=" margin: 0px; padding: 45px 0px;
                         background-image: url('../app/uploads/2016/05/open_book_macro-wallpaper-800x600.jpg');
                         background-color: transparent;"
                         data-x-element="section"
                         data-x-params="{&quot;type&quot;:&quot;image&quot;,&quot;parallax&quot;:false}">
                        <div class="x-container" style="margin: 0px auto; padding: 0px; ">
                            <div class="x-column x-sm x-1-1" style="padding: 180px 0px 0px; ">&nbsp;</div>
                        </div>
                    </div>
                    <div id="x-section-2" class="x-section"
                         style=" margin: 0px; padding: 45px 0px; background-color: transparent;">
                        <div class="x-container" style="margin: 0px auto; padding: 0px; ">
                            <div class="x-column x-sm x-1-1" style="padding: 0px; ">
                                <div class="x-text"><p><b>Laenredadera.io</b> es un proyecto abierto a todos aquellos
                                        que quieran participar. Si te gusta escribir, te interesa el área de crecimiento
                                        personal y piensas que mediante la palabra se pueden transmitir poderosas ideas
                                        que cambien el mundo envíanos un e-mail a <a
                                            href="mailto:laenredadera.digital@gmail.com">laenredadera.digital@gmail.com</a>
                                        y nos pondremos en contacto contigo tan pronto como nos sea posible.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="x-container" style="margin: 0px auto; padding: 0px; ">
                        <div draggable="false" class="x-section x-container__mobile" id="x-section-3"  
                             style="padding: 45px 0px;margin: 0px;">
                            <?php
                            $index = 0;
                            $users = get_users();
                            if ($users) {
                                foreach ($users as $user) {
                                    if (in_array('administrator', $user->roles) == false
                                        && $user->ID != 3 && $user->ID != 4 && $user->ID != 5
                                    ) {
                                        if ($index > 0 and $index % 3 == 0) {
                                            echo '</div></div>';
                                            echo '<div class="x-container" style="margin: 0px auto; padding: 0px;"> ';
                                            echo '<div draggable="false" class="x-section x-container__mobile" id="x-section-3"  style="padding: 45px 0px;margin: 0px;">';
                                        }
                                        ?><div class="x-column x-sm x-1-3" style="padding: 0px; "><div class="x-author-box cf">
                                            <?php echo get_avatar($user->user_email) ?>
                                            <div class="x-author-info">
                                                <h2 class="h-author mtn">
                                                    <?php echo $user->first_name . " " . $user->last_name; ?>
                                                </h2>
                                                <p class="p-author mbn"><?php echo $user->description ?></p>
                                            </div>
                                        </div>
                                        </div>
                                        <?php
                                        $index++;
                                    }
                                }
                                echo '</div></div>';
                            }
                            ?>
                </article>
            </div>
    </section><!-- #content -->
<?php get_footer(); ?>
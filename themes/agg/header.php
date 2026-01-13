<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <header class="site-header">
        <div class="container">
            <div class="site-branding">
                <?php
                if (has_custom_logo()) {
                    the_custom_logo();
                } else {
                    ?>
                    <h1 class="site-title"><a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                            <?php bloginfo('name'); ?>
                        </a></h1>
                    <?php
                }
                ?>
            </div><!-- .site-branding -->

            <nav class="main-navigation">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_id' => 'primary-menu',
                    'container' => false,
                ));
                ?>
            </nav><!-- .main-navigation -->

            <div class="header-tools">
                <a href="<?php echo wc_get_cart_url(); ?>" class="cart-link">
                    Cart (
                    <?php echo WC()->cart->get_cart_contents_count(); ?>)
                </a>
            </div>
        </div>
    </header>
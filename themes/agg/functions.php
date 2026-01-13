<?php
/**
 * AGG Theme Functions
 */

function agg_setup()
{
    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title.
    add_theme_support('title-tag');

    // Register Navigation Menus
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'agg'),
    ));

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support('post-thumbnails');

    // Add WooCommerce Support
    add_theme_support('woocommerce');
}
add_action('after_setup_theme', 'agg_setup');

/**
 * Enqueue scripts and styles.
 */
function agg_scripts()
{
    // Enqueue Google Fonts (Inter)
    wp_enqueue_style('agg-google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', array(), null);

    // Enqueue Main Stylesheet
    wp_enqueue_style('agg-style', get_stylesheet_uri(), array(), '1.1.0');
}
add_action('wp_enqueue_scripts', 'agg_scripts');

/**
 * WooCommerce Wrapper Fix
 */
function agg_wrapper_start()
{
    echo '<div class="container main-content-area" style="margin-top: 2rem; margin-bottom: 2rem;">';
}
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
add_action('woocommerce_before_main_content', 'agg_wrapper_start', 10);

function agg_wrapper_end()
{
    echo '</div>';
}
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
add_action('woocommerce_after_main_content', 'agg_wrapper_end', 10);

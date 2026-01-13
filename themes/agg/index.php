<?php
get_header();
?>

<main id="primary" class="site-main container">

    <?php
    if (have_posts()):

        if (is_home() && !is_front_page()):
            ?>
            <header>
                <h1 class="page-title screen-reader-text">
                    <?php single_post_title(); ?>
                </h1>
            </header>
            <?php
        endif;

        /* Start the Loop */
        while (have_posts()):
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header">
                    <?php the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>'); ?>
                </header>

                <div class="entry-content">
                    <?php
                    the_content(
                        sprintf(
                            wp_kses(
                                /* translators: %s: Name of current post. Only visible to screen readers */
                                __('Continue reading<span class="screen-reader-text"> "%s"</span>', 'agg'),
                                array(
                                    'span' => array(
                                        'class' => array(),
                                    ),
                                )
                            ),
                            wp_kses_post(get_the_title())
                        )
                    );
                    ?>
                </div>
            </article>
            <?php
        endwhile;

    else:
        echo '<p>Nothing found.</p>';

    endif;
    ?>

</main><!-- #main -->

<?php
get_footer();

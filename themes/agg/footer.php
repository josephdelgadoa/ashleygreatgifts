<footer class="site-footer">
    <div class="container">
        <div class="site-info">
            <a href="<?php echo esc_url(__('https://wordpress.org/', 'agg')); ?>">
                <?php
                /* translators: %s: CMS Name, i.e. WordPress. */
                printf(esc_html__('Proudly powered by %s', 'agg'), 'WordPress');
                ?>
            </a>
            <span class="sep"> | </span>
            <?php
            /* translators: 1: Theme name, 2: Theme author. */
            printf(esc_html__('Theme: %1$s by %2$s.', 'agg'), 'AGG Minimalist', 'AGG Team');
            ?>
            <br>
            &copy;
            <?php echo date('Y'); ?>
            <?php bloginfo('name'); ?>. All rights reserved.
        </div><!-- .site-info -->
    </div>
</footer>

<?php wp_footer(); ?>

</body>

</html>
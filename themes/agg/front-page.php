<?php
/**
 * The template for displaying the front page.
 */

get_header();
?>

<main id="primary" class="site-main">

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>Minimalist Style for Everyone</h1>
            <p>Discover the latest trends for men, women, and children.</p>
            <a href="<?php echo get_permalink(wc_get_page_id('shop')); ?>" class="btn">Shop Now</a>
        </div>
        <!-- Background Image (Optional: Add inline style or class for bg image) -->
    </section>

    <!-- Categories Grid -->
    <section class="categories-section container">
        <h2 class="section-title">Shop by Category</h2>
        <div class="categories-grid">

            <!-- Items for Men -->
            <a href="<?php echo site_url('/product-category/men/'); ?>" class="category-card">
                <img src="https://placehold.co/600x800/1a1a1a/FFF?text=Men" alt="Men's Fashion">
                <div class="category-content">
                    <h3>Men</h3>
                    <span>Shop Collection &rarr;</span>
                </div>
            </a>

            <!-- Items for Women -->
            <a href="<?php echo site_url('/product-category/women/'); ?>" class="category-card">
                <img src="https://placehold.co/600x800/d4a5a5/FFF?text=Women" alt="Women's Fashion">
                <div class="category-content">
                    <h3>Women</h3>
                    <span>Shop Collection &rarr;</span>
                </div>
            </a>

            <!-- Items for Kids -->
            <a href="<?php echo site_url('/product-category/kids/'); ?>" class="category-card">
                <img src="https://placehold.co/600x800/8bc34a/FFF?text=Kids" alt="Kids' Fashion">
                <div class="category-content">
                    <h3>Kids</h3>
                    <span>Shop Collection &rarr;</span>
                </div>
            </a>

        </div>
    </section>

    <!-- Featured Products (WooCommerce Loop Optional) -->
    <section class="featured-products container" style="padding-bottom: 4rem;">
        <h2 class="section-title">New Arrivals</h2>
        <?php echo do_shortcode('[products limit="4" columns="4" orderby="date"]'); ?>
    </section>

</main>

<?php
get_footer();

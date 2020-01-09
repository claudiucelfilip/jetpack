<?php
/**
 * OpenTable Block.
 *
 * @since 8.2
 *
 * @package Jetpack
 */

if ( jetpack_opentable_block_is_available() ) {
	jetpack_register_block(
		'jetpack/opentable',
		array( 'render_callback' => 'jetpack_opentable_block_load_assets' )
	);
} else {
	Jetpack_Gutenberg::set_extension_unavailable(
		'jetpack/opentable',
		'missing_plan',
		array(
			'required_feature' => 'opentable',
			'required_plan'    => ( defined( 'IS_WPCOM' ) && IS_WPCOM ) ? 'value_bundle' : 'jetpack_premium',
		)
	);
}

/**
 * Is the OpenTable block available on a given site
 *
 * @return bool True if the block is available, false otherwise.
 */
function jetpack_opentable_block_is_available() {
	// For WPCOM sites.
	if ( defined( 'IS_WPCOM' ) && IS_WPCOM && function_exists( 'has_any_blog_stickers' ) ) {
		$site_id = jetpack_get_blog_id();
		return has_any_blog_stickers( array( 'premium-plan', 'business-plan', 'ecommerce-plan' ), $site_id );
	}
	// For all Jetpack sites.
	return Jetpack::is_active() && Jetpack_Plan::supports( 'opentable' );
}

/**
 * Get the current blog ID
 *
 * @return int The current blog ID
 */
function jetpack_opentable_block_get_blog_id() {
	if ( defined( 'IS_WPCOM' ) && IS_WPCOM ) {
		return get_current_blog_id();
	}
	return Jetpack_Options::get_option( 'id' );
}

/**
 * OpenTable block registration/dependency declaration.
 *
 * @param array $attributes    Array containing the OpenTable block attributes.
 *
 * @return string
 */
function jetpack_opentable_block_load_assets( $attributes ) {
	Jetpack_Gutenberg::load_assets_as_required( 'opentable' );

	$classes = Jetpack_Gutenberg::block_classes( 'opentable', $attributes );
	$content = '<div class="' . esc_attr( $classes ) . '">';
	// The OpenTable script uses multiple `rid` paramters,
	// so we can't use WordPress to output it, as WordPress attempts to validate it and removes them.
	// phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
	$content .= '<script type="text/javascript" src="' . esc_url( jetpack_opentable_build_embed_url( $attributes ) ) . '"></script>';
	$content .= '</div>';
	return $content;
}

/**
 * Get the a block attribute
 *
 * @param array  $attributes Array of block attributes.
 * @param string $attribute_name The attribute to get.
 *
 * @return string The filtered attribute
 */
function jetpack_opentable_block_get_attribute( $attributes, $attribute_name ) {
	if ( isset( $attributes[ $attribute_name ] ) ) {
		if ( in_array( $attribute_name, array( 'iframe', 'newtab' ), true ) ) {
			return $attributes[ $attribute_name ] ? 'true' : 'false';
		}
		return $attributes[ $attribute_name ];
	}

	$default_attributes = array(
		'style'  => 'standard',
		'iframe' => 'true',
		'domain' => 'com',
		'lang'   => 'en-US',
		'newtab' => 'false',
	);

	return isset( $default_attributes[ $attribute_name ] ) ? $default_attributes[ $attribute_name ] : null;
}

/**
 * Get the block type attribute
 *
 * @param array $attributes Array of block attributes.
 *
 * @return string The filtered attribute
 */
function jetpack_opentable_block_get_type_attribute( $attributes ) {
	if ( ! empty( $attributes['rid'] ) && count( $attributes['rid'] ) > 1 ) {
		return 'multi';
	}

	if ( empty( $attributes['style'] ) || 'button' !== $attributes['style'] ) {
		return 'standard';
	}

	return 'button';
}

/**
 * Get the block theme attribute
 *
 * OpenTable has a confusing mix of themes and types for the widget. A type
 * can have a theme, but the button style can not have a theme. The other two
 * types (multi and standard) can have one of the three themes.
 *
 * We have combined these into a `style` attribute as really there are 4 styles
 * standard, wide, tall, and button. Multi can be determined by the number of
 * restaurant IDs we have.
 *
 * This function along with `jetpack_opentable_block_get_type_attribute`, translates
 * the style attribute to a type and theme.
 *
 * Type        Theme      Style
 * ==========|==========|==========
 * Multi     |          |
 * Standard  | Standard | Standard
 *           | Wide     | Wide
 *           | Tall     | Tall
 * Button    | Standard | Button
 *
 * @param array $attributes Array of block attributes.
 *
 * @return string The filtered attribute
 */
function jetpack_opentable_block_get_theme_attribute( $attributes ) {
	if ( empty( $attributes['style'] ) || 'button' === $attributes['style'] ) {
		return 'standard';
	}

	return $attributes['style'];
}

/**
 * Build an embed URL from an array of block attributes.
 *
 * @param array $attributes Array of block attributess.
 *
 * @return string Embed URL
 */
function jetpack_opentable_build_embed_url( $attributes ) {
	$url = add_query_arg(
		array(
			'type'   => jetpack_opentable_block_get_type_attribute( $attributes ),
			'theme'  => jetpack_opentable_block_get_theme_attribute( $attributes ),
			'iframe' => jetpack_opentable_block_get_attribute( $attributes, 'iframe' ),
			'domain' => jetpack_opentable_block_get_attribute( $attributes, 'domain' ),
			'lang'   => jetpack_opentable_block_get_attribute( $attributes, 'lang' ),
			'newtab' => jetpack_opentable_block_get_attribute( $attributes, 'newtab' ),
		),
		'//www.opentable.com/widget/reservation/loader'
	);

	if ( ! empty( $attributes['rid'] ) ) {
		foreach ( $attributes['rid'] as $rid ) {
			$url .= '&rid=' . $rid;
		}
	}

	return apply_filters( 'jetpack_calendly_block_url', esc_url( $url ) );
}

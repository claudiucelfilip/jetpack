/**
 * External Dependencies
 */
import { isEqual } from 'lodash';

/**
 * WordPress dependencies
 */
import { BlockIcon, InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	ColorPicker,
	ExternalLink,
	Notice,
	PanelBody,
	Placeholder,
	SelectControl,
	TextareaControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import icon from './icon';
import attributeDetails, { getValidatedAttributes } from './attributes';

const getUrlAndStyleFromEmbedCode = embedCode => {
	if ( embedCode.indexOf( 'http' ) === 0 ) {
		return {
			style: 'inline',
			url: embedCode,
		};
	}

	let urlFromRegex = embedCode.match( / *data-url *= *["']?([^"']*)/i );
	if ( urlFromRegex && urlFromRegex[ 1 ] && urlFromRegex[ 1 ].indexOf( 'http' ) === 0 ) {
		return {
			style: 'inline',
			url: urlFromRegex[ 1 ],
		};
	}

	urlFromRegex = embedCode.match( / *Calendly\.initPopupWidget\({ *url: *["']?([^"']*)/i );
	if ( urlFromRegex && urlFromRegex[ 1 ] && urlFromRegex[ 1 ].indexOf( 'http' ) === 0 ) {
		return {
			style: 'link',
			url: urlFromRegex[ 1 ],
		};
	}

	urlFromRegex = embedCode.match( / *Calendly\.initBadgeWidget\({ *url: *["']?([^"']*)/i );
	if ( urlFromRegex && urlFromRegex[ 1 ] && urlFromRegex[ 1 ].indexOf( 'http' ) === 0 ) {
		return {
			style: 'link',
			url: urlFromRegex[ 1 ],
		};
	}
};

const getNewAttributesFromUrl = ( { url, style } ) => {
	const attributes = { style };
	const urlObject = new URL( url );
	attributes.url = urlObject.origin + urlObject.pathname;

	if ( ! urlObject.search ) {
		return attributes;
	}

	const searchParams = new URLSearchParams( urlObject.search );
	const backgroundColor = searchParams.get( 'background_color' );
	const primaryColor = searchParams.get( 'primary_color' );
	const textColor = searchParams.get( 'text_color' );
	const hexRegex = /^[A-Za-z0-9]{6}$/;

	if ( searchParams.get( 'hide_event_type_details' ) ) {
		attributes.hideEventTypeDetails = searchParams.get( 'hide_event_type_details' );
	}

	if ( backgroundColor && backgroundColor.match( hexRegex ) ) {
		attributes.backgroundColor = backgroundColor;
	}

	if ( primaryColor && primaryColor.match( hexRegex ) ) {
		attributes.primaryColor = primaryColor;
	}

	if ( textColor && textColor.match( hexRegex ) ) {
		attributes.textColor = textColor;
	}

	return getValidatedAttributes( attributeDetails, attributes );
};

export default function CalendlyEdit( { attributes, className, setAttributes } ) {
	const validatedAttributes = getValidatedAttributes( attributeDetails, attributes );

	if ( ! isEqual( validatedAttributes, attributes ) ) {
		setAttributes( validatedAttributes );
	}

	const {
		backgroundColor,
		buttonText,
		hideEventTypeDetails,
		primaryColor,
		textColor,
		style,
		url,
	} = validatedAttributes;
	const [ embedCode, setEmbedCode ] = useState();
	const [ notice, setNotice ] = useState();

	const setErrorNotice = () =>
		setNotice(
			<>
				{ __(
					"Your calendar couldn't be embedded. Please double check your URL or code.",
					'jetpack'
				) }
			</>
		);

	const parseEmbedCode = event => {
		if ( ! event ) {
			setErrorNotice();
			return;
		}

		event.preventDefault();

		if ( ! embedCode ) {
			setErrorNotice();
			return;
		}

		const newUrlAndStyle = getUrlAndStyleFromEmbedCode( embedCode );
		if ( ! newUrlAndStyle ) {
			setErrorNotice();
			return;
		}

		setAttributes( getNewAttributesFromUrl( newUrlAndStyle ) );
	};

	const embedCodeForm = (
		<form onSubmit={ parseEmbedCode }>
			<TextareaControl
				onChange={ value => setEmbedCode( value ) }
				placeholder={ __( 'Enter your Calendly web address or embed code below.' ) }
			>
				{ embedCode }
			</TextareaControl>
			<div>
				<Button isLarge type="submit">
					{ _x( 'Embed', 'button label', 'jetpack' ) }
				</Button>
			</div>
			<p>
				<ExternalLink
					href="https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview"
					target="_blank"
				>
					{ __( 'Need help finding your embed code?' ) }
				</ExternalLink>
			</p>
		</form>
	);

	const blockPlaceholder = (
		<Placeholder
			label={ __( 'Calendly', 'jetpack' ) }
			icon={ <BlockIcon icon={ icon } /> }
			notices={
				notice && (
					<Notice status="error" isDismissible={ false }>
						{ notice }
					</Notice>
				)
			}
		>
			{ embedCodeForm }
		</Placeholder>
	);

	const iframeSrc = () => {
		let src = url + '?embed_domain=wordpress.com&amp;embed_type=Inline';
		src += '&amp;hide_event_type_details=' + ( hideEventTypeDetails ? 1 : 0 );
		src += '&amp;background_color=' + backgroundColor;
		src += '&amp;primary_color=' + primaryColor;
		src += '&amp;text_color=' + textColor;
		return src;
	};

	const inlinePreview = (
		<>
			<div className={ `${ className }-overlay` }></div>
			<iframe
				src={ iframeSrc() }
				width="100%"
				height="100%"
				frameborder="0"
				data-origwidth="100%"
				data-origheight="100%"
				style={ { minWidth: '320px', height: '630px', width: '100%' } }
				title="Calendly"
			></iframe>
		</>
	);

	const linkPreview = <a href="#">{ buttonText }</a>;

	const preview = style === 'inline' ? inlinePreview : linkPreview;

	const styleOptions = [
		{ value: 'inline', label: __( 'Inline', 'jetpack' ) },
		{ value: 'link', label: __( 'Link', 'jetpack' ) },
	];

	const inspectorControls = (
		<InspectorControls>
			{ url && (
				<PanelBody title={ __( 'Settings', 'jetpack' ) }>
					<SelectControl
						label={ __( 'Type', 'jetpack' ) }
						value={ style }
						onChange={ newStyle => setAttributes( { style: newStyle } ) }
						options={ styleOptions }
					/>
					<ToggleControl
						label={ __( 'Hide Event Type Details', 'jetpack' ) }
						checked={ hideEventTypeDetails }
						onChange={ () => setAttributes( { hideEventTypeDetails: ! hideEventTypeDetails } ) }
					/>
				</PanelBody>
			) }
			{ url && (
				<PanelBody title={ __( 'Background Color', 'jetpack' ) } initialOpen={ false }>
					<ColorPicker
						color={ backgroundColor }
						onChangeComplete={ newBackgroundColor =>
							setAttributes( { backgroundColor: newBackgroundColor.hex.substr( 1 ) } )
						}
						disableAlpha
					/>
				</PanelBody>
			) }
			{ url && (
				<PanelBody title={ __( 'Primary Color', 'jetpack' ) } initialOpen={ false }>
					<ColorPicker
						color={ primaryColor }
						onChangeComplete={ newPrimaryColor =>
							setAttributes( { primaryColor: newPrimaryColor.hex.substr( 1 ) } )
						}
						disableAlpha
					/>
				</PanelBody>
			) }
			{ url && (
				<PanelBody title={ __( 'Text Color', 'jetpack' ) } initialOpen={ false }>
					<ColorPicker
						color={ textColor }
						onChangeComplete={ newTextColor =>
							setAttributes( { textColor: newTextColor.hex.substr( 1 ) } )
						}
						disableAlpha
					/>
				</PanelBody>
			) }
			<PanelBody title={ __( 'Embed code', 'jetpack' ) } initialOpen={ false }>
				{ embedCodeForm }
			</PanelBody>
		</InspectorControls>
	);

	return (
		<>
			{ inspectorControls }
			{ url ? preview : blockPlaceholder }
		</>
	);
}

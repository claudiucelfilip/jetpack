/**
 * External Dependencies
 */
import 'url-polyfill';
import classnames from 'classnames';
import { isEqual } from 'lodash';

/**
 * WordPress dependencies
 */
import { BlockControls, BlockIcon, InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	ExternalLink,
	Notice,
	PanelBody,
	Placeholder,
	ToggleControl,
	Toolbar,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';
import { ENTER, SPACE } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import './editor.scss';
import icon from './icon';
import attributeDetails, { getValidatedAttributes } from './attributes';
import SubmitButton from '../../shared/submit-button';
import { getAttributesFromEmbedCode } from './utils';

export default function CalendlyEdit( { attributes, className, setAttributes } ) {
	const validatedAttributes = getValidatedAttributes( attributeDetails, attributes );

	if ( ! isEqual( validatedAttributes, attributes ) ) {
		setAttributes( validatedAttributes );
	}

	const {
		backgroundColor,
		submitButtonText,
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

		const newAttributes = getAttributesFromEmbedCode( embedCode );
		if ( ! newAttributes ) {
			setErrorNotice();
			return;
		}

		const newValidatedAttributes = getValidatedAttributes( attributeDetails, newAttributes );

		setAttributes( newValidatedAttributes );
	};

	const embedCodeForm = (
		<form onSubmit={ parseEmbedCode }>
			<input
				type="text"
				id="embedCode"
				onChange={ event => setEmbedCode( event.target.value ) }
				placeholder={ __( 'Calendly web address or embed code…' ) }
				value={ embedCode }
				className="components-placeholder__input"
			/>
			<div>
				<Button isLarge type="submit">
					{ _x( 'Embed', 'button label', 'jetpack' ) }
				</Button>
			</div>
			<div className={ `${ className }-learn-more` }>
				<ExternalLink
					href="https://help.calendly.com/hc/en-us/articles/223147027-Embed-options-overview"
					target="_blank"
				>
					{ __( 'Need help finding your embed code?' ) }
				</ExternalLink>
			</div>
		</form>
	);

	const blockPlaceholder = (
		<Placeholder
			label={ __( 'Calendly', 'jetpack' ) }
			instructions={ __( 'Enter your Calendly web address or embed code below.', 'jetpack' ) }
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
				frameBorder="0"
				data-origwidth="100%"
				data-origheight="100%"
				style={ { minWidth: '320px', height: '630px', width: '100%' } }
				title="Calendly"
			></iframe>
		</>
	);

	const submitButtonPreview = (
		<SubmitButton
			submitButtonText={ submitButtonText }
			attributes={ attributes }
			setAttributes={ setAttributes }
		/>
	);

	const linkPreview = (
		<>
			<a style={ { alignSelf: 'flex-start', border: 'none' } } className="wp-block-button__link">
				{ submitButtonText }
			</a>
		</>
	);

	const blockPreview = ( previewStyle, disabled ) => {
		if ( previewStyle === 'inline' ) {
			return inlinePreview;
		}

		if ( disabled ) {
			return linkPreview;
		}

		return submitButtonPreview;
	};

	const styleOptions = [
		{ value: 'inline', label: __( 'Inline', 'jetpack' ) },
		{ value: 'link', label: __( 'Link', 'jetpack' ) },
	];

	const blockControls = (
		<BlockControls>
			{ url && (
				<Toolbar
					isCollapsed={ true }
					icon="admin-appearance"
					label={ __( 'Style', 'jetpck' ) }
					controls={ styleOptions.map( styleOption => ( {
						title: styleOption.label,
						isActive: styleOption.value === style,
						onClick: () => setAttributes( { style: styleOption.value } ),
					} ) ) }
					popoverProps={ { className: 'is-calendly' } }
				/>
			) }
		</BlockControls>
	);

	const inspectorControls = (
		<InspectorControls>
			{ url && (
				<>
					<PanelBody title={ __( 'Styles', 'jetpack' ) }>
						<div className="block-editor-block-styles">
							{ styleOptions.map( styleOption => {
								return (
									<div
										key={ styleOption.value }
										className={ classnames( 'block-editor-block-styles__item is-calendly', {
											'is-active': styleOption.value === style,
										} ) }
										onClick={ () => {
											setAttributes( { style: styleOption.value } );
										} }
										onKeyDown={ event => {
											if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
												event.preventDefault();
												setAttributes( { style: styleOption.value } );
											}
										} }
										role="button"
										tabIndex="0"
										aria-label={ styleOption.label }
									>
										<div className="block-editor-block-styles__item-preview editor-styles-wrapper is-calendly">
											{ blockPreview( styleOption.value, true ) }
										</div>
										<div className="block-editor-block-styles__item-label">
											{ styleOption.label }
										</div>
									</div>
								);
							} ) }
						</div>
					</PanelBody>
				</>
			) }

			<PanelBody title={ __( 'Calendar Settings', 'jetpack' ) } initialOpen={ false }>
				<form onSubmit={ parseEmbedCode } className={ `${ className }-embed-form-sidebar` }>
					<input
						type="text"
						id="embedCode"
						onChange={ event => setEmbedCode( event.target.value ) }
						placeholder={ __( 'Calendly web address or embed code…' ) }
						value={ embedCode }
						className="components-placeholder__input"
					/>
					<div>
						<Button isLarge type="submit">
							{ _x( 'Embed', 'button label', 'jetpack' ) }
						</Button>
					</div>
				</form>

				<ToggleControl
					label={ __( 'Hide Event Type Details', 'jetpack' ) }
					checked={ hideEventTypeDetails }
					onChange={ () => setAttributes( { hideEventTypeDetails: ! hideEventTypeDetails } ) }
				/>
			</PanelBody>
		</InspectorControls>
	);

	return (
		<>
			{ inspectorControls }
			{ blockControls }
			{ url ? blockPreview( style ) : blockPlaceholder }
		</>
	);
}

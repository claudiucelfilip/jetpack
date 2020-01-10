/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { getURLFromEmbedCode } from '../utils';

describe( 'calendly-parse-embed', () => {
	test( 'URL with http', () => {
		expect(
			getURLFromEmbedCode( 'https://calendly.com/scruffian/usability-test?month=2019-12' )
		).toBe(
			'https://calendly.com/scruffian/usability-test?month=2019-12'
		);
	} );
	
	test( 'URL without http', () => {
		expect(
			getURLFromEmbedCode( 'https://calendly.com/scruffian/usability-test?month=2019-12' )
		).toBe(
			'https://calendly.com/scruffian/usability-test?month=2019-12'
		);
	} );

	test( 'Inline embed code', () => {
		const inlineEmbedCode = '<!-- Calendly inline widget begin -->' +
			'<div class="calendly-inline-widget" data-url="https://calendly.com/scruffian/usability-test" style="min-width:320px;height:630px;"></div>' +
			'<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>' +
			'<!-- Calendly inline widget end -->';

		expect(
			getURLFromEmbedCode( inlineEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test'
		);
	} );

	test( 'Widget embed code', () => {
		const widgetEmbedCode = '<!-- Calendly badge widget begin -->' +
			'<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">' +
			'<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>' +
			'<script type="text/javascript">Calendly.initBadgeWidget({ url: \'https://calendly.com/scruffian/usability-test\', text: \'Schedule time with me\', color: \'#00a2ff\', textColor: \'#ffffff\', branding: true });</script>' +
			'<!-- Calendly badge widget end -->';

		expect(
			getURLFromEmbedCode( widgetEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test'
		);
	} );

	test( 'Text embed code', () => {
		const textEmbedCode = '<!-- Calendly link widget begin -->' +
			'<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">' +
			'<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>' +
			'<a href="" onclick="Calendly.initPopupWidget({url: \'https://calendly.com/scruffian/usability-test\'});return false;">Schedule time with me</a>' +
			'<!-- Calendly link widget end -->';

		expect(
			getURLFromEmbedCode( textEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test'
		);
	} );

	test( 'Customised inline embed code', () => {
		const customInlineEmbedCode = '<!-- Calendly inline widget begin -->' +
			'<div class="calendly-inline-widget" data-url="https://calendly.com/scruffian/usability-test?hide_event_type_details=1&background_color=691414&text_color=2051a3&primary_color=1d6e9c" style="min-width:320px;height:630px;"></div>' +
			'<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>' +
			'<!-- Calendly inline widget end -->';

		expect(
			getURLFromEmbedCode( customInlineEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test?hide_event_type_details=1&background_color=691414&text_color=2051a3&primary_color=1d6e9c'
		);
	} );

	test( 'Customised widget embed code', () => {
		const customWidgetEmbedCode = '<!-- Calendly badge widget begin -->' +
			'<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">' +
			'<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>' +
			'<script type="text/javascript">Calendly.initBadgeWidget({ url: \'https://calendly.com/scruffian/usability-test?background_color=c51414&text_color=2563ca&primary_color=1d73a4\', text: \'Schedule some with me\', color: \'#000609\', textColor: \'#b50000\', branding: true });</script>' +
			'<!-- Calendly badge widget end -->';

		 expect(
			getURLFromEmbedCode( customWidgetEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test?background_color=c51414&text_color=2563ca&primary_color=1d73a4'
		);
	} );

	test( 'Customised text embed code', () => {
		const customTextEmbedCode = '<!-- Calendly link widget begin -->' +
			'<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">' +
			'<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>' +
			'<a href="" onclick="Calendly.initPopupWidget({url: \'https://calendly.com/scruffian/usability-test?background_color=e32424&text_color=2a74ef&primary_color=0e425f\'});return false;">Schedule some time with me</a>' +
			'<!-- Calendly link widget end -->';

		expect(
			getURLFromEmbedCode( customTextEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test?background_color=e32424&text_color=2a74ef&primary_color=0e425f'
		);
	} )


} );

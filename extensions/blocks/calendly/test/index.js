/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { getURLFromEmbedCode, getStyleFromEmbedCode, getSubmitButtonTextFromEmbedCode } from '../utils';

const inlineEmbedCode = '<!-- Calendly inline widget begin -->' +
	'<div class="calendly-inline-widget" data-url="https://calendly.com/scruffian/usability-test" style="min-width:320px;height:630px;"></div>' +
	'<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>' +
	'<!-- Calendly inline widget end -->';

const widgetEmbedCode = '<!-- Calendly badge widget begin -->' +
	'<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">' +
	'<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>' +
	'<script type="text/javascript">Calendly.initBadgeWidget({ url: \'https://calendly.com/scruffian/usability-test\', text: \'Schedule time with me\', color: \'#00a2ff\', textColor: \'#ffffff\', branding: true });</script>' +
	'<!-- Calendly badge widget end -->';

const textEmbedCode = '<!-- Calendly link widget begin -->' +
	'<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">' +
	'<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>' +
	'<a href="" onclick="Calendly.initPopupWidget({url: \'https://calendly.com/scruffian/usability-test\'});return false;">Schedule time with me</a>' +
	'<!-- Calendly link widget end -->';

const customInlineEmbedCode = '<!-- Calendly inline widget begin -->' +
	'<div class="calendly-inline-widget" data-url="https://calendly.com/scruffian/usability-test?hide_event_type_details=1&background_color=691414&text_color=2051a3&primary_color=1d6e9c" style="min-width:320px;height:630px;"></div>' +
	'<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js"></script>' +
	'<!-- Calendly inline widget end -->';

const customWidgetEmbedCode = '<!-- Calendly badge widget begin -->' +
	'<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">' +
	'<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>' +
	'<script type="text/javascript">Calendly.initBadgeWidget({ url: \'https://calendly.com/scruffian/usability-test?background_color=c51414&text_color=2563ca&primary_color=1d73a4\', text: \'Schedule some time with me\', color: \'#000609\', textColor: \'#b50000\', branding: true });</script>' +
	'<!-- Calendly badge widget end -->';

const customTextEmbedCode = '<!-- Calendly link widget begin -->' +
	'<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">' +
	'<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>' +
	'<a href="" onclick="Calendly.initPopupWidget({url: \'https://calendly.com/scruffian/usability-test?background_color=e32424&text_color=2a74ef&primary_color=0e425f\'});return false;">Schedule some time with me</a>' +
	'<!-- Calendly link widget end -->';

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
		expect(
			getURLFromEmbedCode( inlineEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test'
		);

		expect(
			getStyleFromEmbedCode( inlineEmbedCode )
		).toBe(
			'inline'
		);

	} );

	test( 'Widget embed code', () => {
		expect(
			getURLFromEmbedCode( widgetEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test'
		);

		expect(
			getStyleFromEmbedCode( widgetEmbedCode )
		).toBe(
			'link'
		);

		expect(
			getSubmitButtonTextFromEmbedCode( customWidgetEmbedCode )
		).toBe(
			'Schedule some time with me'
		);
	} );

	test( 'Text embed code', () => {
		expect(
			getURLFromEmbedCode( textEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test'
		);

		expect(
			getStyleFromEmbedCode( textEmbedCode )
		).toBe(
			'link'
		);

		expect(
			getSubmitButtonTextFromEmbedCode( textEmbedCode )
		).toBe(
			'Schedule time with me'
		);
	} );

	test( 'Customised inline embed code', () => {
		expect(
			getURLFromEmbedCode( customInlineEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test?hide_event_type_details=1&background_color=691414&text_color=2051a3&primary_color=1d6e9c'
		);

		expect(
			getStyleFromEmbedCode( customInlineEmbedCode )
		).toBe(
			'inline'
		);
	} );

	test( 'Customised widget embed code', () => {
		 expect(
			getURLFromEmbedCode( customWidgetEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test?background_color=c51414&text_color=2563ca&primary_color=1d73a4'
		);

		expect(
			getStyleFromEmbedCode( customWidgetEmbedCode )
		).toBe(
			'link'
		);

		expect(
			getSubmitButtonTextFromEmbedCode( customWidgetEmbedCode )
		).toBe(
			'Schedule some time with me'
		);
	} );

	test( 'Customised text embed code', () => {
		expect(
			getURLFromEmbedCode( customTextEmbedCode )
		).toBe(
			'https://calendly.com/scruffian/usability-test?background_color=e32424&text_color=2a74ef&primary_color=0e425f'
		);

		expect(
			getStyleFromEmbedCode( customTextEmbedCode )
		).toBe(
			'link'
		);

		expect(
			getSubmitButtonTextFromEmbedCode( customTextEmbedCode )
		).toBe(
			'Schedule some time with me'
		);
	} )
} );

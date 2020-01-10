export const getURLFromEmbedCode = embedCode => {
	return 'https://' + embedCode.match( /(?<!\.)calendly\.com.+?([^"']*)/i )[ 0 ];
};

export const getStyleFromEmbedCode = embedCode => {
	if ( embedCode.indexOf( 'data-url' ) > 0 ) {
		return 'inline';
	}

	if ( embedCode.indexOf( 'initPopupWidget' ) > 0 || embedCode.indexOf( 'initBadgeWidget' ) > 0 ) {
		return 'link';
	}
};

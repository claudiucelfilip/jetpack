export const getURLFromEmbedCode = embedCode => {
	return 'https://' + embedCode.match( /(?<!\.)calendly\.com.+?([^"']*)/i )[ 0 ];
};

export const getSubmitButtonTextFromEmbedCode = embedCode => {
	const submitButtonText = embedCode.match( /(?<=;"\>).+(?=<\/)/ );
	if ( submitButtonText ) {
		return submitButtonText[ 0 ];
	}

	return embedCode.match( /(?<=text: ').*?(?=')/ )[ 0 ];
};

export const getAttributesFromUrl = url => {
	const attributes = {};
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

	return attributes;
};

export const getStyleFromEmbedCode = embedCode => {
	if ( embedCode.indexOf( 'data-url' ) > 0 ) {
		return 'inline';
	}

	if ( embedCode.indexOf( 'initPopupWidget' ) > 0 || embedCode.indexOf( 'initBadgeWidget' ) > 0 ) {
		return 'link';
	}
};

export const getAttributesFromEmbedCode = embedCode => {
	if ( ! embedCode ) {
		return;
	}

	const newUrl = getURLFromEmbedCode( embedCode );
	if ( ! newUrl ) {
		return;
	}

	const newAttributes = getAttributesFromUrl( newUrl );

	const newStyle = getStyleFromEmbedCode( embedCode );
	if ( newStyle ) {
		newAttributes.style = newStyle;
	}

	const submitButtonText = getSubmitButtonTextFromEmbedCode( embedCode );
	if ( submitButtonText ) {
		newAttributes.submitButtonText = submitButtonText;
	}

	return newAttributes;
};

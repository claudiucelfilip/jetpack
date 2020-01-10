export const getURLFromEmbedCode = embedCode => {
	return 'https://' + embedCode.match( /(?<!\.)calendly\.com.+?([^"']*)/i )[ 0 ];
};

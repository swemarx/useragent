(function() {
	var storage = chrome.storage.sync;
	var bkg = chrome.extension.getBackgroundPage();
	var userAgent = false;

	function loadStorage() {
		bkg.console.log('Attempting to load userAgent from storage.');
		storage.get('userAgent', function(data) {
			if(data['userAgent']) {
				userAgent = data['userAgent'];
				bkg.console.log('Found and loaded userAgent: ' + data['userAgent']);
			}

			fixUserAgent();
        });
    }

	function fixUserAgent() {
		if(!userAgent) {
			bkg.console.log('No userAgent set, wont listen.');
			return;
		}

		chrome.webRequest.onBeforeRequest.addListener(function(details) {
			bkg.console.log(details);
        }, {urls: ["<all_urls>"]}, ["blocking"]);
		bkg.console.log('Attached onBeforeRequest handler.');

		chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
			for(var i = 0, len = details.requestHeaders.length; i < len; ++i) {
				if (details.requestHeaders[i].name === 'User-Agent') {
					//details.requestHeaders.splice(i, 1);
					details.requestHeaders[i].value = userAgent;
					break;
				}
			}

			return {requestHeaders: details.requestHeaders};
		}, { urls: ["<all_urls>"] }, ["blocking", "requestHeaders"]);
		bkg.console.log('Attached onBeforeSendHeaders handler.');
	}

	function onUpdateUserAgent() {
		chrome.storage.onChanged.addListener(function(changes, area) {
			if(changes.hasOwnProperty('userAgent')) {
				userAgent = changes['userAgent'].newValue;
				bkg.console.log('Setting userAgent to: ' + changes['userAgent']['newValue']);
				bkg.console.log('userAgent is now: ' + userAgent);
				fixUserAgent();
			}
		});

		bkg.console.log('Attached onChanged(storage) handler.');
	}

	// Main
	document.addEventListener('DOMContentLoaded', function() {
		bkg.console.log('Initializing extension.');
		// attach handler.
		loadStorage();
		onUpdateUserAgent();
	});
})();

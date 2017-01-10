(function() {
	var storage = chrome.storage.sync;
	var bkg = chrome.extension.getBackgroundPage();

	function renderStatus(text) {
		document.getElementById('status').textContent = text;
	}

	function loadData() {
		storage.get('userAgent', function(data) {
			if(data) {
				document.getElementById('userAgent').value = data['userAgent'];
				//console.log(data['userAgent']);
			}
		});
	}

	function saveData() {
		var userAgentInput = document.getElementById('userAgent').value;
		if(userAgentInput) {
			storage.set({'userAgent': userAgentInput}, function() {
				renderStatus('Saved: ' + userAgentInput); 
			});
		} else {
			renderStatus('Nothing to save.');
		}
	}

	// Main
	document.addEventListener('DOMContentLoaded', function() {
		// attach save-handler.
		document.getElementById('mySubmit').onclick = saveData;
		renderStatus('Useragent:');
		loadData();
	});
})();

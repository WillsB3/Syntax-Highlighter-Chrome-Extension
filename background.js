// Copyright (c) 2013 WillS Bithrey

chrome.runtime.onInstalled.addListener(function() {
	console.log("Extension installed.");

	chrome.webNavigation.onCompleted.addListener(function(e) {
		console.log("URL Filter matched.", e);
		chrome.tabs.executeScript(null, {file: "content_script.js"}, function () {
			console.log('content_script.js was injected into the active tab.');
		});
	}, {
		url: [
			{urlContains: ''}
		]
	});

});
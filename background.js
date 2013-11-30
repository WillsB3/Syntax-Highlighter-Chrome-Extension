// Copyright (c) 2013 WillS Bithrey

chrome.runtime.onInstalled.addListener(function() {
	console.log("Extension installed.");
	debugger
	chrome.webNavigation.onCommitted.addListener(function(e) {
		console.log("URL Filter matched.", e);
	}, {
		url: [
			{pathSuffix: '.js'}
		]
	});
});
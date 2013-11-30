/* global chrome */

// Copyright (c) 2013 Wills Bithrey
(function () {
	'use strict';

	/**
	 * Callback which runs immediately after the extension is installed.
	 * @return {undefined}
	 */
	function onInstalled () {
		console.log('Extension installed.');
		registerEventListeners();
	};

	/**
	 * Sets up the extension so that if a supported type of file is detected the
	 * extensions content script is called. Uses Chrome's UrlFilters toi only
	 * run the content script when a supported file type is detected.
	 * 
	 * @return {undefined}
	 */
	function registerEventListeners () {
		chrome.webNavigation.onCompleted.addListener(onNavigationCompleted, {
			url: [
				{ pathSuffix: '.js' }
			]
		});
	};

	/**
	 * Dynamically injects the extensions content script.
	 * @return {undefined}
	 */
	function onNavigationCompleted (e) {
		console.log('URL Filter matched.', e);
		chrome.tabs.executeScript(null, {file: 'content_script.js'}, function () {
			console.log('content_script.js was injected into the active tab.');
		});
	};

	// Bind to Chrome's `onInstalled` event to perform extension initialisation
	// once the extension is installed.
	chrome.runtime.onInstalled.addListener(onInstalled);
}());
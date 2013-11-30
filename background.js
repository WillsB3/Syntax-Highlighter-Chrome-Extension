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

		// Inject necessary stylesheets.
		chrome.tabs.insertCSS(null, {file: 'libs/syntaxhighlighter_3.0.83/styles/shCore.css'}, function () {
			console.log('shCore.css was injected into the active tab.');
		});

		chrome.tabs.insertCSS(null, {file: 'libs/syntaxhighlighter_3.0.83/styles/shCoreDefault.css'}, function () {
			console.log('shCoreDefault.css was injected into the active tab.');
		});

		// Inject necessary js as content scripts.
		chrome.tabs.executeScript(null, {file: 'libs/syntaxhighlighter_3.0.83/scripts/shCore.js'}, function () {
			console.log('shCore.js was injected into the active tab.');
		});

		// Inject language specific brush
		chrome.tabs.executeScript(null, {file: 'libs/syntaxhighlighter_3.0.83/scripts/shBrushJScript.js'}, function () {
			console.log('shBrushJScript.js was injected into the active tab.');
		});

		chrome.tabs.executeScript(null, {file: 'content_script.js'}, function () {
			console.log('content_script.js was injected into the active tab.');
		});
	};

	// Bind to Chrome's `onInstalled` event to perform extension initialisation
	// once the extension is installed.
	chrome.runtime.onInstalled.addListener(onInstalled);
}());
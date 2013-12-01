/* global chrome */

// Copyright (c) 2013 Wills Bithrey
(function () {
	'use strict';

	var SH_LANG_BRUSH_MAP = {
		'as3 actionscript3': 'shBrushAS3.js',
		'bash, shell': 'shBrushBash.js',
		'cf, coldfusion': 'shBrushColdFusion.js',
		'c-sharp, csharp': 'shBrushCSharp.js',
		'cpp, c': 'shBrushCpp.js',
		'css': 'shBrushCss.js',
		'delphi, pas, pascal': 'shBrushDelphi.js',
		'diff, patch': 'shBrushDiff.js',
		'erl, erlang': 'shBrushErlang.js',
		'groovy': 'shBrushGroovy.js',
		'js, jscript, javascript': 'shBrushJScript.js',
		'java': 'shBrushJava.js',
		'jfx, javafx': 'shBrushJavaFX.js',
		'perl, pl': 'shBrushPerl.js',
		'php': 'shBrushPhp.js',
		'plain, text': 'shBrushPlain.js',
		'ps, powershell': 'shBrushPowerShell.js',
		'py, python': 'shBrushPython.js',
		'rails, ror, ruby': 'shBrushRuby.js',
		'scala': 'shBrushScala.js',
		'sql': 'shBrushSql.js',
		'vb, vbnet': 'shBrushVb.js',
		'xml, xhtml, xslt, html, xhtml': 'shBrushXml.js'
	};

	/**
	 * Callback which runs immediately after the extension is installed.
	 * @return {undefined}
	 */
	function onInstalled () {
		console.log('Extension installed.');
		registerEventListeners();
	}

	/**
	 * Finds the filename of the SyntaxHighlighter brush which can be used to 
	 * highlight files of who's extension matches the `extension` parameter.
	 * 
	 * @param  {String} extension 
	 *         The file extension of the file to be highlighted.
	 *         
	 * @return {String || undefined}
	 *         The filename of the brush which is capable of Syntax Highlighting
	 *         files with the provided extension, or undefined if no suitable
	 *         brush was found for the provided extension.
	 */
	function findBrushForExtension (extension) {
		var keys = Object.keys(SH_LANG_BRUSH_MAP),
			brushFileName,
			found = false;

		keys.some(function (aliasList) {
			var aliases = aliasList.split(', ');

			return aliases.some(function (alias) {
				if (alias === extension) {
					brushFileName = SH_LANG_BRUSH_MAP[aliasList];
					found = true;
					return true;
				}
			});
		});

		return brushFileName;
	}

	/**
	 * Sets up the extension so that if a supported type of file is detected the
	 * extensions content script is called. Uses Chrome's UrlFilters toi only
	 * run the content script when a supported file type is detected.
	 * 
	 * @return {undefined}
	 */
	function registerEventListeners () {
		chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, { 
			types: ["main_frame"],
			urls: ["<all_urls>"]
		}, ["responseHeaders"]);
	}

	/**
	 * Dynamically injects the extensions content script.
	 * @return {undefined}
	 */
	function onHeadersReceived (details) {
		var headers = details.responseHeaders,
			contentTypeHeader;

		headers.some(function (header) {
			if (header.name === 'Content-Type') {
				contentTypeHeader = header;
				return true;
			}
		});

		console.log('onHeadersReceived:', details);
		console.log('Found Content-Type header:', contentTypeHeader);

		if (!contentTypeHeader) {
			return;
		}

		// Check if the content type contains text/html. If it does then we
		// don't want to try and Syntax Highlight anything. 
		if (contentTypeHeader.value.indexOf('text/html') !== -1) {
			console.log('Content-Type text/html detected - Not Highlighting');
			return;
		}

		chrome.tabs.query({ active: true }, function (tabs) {
			var extension,
				brushFilename,
				pageUrl,
				pageUrlParts;

			pageUrl = tabs[0].url;
			pageUrlParts = pageUrl.split('.');
			extension = pageUrlParts[pageUrlParts.length - 1];
			brushFilename = findBrushForExtension(extension);

			// If we can't find a match for the current file then something has
			// probably gone wrong since `onNavigationCompleted` shouldn't 
			// get called unless one of the supported extensions is found in the
			// URL by the UrlFilter used as part of `registerEventListeners`.
			if (!brushFilename) {
				console.warn('Could not identify Syntax Highlighter brush to use for extension "' + extension + '".');
			}

			console.log('Brush for extension "' + extension + '": '  + brushFilename);

			// Inject necessary stylesheets.
			// chrome.tabs.insertCSS(null, {file: 'js/libs/syntaxhighlighter_3.0.83/styles/shCore.css'}, function () {
			// 	console.log('shCore.css was injected into the active tab.');
			// });

			chrome.tabs.insertCSS(null, {file: 'js/libs/syntaxhighlighter_3.0.83/styles/shCoreDefault.css'}, function () {
				console.log('shCoreDefault.css was injected into the active tab.');
			});

			chrome.tabs.insertCSS(null, {file: 'css/base.css'}, function () {
				console.log('base.css was injected into the active tab.');
			});

			// Inject necessary js as content scripts.
			chrome.tabs.executeScript(null, {file: 'js/libs/syntaxhighlighter_3.0.83/scripts/shCore.js'}, function () {
				console.log('shCore.js was injected into the active tab.');
			});

			// Inject language specific brush
			chrome.tabs.executeScript(null, {file: 'js/libs/syntaxhighlighter_3.0.83/scripts/' + brushFilename}, function () {
				console.log('shBrushJScript.js was injected into the active tab.');
			});

			chrome.tabs.executeScript(null, {file: 'js/content_script.js'}, function () {
				console.log('content_script.js was injected into the active tab.');
			});
		});
	}

	// Bind to Chrome's `onInstalled` event to perform extension initialisation
	// once the extension is installed.
	chrome.runtime.onInstalled.addListener(onInstalled);
}());
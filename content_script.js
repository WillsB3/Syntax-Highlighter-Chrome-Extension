/* global chrome, SyntaxHighlighter */

(function () {
	'use strict';

	var SH_LANG_BRUSH_MAP,
		SH_VERSION;

	SH_VERSION = '3.0.83';
	SH_LANG_BRUSH_MAP = {
		'js': chrome.runtime.getURL('/libs/syntaxhighlighter_3.0.83/')
	};

	function getBrushUrl (languageName) {
		var baseBrushFilename	= 'shBrush',
			baseBrushPath		= '/libs/syntaxhighlighter_' + SH_VERSION + '/scripts/';

		return baseBrushPath + baseBrushFilename + languageName;
	}

	function performHighlighting () {
		SyntaxHighlighter.highlight();
	}

	function initialise () {
		var src = document.querySelector('pre');

		src.classList.add('brush:', 'js');

		performHighlighting();
	}

	console.log('Content Script executing.');
	initialise();
	
}());

// content.js — Entry point: loads config from chrome.storage and builds the panel

'use strict';

(function () {
    if (window.d2lGradingHelperLoaded) {
        console.log('D2L Grading Helper already loaded.');
        return;
    }
    window.d2lGradingHelperLoaded = true;
    console.log('D2L Grading Helper (Chrome Extension) loading...');

    function initialize() {
        if (!document.body) { document.addEventListener('DOMContentLoaded', initialize); return; }

        GH.storage.load(function (rawConfig, signature) {
            GH.initConfig(rawConfig, signature);
            GH.autoDetectCourseAndAssignment();
            GH.ensureSelection();
            GH.buildPanel();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

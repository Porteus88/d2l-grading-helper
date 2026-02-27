// utils.js — Small helper functions shared across modules

'use strict';

window.GH = window.GH || {};

GH.uuid = function () {
    return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
};

GH.sanitizeFilename = function (str) {
    return (str || 'untitled').replace(/[^a-z0-9_\-]+/gi, '_');
};

GH.formatToday = function () {
    const today = new Date();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
};

GH.escapeHtml = function (text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

GH.findInAllShadowRoots = function (selector) {
    const results = [];
    function search(root) {
        if (!root || !root.querySelectorAll) return;
        try {
            root.querySelectorAll(selector).forEach(el => results.push(el));
        } catch (e) { }
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) search(el.shadowRoot);
        });
    }
    search(document);
    return results;
};

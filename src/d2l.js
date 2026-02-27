// d2l.js — D2L Overall Feedback (TinyMCE) integration

'use strict';

window.GH = window.GH || {};

GH.findTinyMCEIframes = function () {
    const iframes = [];
    function searchForTinyMCE(root) {
        const selectors = [
            'iframe.tox-edit-area__iframe',
            'iframe[id*="tinymce"]',
            'iframe[title*="feedback" i]',
            'iframe[title*="criterion" i]',
            'iframe[title*="overall" i]'
        ];
        selectors.forEach(selector => {
            root.querySelectorAll(selector).forEach(iframe => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    if (doc && doc.body && doc.body.contentEditable === 'true') {
                        iframes.push({ iframe, document: doc, body: doc.body, title: iframe.title || 'Unknown', id: iframe.id || 'no-id' });
                    }
                } catch (e) { }
            });
        });
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) searchForTinyMCE(el.shadowRoot);
        });
    }
    searchForTinyMCE(document);
    return iframes;
};

GH.getOverallFeedbackArea = function () {
    const tiny = GH.findTinyMCEIframes();
    if (!tiny.length) return null;
    let overall = null;
    for (const info of tiny) {
        const title = (info.title || '').toLowerCase();
        if (title.includes('overall') || title.includes('general')) { overall = info; break; }
    }
    if (!overall) overall = tiny.length === 1 ? tiny[0] : tiny[tiny.length - 1];
    return overall;
};

GH.setOverallFeedbackHtml = function (html) {
    const overallIframe = GH.getOverallFeedbackArea();
    if (!overallIframe) {
        alert('Could not find the Overall Feedback editor. Is the page fully loaded?');
        console.warn('Available TinyMCE iframes:', GH.findTinyMCEIframes().map(f => f.title));
        return false;
    }
    try {
        const existingOverallContent = overallIframe.body.innerHTML || '';
        const cleanExisting = existingOverallContent.replace(/<p><br[^>]*><\/p>/gi, '').replace(/<br[^>]*>/gi, '').trim();
        let newOverallContent;
        if (cleanExisting.length > 0) {
            newOverallContent = html + '<hr style="border:none;border-top:1px solid #ccc;margin:8px 0;">' + existingOverallContent;
        } else {
            newOverallContent = html;
        }
        overallIframe.body.innerHTML = newOverallContent;
        ['input', 'change', 'keyup', 'blur'].forEach(ev => {
            try { overallIframe.body.dispatchEvent(new Event(ev, { bubbles: true })); } catch (e) { }
        });
        if (window.tinymce && Array.isArray(window.tinymce.editors)) {
            window.tinymce.editors.forEach(editor => {
                try {
                    if (editor.getBody && editor.getBody() === overallIframe.body) {
                        editor.setContent(newOverallContent);
                        editor.fire('change');
                        editor.fire('input');
                    }
                } catch (e) { }
            });
        }
        return true;
    } catch (e) {
        console.error('Error setting Overall Feedback content:', e);
        alert('Error while updating Overall Feedback.');
        return false;
    }
};

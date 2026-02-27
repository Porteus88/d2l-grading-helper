// storage.js — Wrapper around chrome.storage.local (replaces localStorage)

'use strict';

window.GH = window.GH || {};

const STORAGE_KEY = 'd2lGradingHelperConfig_v1';
const SIG_KEY = 'teacherSignature';

GH.storage = {
    _listeners: [],

    onReady(fn) {
        this._listeners.push(fn);
    },

    _fireReady() {
        this._listeners.forEach(fn => fn());
        this._listeners = [];
    },

    load(callback) {
        chrome.storage.local.get([STORAGE_KEY, SIG_KEY], (result) => {
            callback(result[STORAGE_KEY] || null, result[SIG_KEY] || '');
        });
    },

    saveConfig(config) {
        chrome.storage.local.set({ [STORAGE_KEY]: config });
    },

    saveSignature(sig) {
        if (sig) {
            chrome.storage.local.set({ [SIG_KEY]: sig });
        } else {
            chrome.storage.local.remove(SIG_KEY);
        }
    },

    loadSignature(callback) {
        chrome.storage.local.get(SIG_KEY, (result) => {
            callback(result[SIG_KEY] || '');
        });
    }
};

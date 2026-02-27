// ui-modals.js — All modal dialogs (v4.1: dark-mode aware modals)

'use strict';

window.GH = window.GH || {};

// ── Dark mode helper — reads current state from the panel class ───────────────
GH._isDark = function () {
    const panel = document.getElementById('d2l-grading-helper-panel');
    return panel ? panel.classList.contains('gh-dark') : false;
};

// ── Theme token helper — returns light or dark value based on current mode ────
GH._t = function (light, dark) {
    return GH._isDark() ? dark : light;
};

// ── Apply dark-aware colours to a modal dialog element ───────────────────────
GH._styleDialog = function (dialog) {
    const dark = GH._isDark();
    Object.assign(dialog.style, {
        backgroundColor: dark ? '#1e2530' : '#ffffff',
        color:           dark ? '#e6eaf2' : '#1a1f27',
        border:          dark ? '1px solid #3a4558' : '1px solid #dde2ea',
        boxShadow:       dark ? '0 4px 24px rgba(0,0,0,0.6)' : '0 4px 24px rgba(0,0,0,0.2)'
    });
};

// ── Shared modal helpers ──────────────────────────────────────────────────────
GH._makeModalOverlay = function () {
    const el = document.createElement('div');
    Object.assign(el.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: GH._isDark() ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.48)',
        zIndex: '10000000', display: 'flex', alignItems: 'center', justifyContent: 'center'
    });
    return el;
};

GH._makeModalDialog = function (maxWidth) {
    const el = document.createElement('div');
    const dark = GH._isDark();
    Object.assign(el.style, {
        backgroundColor: dark ? '#1e2530' : '#ffffff',
        color:           dark ? '#e6eaf2' : '#1a1f27',
        border:          dark ? '1px solid #3a4558' : 'none',
        boxShadow:       dark ? '0 4px 24px rgba(0,0,0,0.6)' : '0 4px 24px rgba(0,0,0,0.22)',
        padding: '20px', borderRadius: '8px',
        maxWidth: maxWidth || '500px', width: '92%',
        maxHeight: '82%', overflowY: 'auto',
        fontFamily: 'Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '13px'
    });
    return el;
};

GH._modalTitle = function (text) {
    const h = document.createElement('h3');
    h.textContent = text;
    Object.assign(h.style, {
        margin: '0 0 14px 0',
        color: GH._isDark() ? '#e6eaf2' : '#111111',
        fontSize: '15px', fontWeight: '700'
    });
    return h;
};

GH._sectionHead = function (text) {
    const el = document.createElement('div');
    el.textContent = text;
    Object.assign(el.style, {
        fontWeight: '700', fontSize: '11px', textTransform: 'uppercase',
        letterSpacing: '0.05em', marginBottom: '8px',
        color: GH._isDark() ? '#8899ae' : '#555555'
    });
    return el;
};

GH._makeBtn = function (label, lightBg, darkBg) {
    const b = document.createElement('button');
    b.textContent = label;
    const bg = GH._isDark() ? (darkBg || lightBg) : lightBg;
    // For grey cancel buttons, override text colour in dark mode
    const isGrey = lightBg === '#6c757d';
    Object.assign(b.style, {
        padding: '6px 14px', borderRadius: '4px',
        border: isGrey && GH._isDark() ? '1px solid #3a4558' : 'none',
        cursor: 'pointer', fontSize: '13px',
        backgroundColor: isGrey && GH._isDark() ? '#252d3a' : bg,
        color: isGrey && GH._isDark() ? '#c8d4e6' : '#ffffff',
        fontFamily: 'inherit'
    });
    b.addEventListener('mouseenter', () => { b.style.opacity = '0.85'; });
    b.addEventListener('mouseleave', () => { b.style.opacity = '1'; });
    return b;
};

GH._makeInput = function (type, extraStyle) {
    const dark = GH._isDark();
    const el = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    if (type !== 'textarea') el.type = type || 'text';
    el.className = 'gh-modal-input';
    Object.assign(el.style, {
        backgroundColor: dark ? '#1a2233' : '#ffffff',
        color:           dark ? '#e6eaf2' : '#1a1f27',
        border:          dark ? '1px solid #3a4558' : '1px solid #b8c0cc',
        ...(extraStyle || {})
    });
    // Inject placeholder colour via a scoped style tag (modal inputs are outside the panel)
    if (!document.getElementById('gh-modal-placeholder-style')) {
        const st = document.createElement('style');
        st.id = 'gh-modal-placeholder-style';
        st.textContent = '.gh-modal-input::placeholder { opacity: 1; }';
        document.head.appendChild(st);
    }
    // Set placeholder colour dynamically based on current theme
    const placeholderStyle = document.getElementById('gh-modal-placeholder-style');
    placeholderStyle.textContent = `.gh-modal-input::placeholder { color: ${dark ? '#8899ae' : '#8892a4'}; opacity: 1; }`;
    return el;
};

GH._makeListBox = function () {
    const dark = GH._isDark();
    const el = document.createElement('div');
    el.className = 'gh-modal-listbox';
    Object.assign(el.style, {
        border:          dark ? '1px solid #2e3a4e' : '1px solid #dde2ea',
        borderRadius: '4px', padding: '4px',
        maxHeight: '260px', overflowY: 'auto', marginBottom: '8px',
        backgroundColor: dark ? '#161b22' : '#f8f9fc',
        // CSS variables for the scoped scrollbar rules
        '--gh-modal-scroll-track': dark ? '#1a2233' : '#f0f2f5',
        '--gh-modal-scroll-thumb': dark ? '#3a4558' : '#c0c8d8',
        '--gh-modal-scroll-hover': dark ? '#4e607a' : '#a0abbe'
    });
    return el;
};

GH._makeRadioLabel = function (name, value, labelText, checked, disabled) {
    const dark = GH._isDark();
    const lbl = document.createElement('label');
    Object.assign(lbl.style, {
        display: 'flex', alignItems: 'center', gap: '8px',
        cursor: disabled ? 'default' : 'pointer', padding: '4px 2px',
        opacity: disabled ? '0.45' : '1',
        color: dark ? '#c8d4e6' : '#1a1f27'
    });
    const r = document.createElement('input');
    r.type = 'radio'; r.name = name; r.value = value; r.checked = !!checked;
    if (disabled) r.disabled = true;
    r.style.accentColor = dark ? '#6aabff' : '#0055cc';
    const sp = document.createElement('span');
    sp.innerHTML = labelText;
    lbl.appendChild(r); lbl.appendChild(sp);
    return lbl;
};

GH._triggerDownload = function (content, mimeType, filename) {
    const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
};

// ── Custom alert dialog (replaces browser alert()) ────────────────────────────
GH._alert = function (message, onClose) {
    const dark   = GH._isDark();
    const modal  = GH._makeModalOverlay();
    const dialog = GH._makeModalDialog('380px');

    const msg = document.createElement('p');
    msg.innerHTML = message.replace(/\n/g, '<br>');
    Object.assign(msg.style, { margin: '0 0 18px 0', lineHeight: '1.55', color: dark ? '#e6eaf2' : '#1a1f27' });

    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end' });
    const okBtn = GH._makeBtn('OK', '#0055cc', '#6aabff');
    if (dark) okBtn.style.color = '#0a1628';
    okBtn.onclick = () => { document.body.removeChild(modal); if (onClose) onClose(); };

    btnRow.appendChild(okBtn);
    dialog.appendChild(msg); dialog.appendChild(btnRow);
    modal.appendChild(dialog); document.body.appendChild(modal);
    setTimeout(() => okBtn.focus(), 60);
};

// ── Custom prompt dialog (replaces browser prompt()) ─────────────────────────
GH._prompt = function (message, defaultValue, onOk, onCancel) {
    const dark   = GH._isDark();
    const modal  = GH._makeModalOverlay();
    const dialog = GH._makeModalDialog('400px');

    const msg = document.createElement('label');
    msg.innerHTML = message.replace(/\n/g, '<br>');
    Object.assign(msg.style, { display: 'block', marginBottom: '10px', lineHeight: '1.5', color: dark ? '#e6eaf2' : '#1a1f27' });

    const input = GH._makeInput('text', { width: '100%', boxSizing: 'border-box' });
    input.value = defaultValue || '';
    Object.assign(input.style, { marginBottom: '16px' });

    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px' });
    const cancelBtn = GH._makeBtn('Cancel', '#6c757d');
    const okBtn     = GH._makeBtn('OK',     '#0055cc', '#6aabff');
    if (dark) okBtn.style.color = '#0a1628';

    const doOk = () => {
        const val = input.value;
        document.body.removeChild(modal);
        if (onOk) onOk(val);
    };
    cancelBtn.onclick = () => { document.body.removeChild(modal); if (onCancel) onCancel(); };
    okBtn.onclick     = doOk;
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doOk(); if (e.key === 'Escape') cancelBtn.onclick(); });

    btnRow.appendChild(cancelBtn); btnRow.appendChild(okBtn);
    dialog.appendChild(msg); dialog.appendChild(input); dialog.appendChild(btnRow);
    modal.appendChild(dialog); document.body.appendChild(modal);
    setTimeout(() => { input.focus(); input.select(); }, 60);
};

// ── Custom confirm dialog (replaces browser confirm() in dark mode) ───────────
GH._confirm = function (message, onYes, onNo) {
    const dark  = GH._isDark();
    const modal = GH._makeModalOverlay();
    const dialog = GH._makeModalDialog('380px');
    dialog.style.textAlign = 'left';

    const msg = document.createElement('p');
    msg.innerHTML = message.replace(/\n/g, '<br>');
    Object.assign(msg.style, { margin: '0 0 18px 0', lineHeight: '1.55', color: dark ? '#e6eaf2' : '#1a1f27' });

    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px' });

    const noBtn  = GH._makeBtn('Cancel', '#6c757d');
    const yesBtn = GH._makeBtn('Confirm', '#b91c1c', '#f87171');
    yesBtn.style.color = dark ? '#0a0a0a' : '#ffffff';

    noBtn.onclick  = () => { document.body.removeChild(modal); if (onNo)  onNo();  };
    yesBtn.onclick = () => { document.body.removeChild(modal); if (onYes) onYes(); };

    btnRow.appendChild(noBtn); btnRow.appendChild(yesBtn);
    dialog.appendChild(msg); dialog.appendChild(btnRow);
    modal.appendChild(dialog); document.body.appendChild(modal);
};

// ── Signature modal ───────────────────────────────────────────────────────────
GH.configureSignature = function (onDone) {
    const dark   = GH._isDark();
    const modal  = GH._makeModalOverlay();
    const dialog = GH._makeModalDialog('500px');

    dialog.appendChild(GH._modalTitle('Configure Your Signature'));

    const instructions = document.createElement('p');
    instructions.textContent = 'Enter the signature to appear after your feedback. Use Enter for new lines.';
    Object.assign(instructions.style, { margin: '0 0 10px 0', fontSize: '13px', color: dark ? '#b0bbcc' : '#555555' });
    dialog.appendChild(instructions);

    const textarea = GH._makeInput('textarea', { width: '100%', height: '110px', resize: 'vertical', boxSizing: 'border-box' });
    textarea.placeholder = 'Best regards,\nYour Name\nCourse / School\nemail@example.com';
    if (GH.teacherSignature) textarea.value = GH.teacherSignature.replace(/<br\s*\/?>/gi, '\n');
    dialog.appendChild(textarea);

    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' });

    const cancelBtn = GH._makeBtn('Cancel', '#6c757d');
    const clearBtn  = GH._makeBtn('Clear',  '#b91c1c', '#f87171');
    const saveBtn   = GH._makeBtn('Save',   '#0055cc', '#6aabff');
    if (dark) { clearBtn.style.color = '#0a0a0a'; saveBtn.style.color = '#0a1628'; }

    cancelBtn.onclick = () => document.body.removeChild(modal);
    clearBtn.onclick  = () => {
        GH._confirm('Clear your signature?', () => {
            textarea.value = ''; GH.teacherSignature = ''; GH.storage.saveSignature('');
            GH.toast('Signature cleared.');
            document.body.removeChild(modal);
            if (onDone) onDone();
        });
    };
    saveBtn.onclick = () => {
        const raw = textarea.value.trim();
        GH.teacherSignature = raw ? raw.replace(/\n/g, '<br>') : '';
        GH.storage.saveSignature(GH.teacherSignature);
        GH.toast(raw ? 'Signature saved.' : 'Signature cleared.');
        document.body.removeChild(modal);
        if (onDone) onDone();
    };

    [cancelBtn, clearBtn, saveBtn].forEach(b => btnRow.appendChild(b));
    dialog.appendChild(btnRow);
    modal.appendChild(dialog);
    modal.addEventListener('click', e => { if (e.target === modal) document.body.removeChild(modal); });
    document.body.appendChild(modal);
    setTimeout(() => textarea.focus(), 80);
};

// ── List editor / reorder modal ───────────────────────────────────────────────
GH.openListEditorModal = function (options) {
    const { title, items, allowEdit = false, allowAdd = false, allowDelete = false, onApply } = options || {};
    const working = Array.isArray(items) ? items.slice() : [];
    const dark    = GH._isDark();
    const modal   = GH._makeModalOverlay();
    const dialog  = GH._makeModalDialog('420px');

    // Header row
    const hdr = document.createElement('div');
    Object.assign(hdr.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' });
    const titleEl = document.createElement('h3');
    titleEl.textContent = title || 'Edit List';
    Object.assign(titleEl.style, { margin: '0', fontSize: '14px', color: dark ? '#e6eaf2' : '#111111' });
    const closeX = document.createElement('button');
    closeX.textContent = '✕';
    Object.assign(closeX.style, {
        border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 6px', borderRadius: '4px',
        backgroundColor: dark ? '#252d3a' : '#f0f2f5',
        color: dark ? '#c8d4e6' : '#333333'
    });
    closeX.addEventListener('click', () => document.body.removeChild(modal));
    hdr.appendChild(titleEl); hdr.appendChild(closeX);

    const listBox = GH._makeListBox();

    function mkIco(t, lightCol, darkCol) {
        const b = document.createElement('button'); b.textContent = t;
        Object.assign(b.style, {
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: '12px', padding: '0 4px',
            color: dark ? (darkCol || '#8899ae') : (lightCol || '#555555')
        });
        return b;
    }

    function renderList() {
        listBox.innerHTML = '';
        if (!working.length) {
            const e = document.createElement('div'); e.textContent = 'No items.';
            Object.assign(e.style, { fontStyle: 'italic', color: dark ? '#8899ae' : '#777777', padding: '4px' });
            listBox.appendChild(e); return;
        }
        working.forEach((text, idx) => {
            const row = document.createElement('div');
            Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 2px', borderRadius: '3px' });
            row.addEventListener('mouseenter', () => { row.style.backgroundColor = dark ? '#252d3a' : '#f0f2f5'; });
            row.addEventListener('mouseleave', () => { row.style.backgroundColor = ''; });

            const lbl = document.createElement('div'); lbl.textContent = text;
            Object.assign(lbl.style, { flex: '1', whiteSpace: 'normal', lineHeight: '1.35', fontSize: '13px', color: dark ? '#c8d4e6' : '#1a1f27' });

            const grp = document.createElement('div'); Object.assign(grp.style, { display: 'flex', gap: '2px' });

            const upBtn   = mkIco('↑'); upBtn.title   = 'Move up';
            const downBtn = mkIco('↓'); downBtn.title = 'Move down';
            upBtn.addEventListener('click',   () => { if (idx > 0)                { [working[idx-1],working[idx]]=[working[idx],working[idx-1]]; renderList(); } });
            downBtn.addEventListener('click', () => { if (idx < working.length-1) { [working[idx+1],working[idx]]=[working[idx],working[idx+1]]; renderList(); } });
            grp.appendChild(upBtn); grp.appendChild(downBtn);

            if (allowEdit) {
                const editBtn = mkIco('✎', '#0055cc', '#6aabff'); editBtn.title = 'Rename';
                editBtn.addEventListener('click', () => { GH._prompt('Edit item:', working[idx], u=>{ if(u.trim()){ working[idx]=u.trim(); renderList(); } }); });
                grp.appendChild(editBtn);
            }
            if (allowDelete) {
                const delBtn = mkIco('✕', '#b91c1c', '#f87171'); delBtn.title = 'Remove';
                delBtn.addEventListener('click', () => {
                    GH._confirm('Remove this item?', () => { working.splice(idx, 1); renderList(); });
                });
                grp.appendChild(delBtn);
            }
            row.appendChild(lbl); row.appendChild(grp);
            listBox.appendChild(row);
        });
    }
    renderList();

    const foot = document.createElement('div');
    Object.assign(foot.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: '4px' });
    const leftCtrl  = document.createElement('div'); Object.assign(leftCtrl.style, { display: 'flex', gap: '4px' });
    const rightCtrl = document.createElement('div'); Object.assign(rightCtrl.style, { display: 'flex', gap: '6px' });

    if (allowAdd) {
        const addBtn = document.createElement('button'); addBtn.textContent = '➕ Add';
        Object.assign(addBtn.style, {
            padding: '3px 10px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer',
            border:           dark ? '1px solid #3a4558' : '1px solid #ccc',
            backgroundColor:  dark ? '#252d3a'           : '#f5f5f5',
            color:            dark ? '#c8d4e6'           : '#1a1f27'
        });
        addBtn.addEventListener('click', () => { GH._prompt('New item name:', '', n=>{ if(n.trim()){ working.push(n.trim()); renderList(); } }); });
        leftCtrl.appendChild(addBtn);
    }

    const cancelBtn = GH._makeBtn('Cancel',     '#6c757d');
    const saveBtn   = GH._makeBtn('Save & Close', '#0055cc', '#6aabff');
    if (dark) saveBtn.style.color = '#0a1628';
    cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
    saveBtn.addEventListener('click',   () => { if (typeof onApply === 'function') onApply(working.slice()); document.body.removeChild(modal); });
    rightCtrl.appendChild(cancelBtn); rightCtrl.appendChild(saveBtn);
    foot.appendChild(leftCtrl); foot.appendChild(rightCtrl);

    dialog.appendChild(hdr); dialog.appendChild(listBox); dialog.appendChild(foot);
    modal.appendChild(dialog); document.body.appendChild(modal);
};

// ── CSV Download modal ────────────────────────────────────────────────────────
GH.showCsvDownloadModal = function () {
    if (!GH.config.courses.length) { GH.toast('No courses found in the configuration.'); return; }

    const dark   = GH._isDark();
    const modal  = GH._makeModalOverlay();
    const dialog = GH._makeModalDialog('420px');
    dialog.appendChild(GH._modalTitle('Download CSV'));

    const course     = GH.getCourseById(GH.config.selectedCourseId);
    const courseName = course ? course.name : '';

    dialog.appendChild(GH._sectionHead('What to download:'));

    const radioBox = document.createElement('div');
    Object.assign(radioBox.style, { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' });
    radioBox.appendChild(GH._makeRadioLabel('csvDlScope', 'course',   course ? `Current course only (${courseName})` : 'Current course (none selected)', !!course, !course));
    radioBox.appendChild(GH._makeRadioLabel('csvDlScope', 'all',      'All courses', !course));
    radioBox.appendChild(GH._makeRadioLabel('csvDlScope', 'template', 'Blank template with example data'));
    dialog.appendChild(radioBox);

    // Signature backup
    const hasSig = !!GH.teacherSignature;
    dialog.appendChild(GH._sectionHead('Signature backup:'));

    const sigLabel = document.createElement('label');
    Object.assign(sigLabel.style, {
        display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px',
        cursor: hasSig ? 'pointer' : 'default', opacity: hasSig ? '1' : '0.45',
        fontSize: '13px', color: dark ? '#c8d4e6' : '#1a1f27'
    });
    const sigCb = document.createElement('input'); sigCb.type = 'checkbox'; sigCb.checked = hasSig; sigCb.disabled = !hasSig;
    sigCb.style.marginTop = '2px'; sigCb.style.accentColor = dark ? '#6aabff' : '#0055cc';
    const sigDesc = document.createElement('span');
    sigDesc.innerHTML = hasSig
        ? 'Also download a <strong>signature backup file</strong> (.txt) so you can restore it later via Upload CSV.'
        : 'No signature configured — nothing to back up.';
    sigLabel.appendChild(sigCb); sigLabel.appendChild(sigDesc);
    dialog.appendChild(sigLabel);

    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px' });
    const cancelBtn   = GH._makeBtn('Cancel',   '#6c757d');
    const downloadBtn = GH._makeBtn('Download', '#0055cc', '#6aabff');
    if (dark) downloadBtn.style.color = '#0a1628';

    cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
    downloadBtn.addEventListener('click', () => {
        const scope   = dialog.querySelector('input[name="csvDlScope"]:checked').value;
        const withSig = hasSig && sigCb.checked;
        const dateStr = GH.formatToday().replace(/[\s,]/g, '_');
        let csvText, filenameBase;

        if (scope === 'course' && course) {
            csvText = GH.buildMasterCsvFromConfig(GH.config, [course.id]);
            filenameBase = GH.sanitizeFilename(course.name);
        } else if (scope === 'template') {
            csvText = [
                '# D2L Grading Helper Master Comment Template',
                '# Section: FEEDBACK, NEXT_STEP, or LEVEL_COMMENT',
                'Section,Course,Assignment,Level,Comment',
                'FEEDBACK,"Math 10","Unit 1 Test","","Great use of formulas and clear work shown"',
                'FEEDBACK,"Math 10","Unit 1 Test","","Check your calculations in question 5"',
                'NEXT_STEP,"Math 10","Unit 1 Test","","Review the order of operations"',
                'LEVEL_COMMENT,"Math 10","Unit 1 Test","EXTENDING","Excellent mastery"',
                'LEVEL_COMMENT,"Math 10","Unit 1 Test","PROFICIENT","Good understanding"',
                'LEVEL_COMMENT,"Math 10","Unit 1 Test","DEVELOPING","Needs more practice"',
                'LEVEL_COMMENT,"Math 10","Unit 1 Test","EMERGING","Requires significant support"'
            ].join('\n');
            filenameBase = 'grading_helper_template';
        } else {
            csvText = GH.buildMasterCsvFromConfig(GH.config, null);
            filenameBase = 'grading_helper_master';
        }

        GH._triggerDownload(csvText, 'text/csv', filenameBase + '_' + dateStr + '.csv');

        if (withSig) {
            const sigContent = [
                '# D2L Grading Helper — Signature Backup',
                '# Generated: ' + GH.formatToday(),
                '# Upload via "Upload CSV" and check "Restore signature from this file".',
                '',
                GH.teacherSignature.replace(/<br\s*\/?>/gi, '\n')
            ].join('\n');
            GH._triggerDownload(sigContent, 'text/plain', 'grading_helper_signature_' + dateStr + '.txt');
        }

        document.body.removeChild(modal);
        GH.toast(withSig ? 'Downloaded CSV + signature backup.' : 'Downloaded CSV.');
    });

    btnRow.appendChild(cancelBtn); btnRow.appendChild(downloadBtn);
    dialog.appendChild(btnRow);
    modal.appendChild(dialog); document.body.appendChild(modal);
};

// ── CSV Upload modal ──────────────────────────────────────────────────────────
GH.showCsvUploadModal = function (hiddenCsvInput, hiddenSigInput) {
    const dark   = GH._isDark();
    const modal  = GH._makeModalOverlay();
    const dialog = GH._makeModalDialog('420px');
    dialog.appendChild(GH._modalTitle('Upload CSV'));

    const course     = GH.getCourseById(GH.config.selectedCourseId);
    const courseName = course ? course.name : '';

    // Scope
    dialog.appendChild(GH._sectionHead('Upload scope:'));
    const scopeBox = document.createElement('div');
    Object.assign(scopeBox.style, { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' });
    scopeBox.appendChild(GH._makeRadioLabel('csvUpScope', 'course', course ? `Current course only (${courseName})` : 'Current course (none selected)', !!course, !course));
    scopeBox.appendChild(GH._makeRadioLabel('csvUpScope', 'all', 'All courses', !course));
    dialog.appendChild(scopeBox);

    // Mode
    dialog.appendChild(GH._sectionHead('Upload mode:'));
    const modeBox = document.createElement('div');
    Object.assign(modeBox.style, { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' });
    modeBox.appendChild(GH._makeRadioLabel('csvUpMode', 'merge',   'Merge — add new items, keep existing', true));
    modeBox.appendChild(GH._makeRadioLabel('csvUpMode', 'replace', 'Replace — <strong style="color:' + (dark ? '#f87171' : '#b91c1c') + '">⚠️ overwrites all existing data</strong>'));
    dialog.appendChild(modeBox);

    // Signature restore
    dialog.appendChild(GH._sectionHead('Signature restore (optional):'));
    const sigRestoreLabel = document.createElement('label');
    Object.assign(sigRestoreLabel.style, {
        display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px',
        cursor: 'pointer', fontSize: '13px', color: dark ? '#c8d4e6' : '#1a1f27'
    });
    const sigRestoreCb = document.createElement('input'); sigRestoreCb.type = 'checkbox';
    sigRestoreCb.style.marginTop = '2px'; sigRestoreCb.style.accentColor = dark ? '#6aabff' : '#0055cc';
    const sigRestoreDesc = document.createElement('span');
    sigRestoreDesc.innerHTML = 'Also upload a <strong>signature backup file</strong> (.txt) to restore your signature.';
    sigRestoreLabel.appendChild(sigRestoreCb); sigRestoreLabel.appendChild(sigRestoreDesc);
    dialog.appendChild(sigRestoreLabel);

    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px' });
    const cancelBtn = GH._makeBtn('Cancel',       '#6c757d');
    const uploadBtn = GH._makeBtn('Choose File…', '#0055cc', '#6aabff');
    if (dark) uploadBtn.style.color = '#0a1628';

    cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
    uploadBtn.addEventListener('click', () => {
        const scope   = dialog.querySelector('input[name="csvUpScope"]:checked').value;
        const mode    = dialog.querySelector('input[name="csvUpMode"]:checked').value;
        const withSig = sigRestoreCb.checked;

        const doUpload = () => {
            hiddenCsvInput.dataset.uploadScope = scope;
            hiddenCsvInput.dataset.uploadMode  = mode;
            hiddenCsvInput.dataset.restoreSig  = withSig ? '1' : '0';
            hiddenCsvInput.value = '';
            hiddenCsvInput.click();
            document.body.removeChild(modal);
        };

        if (mode === 'replace') {
            GH._confirm(
                'Are you sure you want to REPLACE existing data?\n\nThis cannot be undone.',
                doUpload
            );
        } else {
            doUpload();
        }
    });

    btnRow.appendChild(cancelBtn); btnRow.appendChild(uploadBtn);
    dialog.appendChild(btnRow);
    modal.appendChild(dialog); document.body.appendChild(modal);
};

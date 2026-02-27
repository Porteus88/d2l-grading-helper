// ui-modals.js — All modal dialogs (v3: signature backup in CSV, upload sig restore)

'use strict';

window.GH = window.GH || {};

// ─── Signature modal ─────────────────────────────────────────────────────────
GH.configureSignature = function (onDone) {
    const modal  = GH._makeModalOverlay();
    const dialog = GH._makeModalDialog('500px');

    dialog.appendChild(GH._modalTitle('Configure Your Signature'));

    const instructions = document.createElement('p');
    instructions.textContent = 'Enter the signature to appear after your feedback. Use Enter for new lines.';
    Object.assign(instructions.style, { margin: '0 0 10px 0', fontSize: '13px', color: '#555' });
    dialog.appendChild(instructions);

    const textarea = document.createElement('textarea');
    Object.assign(textarea.style, { width: '100%', height: '110px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontSize: '13px', boxSizing: 'border-box' });
    textarea.placeholder = 'Best regards,\nYour Name\nCourse / School\nemail@example.com';
    if (GH.teacherSignature) textarea.value = GH.teacherSignature.replace(/<br\s*\/?>/gi, '\n');
    dialog.appendChild(textarea);

    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' });

    const cancelBtn = GH._makeBtn('Cancel', '#6c757d');
    const clearBtn  = GH._makeBtn('Clear',  '#dc3545');
    const saveBtn   = GH._makeBtn('Save',   '#0055cc');

    cancelBtn.onclick = () => document.body.removeChild(modal);
    clearBtn.onclick  = () => {
        if (!confirm('Clear your signature?')) return;
        textarea.value = ''; GH.teacherSignature = ''; GH.storage.saveSignature('');
        GH.toast('Signature cleared.');
        document.body.removeChild(modal);
        if (onDone) onDone();
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

// ─── Generic list editor / reorder modal ─────────────────────────────────────
GH.openListEditorModal = function (options) {
    const { title, items, allowEdit = false, allowAdd = false, allowDelete = false, onApply } = options || {};
    const working = Array.isArray(items) ? items.slice() : [];
    const modal   = GH._makeModalOverlay();
    const dialog  = GH._makeModalDialog('420px');

    // Header row
    const hdr = document.createElement('div');
    Object.assign(hdr.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' });
    const titleEl = document.createElement('h3');
    titleEl.textContent = title || 'Edit List';
    Object.assign(titleEl.style, { margin: '0', fontSize: '14px' });
    const closeX = document.createElement('button');
    closeX.textContent = '✕';
    Object.assign(closeX.style, { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '14px', padding: '2px 4px' });
    closeX.addEventListener('click', () => document.body.removeChild(modal));
    hdr.appendChild(titleEl); hdr.appendChild(closeX);

    const listBox = document.createElement('div');
    Object.assign(listBox.style, { border: '1px solid #ddd', borderRadius: '4px', padding: '4px', maxHeight: '260px', overflowY: 'auto', marginBottom: '8px', backgroundColor: '#fafafa' });

    function renderList() {
        listBox.innerHTML = '';
        if (!working.length) {
            const e = document.createElement('div'); e.textContent = 'No items.'; e.style.fontStyle = 'italic'; e.style.color = '#777';
            listBox.appendChild(e); return;
        }
        working.forEach((text, idx) => {
            const row = document.createElement('div');
            Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 2px', borderRadius: '3px' });
            row.addEventListener('mouseenter', () => row.style.backgroundColor = '#f0f2f5');
            row.addEventListener('mouseleave', () => row.style.backgroundColor = '');

            const lbl = document.createElement('div'); lbl.textContent = text;
            Object.assign(lbl.style, { flex: '1', whiteSpace: 'normal', lineHeight: '1.35', fontSize: '13px' });

            const grp = document.createElement('div'); Object.assign(grp.style, { display: 'flex', gap: '2px' });

            function mkIco(t, col) {
                const b = document.createElement('button'); b.textContent = t;
                Object.assign(b.style, { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', padding: '0 4px', color: col || '#555' });
                return b;
            }
            const upBtn   = mkIco('↑'); upBtn.title   = 'Move up';
            const downBtn = mkIco('↓'); downBtn.title = 'Move down';
            upBtn.addEventListener('click',   () => { if (idx > 0)                { [working[idx-1], working[idx]] = [working[idx], working[idx-1]]; renderList(); } });
            downBtn.addEventListener('click', () => { if (idx < working.length-1) { [working[idx+1], working[idx]] = [working[idx], working[idx+1]]; renderList(); } });
            grp.appendChild(upBtn); grp.appendChild(downBtn);

            if (allowEdit) {
                const editBtn = mkIco('✎', '#0055cc'); editBtn.title = 'Rename';
                editBtn.addEventListener('click', () => { const u = window.prompt('Edit item:', working[idx]); if (u !== null && u.trim()) { working[idx] = u.trim(); renderList(); } });
                grp.appendChild(editBtn);
            }
            if (allowDelete) {
                const delBtn = mkIco('✕', '#b91c1c'); delBtn.title = 'Remove';
                delBtn.addEventListener('click', () => { if (!confirm('Remove this item?')) return; working.splice(idx, 1); renderList(); });
                grp.appendChild(delBtn);
            }
            row.appendChild(lbl); row.appendChild(grp);
            listBox.appendChild(row);
        });
    }
    renderList();

    const foot = document.createElement('div');
    Object.assign(foot.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' });
    const leftCtrl = document.createElement('div'); Object.assign(leftCtrl.style, { display: 'flex', gap: '4px' });

    if (allowAdd) {
        const addBtn = document.createElement('button'); addBtn.textContent = '➕ Add';
        Object.assign(addBtn.style, { padding: '3px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f5f5f5' });
        addBtn.addEventListener('click', () => { const n = window.prompt('New item name:'); if (n && n.trim()) { working.push(n.trim()); renderList(); } });
        leftCtrl.appendChild(addBtn);
    }

    const rightCtrl = document.createElement('div'); Object.assign(rightCtrl.style, { display: 'flex', gap: '6px' });
    const cancelBtn = GH._makeBtn('Cancel', '#6c757d');
    const saveBtn   = GH._makeBtn('Save & Close', '#0055cc');
    cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
    saveBtn.addEventListener('click',   () => { if (typeof onApply === 'function') onApply(working.slice()); document.body.removeChild(modal); });
    rightCtrl.appendChild(cancelBtn); rightCtrl.appendChild(saveBtn);
    foot.appendChild(leftCtrl); foot.appendChild(rightCtrl);

    dialog.appendChild(hdr); dialog.appendChild(listBox); dialog.appendChild(foot);
    modal.appendChild(dialog); document.body.appendChild(modal);
};

// ─── CSV Download modal (with signature backup) ───────────────────────────────
GH.showCsvDownloadModal = function () {
    if (!GH.config.courses.length) { alert('No courses found in the configuration.'); return; }

    const modal  = GH._makeModalOverlay();
    const dialog = GH._makeModalDialog('420px');
    dialog.appendChild(GH._modalTitle('Download CSV'));

    const course     = GH.getCourseById(GH.config.selectedCourseId);
    const courseName = course ? course.name : '';

    // ── What to download ──
    const scopeHead = GH._sectionHead('What to download:');
    dialog.appendChild(scopeHead);

    const radioBox = document.createElement('div');
    Object.assign(radioBox.style, { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' });

    function mkRadio(name, value, label, checked, disabled) {
        const lbl = document.createElement('label');
        Object.assign(lbl.style, { display: 'flex', alignItems: 'center', gap: '8px', cursor: disabled ? 'default' : 'pointer', padding: '3px 0' });
        const r = document.createElement('input'); r.type = 'radio'; r.name = name; r.value = value; r.checked = !!checked;
        if (disabled) { r.disabled = true; lbl.style.opacity = '0.5'; }
        const sp = document.createElement('span'); sp.textContent = label;
        lbl.appendChild(r); lbl.appendChild(sp); return lbl;
    }

    radioBox.appendChild(mkRadio('csvDlScope', 'course',   course ? `Current course only (${courseName})` : 'Current course (none selected)', !!course, !course));
    radioBox.appendChild(mkRadio('csvDlScope', 'all',      'All courses', !course));
    radioBox.appendChild(mkRadio('csvDlScope', 'template', 'Blank template with example data'));
    dialog.appendChild(radioBox);

    // ── Signature backup option ──
    const hasSig = !!GH.teacherSignature;
    const sigSection = GH._sectionHead('Signature backup:');
    dialog.appendChild(sigSection);

    const sigLabel = document.createElement('label');
    Object.assign(sigLabel.style, { display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '14px', cursor: hasSig ? 'pointer' : 'default', opacity: hasSig ? '1' : '0.45', fontSize: '13px' });
    const sigCb = document.createElement('input'); sigCb.type = 'checkbox'; sigCb.checked = hasSig; sigCb.disabled = !hasSig;
    sigCb.style.marginTop = '2px';
    const sigDesc = document.createElement('span');
    sigDesc.innerHTML = hasSig
        ? 'Also download a <strong>signature backup file</strong> (.txt) so you can restore it later via Upload CSV.'
        : 'No signature configured — nothing to back up.';
    sigLabel.appendChild(sigCb); sigLabel.appendChild(sigDesc);
    dialog.appendChild(sigLabel);

    // ── Buttons ──
    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px' });
    const cancelBtn  = GH._makeBtn('Cancel',   '#6c757d');
    const downloadBtn = GH._makeBtn('Download', '#0055cc');

    cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
    downloadBtn.addEventListener('click', () => {
        const scope  = dialog.querySelector('input[name="csvDlScope"]:checked').value;
        const withSig = hasSig && sigCb.checked;

        let csvText, filenameBase;
        const dateStr = GH.formatToday().replace(/[\s,]/g, '_');

        if (scope === 'course' && course) {
            csvText      = GH.buildMasterCsvFromConfig(GH.config, [course.id]);
            filenameBase = GH.sanitizeFilename(course.name);
        } else if (scope === 'template') {
            csvText = [
                '# D2L Grading Helper Master Comment Template',
                '# Section: FEEDBACK, NEXT_STEP, or LEVEL_COMMENT',
                '# For FEEDBACK and NEXT_STEP rows, leave Level blank.',
                '# For LEVEL_COMMENT rows, fill Level with the proficiency level name.',
                'Section,Course,Assignment,Level,Comment',
                'FEEDBACK,"Math 10","Unit 1 Test","","Great use of formulas and clear work shown"',
                'FEEDBACK,"Math 10","Unit 1 Test","","Check your calculations in question 5"',
                'NEXT_STEP,"Math 10","Unit 1 Test","","Review the order of operations"',
                'NEXT_STEP,"Math 10","Unit 1 Test","","Practice multi-step problems"',
                'LEVEL_COMMENT,"Math 10","Unit 1 Test","EXTENDING","Excellent mastery of all concepts with sophisticated problem-solving"',
                'LEVEL_COMMENT,"Math 10","Unit 1 Test","PROFICIENT","Good understanding of core concepts with minor errors"',
                'LEVEL_COMMENT,"Math 10","Unit 1 Test","DEVELOPING","Shows partial understanding but needs more practice"',
                'LEVEL_COMMENT,"Math 10","Unit 1 Test","EMERGING","Beginning to grasp basic concepts, requires significant support"'
            ].join('\n');
            filenameBase = 'grading_helper_template';
        } else {
            csvText      = GH.buildMasterCsvFromConfig(GH.config, null);
            filenameBase = 'grading_helper_master';
        }

        GH._triggerDownload(csvText, 'text/csv', filenameBase + '_' + dateStr + '.csv');

        if (withSig) {
            const sigContent = [
                '# D2L Grading Helper — Signature Backup',
                '# Generated: ' + GH.formatToday(),
                '# Upload this file via "Upload CSV" and check "Restore signature from this file".',
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

// ─── CSV Upload modal (with optional signature restore) ───────────────────────
GH.showCsvUploadModal = function (hiddenCsvInput, hiddenSigInput) {
    const modal  = GH._makeModalOverlay();
    const dialog = GH._makeModalDialog('420px');
    dialog.appendChild(GH._modalTitle('Upload CSV'));

    const course     = GH.getCourseById(GH.config.selectedCourseId);
    const courseName = course ? course.name : '';

    // ── Scope ──
    dialog.appendChild(GH._sectionHead('Upload scope:'));
    const scopeBox = document.createElement('div');
    Object.assign(scopeBox.style, { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' });

    function mkRadio(name, value, label, checked, disabled) {
        const lbl = document.createElement('label');
        Object.assign(lbl.style, { display: 'flex', alignItems: 'center', gap: '8px', cursor: disabled ? 'default' : 'pointer', padding: '3px 0' });
        const r = document.createElement('input'); r.type = 'radio'; r.name = name; r.value = value; r.checked = !!checked;
        if (disabled) { r.disabled = true; lbl.style.opacity = '0.5'; }
        const sp = document.createElement('span'); sp.textContent = label;
        lbl.appendChild(r); lbl.appendChild(sp); return lbl;
    }

    scopeBox.appendChild(mkRadio('csvUpScope', 'course', course ? `Current course only (${courseName})` : 'Current course (none selected)', !!course, !course));
    scopeBox.appendChild(mkRadio('csvUpScope', 'all', 'All courses', !course));
    dialog.appendChild(scopeBox);

    // ── Mode ──
    dialog.appendChild(GH._sectionHead('Upload mode:'));
    const modeBox = document.createElement('div');
    Object.assign(modeBox.style, { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' });

    const mergeLabel   = mkRadio('csvUpMode', 'merge',   'Merge — add new items, keep existing', true);
    const replaceLabel = mkRadio('csvUpMode', 'replace', '');
    const replaceSpan  = replaceLabel.querySelector('span');
    replaceSpan.innerHTML = 'Replace — <strong>⚠️ overwrites all existing data</strong>';
    modeBox.appendChild(mergeLabel); modeBox.appendChild(replaceLabel);
    dialog.appendChild(modeBox);

    // ── Signature restore ──
    dialog.appendChild(GH._sectionHead('Signature restore (optional):'));
    const sigRestoreLabel = document.createElement('label');
    Object.assign(sigRestoreLabel.style, { display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '14px', cursor: 'pointer', fontSize: '13px' });
    const sigRestoreCb = document.createElement('input'); sigRestoreCb.type = 'checkbox'; sigRestoreCb.style.marginTop = '2px';
    const sigRestoreDesc = document.createElement('span');
    sigRestoreDesc.innerHTML = 'Also upload a <strong>signature backup file</strong> (.txt) to restore your signature. You will be prompted to choose the file separately.';
    sigRestoreLabel.appendChild(sigRestoreCb); sigRestoreLabel.appendChild(sigRestoreDesc);
    dialog.appendChild(sigRestoreLabel);

    // ── Buttons ──
    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px' });
    const cancelBtn  = GH._makeBtn('Cancel',         '#6c757d');
    const uploadBtn  = GH._makeBtn('Choose File…',   '#0055cc');

    cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
    uploadBtn.addEventListener('click', () => {
        const scope    = dialog.querySelector('input[name="csvUpScope"]:checked').value;
        const mode     = dialog.querySelector('input[name="csvUpMode"]:checked').value;
        const withSig  = sigRestoreCb.checked;

        if (mode === 'replace') {
            if (!confirm('Are you sure you want to REPLACE existing data?\n\nThis cannot be undone. Click Cancel to go back.')) return;
        }

        hiddenCsvInput.dataset.uploadScope   = scope;
        hiddenCsvInput.dataset.uploadMode    = mode;
        hiddenCsvInput.dataset.restoreSig    = withSig ? '1' : '0';
        hiddenCsvInput.value = '';
        hiddenCsvInput.click();
        document.body.removeChild(modal);
    });

    btnRow.appendChild(cancelBtn); btnRow.appendChild(uploadBtn);
    dialog.appendChild(btnRow);
    modal.appendChild(dialog); document.body.appendChild(modal);
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
GH._makeModalOverlay = function () {
    const el = document.createElement('div');
    Object.assign(el.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.52)', zIndex: '10000000', display: 'flex', alignItems: 'center', justifyContent: 'center' });
    return el;
};

GH._makeModalDialog = function (maxWidth) {
    const el = document.createElement('div');
    Object.assign(el.style, { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', maxWidth: maxWidth || '500px', width: '92%', maxHeight: '82%', overflowY: 'auto', fontFamily: 'Segoe UI, system-ui, sans-serif', fontSize: '13px' });
    return el;
};

GH._modalTitle = function (text) {
    const h = document.createElement('h3');
    h.textContent = text;
    Object.assign(h.style, { margin: '0 0 14px 0', color: '#111', fontSize: '15px' });
    return h;
};

GH._sectionHead = function (text) {
    const el = document.createElement('div');
    el.textContent = text;
    Object.assign(el.style, { fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555', marginBottom: '8px' });
    return el;
};

GH._makeBtn = function (label, bg) {
    const b = document.createElement('button');
    b.textContent = label;
    Object.assign(b.style, { padding: '6px 14px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '13px', backgroundColor: bg, color: '#fff', fontFamily: 'inherit' });
    b.addEventListener('mouseenter', () => { b.style.opacity = '0.88'; });
    b.addEventListener('mouseleave', () => { b.style.opacity = '1'; });
    return b;
};

GH._triggerDownload = function (content, mimeType, filename) {
    const blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
};

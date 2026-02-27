// ui-panel.js — v3: all UX/UDL recommendations applied

'use strict';

window.GH = window.GH || {};

// ── Toast notification ────────────────────────────────────────────────────────
GH.toast = function (msg, duration) {
    let t = document.getElementById('gh-toast');
    if (!t) { t = document.createElement('div'); t.id = 'gh-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('gh-toast-show');
    clearTimeout(GH._toastTimer);
    GH._toastTimer = setTimeout(() => t.classList.remove('gh-toast-show'), duration || 2400);
};

// ── Panel entry ───────────────────────────────────────────────────────────────
GH.buildPanel = function () {
    const cfg = GH.config;
    const ps  = cfg.panelState;

    if (!ps.top || !ps.left) {
        ps.width  = ps.width  || 440;
        ps.height = ps.height || 580;
        ps.top    = 80;
        ps.left   = Math.max(20, window.innerWidth - ps.width - 40);
    }

    let darkMode = ps.darkMode || false;

    // ── Panel shell ───────────────────────────────────────────────
    const panel = document.createElement('div');
    panel.id = 'd2l-grading-helper-panel';
    if (darkMode) panel.classList.add('gh-dark');
    Object.assign(panel.style, {
        position: 'fixed', zIndex: '9999999', borderRadius: '8px',
        fontFamily: 'Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        width: (ps.width || 440) + 'px', height: (ps.height || 580) + 'px',
        top: ps.top + 'px', left: ps.left + 'px'
    });

    // ── Header ────────────────────────────────────────────────────
    const header = document.createElement('div');
    header.className = 'gh-header';
    Object.assign(header.style, {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 10px', cursor: 'move', fontSize: '13px',
        userSelect: 'none', flexShrink: '0', borderRadius: '8px 8px 0 0'
    });

    const titleSpan = document.createElement('span');
    titleSpan.textContent = '📝 Grading Helper';
    titleSpan.style.cssText = 'font-weight:600;letter-spacing:0.01em;';

    const headerBtns = document.createElement('div');
    Object.assign(headerBtns.style, { display: 'flex', gap: '6px', alignItems: 'center' });

    const darkModeBtn = document.createElement('button');
    const minimizeBtn = document.createElement('button');
    [darkModeBtn, minimizeBtn].forEach(b => {
        Object.assign(b.style, { border: 'none', borderRadius: '4px', padding: '2px 7px', fontSize: '13px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff', lineHeight: '1.4' });
    });
    darkModeBtn.textContent = darkMode ? '☀️' : '🌙';
    darkModeBtn.title       = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
    minimizeBtn.textContent = ps.minimized ? '▢' : '▁';
    minimizeBtn.title       = ps.minimized ? 'Restore panel' : 'Minimize panel';
    headerBtns.appendChild(darkModeBtn); headerBtns.appendChild(minimizeBtn);
    header.appendChild(titleSpan); header.appendChild(headerBtns);

    // ── Body ──────────────────────────────────────────────────────
    const body = document.createElement('div');
    body.className = 'gh-body';
    Object.assign(body.style, {
        padding: '8px', display: ps.minimized ? 'none' : 'flex',
        flexDirection: 'column', gap: '5px', fontSize: '12px',
        flex: '1 1 auto', minHeight: '0', boxSizing: 'border-box', overflowY: 'auto'
    });

    // ─── UI helpers ───────────────────────────────────────────────
    function makeRow(labelText) {
        const row = document.createElement('div');
        Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' });
        if (labelText) {
            const lbl = document.createElement('span');
            lbl.textContent = labelText; lbl.className = 'gh-label'; lbl.style.minWidth = '78px';
            row.appendChild(lbl);
        }
        return row;
    }
    function makeBtn(txt, title) {
        const b = document.createElement('button');
        b.textContent = txt; b.className = 'gh-btn';
        if (title) b.title = title;
        Object.assign(b.style, { padding: '2px 6px', fontSize: '11px' });
        return b;
    }
    function makeIconBtn(txt, role, title) {
        const b = document.createElement('button');
        b.textContent = txt; b.className = 'gh-icon-btn' + (role ? ' ' + role : '');
        if (title) b.title = title;
        return b;
    }

    // ── Course row ────────────────────────────────────────────────
    const courseRow          = makeRow('Course:');
    const courseSelect       = document.createElement('select');
    Object.assign(courseSelect.style, { flex: '1', padding: '2px 4px', fontSize: '12px' });
    const addCourseBtn       = makeBtn('➕', 'Add course');
    const editLevelsBtn      = makeBtn('⚙',  'Edit levels');
    const renameCourseBtn    = makeBtn('✎',  'Rename course');
    const reorderCoursesBtn  = makeBtn('⇅',  'Reorder courses');
    const deleteCourseBtn    = makeBtn('🗑', 'Delete course');
    [courseSelect, addCourseBtn, editLevelsBtn, renameCourseBtn, reorderCoursesBtn, deleteCourseBtn].forEach(el => courseRow.appendChild(el));

    // ── Assignment row ────────────────────────────────────────────
    const assignmentRow         = makeRow('Assignment:');
    const assignmentSelect      = document.createElement('select');
    Object.assign(assignmentSelect.style, { flex: '1', padding: '2px 4px', fontSize: '12px' });
    const addAssignmentBtn      = makeBtn('➕', 'Add assignment');
    const moveUpBtn             = makeBtn('↑',  'Move assignment up');
    const moveDownBtn           = makeBtn('↓',  'Move assignment down');
    const reorderAssignmentsBtn = makeBtn('⇅',  'Reorder assignments');
    const renameAssignmentBtn   = makeBtn('✎',  'Rename assignment');
    const deleteAssignmentBtn   = makeBtn('🗑', 'Delete assignment');
    [assignmentSelect, addAssignmentBtn, moveUpBtn, moveDownBtn, reorderAssignmentsBtn, renameAssignmentBtn, deleteAssignmentBtn].forEach(el => assignmentRow.appendChild(el));

    // ── Level row ─────────────────────────────────────────────────
    const levelRow       = makeRow('Level:');
    const levelSelect    = document.createElement('select');
    Object.assign(levelSelect.style, { flex: '1', padding: '2px 4px', fontSize: '12px' });
    const addLevelBtn    = makeBtn('➕', 'Add level');
    const renameLevelBtn = makeBtn('✎',  'Rename level');
    const reorderLevelsBtn = makeBtn('⇅', 'Reorder levels');
    const deleteLevelBtn = makeBtn('🗑', 'Delete level');
    [levelSelect, addLevelBtn, renameLevelBtn, reorderLevelsBtn, deleteLevelBtn].forEach(el => levelRow.appendChild(el));

    // ── Level comment block (collapsible) ─────────────────────────
    const lcSection = document.createElement('div');
    lcSection.className = 'gh-section';
    lcSection.style.display = 'flex'; lcSection.style.flexDirection = 'column'; lcSection.style.gap = '4px';

    const lcHeaderRow = document.createElement('div');
    Object.assign(lcHeaderRow.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' });

    const lcToggleBtn = document.createElement('button');
    lcToggleBtn.className = 'gh-collapse-toggle';
    lcToggleBtn.innerHTML = '▾ Level Comment <span class="gh-section-label">(overall)</span>';
    Object.assign(lcToggleBtn.style, { border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', fontWeight: '600', fontSize: '12px', color: 'var(--gh-text)', display: 'flex', alignItems: 'center', gap: '4px' });

    const includeLevelLabel = document.createElement('label');
    Object.assign(includeLevelLabel.style, { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', cursor: 'pointer', color: 'var(--gh-text-muted)' });
    const includeLevelCb = document.createElement('input'); includeLevelCb.type = 'checkbox'; includeLevelCb.checked = !!cfg.includeLevelComment;
    includeLevelLabel.appendChild(includeLevelCb);
    includeLevelLabel.appendChild(Object.assign(document.createElement('span'), { textContent: 'Include' }));
    lcHeaderRow.appendChild(lcToggleBtn); lcHeaderRow.appendChild(includeLevelLabel);

    const lcBody = document.createElement('div');
    lcBody.style.display = ps.lcCollapsed ? 'none' : 'flex';
    lcBody.style.flexDirection = 'column'; lcBody.style.gap = '4px';

    const levelFeedbackTextarea = document.createElement('textarea');
    Object.assign(levelFeedbackTextarea.style, { width: '100%', minHeight: '46px', maxHeight: '80px', padding: '4px 6px', fontSize: '12px', resize: 'vertical' });
    levelFeedbackTextarea.placeholder = 'Overall proficiency comment for this assignment & level...';

    const lcBtnRow = document.createElement('div');
    Object.assign(lcBtnRow.style, { display: 'flex', justifyContent: 'flex-end' });
    const saveLevelCommentBtn = makeBtn('💾 Save Level Comment');
    lcBtnRow.appendChild(saveLevelCommentBtn);
    lcBody.appendChild(levelFeedbackTextarea); lcBody.appendChild(lcBtnRow);

    lcSection.appendChild(lcHeaderRow); lcSection.appendChild(lcBody);

    // Collapse toggle
    lcToggleBtn.addEventListener('click', () => {
        ps.lcCollapsed = !ps.lcCollapsed;
        lcBody.style.display = ps.lcCollapsed ? 'none' : 'flex';
        lcToggleBtn.innerHTML = (ps.lcCollapsed ? '▸' : '▾') + ' Level Comment <span class="gh-section-label">(overall)</span>';
        GH.saveConfig();
    });
    if (ps.lcCollapsed) lcToggleBtn.innerHTML = '▸ Level Comment <span class="gh-section-label">(overall)</span>';

    // ── Feedback section ──────────────────────────────────────────
    const fbHeaderRow = document.createElement('div');
    Object.assign(fbHeaderRow.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' });

    // Left: label + selected-count badge
    const fbLeft = document.createElement('div');
    Object.assign(fbLeft.style, { display: 'flex', alignItems: 'center', gap: '6px' });
    const fbTitle = document.createElement('span'); fbTitle.textContent = 'Feedback'; fbTitle.className = 'gh-label';
    const fbCountBadge = document.createElement('span');
    fbCountBadge.className = 'gh-badge';
    Object.assign(fbCountBadge.style, { display: 'none', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: 'var(--gh-accent)', color: 'var(--gh-accent-text)', fontWeight: '600' });
    fbLeft.appendChild(fbTitle); fbLeft.appendChild(fbCountBadge);

    const fbRight = document.createElement('div');
    Object.assign(fbRight.style, { display: 'flex', gap: '4px', alignItems: 'center' });
    const selectAllProfBtn  = makeBtn('✓ All',     'Select all as "did well"');
    const selectAllNeedsBtn = makeBtn('✗ All',     'Select all as "needs improvement"');
    const clearAllBtn       = makeBtn('✗ None',    'Deselect all');
    [selectAllProfBtn, selectAllNeedsBtn, clearAllBtn].forEach(b => fbRight.appendChild(b));
    fbHeaderRow.appendChild(fbLeft); fbHeaderRow.appendChild(fbRight);

    const fbColHeader = document.createElement('div');
    fbColHeader.className = 'gh-col-header';
    ['✓', '✗', 'Comment'].forEach((t, i) => {
        const d = document.createElement('div'); d.textContent = t;
        d.title = i === 0 ? 'Did well' : i === 1 ? 'Needs improvement' : '';
        if (i < 2) d.style.textAlign = 'center';
        fbColHeader.appendChild(d);
    });

    const feedbackListContainer = document.createElement('div');
    feedbackListContainer.className = 'gh-list';
    Object.assign(feedbackListContainer.style, { minHeight: '100px', maxHeight: '160px' });

    const addFbRow = document.createElement('div');
    Object.assign(addFbRow.style, { display: 'flex', flexDirection: 'column', gap: '4px' });
    const newFbInput = document.createElement('textarea'); newFbInput.rows = 2;
    Object.assign(newFbInput.style, { width: '100%', fontSize: '12px', padding: '4px 6px', resize: 'vertical' });
    newFbInput.placeholder = 'Add feedback comment… (Ctrl+Enter to save)';
    const addFbBtnRow = document.createElement('div');
    Object.assign(addFbBtnRow.style, { display: 'flex', justifyContent: 'flex-start' });
    const addFbBtn = makeBtn('➕ Add Feedback');
    addFbBtnRow.appendChild(addFbBtn);
    addFbRow.appendChild(newFbInput); addFbRow.appendChild(addFbBtnRow);

    // ── Next Steps (collapsible) ───────────────────────────────────
    const nsSection = document.createElement('div');
    nsSection.className = 'gh-section';
    nsSection.style.display = 'flex'; nsSection.style.flexDirection = 'column'; nsSection.style.gap = '4px';

    const nsHeaderRow = document.createElement('div');
    Object.assign(nsHeaderRow.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' });

    const nsToggleBtn = document.createElement('button');
    nsToggleBtn.className = 'gh-collapse-toggle';
    nsToggleBtn.innerHTML = '▾ Next Steps';
    Object.assign(nsToggleBtn.style, { border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', fontWeight: '600', fontSize: '12px', color: 'var(--gh-text)', display: 'flex', alignItems: 'center', gap: '4px' });

    // Next Steps selected count badge
    const nsCountBadge = document.createElement('span');
    nsCountBadge.className = 'gh-badge';
    Object.assign(nsCountBadge.style, { display: 'none', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: 'var(--gh-accent)', color: 'var(--gh-accent-text)', fontWeight: '600' });

    const nsToggleLeft = document.createElement('div');
    Object.assign(nsToggleLeft.style, { display: 'flex', alignItems: 'center', gap: '6px' });
    nsToggleLeft.appendChild(nsToggleBtn); nsToggleLeft.appendChild(nsCountBadge);

    const includeNsLabel = document.createElement('label');
    Object.assign(includeNsLabel.style, { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', cursor: 'pointer', color: 'var(--gh-text-muted)' });
    const includeNsCb = document.createElement('input'); includeNsCb.type = 'checkbox'; includeNsCb.checked = !!cfg.includeNextSteps;
    includeNsLabel.appendChild(includeNsCb);
    includeNsLabel.appendChild(Object.assign(document.createElement('span'), { textContent: 'Include' }));
    nsHeaderRow.appendChild(nsToggleLeft); nsHeaderRow.appendChild(includeNsLabel);

    const nsBody = document.createElement('div');
    nsBody.style.display = ps.nsCollapsed ? 'none' : 'flex';
    nsBody.style.flexDirection = 'column'; nsBody.style.gap = '4px';

    const nextStepsListContainer = document.createElement('div');
    nextStepsListContainer.className = 'gh-list';
    Object.assign(nextStepsListContainer.style, { maxHeight: '80px' });

    const nsAddRow = document.createElement('div');
    Object.assign(nsAddRow.style, { display: 'flex', flexDirection: 'column', gap: '4px' });
    const newNsInput = document.createElement('textarea'); newNsInput.rows = 2;
    Object.assign(newNsInput.style, { width: '100%', fontSize: '12px', padding: '4px 6px', resize: 'vertical' });
    newNsInput.placeholder = 'Add next step… (Ctrl+Enter to save)';
    const addNsBtnRow = document.createElement('div');
    Object.assign(addNsBtnRow.style, { display: 'flex', justifyContent: 'flex-end' });
    const addNsBtn = makeBtn('➕ Add Next Step');
    addNsBtnRow.appendChild(addNsBtn);
    nsAddRow.appendChild(newNsInput); nsAddRow.appendChild(addNsBtnRow);
    nsBody.appendChild(nextStepsListContainer); nsBody.appendChild(nsAddRow);
    nsSection.appendChild(nsHeaderRow); nsSection.appendChild(nsBody);

    nsToggleBtn.addEventListener('click', () => {
        ps.nsCollapsed = !ps.nsCollapsed;
        nsBody.style.display = ps.nsCollapsed ? 'none' : 'flex';
        nsToggleBtn.innerHTML = (ps.nsCollapsed ? '▸' : '▾') + ' Next Steps';
        GH.saveConfig();
    });
    if (ps.nsCollapsed) nsToggleBtn.innerHTML = '▸ Next Steps';

    // ── Preview block ─────────────────────────────────────────────
    const previewBlock = document.createElement('div');
    previewBlock.className = 'gh-preview-block';
    previewBlock.style.display = 'flex'; previewBlock.style.flexDirection = 'column'; previewBlock.style.gap = '4px';

    const previewHdr = document.createElement('div');
    Object.assign(previewHdr.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' });

    const previewLeft = document.createElement('div');
    Object.assign(previewLeft.style, { display: 'flex', alignItems: 'center', gap: '6px' });
    const previewLabel = document.createElement('span');
    previewLabel.textContent = '👁 Preview'; previewLabel.className = 'gh-preview-label';
    // Word count
    const wordCountEl = document.createElement('span');
    Object.assign(wordCountEl.style, { fontSize: '10px', color: 'var(--gh-text-faint)', fontStyle: 'italic' });
    previewLeft.appendChild(previewLabel); previewLeft.appendChild(wordCountEl);

    const previewRight = document.createElement('div');
    Object.assign(previewRight.style, { display: 'flex', gap: '4px' });
    const copyPreviewBtn  = makeBtn('📋 Copy', 'Copy preview HTML to clipboard');
    const refreshPreviewBtn = makeBtn('↻ Refresh', 'Refresh preview');
    previewRight.appendChild(copyPreviewBtn); previewRight.appendChild(refreshPreviewBtn);

    previewHdr.appendChild(previewLeft); previewHdr.appendChild(previewRight);
    const previewContent = document.createElement('div');
    previewContent.className = 'gh-preview-content';
    previewContent.innerHTML = '<em style="color:var(--gh-text-faint)">Check feedback items above to preview the output here.</em>';
    previewBlock.appendChild(previewHdr); previewBlock.appendChild(previewContent);

    // ── CSV row ───────────────────────────────────────────────────
    const csvRow = document.createElement('div');
    Object.assign(csvRow.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' });
    const csvLabel = document.createElement('span'); csvLabel.textContent = 'Master CSV:'; csvLabel.className = 'gh-label';
    const csvBtns  = document.createElement('div'); Object.assign(csvBtns.style, { display: 'flex', gap: '4px' });
    const downloadCsvBtn = makeBtn('⬇ Download', 'Download feedback as CSV');
    const uploadCsvBtn   = makeBtn('⬆ Upload',   'Upload CSV');
    csvBtns.appendChild(downloadCsvBtn); csvBtns.appendChild(uploadCsvBtn);
    csvRow.appendChild(csvLabel); csvRow.appendChild(csvBtns);

    const hiddenCsvInput = document.createElement('input');
    hiddenCsvInput.type = 'file'; hiddenCsvInput.accept = '.csv,text/csv'; hiddenCsvInput.style.display = 'none';
    const hiddenSigInput = document.createElement('input');
    hiddenSigInput.type = 'file'; hiddenSigInput.accept = '.txt,text/plain'; hiddenSigInput.style.display = 'none';

    // ── Bottom action bar ─────────────────────────────────────────
    const bottomBar = document.createElement('div');
    Object.assign(bottomBar.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginTop: '2px' });

    const bottomLeft = document.createElement('div');
    Object.assign(bottomLeft.style, { display: 'flex', alignItems: 'center', gap: '8px' });

    const skeletonLabel = document.createElement('label');
    Object.assign(skeletonLabel.style, { display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--gh-text-muted)', fontSize: '11px' });
    const skeletonCb = document.createElement('input'); skeletonCb.type = 'checkbox';
    skeletonCb.title = 'Also copy a plain-text skeleton email to clipboard on insert';
    skeletonLabel.appendChild(skeletonCb);
    skeletonLabel.appendChild(Object.assign(document.createElement('span'), { textContent: '✉ Skeleton email' }));

    const signatureBtn = makeBtn('✍ Sig', 'Configure teacher signature');

    bottomLeft.appendChild(skeletonLabel); bottomLeft.appendChild(signatureBtn);

    const insertBtn = document.createElement('button');
    insertBtn.className = 'gh-insert-btn';
    insertBtn.textContent = '▶ Insert Feedback';
    insertBtn.title = 'Insert selected feedback into D2L Overall Feedback (Ctrl+Shift+Enter)';
    Object.assign(insertBtn.style, { padding: '5px 14px', fontSize: '12px' });

    bottomBar.appendChild(bottomLeft); bottomBar.appendChild(insertBtn);

    // ── Auto-save indicator ───────────────────────────────────────
    const savedIndicator = document.createElement('div');
    Object.assign(savedIndicator.style, { fontSize: '10px', color: 'var(--gh-text-faint)', textAlign: 'right', minHeight: '14px', transition: 'opacity 0.5s', opacity: '0' });
    savedIndicator.textContent = '✓ Saved';

    let savedTimer;
    function flashSaved() {
        savedIndicator.style.opacity = '1';
        clearTimeout(savedTimer);
        savedTimer = setTimeout(() => { savedIndicator.style.opacity = '0'; }, 1800);
    }

    // Wrap saveConfig to flash indicator
    const _origSave = GH.saveConfig.bind(GH);
    GH.saveConfig = function () { _origSave(); flashSaved(); };

    // ── Assemble body ─────────────────────────────────────────────
    body.appendChild(courseRow);
    body.appendChild(assignmentRow);
    body.appendChild(levelRow);
    body.appendChild(lcSection);
    body.appendChild(fbHeaderRow);
    body.appendChild(fbColHeader);
    body.appendChild(feedbackListContainer);
    body.appendChild(addFbRow);
    body.appendChild(nsSection);
    body.appendChild(previewBlock);
    body.appendChild(csvRow);
    body.appendChild(hiddenCsvInput);
    body.appendChild(hiddenSigInput);
    body.appendChild(bottomBar);
    body.appendChild(savedIndicator);

    // ── Resizer ───────────────────────────────────────────────────
    const resizer = document.createElement('div'); resizer.className = 'gh-resizer';
    const resizerIcon = document.createElement('div'); resizerIcon.className = 'gh-resizer-icon';
    resizer.appendChild(resizerIcon);

    panel.appendChild(header); panel.appendChild(body); panel.appendChild(resizer);
    document.body.appendChild(panel);

    if (ps.minimized) { body.style.display = 'none'; resizer.style.display = 'none'; panel.style.height = 'auto'; }

    // ═══════════════════════════════════════════════════════════════
    // SELECTION STATE
    // ═══════════════════════════════════════════════════════════════
    let selectedProf  = new Set();
    let selectedNeeds = new Set();
    let selectedNext  = new Set();

    function resetSelections() { selectedProf.clear(); selectedNeeds.clear(); selectedNext.clear(); }

    function remapAfterRemoval(set, i) {
        const n = new Set();
        set.forEach(x => { if (x < i) n.add(x); else if (x > i) n.add(x - 1); });
        return n;
    }
    function swapInSet(set, a, b) {
        const n = new Set();
        set.forEach(x => { if (x === a) n.add(b); else if (x === b) n.add(a); else n.add(x); });
        return n;
    }

    // ═══════════════════════════════════════════════════════════════
    // BADGE UPDATE
    // ═══════════════════════════════════════════════════════════════
    function updateBadges() {
        const fbCount = selectedProf.size + selectedNeeds.size;
        fbCountBadge.textContent = fbCount + ' selected';
        fbCountBadge.style.display = fbCount > 0 ? '' : 'none';

        const nsCount = selectedNext.size;
        nsCountBadge.textContent = nsCount + ' selected';
        nsCountBadge.style.display = nsCount > 0 ? '' : 'none';
    }

    // ═══════════════════════════════════════════════════════════════
    // HTML / EMAIL BUILDERS
    // ═══════════════════════════════════════════════════════════════
    GH.buildOverallFeedbackHtml = function (profSet, needsSet, nextSet) {
        const course     = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) return null;

        const _p = profSet  !== undefined ? profSet  : selectedProf;
        const _n = needsSet !== undefined ? needsSet : selectedNeeds;
        const _x = nextSet  !== undefined ? nextSet  : selectedNext;

        const levels   = GH.getCourseLevels(course);
        const levelKey = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0] || '');
        const lc       = GH.getLevelCommentsObj(assignment);
        const levelText = (cfg.includeLevelComment && levelKey) ? (lc[levelKey] || '').trim() : '';

        const fbList = GH.getFeedbackList(assignment);
        const profC = [], needsC = [];
        fbList.forEach((t, i) => { const s = String(t||'').trim(); if (!s) return; if (_p.has(i)) profC.push(s); if (_n.has(i)) needsC.push(s); });

        const nsList = GH.getNextStepsList(assignment);
        const nextC  = [];
        if (cfg.includeNextSteps) nsList.forEach((t, i) => { const s = String(t||'').trim(); if (s && _x.has(i)) nextC.push(s); });

        const firstName = GH.getStudentFirstName();
        let html = '';
        const today = GH.formatToday();
        if (today)      html += `<p>${GH.escapeHtml(today)}</p>`;
        if (firstName)  html += `<p>Hi ${GH.escapeHtml(firstName)},</p>`;
        if (levelText)  html += `<p>${GH.escapeHtml(levelText)}</p>`;
        if (profC.length)  { html += '<p><strong>What you did well:</strong></p><ul>'; profC.forEach(c  => { html += `<li>${GH.escapeHtml(c)}</li>`;  }); html += '</ul>'; }
        if (needsC.length) { html += '<p><strong>Areas for improvement:</strong></p><ul>'; needsC.forEach(c => { html += `<li>${GH.escapeHtml(c)}</li>`; }); html += '</ul>'; }
        if (nextC.length)  { html += '<p><strong>Next steps:</strong></p><ul>'; nextC.forEach(c  => { html += `<li>${GH.escapeHtml(c)}</li>`;  }); html += '</ul>'; }
        if (GH.teacherSignature) html += `<p>${GH.teacherSignature}</p>`;
        return html || null;
    };

    GH.buildSkeletonEmailText = function () {
        const course     = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) return '';

        const levels   = GH.getCourseLevels(course);
        const levelKey = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0] || '');
        const levelText = (cfg.includeLevelComment && levelKey) ? (GH.getLevelCommentsObj(assignment)[levelKey] || '').trim() : '';

        const fbList = GH.getFeedbackList(assignment);
        const profC = [], needsC = [];
        fbList.forEach((t, i) => { const s = String(t||'').trim(); if (!s) return; if (selectedProf.has(i)) profC.push(s); if (selectedNeeds.has(i)) needsC.push(s); });
        const nsList = GH.getNextStepsList(assignment);
        const nextC = [];
        if (cfg.includeNextSteps) nsList.forEach((t, i) => { const s = String(t||'').trim(); if (s && selectedNext.has(i)) nextC.push(s); });

        const firstName = GH.getStudentFirstName();
        let text = firstName ? `Hi ${firstName},\n\n` : 'Hi,\n\n';
        if (assignment.name || course.name) {
            text += 'Here is some feedback';
            if (assignment.name) text += ` for "${assignment.name}"`;
            if (course.name)     text += ` in ${course.name}`;
            text += '.\n\n';
        }
        if (levelText)    text += levelText + '\n\n';
        if (profC.length)  { text += 'What you did well:\n'; profC.forEach(c  => { text += `• ${c}\n`; }); text += '\n'; }
        if (needsC.length) { text += 'Areas for improvement:\n'; needsC.forEach(c => { text += `• ${c}\n`; }); text += '\n'; }
        if (nextC.length)  { text += 'Next steps:\n'; nextC.forEach(c  => { text += `• ${c}\n`; }); text += '\n'; }
        if (GH.teacherSignature) text += '\n' + GH.teacherSignature.replace(/<br\s*\/?>/gi, '\n') + '\n';
        return text.trim() || '';
    };

    // ═══════════════════════════════════════════════════════════════
    // PREVIEW + WORD COUNT
    // ═══════════════════════════════════════════════════════════════
    function updatePreview() {
        const html = GH.buildOverallFeedbackHtml();
        previewContent.innerHTML = html
            ? html
            : '<em style="color:var(--gh-text-faint)">Check feedback items above to preview the output here.</em>';

        // Word count from plain text of rendered HTML
        const tmp = document.createElement('div'); tmp.innerHTML = html || '';
        const words = (tmp.textContent || '').trim().split(/\s+/).filter(Boolean).length;
        wordCountEl.textContent = html ? `${words} word${words !== 1 ? 's' : ''}` : '';
        updateBadges();
    }

    // ═══════════════════════════════════════════════════════════════
    // DARK MODE — single class toggle, tokens do the rest
    // ═══════════════════════════════════════════════════════════════
    function applyDarkMode() {
        panel.classList.toggle('gh-dark', darkMode);
        darkModeBtn.textContent = darkMode ? '☀️' : '🌙';
        darkModeBtn.title       = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
    }

    // ═══════════════════════════════════════════════════════════════
    // REFRESH FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    function refreshCourseOptions() {
        courseSelect.innerHTML = '';
        const ph = document.createElement('option'); ph.value = '';
        ph.textContent = cfg.courses.length ? '— select course —' : '— add a course —';
        courseSelect.appendChild(ph);
        cfg.courses.forEach(c => {
            const opt = document.createElement('option'); opt.value = c.id; opt.textContent = c.name;
            courseSelect.appendChild(opt);
        });
        courseSelect.value = GH.getCourseById(cfg.selectedCourseId) ? cfg.selectedCourseId : '';
    }

    function refreshAssignmentOptions() {
        assignmentSelect.innerHTML = '';
        const course = GH.getCourseById(cfg.selectedCourseId);
        const ph = document.createElement('option'); ph.value = '';
        ph.textContent = (course && course.assignments && course.assignments.length) ? '— select assignment —' : '— add an assignment —';
        assignmentSelect.appendChild(ph);
        if (course) {
            (course.assignments || []).forEach(a => {
                const opt = document.createElement('option'); opt.value = a.id; opt.textContent = a.name;
                assignmentSelect.appendChild(opt);
            });
            assignmentSelect.value = GH.getAssignmentById(course, cfg.selectedAssignmentId) ? cfg.selectedAssignmentId : '';
        }
    }

    function refreshLevelOptions() {
        levelSelect.innerHTML = '';
        const course = GH.getCourseById(cfg.selectedCourseId);
        const levels = GH.getCourseLevels(course);
        levels.forEach(l => { const opt = document.createElement('option'); opt.value = l; opt.textContent = l; levelSelect.appendChild(opt); });
        if (!levels.includes(cfg.selectedLevel)) cfg.selectedLevel = levels.includes('PROFICIENT') ? 'PROFICIENT' : levels[0];
        levelSelect.value = cfg.selectedLevel;
    }

    function refreshLevelCommentUI() {
        const course     = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        const levels     = GH.getCourseLevels(course);
        const levelKey   = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0] || '');
        const disabled   = !assignment || !levelKey;
        levelFeedbackTextarea.disabled  = disabled;
        saveLevelCommentBtn.disabled    = disabled;
        includeLevelCb.disabled         = disabled;
        levelFeedbackTextarea.value     = disabled ? '' : (GH.getLevelCommentsObj(assignment)[levelKey] || '');
    }

    function refreshFeedbackList() {
        feedbackListContainer.innerHTML = '';
        const course     = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) {
            const m = document.createElement('div'); m.className = 'gh-empty-msg'; m.textContent = 'Select a course and assignment to see feedback options.';
            feedbackListContainer.appendChild(m); return;
        }
        const list = GH.getFeedbackList(assignment);
        if (!list.length) {
            const m = document.createElement('div'); m.className = 'gh-empty-msg'; m.textContent = 'No feedback comments yet. Add one below.';
            feedbackListContainer.appendChild(m); return;
        }
        list.forEach((text, idx) => {
            const row = document.createElement('div'); row.className = 'gh-feedback-row';

            const profCb = document.createElement('input'); profCb.type = 'checkbox'; profCb.style.margin = '2px auto 0'; profCb.checked = selectedProf.has(idx); profCb.title = 'Mark as "did well"';
            profCb.addEventListener('change', () => { if (profCb.checked) selectedProf.add(idx); else selectedProf.delete(idx); updatePreview(); });

            const needsCb = document.createElement('input'); needsCb.type = 'checkbox'; needsCb.style.margin = '2px auto 0'; needsCb.checked = selectedNeeds.has(idx); needsCb.title = 'Mark as "needs improvement"';
            needsCb.addEventListener('change', () => { if (needsCb.checked) selectedNeeds.add(idx); else selectedNeeds.delete(idx); updatePreview(); });

            const cell = document.createElement('div'); Object.assign(cell.style, { display: 'flex', alignItems: 'flex-start', gap: '4px', paddingLeft: '6px' });
            const lbl  = document.createElement('div'); lbl.textContent = text;
            Object.assign(lbl.style, { flex: '1', whiteSpace: 'normal', lineHeight: '1.35', color: 'var(--gh-text)', paddingTop: '1px' });

            const grp = document.createElement('div'); Object.assign(grp.style, { display: 'flex', flexShrink: '0', gap: '1px' });
            const editBtn = makeIconBtn('✎', 'edit',   'Edit comment');
            const upBtn   = makeIconBtn('↑', 'move',   'Move up');
            const downBtn = makeIconBtn('↓', 'move',   'Move down');
            const delBtn  = makeIconBtn('✕', 'delete', 'Delete comment');

            editBtn.addEventListener('click', () => { const u = window.prompt('Edit this feedback comment:', list[idx]); if (u !== null && u.trim()) { list[idx] = u.trim(); GH.saveConfig(); refreshFeedbackList(); updatePreview(); } });
            upBtn.addEventListener('click',   () => { if (idx <= 0) return; [list[idx-1],list[idx]]=[list[idx],list[idx-1]]; selectedProf=swapInSet(selectedProf,idx,idx-1); selectedNeeds=swapInSet(selectedNeeds,idx,idx-1); GH.saveConfig(); refreshFeedbackList(); updatePreview(); });
            downBtn.addEventListener('click', () => { if (idx>=list.length-1) return; [list[idx+1],list[idx]]=[list[idx],list[idx+1]]; selectedProf=swapInSet(selectedProf,idx,idx+1); selectedNeeds=swapInSet(selectedNeeds,idx,idx+1); GH.saveConfig(); refreshFeedbackList(); updatePreview(); });
            delBtn.addEventListener('click',  () => { if (!confirm('Remove this feedback comment?')) return; list.splice(idx,1); selectedProf=remapAfterRemoval(selectedProf,idx); selectedNeeds=remapAfterRemoval(selectedNeeds,idx); GH.saveConfig(); refreshFeedbackList(); updatePreview(); });

            [editBtn, upBtn, downBtn, delBtn].forEach(b => grp.appendChild(b));
            cell.appendChild(lbl); cell.appendChild(grp);
            row.appendChild(profCb); row.appendChild(needsCb); row.appendChild(cell);
            feedbackListContainer.appendChild(row);
        });
    }

    function refreshNextStepsList() {
        nextStepsListContainer.innerHTML = '';
        const course     = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) {
            const m = document.createElement('div'); m.className = 'gh-empty-msg'; m.textContent = 'Select a course and assignment.';
            nextStepsListContainer.appendChild(m); return;
        }
        const list = GH.getNextStepsList(assignment);
        if (!list.length) {
            const m = document.createElement('div'); m.className = 'gh-empty-msg'; m.textContent = 'No next steps yet. Add one below.';
            nextStepsListContainer.appendChild(m); return;
        }
        list.forEach((text, idx) => {
            const row = document.createElement('div'); row.className = 'gh-nextstep-row';
            const cb = document.createElement('input'); cb.type = 'checkbox'; cb.style.marginTop = '2px'; cb.checked = selectedNext.has(idx);
            cb.addEventListener('change', () => { if (cb.checked) selectedNext.add(idx); else selectedNext.delete(idx); updatePreview(); });
            const lbl = document.createElement('div'); lbl.textContent = text;
            Object.assign(lbl.style, { flex: '1', whiteSpace: 'normal', lineHeight: '1.35', color: 'var(--gh-text)' });
            const grp = document.createElement('div'); Object.assign(grp.style, { display: 'flex', flexShrink: '0', gap: '1px' });
            const editBtn = makeIconBtn('✎', 'edit',   'Edit next step');
            const upBtn   = makeIconBtn('↑', 'move',   'Move up');
            const downBtn = makeIconBtn('↓', 'move',   'Move down');
            const delBtn  = makeIconBtn('✕', 'delete', 'Delete next step');
            editBtn.addEventListener('click', () => { const u = window.prompt('Edit next step:', list[idx]); if (u !== null && u.trim()) { list[idx] = u.trim(); GH.saveConfig(); refreshNextStepsList(); updatePreview(); } });
            upBtn.addEventListener('click',   () => { if (idx<=0) return; [list[idx-1],list[idx]]=[list[idx],list[idx-1]]; selectedNext=swapInSet(selectedNext,idx,idx-1); GH.saveConfig(); refreshNextStepsList(); updatePreview(); });
            downBtn.addEventListener('click', () => { if (idx>=list.length-1) return; [list[idx+1],list[idx]]=[list[idx],list[idx+1]]; selectedNext=swapInSet(selectedNext,idx,idx+1); GH.saveConfig(); refreshNextStepsList(); updatePreview(); });
            delBtn.addEventListener('click',  () => { if (!confirm('Remove this next step?')) return; list.splice(idx,1); selectedNext=remapAfterRemoval(selectedNext,idx); GH.saveConfig(); refreshNextStepsList(); updatePreview(); });
            [editBtn, upBtn, downBtn, delBtn].forEach(b => grp.appendChild(b));
            row.appendChild(cb); row.appendChild(lbl); row.appendChild(grp);
            nextStepsListContainer.appendChild(row);
        });
    }

    function refreshAll() {
        refreshCourseOptions(); refreshAssignmentOptions(); refreshLevelOptions();
        refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview();
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT WIRING
    // ═══════════════════════════════════════════════════════════════

    minimizeBtn.addEventListener('click', () => {
        ps.minimized = !ps.minimized;
        if (ps.minimized) { ps.height=panel.offsetHeight; body.style.display='none'; resizer.style.display='none'; panel.style.height='auto'; }
        else { body.style.display='flex'; resizer.style.display='block'; panel.style.height=(ps.height||580)+'px'; }
        minimizeBtn.textContent = ps.minimized ? '▢' : '▁';
        minimizeBtn.title       = ps.minimized ? 'Restore panel' : 'Minimize panel';
        GH.saveConfig();
    });

    darkModeBtn.addEventListener('click', () => { darkMode = !darkMode; ps.darkMode = darkMode; GH.saveConfig(); applyDarkMode(); });

    // Selects
    courseSelect.addEventListener('change', () => { cfg.selectedCourseId=courseSelect.value||null; cfg.selectedAssignmentId=null; resetSelections(); GH.saveConfig(); refreshAssignmentOptions(); refreshLevelOptions(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview(); });
    assignmentSelect.addEventListener('change', () => { const c=GH.getCourseById(cfg.selectedCourseId); cfg.selectedAssignmentId=(c&&assignmentSelect.value)?assignmentSelect.value:null; resetSelections(); GH.saveConfig(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview(); });
    levelSelect.addEventListener('change', () => { if(levelSelect.value){cfg.selectedLevel=levelSelect.value;GH.saveConfig();refreshLevelCommentUI();updatePreview();} });

    // Course CRUD
    addCourseBtn.addEventListener('click', () => { const n=window.prompt('Name for the new course:'); if(!n||!n.trim()) return; const c={id:GH.uuid(),name:n.trim(),levels:GH.DEFAULT_LEVELS.slice(),assignments:[]}; cfg.courses.push(c); cfg.selectedCourseId=c.id; cfg.selectedAssignmentId=null; GH.saveConfig(); refreshAll(); GH.toast('Course added: '+c.name); });
    renameCourseBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){alert('Select a course first.');return;} const n=window.prompt('Rename course:',c.name); if(n===null||!n.trim()) return; c.name=n.trim(); GH.saveConfig(); refreshCourseOptions(); GH.toast('Course renamed.'); });
    deleteCourseBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){alert('Select a course first.');return;} if(!confirm(`Delete course "${c.name}" and all its data?`)) return; cfg.courses=cfg.courses.filter(x=>x.id!==c.id); cfg.selectedCourseId=cfg.courses.length?cfg.courses[0].id:null; cfg.selectedAssignmentId=null; resetSelections(); GH.saveConfig(); refreshAll(); GH.toast('Course deleted.'); });
    reorderCoursesBtn.addEventListener('click', () => { if(!cfg.courses.length){alert('No courses to reorder.');return;} GH.openListEditorModal({title:'Reorder courses',items:cfg.courses.map(c=>c.name||''),onApply:(o)=>{const old=cfg.courses.slice();const used=new Set();const neo=[];o.forEach(n=>{const i=old.findIndex((c,j)=>!used.has(j)&&c.name===n);if(i!==-1){neo.push(old[i]);used.add(i);}});old.forEach((_,i)=>{if(!used.has(i))neo.push(old[i]);});cfg.courses=neo;GH.saveConfig();refreshCourseOptions();}}); });
    editLevelsBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){alert('Select a course first.');return;} GH.openListEditorModal({title:'Edit levels',items:GH.getCourseLevels(c),allowEdit:true,allowAdd:true,allowDelete:true,onApply:(lv)=>{const levels=lv.map(s=>s.trim()).filter(Boolean);if(!levels.length){alert('Must have at least one level.');return;}c.levels=levels;(c.assignments||[]).forEach(a=>{const newLc={};levels.forEach(l=>{newLc[l]=(a.levelComments||{})[l]||'';});a.levelComments=newLc;});if(!levels.includes(cfg.selectedLevel))cfg.selectedLevel=levels[0];GH.saveConfig();refreshLevelOptions();refreshLevelCommentUI();}}); });

    // Assignment CRUD
    addAssignmentBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){alert('Add/select a course first.');return;} const guess=GH.detectCourseAndAssignmentFromTitle(); const n=window.prompt('Name for the new assignment:',(guess&&guess.assignmentName)||''); if(!n||!n.trim()) return; const a={id:GH.uuid(),name:n.trim(),feedback:[],nextSteps:[],levelComments:{}}; GH.getCourseLevels(c).forEach(l=>{a.levelComments[l]='';});c.assignments=c.assignments||[];c.assignments.push(a);cfg.selectedAssignmentId=a.id;resetSelections();GH.saveConfig();refreshAssignmentOptions();refreshLevelCommentUI();refreshFeedbackList();refreshNextStepsList();updatePreview();GH.toast('Assignment added: '+a.name); });
    renameAssignmentBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){alert('Select an assignment first.');return;} const n=window.prompt('Rename assignment:',a.name); if(n===null||!n.trim()) return; a.name=n.trim(); GH.saveConfig(); refreshAssignmentOptions(); GH.toast('Assignment renamed.'); });
    deleteAssignmentBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){alert('Select an assignment first.');return;} if(!confirm(`Delete assignment "${a.name}"?`)) return; c.assignments=(c.assignments||[]).filter(x=>x.id!==a.id); cfg.selectedAssignmentId=c.assignments.length?c.assignments[0].id:null; resetSelections(); GH.saveConfig(); refreshAssignmentOptions(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview(); GH.toast('Assignment deleted.'); });
    moveUpBtn.addEventListener('click',   () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c) return; const arr=c.assignments||[]; const i=arr.findIndex(a=>a.id===cfg.selectedAssignmentId); if(i<=0) return; [arr[i-1],arr[i]]=[arr[i],arr[i-1]]; GH.saveConfig(); refreshAssignmentOptions(); });
    moveDownBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c) return; const arr=c.assignments||[]; const i=arr.findIndex(a=>a.id===cfg.selectedAssignmentId); if(i===-1||i>=arr.length-1) return; [arr[i+1],arr[i]]=[arr[i],arr[i+1]]; GH.saveConfig(); refreshAssignmentOptions(); });
    reorderAssignmentsBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c||!(c.assignments||[]).length){alert('No assignments to reorder.');return;} GH.openListEditorModal({title:'Reorder assignments',items:c.assignments.map(a=>a.name||''),onApply:(o)=>{const old=c.assignments.slice();const used=new Set();const neo=[];o.forEach(n=>{const i=old.findIndex((a,j)=>!used.has(j)&&a.name===n);if(i!==-1){neo.push(old[i]);used.add(i);}});old.forEach((_,i)=>{if(!used.has(i))neo.push(old[i]);});c.assignments=neo;GH.saveConfig();refreshAssignmentOptions();}}); });

    // Level CRUD
    addLevelBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){alert('Select a course first.');return;} const n=window.prompt('New level name:'); if(!n||!n.trim()) return; const t=n.trim(); const lv=GH.getCourseLevels(c); if(lv.includes(t)){alert('Level already exists.');return;} lv.push(t); c.levels=lv; (c.assignments||[]).forEach(a=>{(a.levelComments||{})[t]='';a.levelComments=a.levelComments||{};a.levelComments[t]='';});cfg.selectedLevel=t;GH.saveConfig();refreshLevelOptions();refreshLevelCommentUI();GH.toast('Level added: '+t); });
    renameLevelBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){alert('Select a course first.');return;} const lv=GH.getCourseLevels(c); const cur=cfg.selectedLevel; if(!cur||!lv.includes(cur)){alert('Select a level first.');return;} const n=window.prompt('Rename level:',cur); if(!n||!n.trim()||n.trim()===cur) return; const t=n.trim(); if(lv.includes(t)){alert('Level already exists.');return;} lv[lv.indexOf(cur)]=t; c.levels=lv; (c.assignments||[]).forEach(a=>{const lc=a.levelComments||{};if(cur in lc){lc[t]=lc[cur];delete lc[cur];}}); cfg.selectedLevel=t; GH.saveConfig(); refreshLevelOptions(); refreshLevelCommentUI(); GH.toast('Level renamed.'); });
    reorderLevelsBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){alert('Select a course first.');return;} const lv=GH.getCourseLevels(c); if(lv.length<2){alert('Need at least 2 levels to reorder.');return;} GH.openListEditorModal({title:'Reorder levels',items:lv,onApply:(o)=>{const levels=o.map(s=>s.trim()).filter(Boolean);if(!levels.length){alert('Must have at least one level.');return;}c.levels=levels;if(!levels.includes(cfg.selectedLevel))cfg.selectedLevel=levels[0];GH.saveConfig();refreshLevelOptions();refreshLevelCommentUI();}}); });
    deleteLevelBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){alert('Select a course first.');return;} const lv=GH.getCourseLevels(c); const cur=cfg.selectedLevel; if(!cur||!lv.includes(cur)){alert('Select a level first.');return;} if(lv.length===1){alert('Cannot delete the only level.');return;} if(!confirm(`Delete level "${cur}"?`)) return; lv.splice(lv.indexOf(cur),1); c.levels=lv; (c.assignments||[]).forEach(a=>{const lc=a.levelComments||{};delete lc[cur];}); cfg.selectedLevel=lv[0]||''; GH.saveConfig(); refreshLevelOptions(); refreshLevelCommentUI(); GH.toast('Level deleted.'); });

    // Level comment
    includeLevelCb.addEventListener('change', () => { cfg.includeLevelComment=includeLevelCb.checked; GH.saveConfig(); updatePreview(); });
    saveLevelCommentBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){alert('Select a course and assignment first.');return;} const lv=GH.getCourseLevels(c); const lk=lv.includes(cfg.selectedLevel)?cfg.selectedLevel:(lv[0]||''); if(!lk) return; GH.getLevelCommentsObj(a)[lk]=levelFeedbackTextarea.value||''; GH.saveConfig(); updatePreview(); GH.toast(`Level comment saved for "${lk}".`); });
    levelFeedbackTextarea.addEventListener('input', () => updatePreview());

    // Feedback list
    addFbBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){alert('Select a course and assignment first.');return;} const t=newFbInput.value.trim(); if(!t) return; GH.getFeedbackList(a).push(t); newFbInput.value=''; GH.saveConfig(); refreshFeedbackList(); GH.toast('Feedback added.'); });
    newFbInput.addEventListener('keydown', e => { if(e.ctrlKey && e.key==='Enter'){e.preventDefault();addFbBtn.click();} });

    selectAllProfBtn.addEventListener('click',  () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a) return; selectedProf=new Set(); selectedNeeds.clear(); GH.getFeedbackList(a).forEach((_,i)=>selectedProf.add(i)); refreshFeedbackList(); updatePreview(); });
    selectAllNeedsBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a) return; selectedNeeds=new Set(); selectedProf.clear(); GH.getFeedbackList(a).forEach((_,i)=>selectedNeeds.add(i)); refreshFeedbackList(); updatePreview(); });
    clearAllBtn.addEventListener('click', () => { selectedProf.clear(); selectedNeeds.clear(); refreshFeedbackList(); updatePreview(); });

    // Next Steps
    includeNsCb.addEventListener('change', () => { cfg.includeNextSteps=includeNsCb.checked; GH.saveConfig(); updatePreview(); });
    addNsBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){alert('Select a course and assignment first.');return;} const t=newNsInput.value.trim(); if(!t) return; GH.getNextStepsList(a).push(t); newNsInput.value=''; GH.saveConfig(); refreshNextStepsList(); GH.toast('Next step added.'); });
    newNsInput.addEventListener('keydown', e => { if(e.ctrlKey && e.key==='Enter'){e.preventDefault();addNsBtn.click();} });

    // Preview
    copyPreviewBtn.addEventListener('click', () => {
        const html = GH.buildOverallFeedbackHtml();
        if (!html) { GH.toast('Nothing to copy — select some feedback first.'); return; }
        const write = () => navigator.clipboard.writeText(html).then(() => GH.toast('HTML copied to clipboard.')).catch(() => _fallbackCopy(html, true));
        if (navigator.clipboard) write(); else _fallbackCopy(html, true);
    });
    refreshPreviewBtn.addEventListener('click', () => updatePreview());

    // CSV
    downloadCsvBtn.addEventListener('click', () => GH.showCsvDownloadModal());
    uploadCsvBtn.addEventListener('click',   () => GH.showCsvUploadModal(hiddenCsvInput, hiddenSigInput));

    hiddenCsvInput.addEventListener('change', () => {
        if (!hiddenCsvInput.files || !hiddenCsvInput.files.length) return;
        const restoreSig = hiddenCsvInput.dataset.restoreSig === '1';
        const reader = new FileReader();
        reader.onload = e => {
            const c      = GH.getCourseById(cfg.selectedCourseId);
            const result = GH.applyMasterCsvToConfig(e.target.result, {
                scope: hiddenCsvInput.dataset.uploadScope === 'course' ? 'current' : 'all',
                mode:  hiddenCsvInput.dataset.uploadMode  === 'replace' ? 'replace' : 'merge',
                currentCourseName: c ? c.name : null
            });
            GH.saveConfig(); refreshAll();
            alert(`CSV import complete (${(hiddenCsvInput.dataset.uploadMode||'merge').toUpperCase()}).\n\nCourses touched: ${result.coursesTouched}\nAssignments touched: ${result.assignmentsTouched}\nComments added/merged: ${result.feedbackAdded}\nLevel comments updated: ${result.levelCommentsUpdated}`);

            // If user also wants to restore signature, prompt for the .txt file now
            if (restoreSig) {
                hiddenSigInput.value = '';
                hiddenSigInput.click();
            }
        };
        reader.readAsText(hiddenCsvInput.files[0]);
    });

    hiddenSigInput.addEventListener('change', () => {
        if (!hiddenSigInput.files || !hiddenSigInput.files.length) return;
        const reader = new FileReader();
        reader.onload = e => {
            const raw = e.target.result || '';
            // Strip comment lines
            const sig = raw.split('\n').filter(l => !l.startsWith('#')).join('\n').trim();
            if (!sig) { GH.toast('Signature file appears empty — no changes made.'); return; }
            GH.teacherSignature = sig.replace(/\n/g, '<br>');
            GH.storage.saveSignature(GH.teacherSignature);
            GH.toast('Signature restored from backup file.');
            updatePreview();
        };
        reader.readAsText(hiddenSigInput.files[0]);
    });

    // Signature
    signatureBtn.addEventListener('click', () => GH.configureSignature(() => updatePreview()));

    // ── Insert button + Ctrl+Shift+Enter ─────────────────────────
    function doInsert() {
        const html = GH.buildOverallFeedbackHtml();
        if (!html) { alert('Please select a course and assignment first.'); return; }
        const ok = GH.setOverallFeedbackHtml(html);
        if (!ok) return;

        GH.toast('✓ Feedback inserted!');

        // Auto-minimize
        if (!ps.minimized) {
            ps.minimized = true; ps.height = panel.offsetHeight;
            body.style.display = 'none'; resizer.style.display = 'none'; panel.style.height = 'auto';
            minimizeBtn.textContent = '▢'; minimizeBtn.title = 'Restore panel';
            GH.saveConfig();
        }

        if (skeletonCb.checked) {
            const emailText = GH.buildSkeletonEmailText();
            if (!emailText) { alert('No skeleton email content available.'); return; }
            const openMailto = () => {
                const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId);
                let subj='Feedback on your assignment';
                if(a&&a.name){subj=`Feedback on ${a.name}`;if(c&&c.name)subj+=` (${c.name})`;}else if(c&&c.name)subj=`Feedback in ${c.name}`;
                window.location.href=`mailto:?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(emailText)}`;
            };
            if (navigator.clipboard) navigator.clipboard.writeText(emailText).then(openMailto).catch(() => { _fallbackCopy(emailText); openMailto(); });
            else { _fallbackCopy(emailText); openMailto(); }
        }
    }

    insertBtn.addEventListener('click', doInsert);

    // Global Ctrl+Shift+Enter shortcut
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.key === 'Enter') { e.preventDefault(); doInsert(); }
    });

    function _fallbackCopy(text) {
        const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px;';
        document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch(err){}
        document.body.removeChild(ta);
    }

    // ── Dragging ──────────────────────────────────────────────────
    (function(){
        let drag=false,ox=0,oy=0;
        header.addEventListener('mousedown',e=>{if(e.button!==0)return;drag=true;ox=e.clientX-panel.offsetLeft;oy=e.clientY-panel.offsetTop;document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);});
        function mm(e){if(!drag)return;const l=Math.min(window.innerWidth-50,Math.max(0,e.clientX-ox));const t=Math.min(window.innerHeight-50,Math.max(0,e.clientY-oy));panel.style.left=l+'px';panel.style.top=t+'px';ps.left=l;ps.top=t;}
        function mu(){drag=false;document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);GH.saveConfig();}
    })();

    // ── Resizing ──────────────────────────────────────────────────
    (function(){
        let res=false,sw=0,sh=0,sx=0,sy=0;
        resizer.addEventListener('mousedown',e=>{if(e.button!==0)return;res=true;sw=panel.offsetWidth;sh=panel.offsetHeight;sx=e.clientX;sy=e.clientY;document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);});
        function mm(e){if(!res)return;const w=Math.max(340,sw+(e.clientX-sx));const h=Math.max(300,sh+(e.clientY-sy));panel.style.width=w+'px';panel.style.height=h+'px';ps.width=w;ps.height=h;}
        function mu(){res=false;document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);GH.saveConfig();}
    })();

    // ── Initial render ────────────────────────────────────────────
    refreshAll();
    if (darkMode) applyDarkMode();
};

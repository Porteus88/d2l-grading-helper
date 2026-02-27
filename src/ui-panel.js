// ui-panel.js — v4.6.0: CSS-token dark mode, no inline colour painting

'use strict';

window.GH = window.GH || {};

// ── Toast ─────────────────────────────────────────────────────────────────────
GH.toast = function (msg, duration) {
    let t = document.getElementById('gh-toast');
    if (!t) { t = document.createElement('div'); t.id = 'gh-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('gh-toast-show');
    clearTimeout(GH._toastTimer);
    GH._toastTimer = setTimeout(() => t.classList.remove('gh-toast-show'), duration || 2400);
};

// ── Panel ─────────────────────────────────────────────────────────────────────
GH.buildPanel = function () {
    const cfg = GH.config;
    const ps  = cfg.panelState;

    if (!ps.top || !ps.left) {
        ps.width  = ps.width  || 430;
        ps.height = ps.height || 560;
        ps.top    = 80;
        ps.left   = Math.max(20, window.innerWidth - ps.width - 40);
    }

    let darkMode = ps.darkMode || false;

    // ── Panel shell ───────────────────────────────────────────────────────────
    const panel = document.createElement('div');
    panel.id = 'd2l-grading-helper-panel';
    if (darkMode) panel.classList.add('gh-dark');
    Object.assign(panel.style, {
        position: 'fixed', zIndex: '9999999', borderRadius: '8px',
        fontFamily: 'Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        width:  (ps.width  || 430) + 'px',
        height: (ps.height || 560) + 'px',
        top:  ps.top  + 'px',
        left: ps.left + 'px'
    });

    // ── Header ────────────────────────────────────────────────────────────────
    const header = document.createElement('div');
    header.className = 'gh-header';
    Object.assign(header.style, {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 10px', cursor: 'move', fontSize: '13px',
        userSelect: 'none', flexShrink: '0'
    });

    const titleSpan = document.createElement('span');
    titleSpan.textContent = '📝 Grading Helper';
    titleSpan.style.fontWeight = '600';

    const headerBtns = document.createElement('div');
    Object.assign(headerBtns.style, { display: 'flex', gap: '6px', alignItems: 'center' });

    const darkModeBtn  = document.createElement('button');
    const minimizeBtn  = document.createElement('button');
    [darkModeBtn, minimizeBtn].forEach(b => {
        Object.assign(b.style, {
            border: 'none', borderRadius: '4px', padding: '2px 7px',
            fontSize: '13px', cursor: 'pointer',
            backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff', lineHeight: '1.4'
        });
    });
    darkModeBtn.textContent = darkMode ? '☀️' : '🌙';
    darkModeBtn.title       = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
    minimizeBtn.textContent = ps.minimized ? '▢' : '▁';
    minimizeBtn.title       = ps.minimized ? 'Restore panel' : 'Minimize panel';

    headerBtns.appendChild(darkModeBtn); headerBtns.appendChild(minimizeBtn);
    header.appendChild(titleSpan); header.appendChild(headerBtns);

    // ── Body ──────────────────────────────────────────────────────────────────
    const body = document.createElement('div');
    body.className = 'gh-body';
    Object.assign(body.style, {
        padding: '8px', display: ps.minimized ? 'none' : 'flex',
        flexDirection: 'column', gap: '5px', fontSize: '12px',
        flex: '1 1 auto', minHeight: '0', boxSizing: 'border-box', overflowY: 'auto'
    });

    // ── Helper builders ───────────────────────────────────────────────────────
    function makeRow(labelText) {
        const row = document.createElement('div');
        Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' });
        if (labelText) {
            const lbl = document.createElement('span');
            lbl.textContent = labelText; lbl.className = 'gh-label';
            Object.assign(lbl.style, { minWidth: '78px' });
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

    function makeSmallIconBtn(txt, role, title) {
        const b = document.createElement('button');
        b.textContent = txt;
        b.className = 'gh-icon-btn' + (role ? ' gh-icon-' + role : '');
        if (title) b.title = title;
        return b;
    }

    // ── Course row ────────────────────────────────────────────────────────────
    const courseRow          = makeRow('Course:');
    const courseSelect       = document.createElement('select'); courseSelect.className = 'gh-select';
    Object.assign(courseSelect.style, { flex: '1', padding: '2px 4px', fontSize: '12px' });
    const addCourseBtn       = makeBtn('➕',  'Add course');
    const editLevelsBtn      = makeBtn('⚙',   'Edit levels');
    const renameCourseBtn    = makeBtn('✎',   'Rename course');
    const reorderCoursesBtn  = makeBtn('⇅',   'Reorder courses');
    const deleteCourseBtn    = makeBtn('🗑',  'Delete course');
    [courseSelect, addCourseBtn, editLevelsBtn, renameCourseBtn, reorderCoursesBtn, deleteCourseBtn].forEach(el => courseRow.appendChild(el));

    // ── Assignment row ────────────────────────────────────────────────────────
    const assignmentRow         = makeRow('Assignment:');
    const assignmentSelect      = document.createElement('select'); assignmentSelect.className = 'gh-select';
    Object.assign(assignmentSelect.style, { flex: '1', padding: '2px 4px', fontSize: '12px' });
    const addAssignmentBtn      = makeBtn('➕',  'Add assignment');
    const moveUpBtn             = makeBtn('↑',   'Move up');
    const moveDownBtn           = makeBtn('↓',   'Move down');
    const reorderAssignmentsBtn = makeBtn('⇅',   'Reorder assignments');
    const renameAssignmentBtn   = makeBtn('✎',   'Rename assignment');
    const deleteAssignmentBtn   = makeBtn('🗑',  'Delete assignment');
    [assignmentSelect, addAssignmentBtn, moveUpBtn, moveDownBtn, reorderAssignmentsBtn, renameAssignmentBtn, deleteAssignmentBtn].forEach(el => assignmentRow.appendChild(el));

    // ── Level row ─────────────────────────────────────────────────────────────
    const levelRow        = makeRow('Level:');
    const levelSelect     = document.createElement('select'); levelSelect.className = 'gh-select';
    Object.assign(levelSelect.style, { flex: '1', padding: '2px 4px', fontSize: '12px' });
    const addLevelBtn     = makeBtn('➕',  'Add level');
    const renameLevelBtn  = makeBtn('✎',   'Rename level');
    const reorderLevelsBtn = makeBtn('⇅',  'Reorder levels');
    const deleteLevelBtn  = makeBtn('🗑',  'Delete level');
    [levelSelect, addLevelBtn, renameLevelBtn, reorderLevelsBtn, deleteLevelBtn].forEach(el => levelRow.appendChild(el));

    // ── Level comment block ───────────────────────────────────────────────────
    const levelFeedbackBlock = document.createElement('div');
    levelFeedbackBlock.className = 'gh-section';
    Object.assign(levelFeedbackBlock.style, { display: 'flex', flexDirection: 'column', gap: '3px' });

    const levelFeedbackTop = document.createElement('div');
    Object.assign(levelFeedbackTop.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' });

    const levelFeedbackLabel = document.createElement('span');
    levelFeedbackLabel.textContent = 'Level Comment (overall):';
    levelFeedbackLabel.className = 'gh-label';

    const includeLevelLabel = document.createElement('label');
    Object.assign(includeLevelLabel.style, { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', cursor: 'pointer' });
    const includeLevelCheckbox = document.createElement('input');
    includeLevelCheckbox.type = 'checkbox'; includeLevelCheckbox.checked = !!cfg.includeLevelComment;
    includeLevelLabel.appendChild(includeLevelCheckbox);
    includeLevelLabel.appendChild(Object.assign(document.createElement('span'), { textContent: 'Include' }));
    levelFeedbackTop.appendChild(levelFeedbackLabel); levelFeedbackTop.appendChild(includeLevelLabel);

    const levelFeedbackTextarea = document.createElement('textarea');
    levelFeedbackTextarea.className = 'gh-textarea';
    Object.assign(levelFeedbackTextarea.style, { width: '100%', minHeight: '46px', maxHeight: '80px', padding: '4px 6px', fontSize: '12px', resize: 'vertical', boxSizing: 'border-box' });
    levelFeedbackTextarea.placeholder = 'Overall proficiency comment for this assignment & level...';

    const levelFeedbackButtonRow = document.createElement('div');
    Object.assign(levelFeedbackButtonRow.style, { display: 'flex', justifyContent: 'flex-end' });
    const saveLevelCommentBtn = makeBtn('💾 Save Level Comment');
    levelFeedbackButtonRow.appendChild(saveLevelCommentBtn);
    levelFeedbackBlock.appendChild(levelFeedbackTop);
    levelFeedbackBlock.appendChild(levelFeedbackTextarea);
    levelFeedbackBlock.appendChild(levelFeedbackButtonRow);

    // ── Feedback section ──────────────────────────────────────────────────────
    const feedbackHeaderTop = document.createElement('div');
    Object.assign(feedbackHeaderTop.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' });
    const feedbackTitle = document.createElement('span');
    feedbackTitle.textContent = 'Feedback'; feedbackTitle.className = 'gh-label';
    const feedbackActions = document.createElement('div');
    Object.assign(feedbackActions.style, { display: 'flex', gap: '4px', alignItems: 'center' });
    const selectAllBtn  = makeBtn('✓ All',  'Select all as "did well"');
    const selectNeedsBtn = makeBtn('✗ All', 'Select all as "needs improvement"');
    const clearAllBtn   = makeBtn('✗ None', 'Deselect all');
    [selectAllBtn, selectNeedsBtn, clearAllBtn].forEach(b => feedbackActions.appendChild(b));
    feedbackHeaderTop.appendChild(feedbackTitle); feedbackHeaderTop.appendChild(feedbackActions);

    const feedbackColumnsHeader = document.createElement('div');
    feedbackColumnsHeader.className = 'gh-col-header';
    ['✓', '✗', 'Comment'].forEach((t, i) => {
        const d = document.createElement('div'); d.textContent = t;
        d.title = i === 0 ? 'Did well' : i === 1 ? 'Needs improvement' : '';
        if (i < 2) d.style.textAlign = 'center';
        feedbackColumnsHeader.appendChild(d);
    });

    const feedbackListContainer = document.createElement('div');
    feedbackListContainer.className = 'gh-list';
    Object.assign(feedbackListContainer.style, { minHeight: '100px', maxHeight: '160px' });

    const addFeedbackRow = document.createElement('div');
    Object.assign(addFeedbackRow.style, { display: 'flex', flexDirection: 'column', gap: '4px' });
    const newFeedbackInput = document.createElement('textarea');
    newFeedbackInput.className = 'gh-textarea'; newFeedbackInput.rows = 2;
    Object.assign(newFeedbackInput.style, { width: '100%', fontSize: '12px', padding: '4px 6px', resize: 'vertical', boxSizing: 'border-box' });
    newFeedbackInput.placeholder = 'Add a new feedback comment… (Ctrl+Enter to save)';
    const addFeedbackButtonRow = document.createElement('div');
    Object.assign(addFeedbackButtonRow.style, { display: 'flex', justifyContent: 'flex-start' });
    const addFeedbackBtn = makeBtn('➕ Add Feedback');
    addFeedbackButtonRow.appendChild(addFeedbackBtn);
    addFeedbackRow.appendChild(newFeedbackInput); addFeedbackRow.appendChild(addFeedbackButtonRow);

    // ── Next Steps block ──────────────────────────────────────────────────────
    const nextStepsBlock = document.createElement('div');
    nextStepsBlock.className = 'gh-section';
    Object.assign(nextStepsBlock.style, { display: 'flex', flexDirection: 'column', gap: '3px' });

    const nextStepsTop = document.createElement('div');
    Object.assign(nextStepsTop.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' });
    const nextStepsLabel = document.createElement('span');
    nextStepsLabel.textContent = 'Next Steps:'; nextStepsLabel.className = 'gh-label';
    const includeNextStepsLabel = document.createElement('label');
    Object.assign(includeNextStepsLabel.style, { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', cursor: 'pointer' });
    const includeNextStepsCheckbox = document.createElement('input');
    includeNextStepsCheckbox.type = 'checkbox'; includeNextStepsCheckbox.checked = !!cfg.includeNextSteps;
    includeNextStepsLabel.appendChild(includeNextStepsCheckbox);
    includeNextStepsLabel.appendChild(Object.assign(document.createElement('span'), { textContent: 'Include' }));
    nextStepsTop.appendChild(nextStepsLabel); nextStepsTop.appendChild(includeNextStepsLabel);

    const nextStepsListContainer = document.createElement('div');
    nextStepsListContainer.className = 'gh-list';
    Object.assign(nextStepsListContainer.style, { maxHeight: '80px' });

    const nextStepsAddRow = document.createElement('div');
    Object.assign(nextStepsAddRow.style, { display: 'flex', flexDirection: 'column', gap: '4px' });
    const newNextStepInput = document.createElement('textarea');
    newNextStepInput.className = 'gh-textarea'; newNextStepInput.rows = 2;
    Object.assign(newNextStepInput.style, { width: '100%', fontSize: '12px', padding: '4px 6px', resize: 'vertical', boxSizing: 'border-box' });
    newNextStepInput.placeholder = 'Add a next step… (Ctrl+Enter to save)';
    const addNextStepButtonRow = document.createElement('div');
    Object.assign(addNextStepButtonRow.style, { display: 'flex', justifyContent: 'flex-end' });
    const addNextStepBtn = makeBtn('➕ Add Next Step');
    addNextStepButtonRow.appendChild(addNextStepBtn);
    nextStepsAddRow.appendChild(newNextStepInput); nextStepsAddRow.appendChild(addNextStepButtonRow);
    nextStepsBlock.appendChild(nextStepsTop); nextStepsBlock.appendChild(nextStepsListContainer); nextStepsBlock.appendChild(nextStepsAddRow);

    // ── Preview block ─────────────────────────────────────────────────────────
    const previewBlock = document.createElement('div');
    previewBlock.className = 'gh-section gh-preview-block';
    Object.assign(previewBlock.style, { display: 'flex', flexDirection: 'column', gap: '3px' });

    const previewHeader = document.createElement('div');
    Object.assign(previewHeader.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' });
    const previewLabel = document.createElement('span');
    previewLabel.textContent = '👁 Preview'; previewLabel.className = 'gh-preview-label';
    const refreshPreviewBtn = makeBtn('↻ Refresh', 'Refresh preview');
    previewHeader.appendChild(previewLabel); previewHeader.appendChild(refreshPreviewBtn);

    const previewContent = document.createElement('div');
    previewContent.className = 'gh-preview-content';
    Object.assign(previewContent.style, { minHeight: '60px', maxHeight: '120px', overflowY: 'auto', fontSize: '11px', lineHeight: '1.5', padding: '6px' });
    previewContent.innerHTML = '<em class="gh-empty-msg">Select feedback items to preview the output here.</em>';
    previewBlock.appendChild(previewHeader); previewBlock.appendChild(previewContent);

    // ── CSV row ───────────────────────────────────────────────────────────────
    const csvRow = document.createElement('div');
    Object.assign(csvRow.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' });
    const csvLabel = document.createElement('span'); csvLabel.textContent = 'Master CSV:'; csvLabel.className = 'gh-label';
    const csvButtons = document.createElement('div'); Object.assign(csvButtons.style, { display: 'flex', gap: '4px' });
    const downloadCsvBtn = makeBtn('⬇ Download', 'Download CSV');
    const uploadCsvBtn   = makeBtn('⬆ Upload',   'Upload CSV');
    csvButtons.appendChild(downloadCsvBtn); csvButtons.appendChild(uploadCsvBtn);
    csvRow.appendChild(csvLabel); csvRow.appendChild(csvButtons);

    const hiddenFileInput = document.createElement('input');
    hiddenFileInput.type = 'file'; hiddenFileInput.accept = '.csv,text/csv'; hiddenFileInput.style.display = 'none';

    // ── Bottom bar ────────────────────────────────────────────────────────────
    const bottomBar = document.createElement('div');
    Object.assign(bottomBar.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginTop: '2px' });

    const bottomLeft = document.createElement('div');
    Object.assign(bottomLeft.style, { display: 'flex', alignItems: 'center', gap: '8px' });

    const skeletonLabel = document.createElement('label');
    Object.assign(skeletonLabel.style, { display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px' });
    const skeletonCheckbox = document.createElement('input'); skeletonCheckbox.type = 'checkbox';
    skeletonCheckbox.title = 'Also copy a plain-text skeleton email on insert';
    skeletonLabel.appendChild(skeletonCheckbox);
    skeletonLabel.appendChild(Object.assign(document.createElement('span'), { textContent: '✉ Skeleton email' }));

    const signatureBtn = makeBtn('✍ Sig', 'Configure teacher signature');
    bottomLeft.appendChild(skeletonLabel); bottomLeft.appendChild(signatureBtn);

    const insertBtn = document.createElement('button');
    insertBtn.className = 'gh-insert-btn';
    insertBtn.textContent = '▶ Insert Feedback';
    insertBtn.title = 'Insert feedback into D2L Overall Feedback (Ctrl+Shift+Enter)';
    Object.assign(insertBtn.style, { padding: '5px 14px', fontSize: '12px' });
    bottomBar.appendChild(bottomLeft); bottomBar.appendChild(insertBtn);

    // ── Version bar ───────────────────────────────────────────────────────────
    const versionBar = document.createElement('div');
    versionBar.className = 'gh-version-bar';
    versionBar.textContent = 'D2L Grading Helper v4.6.0';

    // ── Assemble body ─────────────────────────────────────────────────────────
    body.appendChild(courseRow);
    body.appendChild(assignmentRow);
    body.appendChild(levelRow);
    body.appendChild(levelFeedbackBlock);
    body.appendChild(feedbackHeaderTop);
    body.appendChild(feedbackColumnsHeader);
    body.appendChild(feedbackListContainer);
    body.appendChild(addFeedbackRow);
    body.appendChild(nextStepsBlock);
    body.appendChild(previewBlock);
    body.appendChild(csvRow);
    body.appendChild(hiddenFileInput);
    body.appendChild(bottomBar);
    body.appendChild(versionBar);

    // ── Resizer ───────────────────────────────────────────────────────────────
    const resizer = document.createElement('div'); resizer.className = 'gh-resizer';
    const resizerIcon = document.createElement('div'); resizerIcon.className = 'gh-resizer-icon';
    resizer.appendChild(resizerIcon);

    panel.appendChild(header); panel.appendChild(body); panel.appendChild(resizer);
    document.body.appendChild(panel);

    if (ps.minimized) { body.style.display = 'none'; resizer.style.display = 'none'; panel.style.height = 'auto'; }

    // ── Selection state ───────────────────────────────────────────────────────
    let selectedFeedbackProf  = new Set();
    let selectedFeedbackNeeds = new Set();
    let selectedNextSteps     = new Set();

    function resetSelections() { selectedFeedbackProf.clear(); selectedFeedbackNeeds.clear(); selectedNextSteps.clear(); }
    function remapSetAfterRemoval(set, i) { const n=new Set(); set.forEach(x=>{if(x<i)n.add(x);else if(x>i)n.add(x-1);}); return n; }
    function swapInSet(set, a, b) { const n=new Set(); set.forEach(x=>{if(x===a)n.add(b);else if(x===b)n.add(a);else n.add(x);}); return n; }

    // ── Dark mode — single class toggle, CSS tokens do the rest ──────────────
    function applyDarkMode() {
        panel.classList.toggle('gh-dark', darkMode);
        darkModeBtn.textContent = darkMode ? '☀️' : '🌙';
        darkModeBtn.title       = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
    }

    // ── Preview ───────────────────────────────────────────────────────────────
    function updatePreview() {
        const html = GH.buildOverallFeedbackHtml(selectedFeedbackProf, selectedFeedbackNeeds, selectedNextSteps);
        previewContent.innerHTML = html
            ? html
            : '<em class="gh-empty-msg">Select feedback items to preview the output here.</em>';
    }

    // ── Refresh functions ─────────────────────────────────────────────────────
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
        ph.textContent = (course && (course.assignments||[]).length) ? '— select assignment —' : '— add an assignment —';
        assignmentSelect.appendChild(ph);
        if (course) {
            (course.assignments||[]).forEach(a => {
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
        const levelKey   = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0]||'');
        const disabled   = !assignment || !levelKey;
        levelFeedbackTextarea.disabled  = disabled;
        saveLevelCommentBtn.disabled    = disabled;
        includeLevelCheckbox.disabled   = disabled;
        levelFeedbackTextarea.value     = disabled ? '' : (GH.getLevelCommentsObj(assignment)[levelKey]||'');
    }

    function refreshFeedbackList() {
        feedbackListContainer.innerHTML = '';
        const course     = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) {
            const m = document.createElement('div'); m.className = 'gh-empty-msg'; m.textContent = 'Select a course and assignment.';
            feedbackListContainer.appendChild(m); return;
        }
        const list = GH.getFeedbackList(assignment);
        if (!list.length) {
            const m = document.createElement('div'); m.className = 'gh-empty-msg'; m.textContent = 'No feedback comments yet. Add one below.';
            feedbackListContainer.appendChild(m); return;
        }
        list.forEach((text, idx) => {
            const row = document.createElement('div'); row.className = 'gh-feedback-row';
            row.addEventListener('mouseenter', () => row.classList.add('gh-row-hover'));
            row.addEventListener('mouseleave', () => row.classList.remove('gh-row-hover'));

            const profCb  = document.createElement('input'); profCb.type  = 'checkbox'; profCb.style.margin = '2px auto 0'; profCb.checked = selectedFeedbackProf.has(idx);  profCb.title  = 'Did well';
            const needsCb = document.createElement('input'); needsCb.type = 'checkbox'; needsCb.style.margin = '2px auto 0'; needsCb.checked = selectedFeedbackNeeds.has(idx); needsCb.title = 'Needs improvement';
            profCb.addEventListener('change',  () => { if (profCb.checked)  selectedFeedbackProf.add(idx);  else selectedFeedbackProf.delete(idx);  updatePreview(); });
            needsCb.addEventListener('change', () => { if (needsCb.checked) selectedFeedbackNeeds.add(idx); else selectedFeedbackNeeds.delete(idx); updatePreview(); });

            const cell = document.createElement('div'); Object.assign(cell.style, { display: 'flex', alignItems: 'flex-start', gap: '4px', paddingLeft: '6px' });
            const lbl  = document.createElement('div'); lbl.textContent = text; lbl.className = 'gh-item-text';

            const grp = document.createElement('div'); Object.assign(grp.style, { display: 'flex', flexShrink: '0', gap: '1px' });
            const editBtn = makeSmallIconBtn('✎', 'edit',   'Edit');
            const upBtn   = makeSmallIconBtn('↑', 'move',   'Move up');
            const downBtn = makeSmallIconBtn('↓', 'move',   'Move down');
            const delBtn  = makeSmallIconBtn('✕', 'delete', 'Delete');

            editBtn.addEventListener('click', () => { GH._prompt('Edit feedback comment:', list[idx], u=>{ if(u.trim()){list[idx]=u.trim();GH.saveConfig();refreshFeedbackList();updatePreview();} }); });
            upBtn.addEventListener('click',   () => { if(idx<=0)return; [list[idx-1],list[idx]]=[list[idx],list[idx-1]]; selectedFeedbackProf=swapInSet(selectedFeedbackProf,idx,idx-1); selectedFeedbackNeeds=swapInSet(selectedFeedbackNeeds,idx,idx-1); GH.saveConfig();refreshFeedbackList();updatePreview(); });
            downBtn.addEventListener('click', () => { if(idx>=list.length-1)return; [list[idx+1],list[idx]]=[list[idx],list[idx+1]]; selectedFeedbackProf=swapInSet(selectedFeedbackProf,idx,idx+1); selectedFeedbackNeeds=swapInSet(selectedFeedbackNeeds,idx,idx+1); GH.saveConfig();refreshFeedbackList();updatePreview(); });
            delBtn.addEventListener('click',  () => { GH._confirm('Remove this feedback comment?', ()=>{ list.splice(idx,1); selectedFeedbackProf=remapSetAfterRemoval(selectedFeedbackProf,idx); selectedFeedbackNeeds=remapSetAfterRemoval(selectedFeedbackNeeds,idx); GH.saveConfig();refreshFeedbackList();updatePreview(); }); });

            [editBtn,upBtn,downBtn,delBtn].forEach(b=>grp.appendChild(b));
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
            row.addEventListener('mouseenter', () => row.classList.add('gh-row-hover'));
            row.addEventListener('mouseleave', () => row.classList.remove('gh-row-hover'));

            const cb = document.createElement('input'); cb.type = 'checkbox'; cb.style.marginTop = '2px'; cb.checked = selectedNextSteps.has(idx);
            cb.addEventListener('change', () => { if(cb.checked) selectedNextSteps.add(idx); else selectedNextSteps.delete(idx); updatePreview(); });

            const lbl = document.createElement('div'); lbl.textContent = text; lbl.className = 'gh-item-text';
            const grp = document.createElement('div'); Object.assign(grp.style, { display: 'flex', flexShrink: '0', gap: '1px' });
            const editBtn = makeSmallIconBtn('✎', 'edit',   'Edit');
            const upBtn   = makeSmallIconBtn('↑', 'move',   'Move up');
            const downBtn = makeSmallIconBtn('↓', 'move',   'Move down');
            const delBtn  = makeSmallIconBtn('✕', 'delete', 'Delete');

            editBtn.addEventListener('click', () => { GH._prompt('Edit next step:', list[idx], u=>{ if(u.trim()){list[idx]=u.trim();GH.saveConfig();refreshNextStepsList();updatePreview();} }); });
            upBtn.addEventListener('click',   () => { if(idx<=0)return; [list[idx-1],list[idx]]=[list[idx],list[idx-1]]; selectedNextSteps=swapInSet(selectedNextSteps,idx,idx-1); GH.saveConfig();refreshNextStepsList();updatePreview(); });
            downBtn.addEventListener('click', () => { if(idx>=list.length-1)return; [list[idx+1],list[idx]]=[list[idx],list[idx+1]]; selectedNextSteps=swapInSet(selectedNextSteps,idx,idx+1); GH.saveConfig();refreshNextStepsList();updatePreview(); });
            delBtn.addEventListener('click',  () => { GH._confirm('Remove this next step?', ()=>{ list.splice(idx,1); selectedNextSteps=remapSetAfterRemoval(selectedNextSteps,idx); GH.saveConfig();refreshNextStepsList();updatePreview(); }); });

            row.appendChild(cb); row.appendChild(lbl); row.appendChild(grp);
            nextStepsListContainer.appendChild(row);
        });
    }

    function refreshAll() {
        refreshCourseOptions(); refreshAssignmentOptions(); refreshLevelOptions();
        refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview();
    }

    // ── Build feedback HTML ───────────────────────────────────────────────────
    GH.buildOverallFeedbackHtml = function (profSet, needsSet, nextSet) {
        const course     = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) return null;

        const _prof  = profSet  !== undefined ? profSet  : selectedFeedbackProf;
        const _needs = needsSet !== undefined ? needsSet : selectedFeedbackNeeds;
        const _next  = nextSet  !== undefined ? nextSet  : selectedNextSteps;

        const levels   = GH.getCourseLevels(course);
        const levelKey = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0]||'');
        const levelText = (cfg.includeLevelComment && levelKey) ? (GH.getLevelCommentsObj(assignment)[levelKey]||'').trim() : '';

        const feedbackList = GH.getFeedbackList(assignment);
        const profComments = [], needsComments = [];
        feedbackList.forEach((text, idx) => {
            const t = String(text||'').trim(); if (!t) return;
            if (_prof.has(idx))  profComments.push(t);
            if (_needs.has(idx)) needsComments.push(t);
        });

        const nextStepsList     = GH.getNextStepsList(assignment);
        const nextStepsSelected = [];
        if (cfg.includeNextSteps) {
            nextStepsList.forEach((text, idx) => { const t = String(text||'').trim(); if (t && _next.has(idx)) nextStepsSelected.push(t); });
        }

        const firstName = GH.getStudentFirstName();
        let html = '';
        const today = GH.formatToday();
        if (today)     html += `<p>${GH.escapeHtml(today)}</p>`;
        if (firstName) html += `<p>Hi ${GH.escapeHtml(firstName)},</p>`;
        if (levelText) html += `<p>${GH.escapeHtml(levelText)}</p>`;
        if (profComments.length)  { html += '<p><strong>What you did well:</strong></p><ul>'; profComments.forEach(c  => { html += `<li>${GH.escapeHtml(c)}</li>`; }); html += '</ul>'; }
        if (needsComments.length) { html += '<p><strong>Areas for improvement:</strong></p><ul>'; needsComments.forEach(c => { html += `<li>${GH.escapeHtml(c)}</li>`; }); html += '</ul>'; }
        if (nextStepsSelected.length) { html += '<p><strong>Next steps:</strong></p><ul>'; nextStepsSelected.forEach(c => { html += `<li>${GH.escapeHtml(c)}</li>`; }); html += '</ul>'; }
        if (GH.teacherSignature) html += `<p>${GH.teacherSignature}</p>`;
        return html || null;
    };

    GH.buildSkeletonEmailText = function () {
        const course     = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) return '';
        const levels   = GH.getCourseLevels(course);
        const levelKey = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0]||'');
        const levelText = (cfg.includeLevelComment && levelKey) ? (GH.getLevelCommentsObj(assignment)[levelKey]||'').trim() : '';
        const feedbackList = GH.getFeedbackList(assignment);
        const profC = [], needsC = [];
        feedbackList.forEach((text,idx) => { const t=String(text||'').trim(); if(!t)return; if(selectedFeedbackProf.has(idx))profC.push(t); if(selectedFeedbackNeeds.has(idx))needsC.push(t); });
        const nextList = GH.getNextStepsList(assignment);
        const nextC = [];
        if (cfg.includeNextSteps) nextList.forEach((text,idx)=>{ const t=String(text||'').trim(); if(t&&selectedNextSteps.has(idx))nextC.push(t); });
        const firstName = GH.getStudentFirstName();
        let text = firstName ? `Hi ${firstName},\n\n` : 'Hi,\n\n';
        if (assignment.name||course.name) { text+='Here is some feedback'; if(assignment.name)text+=` for "${assignment.name}"`; if(course.name)text+=` in ${course.name}`; text+='.\n\n'; }
        if (levelText) text += levelText + '\n\n';
        if (profC.length)  { text+='What you did well:\n'; profC.forEach(c=>{text+=`• ${c}\n`;}); text+='\n'; }
        if (needsC.length) { text+='Areas for improvement:\n'; needsC.forEach(c=>{text+=`• ${c}\n`;}); text+='\n'; }
        if (nextC.length)  { text+='Next steps:\n'; nextC.forEach(c=>{text+=`• ${c}\n`;}); text+='\n'; }
        if (GH.teacherSignature) text += '\n' + GH.teacherSignature.replace(/<br\s*\/?>/gi, '\n') + '\n';
        return text.trim() || '';
    };

    // ── Event wiring ──────────────────────────────────────────────────────────
    minimizeBtn.addEventListener('click', () => {
        ps.minimized = !ps.minimized;
        if (ps.minimized) { ps.height=panel.offsetHeight; body.style.display='none'; resizer.style.display='none'; panel.style.height='auto'; }
        else              { body.style.display='flex'; resizer.style.display='block'; panel.style.height=(ps.height||560)+'px'; }
        minimizeBtn.textContent = ps.minimized ? '▢' : '▁';
        minimizeBtn.title       = ps.minimized ? 'Restore panel' : 'Minimize panel';
        GH.saveConfig();
    });

    darkModeBtn.addEventListener('click', () => { darkMode = !darkMode; ps.darkMode = darkMode; GH.saveConfig(); applyDarkMode(); });

    courseSelect.addEventListener('change', () => { cfg.selectedCourseId=courseSelect.value||null; cfg.selectedAssignmentId=null; resetSelections(); GH.saveConfig(); refreshAssignmentOptions(); refreshLevelOptions(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview(); });
    assignmentSelect.addEventListener('change', () => { const c=GH.getCourseById(cfg.selectedCourseId); cfg.selectedAssignmentId=(c&&assignmentSelect.value)?assignmentSelect.value:null; resetSelections(); GH.saveConfig(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview(); });
    levelSelect.addEventListener('change', () => { if(levelSelect.value){cfg.selectedLevel=levelSelect.value;GH.saveConfig();refreshLevelCommentUI();updatePreview();} });

    addCourseBtn.addEventListener('click', () => { GH._prompt('Name for the new course:', '', n=>{ if(!n.trim())return; const c={id:GH.uuid(),name:n.trim(),levels:GH.DEFAULT_LEVELS.slice(),assignments:[]}; cfg.courses.push(c); cfg.selectedCourseId=c.id; cfg.selectedAssignmentId=null; GH.saveConfig(); refreshAll(); GH.toast('Course added: '+c.name); }); });
    renameCourseBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){GH.toast('⚠ Select a course first.');return;} GH._prompt('Rename course:', c.name, n=>{ if(!n.trim())return; c.name=n.trim(); GH.saveConfig(); refreshCourseOptions(); GH.toast('Course renamed.'); }); });
    deleteCourseBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){GH.toast('⚠ Select a course first.');return;} GH._confirm(`Delete course "${c.name}" and all its data?`, ()=>{ cfg.courses=cfg.courses.filter(x=>x.id!==c.id); cfg.selectedCourseId=cfg.courses.length?cfg.courses[0].id:null; cfg.selectedAssignmentId=null; resetSelections(); GH.saveConfig(); refreshAll(); GH.toast('Course deleted.'); }); });
    reorderCoursesBtn.addEventListener('click', () => { if(!cfg.courses.length){GH.toast('⚠ No courses to reorder.');return;} GH.openListEditorModal({title:'Reorder courses',items:cfg.courses.map(c=>c.name||''),onApply:(o)=>{const old=cfg.courses.slice();const used=new Set();const neo=[];o.forEach(n=>{const i=old.findIndex((c,j)=>!used.has(j)&&c.name===n);if(i!==-1){neo.push(old[i]);used.add(i);}});old.forEach((_,i)=>{if(!used.has(i))neo.push(old[i]);});cfg.courses=neo;GH.saveConfig();refreshCourseOptions();}});});
    editLevelsBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){GH.toast('⚠ Select a course first.');return;} GH.openListEditorModal({title:'Edit levels',items:GH.getCourseLevels(c),allowEdit:true,allowAdd:true,allowDelete:true,onApply:(lv)=>{const levels=lv.map(s=>s.trim()).filter(Boolean);if(!levels.length){GH.toast('⚠ Must have at least one level.');return;}c.levels=levels;(c.assignments||[]).forEach(a=>{const newLc={};levels.forEach(l=>{newLc[l]=(a.levelComments||{})[l]||'';});a.levelComments=newLc;});if(!levels.includes(cfg.selectedLevel))cfg.selectedLevel=levels[0];GH.saveConfig();refreshLevelOptions();refreshLevelCommentUI();}});});

    addAssignmentBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){GH.toast('⚠ Add or select a course first.');return;} const guess=GH.detectCourseAndAssignmentFromTitle(); GH._prompt('Name for the new assignment:', (guess&&guess.assignmentName)||'', n=>{ if(!n.trim())return; const a={id:GH.uuid(),name:n.trim(),feedback:[],nextSteps:[],levelComments:{}}; GH.getCourseLevels(c).forEach(l=>{a.levelComments[l]='';});c.assignments=c.assignments||[];c.assignments.push(a);cfg.selectedAssignmentId=a.id;resetSelections();GH.saveConfig();refreshAssignmentOptions();refreshLevelCommentUI();refreshFeedbackList();refreshNextStepsList();updatePreview();GH.toast('Assignment added: '+a.name); }); });
    renameAssignmentBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){GH.toast('⚠ Select an assignment first.');return;} GH._prompt('Rename assignment:', a.name, n=>{ if(!n.trim())return; a.name=n.trim(); GH.saveConfig(); refreshAssignmentOptions(); GH.toast('Assignment renamed.'); }); });
    deleteAssignmentBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){GH.toast('⚠ Select an assignment first.');return;} GH._confirm(`Delete assignment "${a.name}"?`, ()=>{ c.assignments=(c.assignments||[]).filter(x=>x.id!==a.id); cfg.selectedAssignmentId=c.assignments.length?c.assignments[0].id:null; resetSelections(); GH.saveConfig(); refreshAssignmentOptions(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview(); GH.toast('Assignment deleted.'); }); });
    moveUpBtn.addEventListener('click',   () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c)return; const arr=c.assignments||[]; const i=arr.findIndex(a=>a.id===cfg.selectedAssignmentId); if(i<=0)return; [arr[i-1],arr[i]]=[arr[i],arr[i-1]]; GH.saveConfig(); refreshAssignmentOptions(); });
    moveDownBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c)return; const arr=c.assignments||[]; const i=arr.findIndex(a=>a.id===cfg.selectedAssignmentId); if(i===-1||i>=arr.length-1)return; [arr[i+1],arr[i]]=[arr[i],arr[i+1]]; GH.saveConfig(); refreshAssignmentOptions(); });
    reorderAssignmentsBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c||!(c.assignments||[]).length){GH.toast('⚠ No assignments to reorder.');return;} GH.openListEditorModal({title:'Reorder assignments',items:c.assignments.map(a=>a.name||''),onApply:(o)=>{const old=c.assignments.slice();const used=new Set();const neo=[];o.forEach(n=>{const i=old.findIndex((a,j)=>!used.has(j)&&a.name===n);if(i!==-1){neo.push(old[i]);used.add(i);}});old.forEach((_,i)=>{if(!used.has(i))neo.push(old[i]);});c.assignments=neo;GH.saveConfig();refreshAssignmentOptions();}});});

    addLevelBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){GH.toast('⚠ Select a course first.');return;} GH._prompt('New level name:', '', n=>{ if(!n.trim())return; const t=n.trim(); const lv=GH.getCourseLevels(c); if(lv.includes(t)){GH.toast('⚠ That level already exists.');return;} lv.push(t);c.levels=lv;(c.assignments||[]).forEach(a=>{a.levelComments=a.levelComments||{};a.levelComments[t]='';});cfg.selectedLevel=t;GH.saveConfig();refreshLevelOptions();refreshLevelCommentUI();GH.toast('Level added: '+t); }); });
    renameLevelBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){GH.toast('⚠ Select a course first.');return;} const lv=GH.getCourseLevels(c); const cur=cfg.selectedLevel; if(!cur||!lv.includes(cur)){GH.toast('⚠ Select a level first.');return;} GH._prompt('Rename level:', cur, n=>{ if(!n.trim()||n.trim()===cur)return; const t=n.trim(); if(lv.includes(t)){GH.toast('⚠ That level already exists.');return;} lv[lv.indexOf(cur)]=t;c.levels=lv;(c.assignments||[]).forEach(a=>{const lc=a.levelComments||{};if(cur in lc){lc[t]=lc[cur];delete lc[cur];}});cfg.selectedLevel=t;GH.saveConfig();refreshLevelOptions();refreshLevelCommentUI();GH.toast('Level renamed.'); }); });
    reorderLevelsBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){GH.toast('⚠ Select a course first.');return;} const lv=GH.getCourseLevels(c); if(lv.length<2){GH.toast('⚠ Need at least 2 levels to reorder.');return;} GH.openListEditorModal({title:'Reorder levels',items:lv,onApply:(o)=>{const levels=o.map(s=>s.trim()).filter(Boolean);if(!levels.length){GH.toast('⚠ Must have at least one level.');return;}c.levels=levels;if(!levels.includes(cfg.selectedLevel))cfg.selectedLevel=levels[0];GH.saveConfig();refreshLevelOptions();refreshLevelCommentUI();}});});
    deleteLevelBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); if(!c){GH.toast('⚠ Select a course first.');return;} const lv=GH.getCourseLevels(c); const cur=cfg.selectedLevel; if(!cur||!lv.includes(cur)){GH.toast('⚠ Select a level first.');return;} if(lv.length===1){GH.toast('⚠ Cannot delete the only level.');return;} GH._confirm(`Delete level "${cur}"?`, ()=>{ lv.splice(lv.indexOf(cur),1);c.levels=lv;(c.assignments||[]).forEach(a=>{const lc=a.levelComments||{};delete lc[cur];});cfg.selectedLevel=lv[0]||'';GH.saveConfig();refreshLevelOptions();refreshLevelCommentUI();GH.toast('Level deleted.'); }); });

    includeLevelCheckbox.addEventListener('change', () => { cfg.includeLevelComment=includeLevelCheckbox.checked; GH.saveConfig(); updatePreview(); });
    includeNextStepsCheckbox.addEventListener('change', () => { cfg.includeNextSteps=includeNextStepsCheckbox.checked; GH.saveConfig(); updatePreview(); });
    saveLevelCommentBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){GH.toast('⚠ Select a course and assignment first.');return;} const levels=GH.getCourseLevels(c); const lk=levels.includes(cfg.selectedLevel)?cfg.selectedLevel:(levels[0]||''); if(!lk)return; GH.getLevelCommentsObj(a)[lk]=levelFeedbackTextarea.value||''; GH.saveConfig(); updatePreview(); GH.toast(`Level comment saved for "${lk}".`); });
    levelFeedbackTextarea.addEventListener('input', () => updatePreview());

    addFeedbackBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){GH.toast('⚠ Select a course and assignment first.');return;} const t=newFeedbackInput.value.trim(); if(!t)return; GH.getFeedbackList(a).push(t); newFeedbackInput.value=''; GH.saveConfig(); refreshFeedbackList(); GH.toast('Feedback added.'); });
    newFeedbackInput.addEventListener('keydown', e => { if(e.ctrlKey&&e.key==='Enter'){e.preventDefault();addFeedbackBtn.click();} });

    addNextStepBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a){GH.toast('⚠ Select a course and assignment first.');return;} const t=newNextStepInput.value.trim(); if(!t)return; GH.getNextStepsList(a).push(t); newNextStepInput.value=''; GH.saveConfig(); refreshNextStepsList(); GH.toast('Next step added.'); });
    newNextStepInput.addEventListener('keydown', e => { if(e.ctrlKey&&e.key==='Enter'){e.preventDefault();addNextStepBtn.click();} });

    selectAllBtn.addEventListener('click',   () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a)return; selectedFeedbackProf=new Set(); selectedFeedbackNeeds.clear(); GH.getFeedbackList(a).forEach((_,i)=>selectedFeedbackProf.add(i)); refreshFeedbackList(); updatePreview(); });
    selectNeedsBtn.addEventListener('click', () => { const c=GH.getCourseById(cfg.selectedCourseId); const a=GH.getAssignmentById(c,cfg.selectedAssignmentId); if(!c||!a)return; selectedFeedbackNeeds=new Set(); selectedFeedbackProf.clear(); GH.getFeedbackList(a).forEach((_,i)=>selectedFeedbackNeeds.add(i)); refreshFeedbackList(); updatePreview(); });
    clearAllBtn.addEventListener('click', () => { selectedFeedbackProf.clear(); selectedFeedbackNeeds.clear(); refreshFeedbackList(); updatePreview(); });

    refreshPreviewBtn.addEventListener('click', () => updatePreview());
    downloadCsvBtn.addEventListener('click', () => GH.showCsvDownloadModal());
    uploadCsvBtn.addEventListener('click',   () => GH.showCsvUploadModal(hiddenFileInput));

    hiddenFileInput.addEventListener('change', () => {
        if (!hiddenFileInput.files||!hiddenFileInput.files.length) return;
        const reader = new FileReader();
        reader.onload = e => {
            const course  = GH.getCourseById(cfg.selectedCourseId);
            const result  = GH.applyMasterCsvToConfig(e.target.result, { scope: hiddenFileInput.dataset.uploadScope==='course'?'current':'all', mode: hiddenFileInput.dataset.uploadMode==='replace'?'replace':'merge', currentCourseName: course?course.name:null });
            GH.saveConfig(); refreshAll();
            GH._alert(`CSV import complete — ${(hiddenFileInput.dataset.uploadMode||'merge').toUpperCase()}\n\nCourses touched: ${result.coursesTouched}\nAssignments touched: ${result.assignmentsTouched}\nComments added/merged: ${result.feedbackAdded}\nLevel comments updated: ${result.levelCommentsUpdated}`);
        };
        reader.readAsText(hiddenFileInput.files[0]);
    });

    signatureBtn.addEventListener('click', () => GH.configureSignature(() => updatePreview()));

    function doInsert() {
        const html = GH.buildOverallFeedbackHtml();
        if (!html) { GH.toast('⚠ Select a course and assignment first.'); return; }
        const ok = GH.setOverallFeedbackHtml(html);
        if (!ok) return;
        GH.toast('✓ Feedback inserted!');
        if (!ps.minimized) {
            ps.minimized = true; ps.height = panel.offsetHeight;
            body.style.display = 'none'; resizer.style.display = 'none'; panel.style.height = 'auto';
            minimizeBtn.textContent = '▢'; minimizeBtn.title = 'Restore panel';
            GH.saveConfig();
        }
        if (skeletonCheckbox.checked) {
            const emailText = GH.buildSkeletonEmailText();
            if (!emailText) return;
            const course = GH.getCourseById(cfg.selectedCourseId); const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
            let subj = 'Feedback on your assignment';
            if (assignment&&assignment.name) { subj=`Feedback on ${assignment.name}`; if(course&&course.name)subj+=` (${course.name})`; } else if (course&&course.name) subj=`Feedback in ${course.name}`;
            const doMailto = () => { window.location.href=`mailto:?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(emailText)}`; };
            if (navigator.clipboard) navigator.clipboard.writeText(emailText).then(doMailto).catch(doMailto);
            else doMailto();
        }
    }

    insertBtn.addEventListener('click', doInsert);
    document.addEventListener('keydown', e => { if(e.ctrlKey&&e.shiftKey&&e.key==='Enter'){e.preventDefault();doInsert();} });

    // ── Dragging ──────────────────────────────────────────────────────────────
    (function(){
        let drag=false,ox=0,oy=0;
        header.addEventListener('mousedown',e=>{if(e.button!==0)return;drag=true;ox=e.clientX-panel.offsetLeft;oy=e.clientY-panel.offsetTop;document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);});
        function mm(e){if(!drag)return;const l=Math.min(window.innerWidth-50,Math.max(0,e.clientX-ox));const t=Math.min(window.innerHeight-50,Math.max(0,e.clientY-oy));panel.style.left=l+'px';panel.style.top=t+'px';ps.left=l;ps.top=t;}
        function mu(){drag=false;document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);GH.saveConfig();}
    })();

    // ── Resizing ──────────────────────────────────────────────────────────────
    (function(){
        let res=false,sw=0,sh=0,sx=0,sy=0;
        resizer.addEventListener('mousedown',e=>{if(e.button!==0)return;res=true;sw=panel.offsetWidth;sh=panel.offsetHeight;sx=e.clientX;sy=e.clientY;document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);});
        function mm(e){if(!res)return;const w=Math.max(340,sw+(e.clientX-sx));const h=Math.max(300,sh+(e.clientY-sy));panel.style.width=w+'px';panel.style.height=h+'px';ps.width=w;ps.height=h;}
        function mu(){res=false;document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);GH.saveConfig();}
    })();

    // ── Initial render ────────────────────────────────────────────────────────
    refreshAll();
    applyDarkMode();
};

// ui-panel.js — Main floating panel UI

'use strict';

window.GH = window.GH || {};

GH.buildPanel = function () {
    const cfg = GH.config;
    const ps = cfg.panelState;

    if (!ps.top || !ps.left) {
        ps.width = ps.width || 420;
        ps.height = ps.height || 550;
        ps.top = 80;
        ps.left = Math.max(20, window.innerWidth - ps.width - 40);
    }

    // --- Panel container ---
    const panel = document.createElement('div');
    panel.id = 'd2l-grading-helper-panel';
    Object.assign(panel.style, {
        position: 'fixed', zIndex: '9999999',
        backgroundColor: '#ffffff', borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        fontFamily: 'Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
    });
    panel.style.width = (ps.width || 420) + 'px';
    panel.style.height = (ps.height || 550) + 'px';
    panel.style.top = ps.top + 'px';
    panel.style.left = ps.left + 'px';

    // --- Header ---
    const header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 10px', background: 'linear-gradient(90deg, #0066cc, #004a99)',
        color: '#fff', cursor: 'move', fontSize: '13px', userSelect: 'none', flexShrink: '0'
    });
    const titleSpan = document.createElement('span');
    titleSpan.textContent = '📝 Grading Helper';
    const headerButtons = document.createElement('div');
    Object.assign(headerButtons.style, { display: 'flex', gap: '6px', alignItems: 'center' });

    let darkMode = ps.darkMode || false;

    const darkModeBtn = document.createElement('button');
    darkModeBtn.textContent = darkMode ? '☀' : '🌙';
    darkModeBtn.title = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
    const minimizeBtn = document.createElement('button');
    minimizeBtn.textContent = ps.minimized ? '▢' : '▁';

    [darkModeBtn, minimizeBtn].forEach(b => {
        Object.assign(b.style, { border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '12px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' });
    });

    headerButtons.appendChild(darkModeBtn);
    headerButtons.appendChild(minimizeBtn);
    header.appendChild(titleSpan);
    header.appendChild(headerButtons);

    // --- Body ---
    const body = document.createElement('div');
    Object.assign(body.style, {
        padding: '8px', display: ps.minimized ? 'none' : 'flex',
        flexDirection: 'column', gap: '5px', fontSize: '12px',
        flex: '1 1 auto', minHeight: '0', boxSizing: 'border-box', overflowY: 'auto'
    });

    // Helper builders
    function makeRow(labelText) {
        const row = document.createElement('div');
        Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' });
        if (labelText) {
            const label = document.createElement('span');
            label.textContent = labelText;
            Object.assign(label.style, { minWidth: '75px', fontWeight: '600' });
            row.appendChild(label);
        }
        return row;
    }

    function makeIconBtn(txt, color, title) {
        const b = document.createElement('button');
        b.textContent = txt;
        if (title) b.title = title;
        Object.assign(b.style, { padding: '2px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f5f5f5' });
        return b;
    }

    function makeSmallIconBtn(txt, color) {
        const b = document.createElement('button');
        b.textContent = txt;
        Object.assign(b.style, { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', padding: '0 3px', color: color || '#333' });
        return b;
    }

    // --- Course row ---
    const courseRow = makeRow('Course:');
    const courseSelect = document.createElement('select');
    Object.assign(courseSelect.style, { flex: '1', padding: '2px', fontSize: '12px' });
    const addCourseBtn = makeIconBtn('➕');
    const editLevelsBtn = makeIconBtn('⚙', null, 'Edit levels');
    const renameCourseBtn = makeIconBtn('✎', null, 'Rename course');
    const reorderCoursesBtn = makeIconBtn('⇅', null, 'Reorder courses');
    const deleteCourseBtn = makeIconBtn('🗑', null, 'Delete course');
    [courseSelect, addCourseBtn, editLevelsBtn, renameCourseBtn, reorderCoursesBtn, deleteCourseBtn].forEach(el => courseRow.appendChild(el));

    // --- Assignment row ---
    const assignmentRow = makeRow('Assignment:');
    const assignmentSelect = document.createElement('select');
    Object.assign(assignmentSelect.style, { flex: '1', padding: '2px', fontSize: '12px' });
    const addAssignmentBtn = makeIconBtn('➕');
    const moveUpBtn = makeIconBtn('↑', null, 'Move up');
    const moveDownBtn = makeIconBtn('↓', null, 'Move down');
    const reorderAssignmentsBtn = makeIconBtn('⇅', null, 'Reorder');
    const renameAssignmentBtn = makeIconBtn('✎', null, 'Rename');
    const deleteAssignmentBtn = makeIconBtn('🗑', null, 'Delete');
    [assignmentSelect, addAssignmentBtn, moveUpBtn, moveDownBtn, reorderAssignmentsBtn, renameAssignmentBtn, deleteAssignmentBtn].forEach(el => assignmentRow.appendChild(el));

    // --- Level row ---
    const levelRow = makeRow('Level:');
    const levelSelect = document.createElement('select');
    Object.assign(levelSelect.style, { flex: '1', padding: '2px', fontSize: '12px' });
    const addLevelBtn = makeIconBtn('➕', null, 'Add level');
    const renameLevelBtn = makeIconBtn('✎', null, 'Rename level');
    const reorderLevelsBtn = makeIconBtn('⇅', null, 'Reorder levels');
    const deleteLevelBtn = makeIconBtn('🗑', null, 'Delete level');
    [levelSelect, addLevelBtn, renameLevelBtn, reorderLevelsBtn, deleteLevelBtn].forEach(el => levelRow.appendChild(el));

    // --- Level feedback block ---
    const levelFeedbackBlock = document.createElement('div');
    Object.assign(levelFeedbackBlock.style, { display: 'flex', flexDirection: 'column', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '4px', backgroundColor: '#f9fafb', gap: '3px' });
    const levelFeedbackTop = document.createElement('div');
    Object.assign(levelFeedbackTop.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' });
    const levelFeedbackLabel = document.createElement('span');
    levelFeedbackLabel.textContent = 'Level feedback (overall comment):';
    levelFeedbackLabel.style.fontWeight = '600';

    const includeLevelLabel = document.createElement('label');
    Object.assign(includeLevelLabel.style, { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', cursor: 'pointer' });
    const includeLevelCheckbox = document.createElement('input');
    includeLevelCheckbox.type = 'checkbox'; includeLevelCheckbox.checked = !!cfg.includeLevelComment;
    includeLevelLabel.appendChild(includeLevelCheckbox);
    includeLevelLabel.appendChild(Object.assign(document.createElement('span'), { textContent: 'Include on insert' }));
    levelFeedbackTop.appendChild(levelFeedbackLabel); levelFeedbackTop.appendChild(includeLevelLabel);

    const levelFeedbackTextarea = document.createElement('textarea');
    Object.assign(levelFeedbackTextarea.style, { width: '100%', minHeight: '48px', maxHeight: '80px', padding: '4px', fontSize: '12px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', boxSizing: 'border-box' });
    levelFeedbackTextarea.placeholder = 'Overall proficiency comment for this assignment & level...';

    const levelFeedbackButtonRow = document.createElement('div');
    Object.assign(levelFeedbackButtonRow.style, { display: 'flex', justifyContent: 'flex-end' });
    const saveLevelCommentBtn = makeIconBtn('Save Level Comment');
    levelFeedbackButtonRow.appendChild(saveLevelCommentBtn);
    levelFeedbackBlock.appendChild(levelFeedbackTop); levelFeedbackBlock.appendChild(levelFeedbackTextarea); levelFeedbackBlock.appendChild(levelFeedbackButtonRow);

    // --- Feedback section ---
    const feedbackHeaderTop = document.createElement('div');
    Object.assign(feedbackHeaderTop.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' });
    const feedbackTitle = document.createElement('span');
    feedbackTitle.textContent = 'Feedback'; feedbackTitle.style.fontWeight = '600';
    const feedbackActions = document.createElement('div');
    Object.assign(feedbackActions.style, { display: 'flex', gap: '4px', alignItems: 'center' });
    const selectAllBtn = makeIconBtn('All'); const clearAllBtn = makeIconBtn('None');
    feedbackActions.appendChild(selectAllBtn); feedbackActions.appendChild(clearAllBtn);
    feedbackHeaderTop.appendChild(feedbackTitle); feedbackHeaderTop.appendChild(feedbackActions);

    const feedbackColumnsHeader = document.createElement('div');
    Object.assign(feedbackColumnsHeader.style, { display: 'grid', gridTemplateColumns: '28px 28px 1fr', columnGap: '4px', fontSize: '11px', color: '#555', padding: '2px 4px' });
    ['Y', 'N', 'Comment'].forEach(t => {
        const d = document.createElement('div'); d.textContent = t;
        if (t !== 'Comment') d.style.textAlign = 'center';
        feedbackColumnsHeader.appendChild(d);
    });

    const feedbackListContainer = document.createElement('div');
    Object.assign(feedbackListContainer.style, { flex: '0 0 auto', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '4px', overflowY: 'auto', minHeight: '100px', maxHeight: '160px', backgroundColor: '#fafafa' });

    const addFeedbackRow = document.createElement('div');
    Object.assign(addFeedbackRow.style, { display: 'flex', flexDirection: 'column', gap: '4px' });
    const newFeedbackInput = document.createElement('textarea');
    newFeedbackInput.rows = 2;
    Object.assign(newFeedbackInput.style, { width: '100%', fontSize: '12px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', boxSizing: 'border-box' });
    newFeedbackInput.placeholder = 'Add a new feedback comment for this assignment...';
    const addFeedbackButtonRow = document.createElement('div');
    Object.assign(addFeedbackButtonRow.style, { display: 'flex', justifyContent: 'flex-start' });
    const addFeedbackBtn = makeIconBtn('➕ Add Feedback');
    addFeedbackButtonRow.appendChild(addFeedbackBtn);
    addFeedbackRow.appendChild(newFeedbackInput); addFeedbackRow.appendChild(addFeedbackButtonRow);

    // --- Next Steps block ---
    const nextStepsBlock = document.createElement('div');
    Object.assign(nextStepsBlock.style, { display: 'flex', flexDirection: 'column', border: '1px solid #e0e0e0', borderRadius: '4px', padding: '4px', backgroundColor: '#f9fafb', gap: '3px' });
    const nextStepsTop = document.createElement('div');
    Object.assign(nextStepsTop.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' });
    const nextStepsLabel = document.createElement('span');
    nextStepsLabel.textContent = 'Next Steps:'; nextStepsLabel.style.fontWeight = '600';
    const includeNextStepsLabel = document.createElement('label');
    Object.assign(includeNextStepsLabel.style, { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', cursor: 'pointer' });
    const includeNextStepsCheckbox = document.createElement('input');
    includeNextStepsCheckbox.type = 'checkbox'; includeNextStepsCheckbox.checked = !!cfg.includeNextSteps;
    includeNextStepsLabel.appendChild(includeNextStepsCheckbox);
    includeNextStepsLabel.appendChild(Object.assign(document.createElement('span'), { textContent: 'Include on insert' }));
    nextStepsTop.appendChild(nextStepsLabel); nextStepsTop.appendChild(includeNextStepsLabel);

    const nextStepsListContainer = document.createElement('div');
    Object.assign(nextStepsListContainer.style, { border: '1px solid #e0e0e0', borderRadius: '4px', padding: '4px', maxHeight: '80px', overflowY: 'auto', backgroundColor: '#ffffff' });

    const nextStepsAddRow = document.createElement('div');
    Object.assign(nextStepsAddRow.style, { display: 'flex', flexDirection: 'column', gap: '4px' });
    const newNextStepInput = document.createElement('textarea');
    newNextStepInput.rows = 2;
    Object.assign(newNextStepInput.style, { width: '100%', fontSize: '12px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', boxSizing: 'border-box' });
    newNextStepInput.placeholder = 'Add a new next steps comment...';
    const addNextStepButtonRow = document.createElement('div');
    Object.assign(addNextStepButtonRow.style, { display: 'flex', justifyContent: 'flex-end' });
    const addNextStepBtn = makeIconBtn('➕ Add Next Step');
    addNextStepButtonRow.appendChild(addNextStepBtn);
    nextStepsAddRow.appendChild(newNextStepInput); nextStepsAddRow.appendChild(addNextStepButtonRow);
    nextStepsBlock.appendChild(nextStepsTop); nextStepsBlock.appendChild(nextStepsListContainer); nextStepsBlock.appendChild(nextStepsAddRow);

    // --- Preview window (NEW) ---
    const previewBlock = document.createElement('div');
    Object.assign(previewBlock.style, { display: 'flex', flexDirection: 'column', border: '1px solid #b0c4e0', borderRadius: '4px', padding: '4px', backgroundColor: '#f0f6ff', gap: '3px' });

    const previewHeader = document.createElement('div');
    Object.assign(previewHeader.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' });
    const previewLabel = document.createElement('span');
    previewLabel.textContent = '👁 Preview'; previewLabel.style.fontWeight = '600'; previewLabel.style.color = '#0055aa';
    const refreshPreviewBtn = makeIconBtn('↻ Refresh', null, 'Refresh preview');
    Object.assign(refreshPreviewBtn.style, { fontSize: '11px' });
    previewHeader.appendChild(previewLabel); previewHeader.appendChild(refreshPreviewBtn);

    const previewContent = document.createElement('div');
    Object.assign(previewContent.style, {
        border: '1px solid #ccd9ee', borderRadius: '4px', padding: '6px', backgroundColor: '#ffffff',
        minHeight: '60px', maxHeight: '120px', overflowY: 'auto', fontSize: '11px', lineHeight: '1.5',
        color: '#333', fontFamily: 'Segoe UI, system-ui, sans-serif'
    });
    previewContent.innerHTML = '<em style="color:#999">Select feedback items to preview the output here.</em>';
    previewBlock.appendChild(previewHeader); previewBlock.appendChild(previewContent);

    // --- CSV row ---
    const csvRow = document.createElement('div');
    Object.assign(csvRow.style, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' });
    const csvLabel = document.createElement('span'); csvLabel.textContent = 'Master CSV:'; csvLabel.style.fontWeight = '600';
    const csvButtons = document.createElement('div'); Object.assign(csvButtons.style, { display: 'flex', gap: '4px' });
    const downloadCsvBtn = makeIconBtn('⬇️ Download');
    const uploadCsvBtn = makeIconBtn('⬆️ Upload');
    csvButtons.appendChild(downloadCsvBtn); csvButtons.appendChild(uploadCsvBtn);
    csvRow.appendChild(csvLabel); csvRow.appendChild(csvButtons);

    const hiddenFileInput = document.createElement('input');
    hiddenFileInput.type = 'file'; hiddenFileInput.accept = '.csv,text/csv'; hiddenFileInput.style.display = 'none';

    // --- Skeleton email row ---
    const skeletonRow = document.createElement('div');
    Object.assign(skeletonRow.style, { display: 'flex', alignItems: 'center', gap: '6px' });
    const skeletonCheckbox = document.createElement('input'); skeletonCheckbox.type = 'checkbox'; skeletonCheckbox.id = 'd2l-gh-skeleton-email';
    const skeletonLabel = document.createElement('label'); skeletonLabel.textContent = 'Prep skeleton email'; skeletonLabel.htmlFor = skeletonCheckbox.id;
    Object.assign(skeletonLabel.style, { cursor: 'pointer', fontSize: '12px' });
    skeletonRow.appendChild(skeletonCheckbox); skeletonRow.appendChild(skeletonLabel);

    // --- Signature row ---
    const signatureRow = document.createElement('div');
    Object.assign(signatureRow.style, { display: 'flex', justifyContent: 'flex-start' });
    const signatureBtn = makeIconBtn('✍️ Signature');
    signatureRow.appendChild(signatureBtn);

    // --- Submit row ---
    const submitRow = document.createElement('div');
    Object.assign(submitRow.style, { display: 'flex', justifyContent: 'flex-end' });
    const insertBtn = document.createElement('button');
    insertBtn.textContent = 'Insert into Overall Feedback';
    Object.assign(insertBtn.style, { padding: '5px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', fontWeight: '600' });
    submitRow.appendChild(insertBtn);

    // --- Assemble body ---
    body.appendChild(courseRow);
    body.appendChild(assignmentRow);
    body.appendChild(levelRow);
    body.appendChild(levelFeedbackBlock);
    body.appendChild(feedbackHeaderTop);
    body.appendChild(feedbackColumnsHeader);
    body.appendChild(feedbackListContainer);
    body.appendChild(addFeedbackRow);
    body.appendChild(nextStepsBlock);
    body.appendChild(previewBlock);   // NEW: preview after Next Steps
    body.appendChild(csvRow);
    body.appendChild(hiddenFileInput);
    body.appendChild(skeletonRow);
    body.appendChild(signatureRow);
    body.appendChild(submitRow);

    // --- Resizer ---
    const resizer = document.createElement('div');
    Object.assign(resizer.style, { position: 'absolute', width: '14px', height: '14px', right: '1px', bottom: '1px', cursor: 'se-resize', background: 'transparent' });
    const resizerIcon = document.createElement('div');
    Object.assign(resizerIcon.style, { width: '100%', height: '100%', borderRight: '2px solid rgba(0,0,0,0.3)', borderBottom: '2px solid rgba(0,0,0,0.3)', boxSizing: 'border-box' });
    resizer.appendChild(resizerIcon);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(resizer);
    document.body.appendChild(panel);

    if (ps.minimized) {
        body.style.display = 'none'; resizer.style.display = 'none'; panel.style.height = 'auto';
    }

    // ===================== SELECTION STATE =====================
    let selectedFeedbackProf = new Set();
    let selectedFeedbackNeeds = new Set();
    let selectedNextSteps = new Set();

    function resetSelections() { selectedFeedbackProf.clear(); selectedFeedbackNeeds.clear(); selectedNextSteps.clear(); }

    function remapSetAfterRemoval(set, removedIndex) {
        const next = new Set();
        set.forEach(idx => { if (idx < removedIndex) next.add(idx); else if (idx > removedIndex) next.add(idx - 1); });
        return next;
    }
    function swapInSet(set, i, j) {
        const next = new Set();
        set.forEach(idx => { if (idx === i) next.add(j); else if (idx === j) next.add(i); else next.add(idx); });
        return next;
    }

    // ===================== PREVIEW =====================
    function updatePreview() {
        const html = GH.buildOverallFeedbackHtml(selectedFeedbackProf, selectedFeedbackNeeds, selectedNextSteps);
        if (!html) {
            previewContent.innerHTML = '<em style="color:#999">Select feedback items to preview the output here.</em>';
        } else {
            previewContent.innerHTML = html;
        }
    }

    // ===================== REFRESH FUNCTIONS =====================
    function refreshCourseOptions() {
        courseSelect.innerHTML = '';
        const ph = document.createElement('option'); ph.value = ''; ph.textContent = cfg.courses.length ? '-- select --' : '-- add a course --';
        courseSelect.appendChild(ph);
        cfg.courses.forEach(course => {
            const opt = document.createElement('option'); opt.value = course.id; opt.textContent = course.name;
            courseSelect.appendChild(opt);
        });
        if (GH.getCourseById(cfg.selectedCourseId)) courseSelect.value = cfg.selectedCourseId;
        else courseSelect.value = '';
    }

    function refreshAssignmentOptions() {
        assignmentSelect.innerHTML = '';
        const course = GH.getCourseById(cfg.selectedCourseId);
        const ph = document.createElement('option'); ph.value = ''; ph.textContent = (course && course.assignments && course.assignments.length) ? '-- select --' : '-- add an assignment --';
        assignmentSelect.appendChild(ph);
        if (course) {
            (course.assignments || []).forEach(a => {
                const opt = document.createElement('option'); opt.value = a.id; opt.textContent = a.name;
                assignmentSelect.appendChild(opt);
            });
            if (GH.getAssignmentById(course, cfg.selectedAssignmentId)) assignmentSelect.value = cfg.selectedAssignmentId;
            else assignmentSelect.value = '';
        }
    }

    function refreshLevelOptions() {
        levelSelect.innerHTML = '';
        const course = GH.getCourseById(cfg.selectedCourseId);
        const levels = GH.getCourseLevels(course);
        levels.forEach(level => {
            const opt = document.createElement('option'); opt.value = level; opt.textContent = level;
            levelSelect.appendChild(opt);
        });
        if (!levels.includes(cfg.selectedLevel)) cfg.selectedLevel = levels.includes('PROFICIENT') ? 'PROFICIENT' : levels[0];
        levelSelect.value = cfg.selectedLevel;
    }

    function refreshLevelCommentUI() {
        const course = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        const levels = GH.getCourseLevels(course);
        const levelKey = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0] || '');
        if (!assignment || !levelKey) {
            levelFeedbackTextarea.value = ''; levelFeedbackTextarea.disabled = true;
            saveLevelCommentBtn.disabled = true; includeLevelCheckbox.disabled = true; return;
        }
        levelFeedbackTextarea.disabled = false; saveLevelCommentBtn.disabled = false; includeLevelCheckbox.disabled = false;
        levelFeedbackTextarea.value = GH.getLevelCommentsObj(assignment)[levelKey] || '';
    }

    function refreshFeedbackList() {
        feedbackListContainer.innerHTML = '';
        const course = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) {
            const msg = document.createElement('div'); msg.textContent = 'Select a course and assignment.'; msg.style.fontStyle = 'italic'; msg.style.color = '#555';
            feedbackListContainer.appendChild(msg); return;
        }
        const list = GH.getFeedbackList(assignment);
        if (!list.length) {
            const msg = document.createElement('div'); msg.textContent = 'No feedback comments yet for this assignment.'; msg.style.fontStyle = 'italic'; msg.style.color = '#555';
            feedbackListContainer.appendChild(msg); return;
        }
        list.forEach((text, idx) => {
            const row = document.createElement('div');
            Object.assign(row.style, { display: 'grid', gridTemplateColumns: '28px 28px 1fr', columnGap: '4px', alignItems: 'flex-start', padding: '2px 2px' });

            const profCb = document.createElement('input'); profCb.type = 'checkbox'; profCb.style.margin = '0 auto'; profCb.checked = selectedFeedbackProf.has(idx);
            profCb.addEventListener('change', () => { if (profCb.checked) selectedFeedbackProf.add(idx); else selectedFeedbackProf.delete(idx); updatePreview(); });

            const needsCb = document.createElement('input'); needsCb.type = 'checkbox'; needsCb.style.margin = '0 auto'; needsCb.checked = selectedFeedbackNeeds.has(idx);
            needsCb.addEventListener('change', () => { if (needsCb.checked) selectedFeedbackNeeds.add(idx); else selectedFeedbackNeeds.delete(idx); updatePreview(); });

            const commentCell = document.createElement('div');
            Object.assign(commentCell.style, { display: 'flex', alignItems: 'flex-start', gap: '4px', paddingLeft: '8px' });
            const label = document.createElement('div'); label.textContent = text;
            Object.assign(label.style, { flex: '1', whiteSpace: 'normal', lineHeight: '1.3' });

            const btnGroup = document.createElement('div'); Object.assign(btnGroup.style, { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px' });
            const editBtn = makeSmallIconBtn('✎', '#0066cc'); editBtn.title = 'Edit';
            const upBtn = makeSmallIconBtn('↑', '#555'); upBtn.title = 'Move up';
            const downBtn = makeSmallIconBtn('↓', '#555'); downBtn.title = 'Move down';
            const delBtn = makeSmallIconBtn('✕', '#b00'); delBtn.title = 'Delete';

            editBtn.addEventListener('click', () => {
                const updated = window.prompt('Edit this feedback comment:', list[idx]);
                if (updated !== null) { const trimmed = updated.trim(); if (trimmed) { list[idx] = trimmed; GH.saveConfig(); refreshFeedbackList(); updatePreview(); } }
            });
            upBtn.addEventListener('click', () => { if (idx <= 0) return; const t = list[idx - 1]; list[idx - 1] = list[idx]; list[idx] = t; selectedFeedbackProf = swapInSet(selectedFeedbackProf, idx, idx - 1); selectedFeedbackNeeds = swapInSet(selectedFeedbackNeeds, idx, idx - 1); GH.saveConfig(); refreshFeedbackList(); updatePreview(); });
            downBtn.addEventListener('click', () => { if (idx >= list.length - 1) return; const t = list[idx + 1]; list[idx + 1] = list[idx]; list[idx] = t; selectedFeedbackProf = swapInSet(selectedFeedbackProf, idx, idx + 1); selectedFeedbackNeeds = swapInSet(selectedFeedbackNeeds, idx, idx + 1); GH.saveConfig(); refreshFeedbackList(); updatePreview(); });
            delBtn.addEventListener('click', () => { if (confirm('Remove this feedback comment?')) { list.splice(idx, 1); selectedFeedbackProf = remapSetAfterRemoval(selectedFeedbackProf, idx); selectedFeedbackNeeds = remapSetAfterRemoval(selectedFeedbackNeeds, idx); GH.saveConfig(); refreshFeedbackList(); updatePreview(); } });

            btnGroup.appendChild(editBtn); btnGroup.appendChild(upBtn); btnGroup.appendChild(downBtn); btnGroup.appendChild(delBtn);
            commentCell.appendChild(label); commentCell.appendChild(btnGroup);
            row.appendChild(profCb); row.appendChild(needsCb); row.appendChild(commentCell);
            feedbackListContainer.appendChild(row);
        });
        if (darkMode) applyDarkMode();
    }

    function refreshNextStepsList() {
        nextStepsListContainer.innerHTML = '';
        const course = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) {
            const msg = document.createElement('div'); msg.textContent = 'Select a course and assignment.'; msg.style.fontStyle = 'italic'; msg.style.color = '#555';
            nextStepsListContainer.appendChild(msg); return;
        }
        const list = GH.getNextStepsList(assignment);
        if (!list.length) {
            const msg = document.createElement('div'); msg.textContent = 'No next steps yet.'; msg.style.fontStyle = 'italic'; msg.style.color = '#555';
            nextStepsListContainer.appendChild(msg); return;
        }
        list.forEach((text, idx) => {
            const row = document.createElement('div');
            Object.assign(row.style, { display: 'flex', alignItems: 'flex-start', gap: '4px', padding: '2px 2px' });
            const cb = document.createElement('input'); cb.type = 'checkbox'; cb.style.marginTop = '2px'; cb.checked = selectedNextSteps.has(idx);
            cb.addEventListener('change', () => { if (cb.checked) selectedNextSteps.add(idx); else selectedNextSteps.delete(idx); updatePreview(); });
            const label = document.createElement('div'); label.textContent = text; Object.assign(label.style, { flex: '1', whiteSpace: 'normal', lineHeight: '1.3' });
            const btnGroup = document.createElement('div'); Object.assign(btnGroup.style, { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px' });
            const editBtn = makeSmallIconBtn('✎', '#0066cc'); editBtn.title = 'Edit';
            const upBtn = makeSmallIconBtn('↑', '#555'); upBtn.title = 'Move up';
            const downBtn = makeSmallIconBtn('↓', '#555'); downBtn.title = 'Move down';
            const delBtn = makeSmallIconBtn('✕', '#b00'); delBtn.title = 'Delete';
            editBtn.addEventListener('click', () => { const u = window.prompt('Edit next step:', list[idx]); if (u !== null) { const t = u.trim(); if (t) { list[idx] = t; GH.saveConfig(); refreshNextStepsList(); updatePreview(); } } });
            upBtn.addEventListener('click', () => { if (idx <= 0) return; const t = list[idx - 1]; list[idx - 1] = list[idx]; list[idx] = t; selectedNextSteps = swapInSet(selectedNextSteps, idx, idx - 1); GH.saveConfig(); refreshNextStepsList(); updatePreview(); });
            downBtn.addEventListener('click', () => { if (idx >= list.length - 1) return; const t = list[idx + 1]; list[idx + 1] = list[idx]; list[idx] = t; selectedNextSteps = swapInSet(selectedNextSteps, idx, idx + 1); GH.saveConfig(); refreshNextStepsList(); updatePreview(); });
            delBtn.addEventListener('click', () => { if (confirm('Remove this next step?')) { list.splice(idx, 1); selectedNextSteps = remapSetAfterRemoval(selectedNextSteps, idx); GH.saveConfig(); refreshNextStepsList(); updatePreview(); } });
            btnGroup.appendChild(editBtn); btnGroup.appendChild(upBtn); btnGroup.appendChild(downBtn); btnGroup.appendChild(delBtn);
            row.appendChild(cb); row.appendChild(label); row.appendChild(btnGroup);
            nextStepsListContainer.appendChild(row);
        });
        if (darkMode) applyDarkMode();
    }

    function refreshAll() {
        refreshCourseOptions(); refreshAssignmentOptions(); refreshLevelOptions(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview();
    }

    // ===================== DARK MODE =====================
    function applyDarkMode() {
        if (darkMode) {
            panel.style.backgroundColor = '#1e1e1e'; panel.style.color = '#d4d4d4';
            header.style.background = 'linear-gradient(90deg, #1a1a2e, #16213e)';
            body.style.backgroundColor = '#1e1e1e'; body.style.color = '#d4d4d4';
            darkModeBtn.textContent = '☀'; darkModeBtn.title = 'Light mode';
            previewBlock.style.backgroundColor = '#1e2a3a'; previewBlock.style.borderColor = '#446';
            previewContent.style.backgroundColor = '#252a35'; previewContent.style.color = '#cdd';
        } else {
            panel.style.backgroundColor = '#ffffff'; panel.style.color = '';
            header.style.background = 'linear-gradient(90deg, #0066cc, #004a99)';
            body.style.backgroundColor = ''; body.style.color = '';
            darkModeBtn.textContent = '🌙'; darkModeBtn.title = 'Dark mode';
            previewBlock.style.backgroundColor = '#f0f6ff'; previewBlock.style.borderColor = '#b0c4e0';
            previewContent.style.backgroundColor = '#ffffff'; previewContent.style.color = '#333';
        }

        const allSelects = body.querySelectorAll('select');
        const allTextareas = body.querySelectorAll('textarea');
        const allContainers = [feedbackListContainer, nextStepsListContainer];

        if (darkMode) {
            allSelects.forEach(el => { el.style.backgroundColor = '#2d2d2d'; el.style.color = '#d4d4d4'; el.style.borderColor = '#555'; });
            allTextareas.forEach(el => { el.style.backgroundColor = '#2d2d2d'; el.style.color = '#d4d4d4'; el.style.borderColor = '#555'; });
            allContainers.forEach(el => { el.style.backgroundColor = '#252525'; el.style.borderColor = '#444'; });
        } else {
            allSelects.forEach(el => { el.style.backgroundColor = ''; el.style.color = ''; el.style.borderColor = ''; });
            allTextareas.forEach(el => { el.style.backgroundColor = ''; el.style.color = ''; el.style.borderColor = ''; });
            allContainers.forEach(el => { el.style.backgroundColor = el === feedbackListContainer ? '#fafafa' : '#ffffff'; el.style.borderColor = '#e0e0e0'; });
        }
    }

    // ===================== BUILD HTML / EMAIL =====================
    GH.buildOverallFeedbackHtml = function (profSet, needsSet, nextSet) {
        const course = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) return null;

        const _prof = profSet !== undefined ? profSet : selectedFeedbackProf;
        const _needs = needsSet !== undefined ? needsSet : selectedFeedbackNeeds;
        const _next = nextSet !== undefined ? nextSet : selectedNextSteps;

        const levels = GH.getCourseLevels(course);
        const levelKey = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0] || '');
        const levelComments = GH.getLevelCommentsObj(assignment);
        const levelText = (cfg.includeLevelComment && levelKey) ? (levelComments[levelKey] || '').trim() : '';

        const feedbackList = GH.getFeedbackList(assignment);
        const profComments = [], needsComments = [];
        feedbackList.forEach((text, idx) => {
            const t = String(text || '').trim(); if (!t) return;
            if (_prof.has(idx)) profComments.push(t);
            if (_needs.has(idx)) needsComments.push(t);
        });

        const nextStepsList = GH.getNextStepsList(assignment);
        const nextStepsSelected = [];
        if (cfg.includeNextSteps) {
            nextStepsList.forEach((text, idx) => { const t = String(text || '').trim(); if (t && _next.has(idx)) nextStepsSelected.push(t); });
        }

        const firstName = GH.getStudentFirstName();
        const todayStr = GH.formatToday();
        let html = '';
        if (todayStr) html += `<p>${GH.escapeHtml(todayStr)}</p>`;
        if (firstName) html += `<p>Hi ${GH.escapeHtml(firstName)},</p>`;
        if (levelText) html += `<p>${GH.escapeHtml(levelText)}</p>`;
        if (profComments.length) { html += '<p><strong>What you did well:</strong></p><ul>'; profComments.forEach(c => { html += `<li>${GH.escapeHtml(c)}</li>`; }); html += '</ul>'; }
        if (needsComments.length) { html += '<p><strong>Areas for improvement:</strong></p><ul>'; needsComments.forEach(c => { html += `<li>${GH.escapeHtml(c)}</li>`; }); html += '</ul>'; }
        if (nextStepsSelected.length) { html += '<p><strong>Next steps:</strong></p><ul>'; nextStepsSelected.forEach(c => { html += `<li>${GH.escapeHtml(c)}</li>`; }); html += '</ul>'; }
        if (GH.teacherSignature) html += `<p>${GH.teacherSignature}</p>`;
        return html || null;
    };

    GH.buildSkeletonEmailText = function () {
        const course = GH.getCourseById(cfg.selectedCourseId);
        const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
        if (!course || !assignment) return '';

        const levels = GH.getCourseLevels(course);
        const levelKey = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0] || '');
        const levelText = (cfg.includeLevelComment && levelKey) ? (GH.getLevelCommentsObj(assignment)[levelKey] || '').trim() : '';
        const feedbackList = GH.getFeedbackList(assignment);
        const profComments = [], needsComments = [];
        feedbackList.forEach((text, idx) => { const t = String(text || '').trim(); if (!t) return; if (selectedFeedbackProf.has(idx)) profComments.push(t); if (selectedFeedbackNeeds.has(idx)) needsComments.push(t); });
        const nextStepsList = GH.getNextStepsList(assignment);
        const nextStepsSelected = [];
        if (cfg.includeNextSteps) nextStepsList.forEach((text, idx) => { const t = String(text || '').trim(); if (t && selectedNextSteps.has(idx)) nextStepsSelected.push(t); });

        const firstName = GH.getStudentFirstName();
        let text = firstName ? `Hi ${firstName},\n\n` : 'Hi,\n\n';
        const courseName = course.name || '', assignmentName = assignment.name || '';
        if (assignmentName || courseName) {
            text += 'Here is some feedback';
            if (assignmentName) text += ` for "${assignmentName}"`;
            if (courseName) text += ` in ${courseName}`;
            text += '.\n\n';
        }
        if (levelText) text += levelText + '\n\n';
        if (profComments.length) { text += 'What you did well:\n'; profComments.forEach(c => { text += `• ${c}\n`; }); text += '\n'; }
        if (needsComments.length) { text += 'Areas for improvement:\n'; needsComments.forEach(c => { text += `• ${c}\n`; }); text += '\n'; }
        if (nextStepsSelected.length) { text += 'Next steps:\n'; nextStepsSelected.forEach(c => { text += `• ${c}\n`; }); text += '\n'; }
        if (GH.teacherSignature) text += '\n' + GH.teacherSignature.replace(/<br\s*\/?>/gi, '\n') + '\n';
        return text.trim() || '';
    };

    // ===================== EVENT WIRING =====================

    minimizeBtn.addEventListener('click', () => {
        ps.minimized = !ps.minimized;
        if (ps.minimized) { ps.height = panel.offsetHeight; body.style.display = 'none'; resizer.style.display = 'none'; panel.style.height = 'auto'; }
        else { body.style.display = 'flex'; resizer.style.display = 'block'; panel.style.height = (ps.height || 550) + 'px'; }
        minimizeBtn.textContent = ps.minimized ? '▢' : '▁';
        GH.saveConfig();
    });

    darkModeBtn.addEventListener('click', () => { darkMode = !darkMode; ps.darkMode = darkMode; GH.saveConfig(); applyDarkMode(); });

    courseSelect.addEventListener('change', () => { cfg.selectedCourseId = courseSelect.value || null; cfg.selectedAssignmentId = null; resetSelections(); GH.saveConfig(); refreshAssignmentOptions(); refreshLevelOptions(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview(); });
    assignmentSelect.addEventListener('change', () => { const course = GH.getCourseById(cfg.selectedCourseId); cfg.selectedAssignmentId = (course && assignmentSelect.value) ? assignmentSelect.value : null; resetSelections(); GH.saveConfig(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview(); });
    levelSelect.addEventListener('change', () => { if (levelSelect.value) { cfg.selectedLevel = levelSelect.value; GH.saveConfig(); refreshLevelCommentUI(); updatePreview(); } });

    addCourseBtn.addEventListener('click', () => {
        const name = window.prompt('Enter a name for the new course:'); if (!name) return; const trimmed = name.trim(); if (!trimmed) return;
        const course = { id: GH.uuid(), name: trimmed, levels: GH.DEFAULT_LEVELS.slice(), assignments: [] };
        cfg.courses.push(course); cfg.selectedCourseId = course.id; cfg.selectedAssignmentId = null; GH.saveConfig(); refreshAll();
    });

    renameCourseBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); if (!course) { alert('Select a course first.'); return; } const name = window.prompt('Rename course:', course.name || ''); if (name === null) return; const trimmed = name.trim(); if (!trimmed) return; course.name = trimmed; GH.saveConfig(); refreshCourseOptions(); });
    deleteCourseBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); if (!course) { alert('Select a course first.'); return; } if (!confirm(`Delete course "${course.name}" and all its assignments/comments?`)) return; cfg.courses = cfg.courses.filter(c => c.id !== course.id); cfg.selectedCourseId = cfg.courses.length ? cfg.courses[0].id : null; cfg.selectedAssignmentId = null; resetSelections(); GH.saveConfig(); refreshAll(); });

    reorderCoursesBtn.addEventListener('click', () => {
        if (!cfg.courses.length) { alert('No courses to reorder.'); return; }
        GH.openListEditorModal({ title: 'Reorder courses', items: cfg.courses.map(c => c.name || ''), onApply: (newOrder) => {
            const old = cfg.courses.slice(); const used = new Set(); const newCourses = [];
            newOrder.forEach(name => { const idx = old.findIndex((c, i) => !used.has(i) && (c.name || '') === name); if (idx !== -1) { newCourses.push(old[idx]); used.add(idx); } });
            old.forEach((c, i) => { if (!used.has(i)) newCourses.push(c); });
            cfg.courses = newCourses; GH.saveConfig(); refreshCourseOptions();
        }});
    });

    editLevelsBtn.addEventListener('click', () => {
        const course = GH.getCourseById(cfg.selectedCourseId); if (!course) { alert('Select a course first.'); return; }
        GH.openListEditorModal({ title: 'Edit levels', items: GH.getCourseLevels(course), allowEdit: true, allowAdd: true, allowDelete: true, onApply: (newLevels) => {
            const levels = newLevels.map(s => s.trim()).filter(Boolean); if (!levels.length) { alert('Must have at least one level.'); return; }
            course.levels = levels;
            (course.assignments || []).forEach(a => { a.levelComments = a.levelComments && typeof a.levelComments === 'object' ? a.levelComments : {}; const newLc = {}; levels.forEach(l => { newLc[l] = a.levelComments[l] || ''; }); a.levelComments = newLc; });
            if (!levels.includes(cfg.selectedLevel)) cfg.selectedLevel = levels[0];
            GH.saveConfig(); refreshLevelOptions(); refreshLevelCommentUI();
        }});
    });

    addAssignmentBtn.addEventListener('click', () => {
        const course = GH.getCourseById(cfg.selectedCourseId); if (!course) { alert('Add/select a course first.'); return; }
        const guess = GH.detectCourseAndAssignmentFromTitle();
        const name = window.prompt('Enter a name for the new assignment:', (guess && guess.assignmentName) ? guess.assignmentName : ''); if (!name) return; const trimmed = name.trim(); if (!trimmed) return;
        const assignment = { id: GH.uuid(), name: trimmed, feedback: [], nextSteps: [], levelComments: {} };
        GH.getCourseLevels(course).forEach(l => { assignment.levelComments[l] = ''; });
        course.assignments = course.assignments || []; course.assignments.push(assignment);
        cfg.selectedAssignmentId = assignment.id; resetSelections(); GH.saveConfig(); refreshAssignmentOptions(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview();
    });

    renameAssignmentBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId); if (!course || !assignment) { alert('Select an assignment first.'); return; } const name = window.prompt('Rename assignment:', assignment.name || ''); if (name === null) return; const trimmed = name.trim(); if (!trimmed) return; assignment.name = trimmed; GH.saveConfig(); refreshAssignmentOptions(); });
    deleteAssignmentBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId); if (!course || !assignment) { alert('Select an assignment first.'); return; } if (!confirm(`Delete assignment "${assignment.name}" and its comments?`)) return; course.assignments = (course.assignments || []).filter(a => a.id !== assignment.id); cfg.selectedAssignmentId = course.assignments.length ? course.assignments[0].id : null; resetSelections(); GH.saveConfig(); refreshAssignmentOptions(); refreshLevelCommentUI(); refreshFeedbackList(); refreshNextStepsList(); updatePreview(); });

    moveUpBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); if (!course) return; const assignments = course.assignments || []; const idx = assignments.findIndex(a => a.id === cfg.selectedAssignmentId); if (idx <= 0) return; const t = assignments[idx - 1]; assignments[idx - 1] = assignments[idx]; assignments[idx] = t; GH.saveConfig(); refreshAssignmentOptions(); });
    moveDownBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); if (!course) return; const assignments = course.assignments || []; const idx = assignments.findIndex(a => a.id === cfg.selectedAssignmentId); if (idx === -1 || idx >= assignments.length - 1) return; const t = assignments[idx + 1]; assignments[idx + 1] = assignments[idx]; assignments[idx] = t; GH.saveConfig(); refreshAssignmentOptions(); });

    reorderAssignmentsBtn.addEventListener('click', () => {
        const course = GH.getCourseById(cfg.selectedCourseId); if (!course || !(course.assignments || []).length) { alert('No assignments to reorder.'); return; }
        GH.openListEditorModal({ title: 'Reorder assignments', items: course.assignments.map(a => a.name || ''), onApply: (newOrder) => {
            const old = course.assignments.slice(); const used = new Set(); const newAssignments = [];
            newOrder.forEach(name => { const idx = old.findIndex((a, i) => !used.has(i) && (a.name || '') === name); if (idx !== -1) { newAssignments.push(old[idx]); used.add(idx); } });
            old.forEach((a, i) => { if (!used.has(i)) newAssignments.push(a); });
            course.assignments = newAssignments; GH.saveConfig(); refreshAssignmentOptions();
        }});
    });

    addLevelBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); if (!course) { alert('Select a course first.'); return; } const name = window.prompt('New level name:'); if (!name) return; const trimmed = name.trim(); if (!trimmed) return; const levels = GH.getCourseLevels(course); if (levels.includes(trimmed)) { alert('Level already exists.'); return; } levels.push(trimmed); course.levels = levels; (course.assignments || []).forEach(a => { const lc = a.levelComments || {}; lc[trimmed] = ''; a.levelComments = lc; }); cfg.selectedLevel = trimmed; GH.saveConfig(); refreshLevelOptions(); refreshLevelCommentUI(); });

    renameLevelBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); if (!course) { alert('Select a course first.'); return; } const levels = GH.getCourseLevels(course); const currentLevel = cfg.selectedLevel; if (!currentLevel || !levels.includes(currentLevel)) { alert('Select a level first.'); return; } const newName = window.prompt('Rename level:', currentLevel); if (!newName) return; const trimmed = newName.trim(); if (!trimmed || trimmed === currentLevel) return; if (levels.includes(trimmed)) { alert('Level already exists.'); return; } const idx = levels.indexOf(currentLevel); if (idx !== -1) { levels[idx] = trimmed; course.levels = levels; } (course.assignments || []).forEach(a => { const lc = a.levelComments || {}; if (lc[currentLevel] !== undefined) { lc[trimmed] = lc[currentLevel]; delete lc[currentLevel]; } }); cfg.selectedLevel = trimmed; GH.saveConfig(); refreshLevelOptions(); refreshLevelCommentUI(); });

    reorderLevelsBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); if (!course) { alert('Select a course first.'); return; } const currentLevels = GH.getCourseLevels(course); if (currentLevels.length < 2) { alert('Need at least 2 levels to reorder.'); return; } GH.openListEditorModal({ title: 'Reorder levels', items: currentLevels, onApply: (newLevels) => { const levels = newLevels.map(s => s.trim()).filter(Boolean); if (!levels.length) { alert('Must have at least one level.'); return; } course.levels = levels; if (!levels.includes(cfg.selectedLevel)) cfg.selectedLevel = levels[0]; GH.saveConfig(); refreshLevelOptions(); refreshLevelCommentUI(); } }); });

    deleteLevelBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); if (!course) { alert('Select a course first.'); return; } const levels = GH.getCourseLevels(course); const currentLevel = cfg.selectedLevel; if (!currentLevel || !levels.includes(currentLevel)) { alert('Select a level first.'); return; } if (levels.length === 1) { alert('Cannot delete the only level.'); return; } if (!confirm(`Delete level "${currentLevel}"? This will also remove associated level comments.`)) return; const idx = levels.indexOf(currentLevel); if (idx !== -1) { levels.splice(idx, 1); course.levels = levels; } (course.assignments || []).forEach(a => { const lc = a.levelComments || {}; delete lc[currentLevel]; }); cfg.selectedLevel = levels[0] || ''; GH.saveConfig(); refreshLevelOptions(); refreshLevelCommentUI(); });

    includeLevelCheckbox.addEventListener('change', () => { cfg.includeLevelComment = includeLevelCheckbox.checked; GH.saveConfig(); updatePreview(); });
    includeNextStepsCheckbox.addEventListener('change', () => { cfg.includeNextSteps = includeNextStepsCheckbox.checked; GH.saveConfig(); updatePreview(); });

    saveLevelCommentBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId); if (!course || !assignment) { alert('Select a course and assignment first.'); return; } const levels = GH.getCourseLevels(course); const levelKey = levels.includes(cfg.selectedLevel) ? cfg.selectedLevel : (levels[0] || ''); if (!levelKey) return; GH.getLevelCommentsObj(assignment)[levelKey] = levelFeedbackTextarea.value || ''; GH.saveConfig(); updatePreview(); alert(`Saved level comment for "${levelKey}".`); });

    addFeedbackBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId); if (!course || !assignment) { alert('Select a course and assignment first.'); return; } const text = newFeedbackInput.value.trim(); if (!text) return; GH.getFeedbackList(assignment).push(text); newFeedbackInput.value = ''; GH.saveConfig(); refreshFeedbackList(); });
    addNextStepBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId); if (!course || !assignment) { alert('Select a course and assignment first.'); return; } const text = newNextStepInput.value.trim(); if (!text) return; GH.getNextStepsList(assignment).push(text); newNextStepInput.value = ''; GH.saveConfig(); refreshNextStepsList(); });

    selectAllBtn.addEventListener('click', () => { const course = GH.getCourseById(cfg.selectedCourseId); const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId); if (!course || !assignment) return; selectedFeedbackProf = new Set(); selectedFeedbackNeeds.clear(); GH.getFeedbackList(assignment).forEach((_, idx) => { selectedFeedbackProf.add(idx); }); refreshFeedbackList(); updatePreview(); });
    clearAllBtn.addEventListener('click', () => { selectedFeedbackProf.clear(); selectedFeedbackNeeds.clear(); refreshFeedbackList(); updatePreview(); });

    refreshPreviewBtn.addEventListener('click', () => updatePreview());
    levelFeedbackTextarea.addEventListener('input', () => updatePreview());

    downloadCsvBtn.addEventListener('click', () => GH.showCsvDownloadModal());
    uploadCsvBtn.addEventListener('click', () => GH.showCsvUploadModal(hiddenFileInput));
    hiddenFileInput.addEventListener('change', () => {
        if (!hiddenFileInput.files || !hiddenFileInput.files.length) return;
        const file = hiddenFileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const course = GH.getCourseById(cfg.selectedCourseId);
            const uploadScope = hiddenFileInput.dataset.uploadScope || 'all';
            const uploadMode = hiddenFileInput.dataset.uploadMode || 'merge';
            const result = GH.applyMasterCsvToConfig(text, { scope: uploadScope === 'course' ? 'current' : 'all', mode: uploadMode === 'replace' ? 'replace' : 'merge', currentCourseName: course ? course.name : null });
            GH.saveConfig(); refreshAll();
            alert(`CSV import complete (${uploadMode.toUpperCase()}).\n\nCourses touched: ${result.coursesTouched}\nAssignments touched: ${result.assignmentsTouched}\nComments added/merged: ${result.feedbackAdded}\nLevel comments updated: ${result.levelCommentsUpdated}`);
        };
        reader.readAsText(file);
    });

    signatureBtn.addEventListener('click', () => GH.configureSignature(() => updatePreview()));

    // --- Insert button: insert + auto-minimize ---
    insertBtn.addEventListener('click', () => {
        const html = GH.buildOverallFeedbackHtml();
        if (!html) { alert('Please select a course and assignment first.'); return; }
        const ok = GH.setOverallFeedbackHtml(html);
        if (!ok) return;

        // Auto-minimize after successful insert
        if (!ps.minimized) {
            ps.minimized = true;
            ps.height = panel.offsetHeight;
            body.style.display = 'none';
            resizer.style.display = 'none';
            panel.style.height = 'auto';
            minimizeBtn.textContent = '▢';
            GH.saveConfig();
        }

        if (skeletonCheckbox.checked) {
            const emailText = GH.buildSkeletonEmailText();
            if (!emailText) { alert('No skeleton email content available.'); return; }
            // Copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(emailText).then(() => { alert('Skeleton email copied to clipboard. Paste into your email draft.'); }).catch(() => { fallbackCopyText(emailText); });
            } else { fallbackCopyText(emailText); }
            // Open mailto
            const course = GH.getCourseById(cfg.selectedCourseId);
            const assignment = GH.getAssignmentById(course, cfg.selectedAssignmentId);
            let subject = 'Feedback on your assignment';
            if (assignment && assignment.name) { subject = `Feedback on ${assignment.name}`; if (course && course.name) subject += ` (${course.name})`; } else if (course && course.name) { subject = `Feedback in ${course.name}`; }
            window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailText)}`;
        }
    });

    function fallbackCopyText(text) {
        const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); alert('Skeleton email copied to clipboard.'); } catch (e) { alert('Could not copy automatically.\n\n' + text); }
        document.body.removeChild(ta);
    }

    // ===================== DRAGGING =====================
    (function () {
        let dragging = false, offsetX = 0, offsetY = 0;
        function onMouseMove(e) { if (!dragging) return; const newLeft = Math.min(window.innerWidth - 50, Math.max(0, e.clientX - offsetX)); const newTop = Math.min(window.innerHeight - 50, Math.max(0, e.clientY - offsetY)); panel.style.left = newLeft + 'px'; panel.style.top = newTop + 'px'; ps.left = newLeft; ps.top = newTop; }
        function onMouseUp() { dragging = false; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); GH.saveConfig(); }
        header.addEventListener('mousedown', (e) => { if (e.button !== 0) return; dragging = true; offsetX = e.clientX - panel.offsetLeft; offsetY = e.clientY - panel.offsetTop; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); });
    })();

    // ===================== RESIZING =====================
    (function () {
        let resizing = false, startWidth = 0, startHeight = 0, startX = 0, startY = 0;
        function onMouseMove(e) { if (!resizing) return; const w = Math.max(320, startWidth + (e.clientX - startX)); const h = Math.max(300, startHeight + (e.clientY - startY)); panel.style.width = w + 'px'; panel.style.height = h + 'px'; ps.width = w; ps.height = h; }
        function onMouseUp() { resizing = false; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); GH.saveConfig(); }
        resizer.addEventListener('mousedown', (e) => { if (e.button !== 0) return; resizing = true; startWidth = panel.offsetWidth; startHeight = panel.offsetHeight; startX = e.clientX; startY = e.clientY; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); });
    })();

    // ===================== VERSION BAR =====================
    const versionBar = document.createElement('div');
    Object.assign(versionBar.style, {
        fontSize: '10px', color: 'var(--gh-text-faint)', textAlign: 'center',
        padding: '3px 0 2px 0', letterSpacing: '0.03em', userSelect: 'none'
    });
    versionBar.textContent = 'D2L Grading Helper v4.1.0';
    body.appendChild(versionBar);

    // ===================== INITIAL RENDER =====================
    refreshAll();
    if (darkMode) applyDarkMode();
};

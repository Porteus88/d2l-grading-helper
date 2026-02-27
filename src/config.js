// config.js — Configuration management, migration helpers, and data accessors

'use strict';

window.GH = window.GH || {};

GH.DEFAULT_LEVELS = ['EXTENDING', 'PROFICIENT', 'DEVELOPING', 'EMERGING'];

GH.defaultConfig = function () {
    return {
        courses: [],
        selectedCourseId: null,
        selectedAssignmentId: null,
        selectedLevel: 'PROFICIENT',
        includeLevelComment: true,
        includeNextSteps: true,
        panelState: {
            top: null,
            left: null,
            width: 440,
            height: 580,
            minimized: false,
            darkMode: false,
            lcCollapsed: false,
            nsCollapsed: false
        }
    };
};

GH._migrateAssignmentsToLevels = function (cfg) {
    cfg.courses.forEach(course => {
        (course.assignments || []).forEach(a => {
            if (!a.levels) {
                const baseFeedback = Array.isArray(a.feedback) ? a.feedback.slice() : [];
                a.levels = {};
                GH.DEFAULT_LEVELS.forEach(l => { a.levels[l] = []; });
                a.levels.PROFICIENT = baseFeedback;
            } else {
                const courseLevels = Array.isArray(course.levels) && course.levels.length
                    ? course.levels
                    : GH.DEFAULT_LEVELS;
                course.levels = courseLevels;
                courseLevels.forEach(l => {
                    if (!Array.isArray(a.levels[l])) a.levels[l] = [];
                });
            }
        });
    });
};

GH._migrateLevelsToFeedback = function (cfg) {
    cfg.courses.forEach(course => {
        (course.assignments || []).forEach(a => {
            if (!Array.isArray(a.feedback)) {
                const all = new Set();
                if (a.levels && typeof a.levels === 'object') {
                    Object.keys(a.levels).forEach(key => {
                        const arr = a.levels[key];
                        if (Array.isArray(arr)) arr.forEach(t => {
                            const s = String(t || '').trim();
                            if (s) all.add(s);
                        });
                    });
                }
                a.feedback = Array.from(all);
            }
            if (!a.levelComments || typeof a.levelComments !== 'object') a.levelComments = {};
            if (!Array.isArray(a.nextSteps)) a.nextSteps = [];
        });
    });
};

GH.initConfig = function (rawConfig, signature) {
    let cfg;
    if (!rawConfig) {
        cfg = GH.defaultConfig();
    } else {
        cfg = rawConfig;
        if (!cfg.courses) cfg.courses = [];
        if (!cfg.panelState) cfg.panelState = GH.defaultConfig().panelState;
        if (typeof cfg.panelState.lcCollapsed !== 'boolean') cfg.panelState.lcCollapsed = false;
        if (typeof cfg.panelState.nsCollapsed !== 'boolean') cfg.panelState.nsCollapsed = false;
        if (typeof cfg.includeLevelComment !== 'boolean') cfg.includeLevelComment = true;
        if (typeof cfg.includeNextSteps !== 'boolean') cfg.includeNextSteps = true;
        if (!cfg.selectedLevel) cfg.selectedLevel = 'PROFICIENT';
        GH._migrateAssignmentsToLevels(cfg);
        GH._migrateLevelsToFeedback(cfg);
    }
    GH.config = cfg;
    GH.teacherSignature = signature || '';
};

GH.saveConfig = function () {
    GH.storage.saveConfig(GH.config);
};

// --- Data accessors ---

GH.getCourseById = function (id) {
    return GH.config.courses.find(c => c.id === id) || null;
};

GH.getAssignmentById = function (course, id) {
    if (!course) return null;
    return (course.assignments || []).find(a => a.id === id) || null;
};

GH.getCourseLevels = function (course) {
    if (!course) return GH.DEFAULT_LEVELS;
    if (!Array.isArray(course.levels) || !course.levels.length) course.levels = GH.DEFAULT_LEVELS.slice();
    return course.levels;
};

GH.getFeedbackList = function (assignment) {
    if (!assignment) return [];
    if (!Array.isArray(assignment.feedback)) assignment.feedback = [];
    return assignment.feedback;
};

GH.getNextStepsList = function (assignment) {
    if (!assignment) return [];
    if (!Array.isArray(assignment.nextSteps)) assignment.nextSteps = [];
    return assignment.nextSteps;
};

GH.getLevelCommentsObj = function (assignment) {
    if (!assignment) return {};
    if (!assignment.levelComments || typeof assignment.levelComments !== 'object') assignment.levelComments = {};
    return assignment.levelComments;
};

GH.ensureSelection = function () {
    const cfg = GH.config;
    if (!cfg.courses.length) return;
    if (!GH.getCourseById(cfg.selectedCourseId)) cfg.selectedCourseId = cfg.courses[0].id;
    const course = GH.getCourseById(cfg.selectedCourseId);
    if (!course.assignments) course.assignments = [];
    if (course.assignments.length && !GH.getAssignmentById(course, cfg.selectedAssignmentId)) {
        cfg.selectedAssignmentId = course.assignments[0].id;
    }
    const courseLevels = GH.getCourseLevels(course);
    if (!courseLevels.includes(cfg.selectedLevel)) {
        cfg.selectedLevel = courseLevels.includes('PROFICIENT') ? 'PROFICIENT' : courseLevels[0];
    }
};

GH.detectCourseAndAssignmentFromTitle = function () {
    let subtitleEl = document.getElementById('subtitleName');
    if (!subtitleEl) {
        const subs = GH.findInAllShadowRoots('#subtitleName');
        if (subs.length) subtitleEl = subs[0];
    }
    let titleEl = document.getElementById('titleName');
    if (!titleEl) {
        const titles = GH.findInAllShadowRoots('#titleName');
        if (titles.length) titleEl = titles[0];
    }

    let assignmentName = titleEl ? titleEl.textContent.trim() : '';
    let courseName = subtitleEl ? subtitleEl.textContent.trim() : '';

    if (assignmentName || courseName) return { assignmentName, courseName };

    const title = document.title || '';
    if (!title) return null;
    const parts = title.split(' - ').map(p => p.trim()).filter(Boolean);
    if (!parts.length) return null;
    const evalIdx = parts.findIndex(p => /Assignment Evaluation|Activity Evaluation/i.test(p));
    if (evalIdx === -1) return null;
    const after = parts.slice(evalIdx + 1);
    if (!after.length) return null;
    const remainder = after.slice(1);
    if (!remainder.length) return null;
    if (remainder.length > 1 && /brightspace|desire2learn|d2l|onlinelearning/i.test(remainder[remainder.length - 1])) {
        remainder.pop();
    }
    if (remainder.length === 1) {
        assignmentName = remainder[0];
    } else if (remainder.length >= 2) {
        assignmentName = remainder[0];
        courseName = remainder[1];
    }
    assignmentName = assignmentName.trim();
    courseName = courseName.trim();
    if (!assignmentName && !courseName) return null;
    return { assignmentName, courseName };
};

GH.autoDetectCourseAndAssignment = function () {
    const parsed = GH.detectCourseAndAssignmentFromTitle();
    if (!parsed) return;
    let { assignmentName, courseName } = parsed;
    const cfg = GH.config;
    let course = null;
    if (courseName) course = cfg.courses.find(c => c.name === courseName) || null;
    if (!course && courseName) {
        course = { id: GH.uuid(), name: courseName, levels: GH.DEFAULT_LEVELS.slice(), assignments: [] };
        cfg.courses.push(course);
    }
    if (!course && cfg.courses.length === 1) course = cfg.courses[0];
    if (!course) return;
    cfg.selectedCourseId = course.id;
    course.assignments = course.assignments || [];
    let assignment = null;
    if (assignmentName) assignment = course.assignments.find(a => a.name === assignmentName) || null;
    if (!assignment && assignmentName) {
        const levels = course.levels || GH.DEFAULT_LEVELS.slice();
        assignment = { id: GH.uuid(), name: assignmentName, feedback: [], nextSteps: [], levelComments: {} };
        levels.forEach(l => { assignment.levelComments[l] = assignment.levelComments[l] || ''; });
        course.assignments.push(assignment);
    }
    if (assignment) {
        cfg.selectedAssignmentId = assignment.id;
        const levels = course.levels || GH.DEFAULT_LEVELS.slice();
        const lc = assignment.levelComments || {};
        Object.keys(lc).forEach(k => { if (!levels.includes(k)) delete lc[k]; });
        levels.forEach(k => { if (typeof lc[k] !== 'string') lc[k] = ''; });
        assignment.levelComments = lc;
        if (!Array.isArray(assignment.nextSteps)) assignment.nextSteps = [];
    }
    GH.saveConfig();
};

GH.getStudentFirstName = function () {
    try {
        const pageTitle = document.title;
        const m = pageTitle.match(/(?:Assignment|Activity) Evaluation - ([^-]+) -/);
        if (!m) return '';
        return m[1].trim().split(' ')[0] || '';
    } catch (e) { return ''; }
};

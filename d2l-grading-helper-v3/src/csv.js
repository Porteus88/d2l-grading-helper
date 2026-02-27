// csv.js — Master CSV build, parse, and apply logic

'use strict';

window.GH = window.GH || {};

GH.csvEscape = function (str) {
    return `"${String(str == null ? '' : str).replace(/"/g, '""')}"`;
};

GH.buildMasterCsvFromConfig = function (cfg, courseIdFilter) {
    const rows = [
        '# D2L Grading Helper Master Comment Template',
        '# Section: FEEDBACK, NEXT_STEP, or LEVEL_COMMENT',
        '# For FEEDBACK and NEXT_STEP rows, leave Level blank.',
        '# For LEVEL_COMMENT rows, fill Level with the proficiency level name.',
        'Section,Course,Assignment,Level,Comment'
    ];
    const filterSet = courseIdFilter ? new Set(courseIdFilter) : null;

    (cfg.courses || []).forEach(course => {
        if (filterSet && !filterSet.has(course.id)) return;
        const courseName = course.name || '';
        const levels = Array.isArray(course.levels) && course.levels.length ? course.levels : GH.DEFAULT_LEVELS;

        (course.assignments || []).forEach(a => {
            const assignmentName = a.name || '';
            let addedSomething = false;

            (Array.isArray(a.feedback) ? a.feedback : []).forEach(text => {
                rows.push([GH.csvEscape('FEEDBACK'), GH.csvEscape(courseName), GH.csvEscape(assignmentName), GH.csvEscape(''), GH.csvEscape(text)].join(','));
                addedSomething = true;
            });

            (Array.isArray(a.nextSteps) ? a.nextSteps : []).forEach(text => {
                rows.push([GH.csvEscape('NEXT_STEP'), GH.csvEscape(courseName), GH.csvEscape(assignmentName), GH.csvEscape(''), GH.csvEscape(text)].join(','));
                addedSomething = true;
            });

            const lc = (a.levelComments && typeof a.levelComments === 'object') ? a.levelComments : {};
            levels.forEach(level => {
                const cmt = (lc[level] || '').trim();
                if (cmt) {
                    rows.push([GH.csvEscape('LEVEL_COMMENT'), GH.csvEscape(courseName), GH.csvEscape(assignmentName), GH.csvEscape(level), GH.csvEscape(cmt)].join(','));
                    addedSomething = true;
                }
            });

            if (!addedSomething) {
                rows.push([GH.csvEscape('FEEDBACK'), GH.csvEscape(courseName), GH.csvEscape(assignmentName), GH.csvEscape(''), GH.csvEscape('')].join(','));
            }
        });
    });

    return rows.join('\r\n');
};

GH.parseCsvLine = function (line) {
    const result = [];
    let i = 0;
    const len = line.length;
    while (i < len) {
        if (line[i] === '"') {
            let j = i + 1;
            let field = '';
            while (j < len) {
                if (line[j] === '"') {
                    if (j + 1 < len && line[j + 1] === '"') { field += '"'; j += 2; }
                    else { j++; break; }
                } else { field += line[j++]; }
            }
            result.push(field);
            if (j < len && line[j] === ',') j++;
            i = j;
        } else {
            let j = i;
            let field = '';
            while (j < len && line[j] !== ',') field += line[j++];
            result.push(field.trim());
            if (j < len && line[j] === ',') j++;
            i = j;
        }
    }
    return result;
};

GH.parseMasterCsv = function (text) {
    const lines = String(text || '').split(/\r?\n/);
    const coursesByName = new Map();
    let headerSeen = false;

    function getCourseEntry(courseName) {
        const key = courseName.toLowerCase();
        let entry = coursesByName.get(key);
        if (!entry) {
            entry = { name: courseName, levelsSet: new Set(), assignmentsByName: new Map() };
            coursesByName.set(key, entry);
        }
        return entry;
    }

    function getAssignmentEntry(courseEntry, assignmentName) {
        const key = assignmentName.toLowerCase();
        let entry = courseEntry.assignmentsByName.get(key);
        if (!entry) {
            entry = { name: assignmentName, feedbacks: [], nextSteps: [], levelComments: new Map() };
            courseEntry.assignmentsByName.set(key, entry);
        }
        return entry;
    }

    for (let rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line[0] === '#') continue;
        const cols = GH.parseCsvLine(line);
        if (cols.length < 5) continue;
        if (!headerSeen && /^section$/i.test(cols[0])) { headerSeen = true; continue; }
        headerSeen = true;

        const section = (cols[0] || '').trim().toUpperCase();
        const courseName = (cols[1] || '').trim();
        const assignmentName = (cols[2] || '').trim();
        const levelName = (cols[3] || '').trim();
        const comment = (cols[4] || '').trim();

        if (!courseName || !assignmentName) continue;
        if (!['FEEDBACK', 'LEVEL_COMMENT', 'NEXT_STEP'].includes(section)) continue;

        const courseEntry = getCourseEntry(courseName);
        const assignmentEntry = getAssignmentEntry(courseEntry, assignmentName);

        if (section === 'FEEDBACK') { if (comment) assignmentEntry.feedbacks.push(comment); }
        else if (section === 'NEXT_STEP') { if (comment) assignmentEntry.nextSteps.push(comment); }
        else if (section === 'LEVEL_COMMENT') {
            if (!levelName) continue;
            courseEntry.levelsSet.add(levelName);
            assignmentEntry.levelComments.set(levelName, comment);
        }
    }

    return coursesByName;
};

GH.applyMasterCsvToConfig = function (text, options) {
    const { scope = 'all', mode = 'replace', currentCourseName = null } = options || {};
    const parsed = GH.parseMasterCsv(text);
    if (!parsed.size) {
        alert('No valid rows found in the CSV. No changes were applied.');
        return { coursesTouched: 0, assignmentsTouched: 0, feedbackAdded: 0, levelCommentsUpdated: 0 };
    }

    function getOrCreateCourseByName(name) {
        const existing = GH.config.courses.find(c => (c.name || '').toLowerCase() === name.toLowerCase());
        if (existing) return existing;
        const course = { id: GH.uuid(), name: name, levels: GH.DEFAULT_LEVELS.slice(), assignments: [] };
        GH.config.courses.push(course);
        return course;
    }

    let coursesTouched = 0, assignmentsTouched = 0, feedbackAdded = 0, levelCommentsUpdated = 0;

    for (const [, courseEntry] of parsed.entries()) {
        const csvCourseName = courseEntry.name;
        if (scope === 'current') {
            if (!currentCourseName || csvCourseName.toLowerCase() !== currentCourseName.toLowerCase()) continue;
        }

        let course = getOrCreateCourseByName(csvCourseName);
        let courseLevelsFromCsv = courseEntry.levelsSet.size ? Array.from(courseEntry.levelsSet) : GH.DEFAULT_LEVELS.slice();

        if (mode === 'replace') {
            const newAssignments = [];
            for (const assignmentEntry of courseEntry.assignmentsByName.values()) {
                const lcObj = {};
                courseLevelsFromCsv.forEach(level => {
                    const text = assignmentEntry.levelComments.has(level) ? assignmentEntry.levelComments.get(level) : '';
                    lcObj[level] = text || '';
                    if ((text || '').trim()) levelCommentsUpdated++;
                });
                newAssignments.push({ id: GH.uuid(), name: assignmentEntry.name, feedback: assignmentEntry.feedbacks.slice(), nextSteps: assignmentEntry.nextSteps.slice(), levelComments: lcObj });
                assignmentsTouched++;
                feedbackAdded += assignmentEntry.feedbacks.length + assignmentEntry.nextSteps.length;
            }
            course.levels = courseLevelsFromCsv;
            course.assignments = newAssignments;
            coursesTouched++;
        } else {
            const existingLevels = Array.isArray(course.levels) && course.levels.length ? course.levels : GH.DEFAULT_LEVELS.slice();
            courseLevelsFromCsv.forEach(l => { if (!existingLevels.includes(l)) existingLevels.push(l); });
            course.levels = existingLevels;
            course.assignments = course.assignments || [];
            const existingAssignmentsByName = new Map();
            course.assignments.forEach(a => existingAssignmentsByName.set((a.name || '').toLowerCase(), a));

            for (const assignmentEntry of courseEntry.assignmentsByName.values()) {
                const key = assignmentEntry.name.toLowerCase();
                let assignment = existingAssignmentsByName.get(key);
                if (!assignment) {
                    const lcObj = {};
                    existingLevels.forEach(level => {
                        const fromCsv = assignmentEntry.levelComments.has(level) ? assignmentEntry.levelComments.get(level) : '';
                        lcObj[level] = fromCsv || '';
                        if ((fromCsv || '').trim()) levelCommentsUpdated++;
                    });
                    assignment = { id: GH.uuid(), name: assignmentEntry.name, feedback: assignmentEntry.feedbacks.slice(), nextSteps: assignmentEntry.nextSteps.slice(), levelComments: lcObj };
                    course.assignments.push(assignment);
                    existingAssignmentsByName.set(key, assignment);
                    coursesTouched++;
                    assignmentsTouched++;
                    feedbackAdded += assignmentEntry.feedbacks.length + assignmentEntry.nextSteps.length;
                } else {
                    assignmentsTouched++;
                    assignment.feedback = Array.isArray(assignment.feedback) ? assignment.feedback : [];
                    let existingSet = new Set(assignment.feedback.map(t => t.trim()));
                    assignmentEntry.feedbacks.forEach(text => {
                        const trimmed = (text || '').trim();
                        if (trimmed && !existingSet.has(trimmed)) { assignment.feedback.push(text); existingSet.add(trimmed); feedbackAdded++; }
                    });
                    assignment.nextSteps = Array.isArray(assignment.nextSteps) ? assignment.nextSteps : [];
                    const existingNextSet = new Set(assignment.nextSteps.map(t => t.trim()));
                    assignmentEntry.nextSteps.forEach(text => {
                        const trimmed = (text || '').trim();
                        if (trimmed && !existingNextSet.has(trimmed)) { assignment.nextSteps.push(text); existingNextSet.add(trimmed); feedbackAdded++; }
                    });
                    assignment.levelComments = (assignment.levelComments && typeof assignment.levelComments === 'object') ? assignment.levelComments : {};
                    existingLevels.forEach(level => {
                        const oldVal = assignment.levelComments[level] || '';
                        if (assignmentEntry.levelComments.has(level)) {
                            const newVal = assignmentEntry.levelComments.get(level) || '';
                            if (newVal !== oldVal) { assignment.levelComments[level] = newVal; levelCommentsUpdated++; }
                        } else if (!(level in assignment.levelComments)) {
                            assignment.levelComments[level] = oldVal || '';
                        }
                    });
                    coursesTouched++;
                }
            }
        }
    }

    GH.config.courses.forEach(c => {
        c.assignments = c.assignments || [];
        c.assignments.forEach(a => {
            if (!Array.isArray(a.feedback)) a.feedback = [];
            if (!Array.isArray(a.nextSteps)) a.nextSteps = [];
            if (!a.levelComments || typeof a.levelComments !== 'object') a.levelComments = {};
            const levels = Array.isArray(c.levels) && c.levels.length ? c.levels : GH.DEFAULT_LEVELS;
            levels.forEach(l => { if (typeof a.levelComments[l] !== 'string') a.levelComments[l] = ''; });
        });
    });

    return { coursesTouched, assignmentsTouched, feedbackAdded, levelCommentsUpdated };
};

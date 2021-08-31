import {
    Access,
    ElementFilter, FormFilter, FormStatus, GroupTagFilter, Role, TaskFilter, TextFilter, TimeFilter, UserFilter
} from './formapi.model';
/* eslint-disable max-lines,complexity */

/**
 * Creates query for form api
 * @param f Filter
 * @returns filter query
 */
export function FormFilterToString(f: FormFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = (f as { and: Array<FormFilter> }).and;
        if (and.length === 1) {
            return FormFilterToString(and[0]);
        }
        let out = '';
        for (const each of and) {
            if (out === '') {
                out = FormFilterToString(each);
            } else {
                out = out + ',' + FormFilterToString(each);
            }
        }
        return 'and(' + out + ')';
    } else if (f.hasOwnProperty('or')) {
        const or = (f as { or: Array<FormFilter> }).or;
        if (or.length === 1) {
            return FormFilterToString(or[0]);
        }
        let out = '';
        for (const each of or) {
            if (out === '') {
                out = FormFilterToString(each);
            } else {
                out = out + ',' + FormFilterToString(each);
            }
        }
        return 'or(' + out + ')';
    } else if (f.hasOwnProperty('not')) {
        return 'not(' + FormFilterToString((f as { not: FormFilter }).not) + ')';
    } else if (f.hasOwnProperty('id')) {
        return 'id=' + (f as { id: string }).id;
    } else if (f.hasOwnProperty('owner')) {
        return 'owner(' + UserFilterToString((f as { owner: UserFilter }).owner) + ')';
    } else if (f.hasOwnProperty('group')) {
        return 'group=' + TextFilterToString((f as { group: TextFilter }).group);
    } else if (f.hasOwnProperty('extract')) {
        return 'extract-' + TextFilterToString((f as { extract: TextFilter }).extract);
    } else if (f.hasOwnProperty('tag')) {
        return 'tag-' + TextFilterToString((f as { tag: TextFilter }).tag);
    } else if (f.hasOwnProperty('access')) {
        return 'access=' + (f as { access: Access }).access;
    } else if (f.hasOwnProperty('status')) {
        return 'status=' + (f as { status: FormStatus }).status;
    } else if (f.hasOwnProperty('created')) {
        return 'created-' + TimeFilterToString((f as { created: TimeFilter }).created);
    } else {
        return 'updated-' + TimeFilterToString((f as { updated: TimeFilter }).updated);
    }
}

/**
 * Creates query for form api
 * @param f Filter
 * @returns filter query
 */
export function TaskFilterToString(f: TaskFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = (f as { and: Array<TaskFilter> }).and;
        if (and.length === 1) {
            return TaskFilterToString(and[0]);
        }
        let out = '';
        for (const each of and) {
            if (out === '') {
                out = TaskFilterToString(each);
            } else {
                out = out + ',' + TaskFilterToString(each);
            }
        }
        return 'and(' + out + ')';
    } else if (f.hasOwnProperty('or')) {
        const or = (f as { or: Array<TaskFilter> }).or;
        if (or.length === 1) {
            return TaskFilterToString(or[0]);
        }
        let out = '';
        for (const each of or) {
            if (out === '') {
                out = TaskFilterToString(each);
            } else {
                out = out + ',' + TaskFilterToString(each);
            }
        }
        return 'or(' + out + ')';
    } else if (f.hasOwnProperty('not')) {
        return 'not(' + TaskFilterToString((f as { not: TaskFilter }).not) + ')';
    } else if (f.hasOwnProperty('id')) {
        return 'id=' + (f as { id: string }).id;
    } else if (f.hasOwnProperty('form')) {
        return 'form(' + FormFilterToString((f as { form: FormFilter }).form) + ')';
    } else if (f.hasOwnProperty('extract')) {
        return 'extract-' + TextFilterToString((f as { extract: TextFilter }).extract);
    } else if (f.hasOwnProperty('pin')) {
        return 'pin=' + (f as { pin: string }).pin;
    } else if (f.hasOwnProperty('description')) {
        return 'description-' + TextFilterToString((f as { description: TextFilter }).description);
    } else if (f.hasOwnProperty('status')) {
        return 'status=' + (f as { status: FormStatus }).status;
    } else if (f.hasOwnProperty('created')) {
        return 'created-' + TimeFilterToString((f as { created: TimeFilter }).created);
    } else {
        return 'updated-' + TimeFilterToString((f as { updated: TimeFilter }).updated);
    }
}

/**
 * Creates query for form api
 * @param f Filter
 * @returns filter query
 */
export function UserFilterToString(f: UserFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = (f as { and: Array<UserFilter> }).and;
        if (and.length === 1) {
            return UserFilterToString(and[0]);
        }
        let out = '';
        for (const each of and) {
            if (out === '') {
                out = UserFilterToString(each);
            } else {
                out = out + ',' + UserFilterToString(each);
            }
        }
        return 'and(' + out + ')';
    } else if (f.hasOwnProperty('or')) {
        const or = (f as { or: Array<UserFilter> }).or;
        if (or.length === 1) {
            return UserFilterToString(or[0]);
        }
        let out = '';
        for (const each of or) {
            if (out === '') {
                out = UserFilterToString(each);
            } else {
                out = out + ',' + UserFilterToString(each);
            }
        }
        return 'or(' + out + ')';
    } else if (f.hasOwnProperty('not')) {
        return 'not(' + UserFilterToString((f as { not: UserFilter }).not) + ')';
    } else if (f.hasOwnProperty('id')) {
        return 'id=' + (f as { id: string }).id;
    } else if (f.hasOwnProperty('name')) {
        return 'name-' + TextFilterToString((f as { name: TextFilter }).name);
    } else if (f.hasOwnProperty('role')) {
        return 'role=' + (f as { role: Role }).role;
    } else {
        return 'group-' + TextFilterToString((f as { group: TextFilter }).group);
    }
}

/**
 * Creates query for form api
 * @param f Filter
 * @returns filter query
 */
export function GroupTagFilterToString(f: GroupTagFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = (f as { and: Array<GroupTagFilter> }).and;
        if (and.length === 1) {
            return GroupTagFilterToString(and[0]);
        }
        let out = '';
        for (const each of and) {
            if (out === '') {
                out = GroupTagFilterToString(each);
            } else {
                out = out + ',' + GroupTagFilterToString(each);
            }
        }
        return 'and(' + out + ')';
    } else if (f.hasOwnProperty('or')) {
        const or = (f as { or: Array<GroupTagFilter> }).or;
        if (or.length === 1) {
            return GroupTagFilterToString(or[0]);
        }
        let out = '';
        for (const each of or) {
            if (out === '') {
                out = GroupTagFilterToString(each);
            } else {
                out = out + ',' + GroupTagFilterToString(each);
            }
        }
        return 'or(' + out + ')';
    } else if (f.hasOwnProperty('not')) {
        return 'not(' + UserFilterToString((f as { not: GroupTagFilter }).not) + ')';
    } else {
        return 'name-' + TextFilterToString((f as { name: TextFilter }).name);
    }
}

/**
 * Creates query for form api
 * @param f Filter
 * @returns filter query
 */
export function ElementFilterToString(f: ElementFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = (f as { and: Array<ElementFilter> }).and;
        if (and.length === 1) {
            return ElementFilterToString(and[0]);
        }
        let out = '';
        for (const each of and) {
            if (out === '') {
                out = ElementFilterToString(each);
            } else {
                out = out + ',' + ElementFilterToString(each);
            }
        }
        return 'and(' + out + ')';
    } else if (f.hasOwnProperty('or')) {
        const or = (f as { or: Array<ElementFilter> }).or;
        if (or.length === 1) {
            return ElementFilterToString(or[0]);
        }
        let out = '';
        for (const each of or) {
            if (out === '') {
                out = ElementFilterToString(each);
            } else {
                out = out + ',' + ElementFilterToString(each);
            }
        }
        return 'or(' + out + ')';
    } else if (f.hasOwnProperty('not')) {
        return 'not(' + ElementFilterToString((f as { not: ElementFilter }).not) + ')';
    } else if (f.hasOwnProperty('owner')) {
        return 'owner(' + UserFilterToString((f as { owner: UserFilter }).owner) + ')';
    } else if (f.hasOwnProperty('id')) {
        return 'id=' + (f as { id: string }).id;
    } else if (f.hasOwnProperty('extract')) {
        return 'extract' + TextFilterToString((f as { extract: TextFilter }).extract);
    } else if (f.hasOwnProperty('group')) {
        return 'group' + TextFilterToString((f as { group: TextFilter }).group);
    } else if (f.hasOwnProperty('created')) {
        return 'created-' + TimeFilterToString((f as { created: TimeFilter }).created);
    } else {
        return 'updated-' + TimeFilterToString((f as { updated: TimeFilter }).updated);
    }
}

/**
 * Creates query for form api
 * @param f Filter
 * @returns filter query
 */
export function TextFilterToString(f: TextFilter): string {
    if (f.hasOwnProperty('contains')) {
        f = f as { lower: boolean; contains: string; };
        return (f.lower ? 'lower-' : '') + 'contains=' + f['contains'];
    }
    f = f as { lower: boolean; equals: string; };
    return (f.lower ? 'lower-' : '') + 'equals=' + f['equals'];
}

/**
 * Creates query for form api
 * @param f Filter
 * @returns filter query
 */
export function TimeFilterToString(f: TimeFilter): string {
    if (f.hasOwnProperty('after')) {
        f = f as { after: string; };
        return 'after=' + f['after'];
    }
    f = f as { before: string; };
    return 'before=' + f['before'];
}

/**
 * Creates query for form api
 * @param s Sort config
 * @param s.field Field to sort
 * @param s.desc Order of sorting
 * @returns Sort query
 */
export function SortToString(s: {
    field: string;
    desc: boolean;
}): string {
    return (s.desc ? '-' : '') + s.field;
}

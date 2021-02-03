import {
    ElementFilter, FormFilter, GroupTagFilter, TaskFilter, TextFilter, TimeFilter, UserFilter
} from './formapi.model';

/* eslint-disable-next-line complexity */
export function FormFilterToString(f: FormFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = f['and'] as Array<FormFilter>;
        if (f['and'].length === 1) {
            return FormFilterToString(f['and'][0]);
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
        const or = f['or'] as Array<FormFilter>;
        if (f['or'].length === 1) {
            return FormFilterToString(f['or'][0]);
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
        return 'not(' + FormFilterToString(f['not']) + ')';
    } else if (f.hasOwnProperty('id')) {
        return 'id=' + f['id'];
    } else if (f.hasOwnProperty('owner')) {
        return 'owner(' + UserFilterToString(f['owner']) + ')';
    } else if (f.hasOwnProperty('group')) {
        return 'group=' + TextFilterToString(f['group']);
    } else if (f.hasOwnProperty('extract')) {
        return 'extract-' + TextFilterToString(f['extract']);
    } else if (f.hasOwnProperty('tag')) {
        return 'tag-' + TextFilterToString(f['tag']);
    } else if (f.hasOwnProperty('access')) {
        return 'access=' + f['access'];
    } else if (f.hasOwnProperty('status')) {
        return 'status=' + f['status'];
    } else if (f.hasOwnProperty('created')) {
        return 'created-' + TimeFilterToString(f['created']);
    } else {
        return 'updated-' + TimeFilterToString(f['updated']);
    };
}

/* eslint-disable-next-line complexity */
export function TaskFilterToString(f: TaskFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = f['and'] as Array<TaskFilter>;
        if (f['and'].length === 1) {
            return TaskFilterToString(f['and'][0]);
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
        const or = f['or'] as Array<TaskFilter>;
        if (f['or'].length === 1) {
            return TaskFilterToString(f['or'][0]);
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
        return 'not(' + TaskFilterToString(f['not']) + ')';
    } else if (f.hasOwnProperty('id')) {
        return 'id=' + f['id'];
    } else if (f.hasOwnProperty('form')) {
        return 'form(' + FormFilterToString(f['form']) + ')';
    } else if (f.hasOwnProperty('extract')) {
        return 'extract-' + TextFilterToString(f['extract']);
    } else if (f.hasOwnProperty('pin')) {
        return 'pin=' + f['pin'];
    } else if (f.hasOwnProperty('description')) {
        return 'description-' + TextFilterToString(f['description']);
    } else if (f.hasOwnProperty('status')) {
        return 'status=' + f['status'];
    } else if (f.hasOwnProperty('created')) {
        return 'created-' + TimeFilterToString(f['created']);
    } else {
        return 'updated-' + TimeFilterToString(f['updated']);
    }
}

/* eslint-disable-next-line complexity */
export function UserFilterToString(f: UserFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = f['and'] as Array<UserFilter>;
        if (f['and'].length === 1) {
            return UserFilterToString(f['and'][0]);
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
        const or = f['or'] as Array<UserFilter>;
        if (f['or'].length === 1) {
            return UserFilterToString(f['or'][0]);
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
        return 'not(' + UserFilterToString(f['not']) + ')';
    } else if (f.hasOwnProperty('id')) {
        return 'id=' + f['id'];
    } else if (f.hasOwnProperty('name')) {
        return 'name-' + TextFilterToString(f['name']);
    } else if (f.hasOwnProperty('role')) {
        return 'role=' + f['role'];
    } else {
        return 'group-' + TextFilterToString(f['group']);
    }
}

/* eslint-disable-next-line complexity */
export function GroupTagFilterToString(f: GroupTagFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = f['and'] as Array<GroupTagFilter>;
        if (f['and'].length === 1) {
            return GroupTagFilterToString(f['and'][0]);
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
        const or = f['or'] as Array<GroupTagFilter>;
        if (f['or'].length === 1) {
            return GroupTagFilterToString(f['or'][0]);
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
        return 'not(' + UserFilterToString(f['not']) + ')';
    } else {
        return 'name-' + TextFilterToString(f['name']);
    }
}

/* eslint-disable-next-line complexity */
export function ElementFilterToString(f: ElementFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = f['and'] as Array<ElementFilter>;
        if (f['and'].length === 1) {
            return ElementFilterToString(f['and'][0]);
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
        const or = f['or'] as Array<ElementFilter>;
        if (f['or'].length === 1) {
            return ElementFilterToString(f['or'][0]);
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
        return 'not(' + ElementFilterToString(f['not']) + ')';
    } else if (f.hasOwnProperty('owner')) {
        return 'owner(' + UserFilterToString(f['owner']) + ')';
    } else if (f.hasOwnProperty('id')) {
        return 'id=' + f['id'];
    } else if (f.hasOwnProperty('extract')) {
        return 'extract' + TextFilterToString(f['extract']);
    } else if (f.hasOwnProperty('group')) {
        return 'group' + TextFilterToString(f['group']);
    } else if (f.hasOwnProperty('created')) {
        return 'created-' + TimeFilterToString(f['created']);
    } else {
        return 'updated-' + TimeFilterToString(f['updated']);
    }
}

export function TextFilterToString(f: TextFilter): string {
    if (f.hasOwnProperty('contains')) {
        return (f.lower ? 'lower-' : '') + 'contains=' + f['contains'];
    }
    return (f.lower ? 'lower-' : '') + 'equals=' + f['equals'];
}

export function TimeFilterToString(f: TimeFilter): string {
    if (f.hasOwnProperty('after')) {
        return 'after=' + f['after'];
    }
    return 'before=' + f['before'];
}

export function SortToString(s: {
    field: string;
    desc: boolean;
}): string {
    return (s.desc ? '-' : '') + s.field;
}

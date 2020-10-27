import {
    ElementFilter, FormFilter, NumberFilter,
    Order, PathFilter, TaskFilter, TextFilter, TimeFilter, UserFilter
} from './formapi.model';

// tslint:disable-next-line: cyclomatic-complexity
// tslint:disable-next-line: max-func-body-length
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
    }
    if (f.hasOwnProperty('or')) {
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
    }
    if (f.hasOwnProperty('not')) {
        return 'not(' + FormFilterToString(f['not']) + ')';
    }
    if (f.hasOwnProperty('id')) {
        return 'id=' + f['id'];
    }
    if (f.hasOwnProperty('has-owner-with')) {
        return 'has-owner-with(' + UserFilterToString(f['has-owner-with']) + ')';
    }
    if (f.hasOwnProperty('group')) {
        return 'group=' + f['group'];
    }
    if (f.hasOwnProperty('group-permission')) {
        return 'group-permission=' + f['group-permission'];
    }
    if (f.hasOwnProperty('other-permission')) {
        return 'other-permission=' + f['other-permission'];
    }
    if (f.hasOwnProperty('content')) {
        return 'content.' + PathFilterToString(f['content']);
    }
    if (f.hasOwnProperty('tag')) {
        return 'tag-' + TextFilterToString(f['tag']);
    }
    if (f.hasOwnProperty('access')) {
        return 'access=' + f['access'];
    }
    if (f.hasOwnProperty('status')) {
        return `status=${f['status']}`;
    }
    if (f.hasOwnProperty('created')) {
        return 'created-' + TimeFilterToString(f['created']);
    }
    if (f.hasOwnProperty('updated')) {
        return 'updated-' + TimeFilterToString(f['updated']);
    }
    return '';
}

// tslint:disable-next-line: max-func-body-length
// tslint:disable-next-line: cyclomatic-complexity
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
    }
    if (f.hasOwnProperty('or')) {
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
    }
    if (f.hasOwnProperty('not')) {
        return 'not(' + TaskFilterToString(f['not']) + ')';
    }
    if (f.hasOwnProperty('id')) {
        return 'id=' + f['id'];
    }
    if (f.hasOwnProperty('has-form-with')) {
        return 'has-form-with(' + FormFilterToString(f['has-form-with']) + ')';
    }
    if (f.hasOwnProperty('content')) {
        return 'content.' + PathFilterToString(f['content']);
    }
    if (f.hasOwnProperty('pin')) {
        return 'pin=' + f['pin'];
    }
    if (f.hasOwnProperty('description')) {
        return 'description-' + TextFilterToString(f['description']);
    }
    if (f.hasOwnProperty('status')) {
        return 'status=' + f['status'];
    }
    if (f.hasOwnProperty('created')) {
        return 'created-' + TimeFilterToString(f['created']);
    }
    if (f.hasOwnProperty('updated')) {
        return 'updated-' + TimeFilterToString(f['updated']);
    }
    return '';
}

// tslint:disable-next-line: max-func-body-length
// tslint:disable-next-line: cyclomatic-complexity
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
    }
    if (f.hasOwnProperty('or')) {
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
    }
    if (f.hasOwnProperty('not')) {
        return 'not(' + UserFilterToString(f['not']) + ')';
    }
    if (f.hasOwnProperty('id')) {
        return 'id=' + f['id'];
    }
    if (f.hasOwnProperty('name')) {
        return 'name-' + TextFilterToString(f['name']);
    }
    if (f.hasOwnProperty('given-name')) {
        return 'given-name-' + TextFilterToString(f['given-name']);
    }
    if (f.hasOwnProperty('family-name')) {
        return 'family-name-' + TextFilterToString(f['family-name']);
    }
    if (f.hasOwnProperty('group')) {
        return 'group-' + TextFilterToString(f['group']);
    }
    return '';
}

// tslint:disable-next-line: max-func-body-length
// tslint:disable-next-line: cyclomatic-complexity
export function ElementFilterToString(f: ElementFilter): string {
    if (f.hasOwnProperty('and')) {
        const and = f['and'] as Array<ElementFilter>;
        let out = '';
        for (const each of and) {
            if (out === '') {
                out = ElementFilterToString(each);
            } else {
                out = out + ',' + ElementFilterToString(each);
            }
        }
        return 'and(' + out + ')';
    }
    if (f.hasOwnProperty('or')) {
        const or = f['or'] as Array<ElementFilter>;
        let out = '';
        for (const each of or) {
            if (out === '') {
                out = ElementFilterToString(each);
            } else {
                out = out + ',' + ElementFilterToString(each);
            }
        }
        return 'or(' + out + ')';
    }
    if (f.hasOwnProperty('not')) {
        return 'not(' + ElementFilterToString(f['not']) + ')';
    }
    if (f.hasOwnProperty('id')) {
        return 'id=' + f['id'];
    }
    if (f.hasOwnProperty('content')) {
        return 'content.' + PathFilterToString(f['content']);
    }
    if (f.hasOwnProperty('created')) {
        return 'created-' + TimeFilterToString(f['created']);
    }
    if (f.hasOwnProperty('updated')) {
        return 'updated-' + TimeFilterToString(f['updated']);
    }
    return '';
}

export function TextFilterToString(f: TextFilter): string {
    if (f.hasOwnProperty('equals')) {
        return (f.lower ? 'lower-' : '') + 'equals=' + f['equals'];
    }
    if (f.hasOwnProperty('contains')) {
        return (f.lower ? 'lower-' : '') + 'contains=' + f['contains'];
    }
    return '';
}

export function NumberFilterToString(f: NumberFilter): string {
    if (f.hasOwnProperty('equals')) {
        return 'equals=' + f['equals'];
    }
    if (f.hasOwnProperty('greater')) {
        return 'greater=' + f['greater'];
    }
    if (f.hasOwnProperty('less')) {
        return 'less=' + f['less'];
    }
    return '';
}

export function TimeFilterToString(f: TimeFilter): string {
    if (f.hasOwnProperty('after')) {
        return 'after=' + f['after'];
    }
    if (f.hasOwnProperty('before')) {
        return 'before=' + f['before'];
    }
    return '';
}

export function PathFilterToString(f: PathFilter): string {
    if (f.hasOwnProperty('text')) {
        return f.path.join('.') + '-text-' + TextFilterToString(f['text']);
    }
    if (f.hasOwnProperty('number')) {
        return f.path.join('.') + '-number-' + NumberFilterToString(f['number']);
    }
    return '';
}

export function SortToString(s: {
    orderBy: {
        field: string,
        path?: Array<string>,
    };
    alternative?: {
        field: string,
        path?: Array<string>,
    };
    order: Order;
}): string {
    if (s.alternative) {
        return (s.order === 'desc' ? '-' : '') + '(' +
            OrderByToString(s.orderBy) + ',' + OrderByToString(s.alternative) + ')';
    }
    return (s.order === 'desc' ? '-' : '') + OrderByToString(s.orderBy);
}

export function OrderByToString(o: { field: string, path?: Array<string> }): string {
    return o.field + (o.path && o.path.length > 0 ? '.' + o.path.join('.') : '');
}

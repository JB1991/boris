export interface Form {
    id?: string;
    content?: any;
    tags?: Array<string>;
    access?: Access;
    owner?: string;
    group?: string;
    'group-permissions'?: Array<Permission>;
    'other-permissions'?: Array<Permission>;
    status?: FormStatus;
    created?: string;
    updated?: string;
    extra?: string;
}

export interface Task {
    id?: string;
    form?: string;
    content?: any;
    pin?: string;
    description?: string;
    status?: TaskStatus;
    created?: string;
    updated?: string;
    extra?: string;
}

export interface Element {
    id?: string;
    owner?: string;
    content?: any;
    created?: string;
    updated?: string;
    extra?: string;
}

export interface User {
    id?: string;
    name?: string;
    'given-name'?: string;
    'family-name'?: string;
    groups?: Array<string>;
}

export interface PublicForm {
    id?: string;
    content?: any;
    tags?: Array<string>;
    access?: Access;
    extra?: string;
}

export interface PublicTask {
    id?: string;
    form?: string;
    content?: any;
    extra?: string;
}

export type FormFilter =
    | {
        and: Array<FormFilter>;
    }
    | {
        or: Array<FormFilter>;
    }
    | {
        not: FormFilter;
    }
    | {
        id: string;
    }
    | {
        group: string;
    }
    | {
        'group-permission': Permission;
    }
    | {
        'other-permission': Permission;
    }
    | {
        content: PathFilter;
    }
    | {
        tag: TextFilter;
    }
    | {
        access: Access;
    }
    | {
        status: FormStatus;
    }
    | {
        created: TimeFilter;
    }
    | {
        updated: TimeFilter;
    }
    | {
        'has-owner-with': UserFilter;
    };

export type PublicFormFilter =
    | {
        and: Array<FormFilter>;
    }
    | {
        or: Array<FormFilter>;
    }
    | {
        not: FormFilter;
    }
    | {
        id: string;
    }
    | {
        content: PathFilter;
    }
    | {
        tag: TextFilter;
    }
    | {
        access: Access;
    };

export type TaskFilter =
    | {
        and: Array<TaskFilter>;
    }
    | {
        or: Array<TaskFilter>;
    }
    | {
        not: TaskFilter;
    }
    | {
        id: string;
    }
    | {
        content: PathFilter;
    }
    | {
        pin: string;
    }
    | {
        description: TextFilter;
    }
    | {
        status: FormStatus;
    }
    | {
        created: TimeFilter;
    }
    | {
        updated: TimeFilter;
    }
    | {
        'has-form-with': FormFilter;
    };

export type UserFilter =
    | {
        and: Array<UserFilter>;
    }
    | {
        or: Array<UserFilter>;
    }
    | {
        not: UserFilter;
    }
    | {
        id: string;
    }
    | {
        name: TextFilter;
    }
    | {
        'given-name': TextFilter;
    }
    | {
        'family-name': TextFilter;
    }
    | {
        group: TextFilter;
    };

export type ElementFilter =
    | {
        and: Array<ElementFilter>;
    }
    | {
        or: Array<ElementFilter>;
    }
    | {
        not: ElementFilter;
    }
    | {
        id: string;
    }
    | {
        content: PathFilter;
    }
    | {
        created: TimeFilter;
    }
    | {
        updated: TimeFilter;
    };

export type PathFilter =
    | {
        path: Array<string>;
        number: NumberFilter;
    }
    | {
        path: Array<string>;
        text: TextFilter;
    };

export type NumberFilter =
    | {
        equals: number;
    }
    | {
        greater: number;
    }
    | {
        less: number;
    };

export type TextFilter =
    | {
        lower: boolean;
        equals: string;
    }
    | {
        lower: boolean;
        contains: string;
    };

export type TimeFilter =
    | {
        after: string;
    }
    | {
        before: string;
    };

export interface FormSort {
    orderBy: FormOrderBy;
    alternative?: FormOrderBy;
    order: Order;
}

export interface PublicFormOrderBy {
    field: PublicFormSortField;
    path?: Array<string>;
}

export interface PublicFormSort {
    orderBy: PublicFormOrderBy;
    alternative?: PublicFormOrderBy;
    order: Order;
}

export interface FormOrderBy {
    field: FormSortField;
    path?: Array<string>;
}

export interface TaskSort {
    orderBy: TaskOrderBy;
    alternative?: TaskOrderBy;
    order: Order;
}

export interface TaskOrderBy {
    field: TaskSortField;
    path?: Array<string>;
}

export interface PublicTaskSort {
    orderBy: PublicTaskOrderBy;
    alternative?: PublicTaskOrderBy;
    order: Order;
}

export interface PublicTaskOrderBy {
    field: PublicTaskSortField;
    path?: Array<string>;
}

export interface ElementSort {
    orderBy: ElementOrderBy;
    alternative?: ElementOrderBy;
    order: Order;
}

export interface ElementOrderBy {
    field: ElementSortField;
    path?: Array<string>;
}

export type Access = 'public' | 'pin6' | 'pin8';
export type Permission = 'read-form' | 'update-form' | 'create-task' | 'read-task' | 'update-task' | 'delete-task';
export type FormStatus = 'created' | 'published' | 'cancelled';
export type TaskStatus = 'created' | 'accessed' | 'submitted' | 'completed';
export type FormField = 'all' | 'id' | 'owner' | 'content' | 'tags' | 'access' | 'group' | 'group-permissions' | 'other-permissions' | 'status' | 'created' | 'updated';
export type PublicFormField = 'all' | 'id' | 'content' | 'tags' | 'access';
export type UserField = 'all' | 'id' | 'name' | 'given-name' | 'family-name' | 'groups';
export type TaskField = 'all' | 'id' | 'form' | 'content' | 'pin' | 'description' | 'status' | 'created' | 'updated';
export type PublicTaskField = 'all' | 'id' | 'form' | 'content';
export type ElementField = 'all' | 'id' | 'content' | 'created' | 'updated';

export type Order = 'asc' | 'desc';
export type FormSortField = 'id' | 'content' | 'tags' | 'access' | 'group' | 'status' | 'created' | 'updated' | 'owner.id' | 'owner.name' | 'owner.given-name' | 'owner.family-name' | 'owner.groups';
export type TaskSortField = 'id' | 'form' | 'content' | 'pin' | 'description' | 'status' | 'created' | 'updated' | 'form.id' | 'form.content' | 'form.tags' | 'form.access' | 'form.group' | 'form.status' | 'form.created' | 'form.updated' | 'owner.id' | 'owner.name' | 'owner.given-name' | 'owner.family-name' | 'owner.groups';
export type ElementSortField = 'id' | 'content' | 'created' | 'updated';
export type PublicFormSortField = 'id' | 'content' | 'tags' | 'access';
export type PublicTaskSortField = 'id' | 'form' | 'content';

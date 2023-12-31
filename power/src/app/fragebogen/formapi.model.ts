export interface Form {
    id: string;
    owner?: User;
    groups?: string[];
    tags?: string[];
    extract?: string;
    content?: any;
    access?: Access;
    status?: FormStatus;
    created?: string;
    updated?: string;
}

export interface Task {
    id: string;
    form?: Form;
    content?: any;
    pin?: string;
    description?: string;
    status?: TaskStatus;
    created?: string;
    updated?: string;
    extract?: string;
}

export interface Element {
    id: string;
    owner?: string;
    groups?: string[];
    content?: any;
    created?: string;
    updated?: string;
    extract?: string;
}

export interface User {
    id: string;
    name?: string;
    role?: string;
    groups?: string[];
}

export interface PublicForm {
    id: string;
    content?: any;
    tags?: string[];
    access?: Access;
    extract?: string;
}

export interface PublicTask {
    id: string;
    form?: PublicForm;
    content?: any;
    extract?: string;
}

export type FormFilter =
    | {
        and: FormFilter[];
    }
    | {
        or: FormFilter[];
    }
    | {
        not: FormFilter;
    }
    | {
        owner: UserFilter;
    }
    | {
        id: string;
    }
    | {
        group: TextFilter;
    }
    | {
        extract: TextFilter;
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
    };

export type PublicFormFilter =
    | {
        and: FormFilter[];
    }
    | {
        or: FormFilter[];
    }
    | {
        not: FormFilter;
    }
    | {
        id: string;
    }
    | {
        extract: TextFilter;
    }
    | {
        tag: TextFilter;
    }
    | {
        access: Access;
    };

export type TaskFilter =
    | {
        and: TaskFilter[];
    }
    | {
        or: TaskFilter[];
    }
    | {
        not: TaskFilter;
    }
    | {
        form: FormFilter;
    }
    | {
        id: string;
    }
    | {
        extract: TextFilter;
    }
    | {
        pin: string;
    }
    | {
        description: TextFilter;
    }
    | {
        status: TaskStatus;
    }
    | {
        created: TimeFilter;
    }
    | {
        updated: TimeFilter;
    };

export type UserFilter =
    | {
        and: UserFilter[];
    }
    | {
        or: UserFilter[];
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
        role: Role;
    }
    | {
        group: TextFilter;
    };

export type ElementFilter =
    | {
        and: ElementFilter[];
    }
    | {
        or: ElementFilter[];
    }
    | {
        not: ElementFilter;
    }
    | {
        owner: UserFilter;
    }
    | {
        id: string;
    }
    | {
        group: TextFilter;
    }
    | {
        extract: TextFilter;
    }
    | {
        created: TimeFilter;
    }
    | {
        updated: TimeFilter;
    };

export type GroupTagFilter =
    | {
        and: GroupTagFilter[];
    }
    | {
        or: GroupTagFilter[];
    }
    | {
        not: GroupTagFilter;
    } | {
        name: TextFilter;
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

export interface UserSort {
    field: UserField;
    desc: boolean;
}

export interface FormSort {
    field: FormField;
    desc: boolean;
}

export interface PublicFormSort {
    field: PublicFormField;
    desc: boolean;
}

export interface TaskSort {
    field: TaskField;
    desc: boolean;
}

export interface ElementSort {
    field: ElementField;
    desc: boolean;
}

export type Role = 'admin' | 'manager' | 'editor' | 'user';
export type Access = 'public' | 'pin6' | 'pin8';
export type FormStatus = 'created' | 'published' | 'cancelled';
export type TaskStatus = 'created' | 'accessed' | 'submitted' | 'completed';
export type FormField = 'id' | 'owner.id' | 'owner.name' | 'owner.role' | 'owner.groups' |
    'groups' | 'tags' | 'extract' | 'content' | 'access' | 'status' | 'created' | 'updated';
export type PublicFormField = 'id' | 'content' | 'tags' | 'access' | 'extract';
export type UserField = 'id' | 'name' | 'role' | 'groups';
export type TaskField = 'id' | 'form.id' | 'form.owner.id' | 'form.owner.name' | 'form.owner.role' |
    'form.owner.groups' | 'form.groups' | 'form.tags' | 'form.extract' | 'form.access' | 'form.status' |
    'form.created' | 'form.updated' | 'content' | 'extract' | 'pin' | 'description' | 'status' | 'created' | 'updated';
export type PublicTaskField = 'id' | 'form.id' | 'form.content' | 'form.tags' | 'form.access' | 'form.extract' | 'content';
export type ElementField = 'id' | 'owner.id' | 'owner.name' | 'owner.role' | 'owner.groups' |
    'groups' | 'extract' | 'content' | 'created' | 'updated';

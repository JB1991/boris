/**
 * surveyjs style object for bootstrap 4
 */
export const Bootstrap4_CSS = {
    root: 'sv_main sv_bootstrap_css',
    container: 'sv_container card',
    header: 'panel-heading card-header',
    body: 'panel-body',
    bodyEmpty: 'panel-body sv_body_empty',
    footer: 'panel-footer card-footer',
    title: 'h3',
    description: 'font-weight-light formular-description',
    logo: 'sv_logo',
    logoImage: 'sv_logo__image',
    headerText: 'sv_header__text',
    navigationButton: '',
    completedPage: 'card-body',
    navigation: {
        complete: 'btn btn-success',
        prev: 'btn btn-primary',
        next: 'btn btn-primary',
        start: 'btn btn-success',
        preview: 'btn btn-primary',
        edit: 'btn btn-primary',
    },
    progress: 'progress m-4',
    progressBar: 'progress-bar m-0',
    progressText: '',
    progressTextInBar: '',
    progressTextUnderBar: 'sv-hidden',
    page: {
        root: 'card-body p-1 p-lg-3',
        title: 'h4',
        description: 'font-weight-light mb-4'
    },
    pageTitle: 'nolist h4',
    pageDescription: 'font-weight-light hassubtext',
    row: 'sv_row mb-3',
    question: {
        mainRoot: 'sv_qstn',
        flowRoot: 'sv_q_flow sv_qstn',
        header: '',
        headerLeft: 'title-left',
        content: 'p-1',
        contentLeft: 'content-left',
        titleLeftRoot: 'sv_qstn_left',
        title: 'h5',
        number: 'sv_q_num',
        description: 'font-weight-light mb-1',
        descriptionUnderInput: 'small',
        requiredText: 'sv_q_required_text',
        comment: 'form-control',
        required: '',
        titleRequired: '',
        hasError: 'has-error',
        indent: 20,
        formGroup: 'form-group m-0'
    },
    panel: {
        title: 'sv_p_title',
        titleExpandable: 'sv_p_title_expandable',
        icon: 'sv_panel_icon',
        iconExpanded: 'sv_expanded',
        description: 'small sv_p_description',
        container: 'sv_p_container',
        footer: 'sv_p_footer',
    },
    error: {
        root: 'alert alert-danger',
        icon: 'fas fa-exclamation-triangle fa-fw',
        item: '',
        locationTop: 'sv_qstn_error_top',
        locationBottom: 'sv_qstn_error_bottom'
    },
    boolean: {
        root: 'sv_qbln checkbox',
        item: 'sv-boolean',
        control: 'sv-visuallyhidden',
        itemChecked: 'sv-boolean--checked checked',
        itemIndeterminate: 'sv-boolean--indeterminate',
        itemDisabled: 'sv-boolean--disabled',
        switch: 'sv-boolean__switch',
        slider: 'sv-boolean__slider',
        label: 'sv-boolean__label ',
        disabledLabel: 'sv-boolean__label--disabled',
    },
    checkbox: {
        root: 'sv_qcbc sv_qcbx',
        item: 'custom-control custom-checkbox',
        itemChecked: 'checked',
        itemInline: '',
        itemControl: 'custom-control-input',
        itemDecorator: 'sv-hidden',
        label: 'sv_q_checkbox_label',
        labelChecked: '',
        controlLabel: 'custom-control-label',
        materialDecorator: 'checkbox-material',
        other: 'sv_q_checkbox_other form-control',
        column: 'sv_q_select_column'
    },
    comment: 'form-control',
    html: {
        root: ''
    },
    image: {
        root: 'sv_q_image',
        image: 'sv_image_image'
    },
    matrix: {
        root: 'sv_q_matrix table table-hover',
        label: 'sv_q_m_label w-25',
        itemChecked: 'checked',
        itemDecorator: 'sv-hidden',
        cellText: 'sv_q_m_cell_text',
        cellTextSelected: 'sv_q_m_cell_selected bg-primary',
        cellLabel: 'sv_q_m_cell_label'
    },
    multipletext: {
        root: 'table',
        itemTitle: '',
        itemValue: 'sv_q_mt_item_value form-control',
    },
    radiogroup: {
        root: 'sv_qcbc',
        item: 'sv_q_radiogroup custom-control custom-radio',
        itemChecked: 'checked',
        itemInline: 'sv_q_radiogroup_inline',
        label: 'sv_q_radiogroup_label',
        labelChecked: '',
        itemControl: 'custom-control-input',
        itemDecorator: 'sv-hidden',
        controlLabel: 'custom-control-label',
        materialDecorator: 'circle',
        other: 'form-control',
        clearButton: 'btn btn-danger',
        column: 'sv_q_select_column'
    },
    imagepicker: {
        root: 'sv_imgsel',
        item: 'sv_q_imgsel',
        itemChecked: 'checked imagepicker-checked',
        itemInline: 'sv_q_imagepicker_inline',
        label: 'sv_q_imgsel_label',
        itemControl: 'sv_q_imgsel_control_item',
        image: 'sv_q_imgsel_image',
        itemText: 'sv_q_imgsel_text font-weight-light',
        other: 'form-control',
        clearButton: 'sv_q_radiogroup_clear btn btn-danger',
    },
    rating: {
        root: 'btn-group',
        item: 'btn btn-default btn-primary',
        selected: 'active',
        minText: 'sv_q_rating_min_text',
        itemText: 'sv_q_rating_item_text',
        maxText: 'sv_q_rating_max_text',
        disabled: '',
        other: 'form-control',
    },
    text: 'form-control',
    expression: 'form-control',
    file: {
        root: 'sv_q_file',
        placeholderInput: 'sv_q_file_placeholder',
        preview: 'sv_q_file_preview',
        removeButton: 'sv_q_file_remove_button',
        fileInput: 'sv_q_file_input',
        removeFile: 'sv_q_file_remove',
        removeFileSvg: 'sv-hidden',
        fileDecorator: 'sv-hidden',
        fileSignBottom: 'sv-hidden',
        removeButtonBottom: 'sv-hidden',
    },
    nouislider: {
        other: 'form-control',
    },
    signaturepad: {
        root: 'sv_q_signaturepad sjs_sp_container',
        controls: 'sjs_sp_controls',
        clearButton: 'sjs_sp_clear',
    },
    saveData: {
        root: '',
        saving: 'alert alert-info m-4',
        error: 'alert alert-danger m-4',
        success: 'alert alert-success m-4',
        saveAgainButton: 'btn btn-warning mt-2 d-block'
    }
};
/* vim: set expandtab ts=4 sw=4 sts=4: */

/**
 * surveyjs style object for bootstrap 4
 */
export const Bootstrap4_CSS = {
  root: 'sv_main sv_default_css',
  container: 'sv_container card',
  header: 'sv_header',
  body: 'sv_body',
  bodyEmpty: 'sv_body sv_body_empty',
  footer: 'sv_nav card-footer',
  title: 'd-block card-header h3',
  description: 'font-weight-light formular-description',
  navigationButton: '',
  completedPage: 'sv_completed_page card-body',
  navigation: {
    complete: 'sv_complete_btn btn btn-success',
    prev: 'sv_prev_btn btn btn-primary',
    next: 'sv_next_btn btn btn-primary',
    start: 'sv_start_btn btn btn-success'
  },
  progress: 'sv_progress m-4 progress',
  progressBar: 'sv_progress_bar progress-bar m-0',
  progressTextInBar: '',
  page: {
    root: 'sv_p_rootroot card-body p-3',
    title: 'h4',
    description: 'font-weight-light mb-4'
  },
  pageTitle: 'sv_page_title nolist h4',
  pageDescription: 'font-weight-light hassubtext',
  row: 'sv_row',
  question: {
    mainRoot: 'sv_q sv_qstn mb-3 p-1',
    flowRoot: 'sv_q_flow sv_qstn',
    header: '',
    headerLeft: 'title-left',
    content: '',
    contentLeft: 'content-left',
    titleLeftRoot: 'sv_qstn_left',
    requiredText: 'sv_q_required_text',
    title: 'sv_q_title h5',
    number: 'sv_q_num',
    description: 'sv_q_description font-weight-light mb-1',
    comment: 'form-control',
    required: '',
    titleRequired: '',
    hasError: '',
    indent: 20,
    footer: 'sv_q_footer',
    formGroup: 'form-group m-0'
  },
  panel: {
    title: 'sv_p_title',
    titleExpandable: 'sv_p_title_expandable',
    icon: 'sv_panel_icon',
    iconExpanded: 'sv_expanded',
    description: 'sv_p_description',
    container: 'sv_p_container'
  },
  error: {
    root: 'sv_q_erbox alert alert-danger',
    icon: 'fas fa-exclamation-triangle fa-fw',
    item: '',
    locationTop: 'sv_qstn_error_top',
    locationBottom: 'sv_qstn_error_bottom'
  },
  checkbox: {
    root: 'sv_qcbc sv_qcbx',
    item: 'sv_q_checkbox custom-control custom-checkbox',
    itemChecked: 'checked',
    itemInline: 'sv_q_checkbox_inline',
    label: 'sv_q_checkbox_label',
    labelChecked: '',
    itemControl: 'sv_q_checkbox_control_item custom-control-input',
    itemDecorator: 'sv-hidden',
    controlLabel: 'sv_q_checkbox_control_label custom-control-label',
    materialDecorator: 'checkbox-material',
    other: 'sv_q_other sv_q_checkbox_other form-control',
    column: 'sv_q_select_column'
  },
  comment: 'form-control',
  matrix: {
    root: 'sv_q_matrix table table-hover',
    label: 'sv_q_m_label w-25',
    itemChecked: 'checked',
    itemDecorator: 'sv-hidden',
    cellText: 'sv_q_m_cell_text',
    cellTextSelected: 'sv_q_m_cell_selected',
    cellLabel: 'sv_q_m_cell_label'
  },
  radiogroup: {
    root: 'sv_qcbc',
    item: 'sv_q_radiogroup custom-control custom-radio',
    itemChecked: 'checked',
    itemInline: 'sv_q_radiogroup_inline',
    itemDecorator: 'sv-hidden',
    label: 'sv_q_radiogroup_label',
    labelChecked: '',
    itemControl: 'sv_q_radiogroup_control_item custom-control-input',
    controlLabel: 'custom-control-label',
    materialDecorator: 'circle',
    other: 'sv_q_other sv_q_radiogroup_other form-control',
    clearButton: 'sv_q_radiogroup_clear',
    column: 'sv_q_select_column'
  },
  imagepicker: {
    root: 'sv_imgsel',
    item: 'sv_q_imgsel',
    itemChecked: 'checked imagepicker-checked',
    label: 'sv_q_imgsel_label',
    itemControl: 'sv_q_imgsel_control_item',
    image: 'sv_q_imgsel_image',
    itemInline: 'sv_q_imagepicker_inline',
    itemText: 'sv_q_imgsel_text font-weight-light',
    other: 'sv_q_other sv_q_checkbox_other form-control',
    clearButton: 'sv_q_radiogroup_clear btn btn-danger',
  },
  rating: {
    root: 'sv_q_rating btn-group',
    item: 'sv_q_rating_item btn btn-default btn-primary',
    selected: 'active',
    minText: 'sv_q_rating_min_text',
    itemText: 'sv_q_rating_item_text',
    maxText: 'sv_q_rating_max_text',
    disabled: ''
  },
  text: 'sv_q_text_root form-control',
  expression: '',
  saveData: {
    root: '',
    saving: 'alert alert-info',
    error: 'alert alert-danger',
    success: 'alert alert-success',
    saveAgainButton: 'btn btn-warning'
  }
};

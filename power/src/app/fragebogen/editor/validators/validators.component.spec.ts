import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { ValidatorsComponent } from './validators.component';
import { LocaleInputComponent } from '../localeinput/localeinput.component';

describe('Fragebogen.Editor.Validators.ValidatorsComponent', () => {
    let component: ValidatorsComponent;
    let fixture: ComponentFixture<ValidatorsComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [
                ValidatorsComponent,
                LocaleInputComponent
            ],
            imports: [
                CommonModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ValidatorsComponent);
        component = fixture.componentInstance;
        component.model = { pages: [] };
        component.data = {};
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load question list', () => {
        component.model = {
            pages: [
                {
                    elements: [
                        {
                            type: 'text',
                            name: 'e1',
                            title: {
                                default: 'A'
                            }
                        }, {
                            type: 'choice',
                            name: 'e2',
                            title: {},
                            choices: ['A', 'B']
                        }, {
                            type: 'matrix',
                            name: 'e3',
                            title: {},
                            columns: 5,
                            rows: [
                                {
                                    text: {
                                        default: 'Test'
                                    },
                                    value: 'q1'
                                }, {
                                    text: {},
                                    value: 'q2'
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        // parse
        component.ngOnInit();
        expect(component.questions[0].name).toEqual('e1');
        expect(component.questions[0].title).toEqual('A');
        expect(component.questions[0].type).toEqual('text');
        expect(component.questions[0].choices).toBeUndefined();
        expect(component.questions[2].name).toEqual('e3.q1');
        expect(component.questions[2].title).toEqual('Test');
        expect(component.questions[2].type).toEqual('matrix');
        expect(component.questions[2].choices).toEqual(5);
    });

    it('should add and remove validators', () => {
        component.ValidatorDel();
        expect(component.struct.length).toEqual(0);
        component.ValidatorAdd();
        expect(component.struct.length).toEqual(1);
        component.ValidatorAdd();
        expect(component.struct.length).toEqual(2);
        component.ValidatorDel();
        expect(component.struct.length).toEqual(1);
    });

    it('should add standard validators', () => {
        expect(component.struct.length).toEqual(0);
        component.selectDefaultValidator({ target: { value: '' } } as any);
        expect(component.struct.length).toEqual(0);

        component.selectDefaultValidator({ target: { value: 'date1' } } as any);
        expect(component.struct.length).toEqual(1);
        expect(component.struct[0].type).toEqual('regex');
        expect(component.struct[0].regex).toEqual('^(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)\\d{2})$');

        component.selectDefaultValidator({ target: { value: 'date2' } } as any);
        expect(component.struct.length).toEqual(2);
        expect(component.struct[1].type).toEqual('regex');
        expect(component.struct[1].regex).toEqual('^((?:19|20)\\d{2})-(1[012]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9])$');
    });

    it('should not parse validators', () => {
        // no data
        component.data = { validators: null };
        component.ngOnChanges({});
        expect(component.struct.length).toEqual(0);

        // crash
        component.data = {
            validators: [
                {
                    type: 'toast'
                }
            ]
        };
        expect(() => {
            component.ngOnChanges({});
        }).toThrowError('Unkown validator type');
    });

    it('should parse validators', () => {
        component.data = {
            validators: [
                {
                    type: 'numeric',
                    minValue: 1,
                    maxValue: 10
                }, {
                    type: 'answercount',
                    minCount: 1,
                    maxCount: 3
                }, {
                    type: 'text',
                    minLength: 0,
                    maxLength: 10
                }, {
                    type: 'email'
                }, {
                    type: 'regex',
                    regex: 'abc'
                }
            ]
        };
        component.ngOnChanges({});
        expect(component.struct.length).toEqual(5);
        expect(component.struct[0].type).toEqual('numeric');
        expect(component.struct[1].type).toEqual('answercount');
        expect(component.struct[2].type).toEqual('text');
        expect(component.struct[3].type).toEqual('email');
        expect(component.struct[4].type).toEqual('regex');
        component.modelChanged();
    });

    it('should parse expression validators', () => {
        component.data = {
            validators: [
                {
                    type: 'expression',
                    expression: '{e1} equals \'5\''
                }, {
                    type: 'expression',
                    expression: '\'k\' notempty'
                }, {
                    type: 'expression',
                    expression: '{e2} anyof [\'A\',\'B\']'
                }, {
                    type: 'expression',
                    expression: '{e3} = {items}'
                }
            ]
        };
        component.ngOnChanges({});
        expect(component.struct.length).toEqual(4);
        expect(component.struct[0].type).toEqual('expression');
    });

    it('should not create validators', () => {
        // crash
        component.struct = [
            {
                type: 'toast'
            }
        ];
        expect(() => {
            component.modelChanged();
        }).toThrowError('Unkown validator type');
    });

    it('should create validators', () => {
        const testdata = [
            {
                type: 'numeric',
                minValue: 1,
                maxValue: 10
            }, {
                type: 'answercount',
                minCount: 1,
                maxCount: 3
            }, {
                type: 'text',
                minLength: 0,
                maxLength: 10,
                allowDigits: true
            }, {
                type: 'email'
            }, {
                type: 'regex',
                regex: 'abc',
                text: 'Ihre Eingabe entspricht nicht dem gefordertem Format.'
            }
        ];
        component.data = {
            validators: testdata
        };
        component.ngOnChanges({});

        component.modelChanged();
        expect(component.data.validators).toEqual(testdata);
    });

    it('should create expression validators', () => {
        const testdata = [
            {
                type: 'expression',
                expression: '{e1} equals \'5\''
            }, {
                type: 'expression',
                expression: '\'k\' notempty'
            }, {
                type: 'expression',
                expression: '{e2} anyof [\'A\',\'B\']'
            }, {
                type: 'expression',
                expression: '{e3} = {items}'
            }
        ];
        component.data = {
            validators: testdata
        };
        component.ngOnChanges({});
        component.struct[0].value = '';
        testdata[0].expression = '{e1} equals \'\'';

        component.modelChanged();
        expect(component.data.validators).toEqual(testdata);
    });

    it('should validate regular expression', () => {
        expect(component.isRegExInvalid('^\\d*$')).toBeFalse();
        expect(component.isRegExInvalid('^((?:19|20)\\d{2})-(1[012]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9')).toBeTrue();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */

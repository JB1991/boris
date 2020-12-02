import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsComponent } from './conditions.component';

describe('Fragebogen.Editor.Conditions.ConditionsComponent', () => {
    let component: ConditionsComponent;
    let fixture: ComponentFixture<ConditionsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConditionsComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConditionsComponent);
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

    it('should add and remove conditions', () => {
        component.ConditionDel();
        expect(component.struct.length).toEqual(0);
        component.ConditionAdd();
        expect(component.struct.length).toEqual(1);
        component.ConditionAdd();
        expect(component.struct.length).toEqual(2);
        component.ConditionDel();
        expect(component.struct.length).toEqual(1);
    });

    it('should parse conditions', () => {
        component.data = '{e1} equals 5 and \'k\' notempty or {e2} anyof [\'A\',\'B\'] and {e3} = {items}';
        component.ngOnChanges(null);
        expect(component.struct.length).toEqual(4);
        expect(component.struct[0].condition).toEqual('');
        expect(component.struct[0].question).toEqual('{e1}');
        expect(component.struct[0].operator).toEqual('equals');
        expect(component.struct[0].value).toEqual('5');
        expect(component.struct[0].choices).toBeNull();
    });

    it('should create condition', () => {
        component.data = '{e1} equals \'5\' and \'k\' notempty or {e2} anyof [\'A\',\'B\',\'\'] and {e3} = {items}';
        component.ngOnChanges(null);
        component.struct[0].value = '';

        component.modelChanged(null);
        expect(component.data).toEqual('{e1} equals \'\' and \'k\' notempty or {e2} anyof [\'A\',\'B\',\'\'] and {e3} = {items}');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */

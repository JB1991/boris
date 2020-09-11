import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersComponent } from './answers.component';
import { FormsModule } from '@angular/forms';

describe('Fragebogen.Editor.AnswersComponent', () => {
    let component: AnswersComponent;
    let fixture: ComponentFixture<AnswersComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [
                AnswersComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AnswersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        component.changed();
        expect(component).toBeTruthy();
    });

    it('should add and remove items', () => {
        // add
        expect(component.data.length).toEqual(0);
        component.addAnswer();
        expect(component.data.length).toEqual(1);
        component.hasImg = true;
        component.addAnswer();
        expect(component.data.length).toEqual(2);

        // delete
        component.delAnswer(0);
        expect(component.data.length).toEqual(1);
    });

    it('should move up and down', () => {
        component.data = [1, 2, 3];
        component.moveUp(1);
        expect(component.data[0]).toEqual(2);
        expect(component.data[1]).toEqual(1);
        component.moveDown(1);
        expect(component.data[1]).toEqual(3);
        expect(component.data[2]).toEqual(1);

        // should not move
        component.moveUp(0);
        component.moveDown(2);
        expect(component.data[0]).toEqual(2);
        expect(component.data[1]).toEqual(3);
        expect(component.data[2]).toEqual(1);
    });

    it('should delete image', () => {
        component.data = [{ imageLink: 'abc' }];
        component.delImage(0);
        expect(component.data[0].imageLink).toEqual('');
    });

    it('should throw error', () => {
        component.data = [1, 2, 3];
        expect(() => {
            component.delAnswer(-1);
        }).toThrowError('i is invalid');
        expect(() => {
            component.delAnswer(3);
        }).toThrowError('i is invalid');
        expect(() => {
            component.moveUp(-1);
        }).toThrowError('i is invalid');
        expect(() => {
            component.moveUp(3);
        }).toThrowError('i is invalid');
        expect(() => {
            component.moveDown(-1);
        }).toThrowError('i is invalid');
        expect(() => {
            component.moveDown(3);
        }).toThrowError('i is invalid');
        expect(() => {
            component.delImage(-1);
        }).toThrowError('i is invalid');
        expect(() => {
            component.delImage(3);
        }).toThrowError('i is invalid');
        expect(() => {
            component.uploadImage(-1);
        }).toThrowError('i is invalid');
        expect(() => {
            component.uploadImage(3);
        }).toThrowError('i is invalid');
    });
});

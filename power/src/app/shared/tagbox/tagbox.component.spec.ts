import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { TagboxComponent } from './tagbox.component';

describe('Shared.TagboxComponent', () => {
    let component: TagboxComponent;
    let fixture: ComponentFixture<TagboxComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [
                TagboxComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TagboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add tag', () => {
        component.tagInput = 'MyTag';
        component.addTag();
        expect(component.tagList.length).toEqual(1);
        expect(component.tagList[0]).toEqual('mytag');

        component.removeTag(0);
        expect(component.tagList.length).toEqual(0);
    });

    it('should fail tag', () => {
        component.tagInput = '';
        component.addTag();
        expect(component.tagList.length).toEqual(0);

        component.tagInput = 'mytag';
        component.addTag();
        expect(() => {
            component.removeTag(-1);
        }).toThrowError('Invalid i');
        expect(() => {
            component.removeTag(1);
        }).toThrowError('Invalid i');
    });

    it('should not add same tag', () => {
        component.tagList = ['mytag'];
        component.tagInput = 'MyTag';
        component.addTag();
        expect(component.tagList.length).toEqual(1);
    });

    it('should reach limit', () => {
        component.max = 2;
        component.tagList = ['mytag A', 'mytag B'];
        component.tagInput = 'mytag C';
        expect(() => {
            component.addTag();
        }).toThrowError('Reached tagbox limit');
        expect(component.tagList.length).toEqual(2);
    });

    it('should delete all', () => {
        component.tagList = ['mytag A', 'mytag B'];
        expect(component.tagList.length).toEqual(2);
        component.removeAll();
        expect(component.tagList.length).toEqual(0);
    });
});

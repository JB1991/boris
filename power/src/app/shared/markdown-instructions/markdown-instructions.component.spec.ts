/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MarkdownInstructionsComponent } from './markdown-instructions.component';

describe('MarkdownInstructionsComponent', () => {
    let component: MarkdownInstructionsComponent;
    let fixture: ComponentFixture<MarkdownInstructionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MarkdownInstructionsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MarkdownInstructionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

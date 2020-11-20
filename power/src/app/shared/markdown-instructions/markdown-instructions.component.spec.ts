import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalComponent } from '../modal/modal.component';
import { MarkdownInstructionsComponent } from './markdown-instructions.component';

describe('MarkdownInstructionsComponent', () => {
    let component: MarkdownInstructionsComponent;
    let fixture: ComponentFixture<MarkdownInstructionsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                MarkdownInstructionsComponent,
                ModalComponent
            ]
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

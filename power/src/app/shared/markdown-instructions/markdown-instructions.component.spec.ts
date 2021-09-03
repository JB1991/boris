import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { MarkdownInstructionsComponent } from './markdown-instructions.component';
import { SharedModule } from '@app/shared/shared.module';

describe('MarkdownInstructionsComponent', () => {
    let component: MarkdownInstructionsComponent;
    let fixture: ComponentFixture<MarkdownInstructionsComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [
                MarkdownInstructionsComponent
            ],
            imports: [
                CommonModule,
                SharedModule
            ]
        }).compileComponents();
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

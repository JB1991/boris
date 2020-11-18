import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MarkdownInstructionsComponent } from './markdown-instructions.component';

describe('MarkdownInstructionsComponent', () => {
    let component: MarkdownInstructionsComponent;
    let fixture: ComponentFixture<MarkdownInstructionsComponent>;

    beforeEach(waitForAsync(() => {
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

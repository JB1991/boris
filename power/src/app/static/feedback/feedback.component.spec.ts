import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackComponent } from './feedback.component';

describe('Static.Feedback.FeedbackComponent', () => {
    let component: FeedbackComponent;
    let fixture: ComponentFixture<FeedbackComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FeedbackComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedbackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a title', () => {
        expect(component.titleService.getTitle()).toContain('Feedback');
    });

    it('should show the mail address', () => {
        expect(document.body.innerHTML)
            .toContain('incoming+lgln-power-ni-power-frontend-17688796-issue-@incoming.gitlab.com');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */

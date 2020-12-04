import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { FeedbackComponent } from './feedback.component';

describe('Static.Feedback.FeedbackComponent', () => {
    let component: FeedbackComponent;
    let fixture: ComponentFixture<FeedbackComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                FormsModule
            ],
            declarations: [
                FeedbackComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FeedbackComponent);
        component = fixture.componentInstance;
        spyOn(component, 'loadRSSFeed');

        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.loadRSSFeed).toHaveBeenCalledTimes(1);
    });

    it('should have a title', () => {
        expect(component.titleService.getTitle()).toContain('Feedback');
    });

    it('should show the mail address', () => {
        expect(document.body.innerHTML)
            .toContain('incoming+kay-lgln-power-22861970-issue-@incoming.gitlab.com');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

import { FeedbackComponent } from './feedback.component';
import { AuthService } from '@app/shared/auth/auth.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';

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
            providers: [
                Title,
                Meta,
                AuthService,
                AlertsService
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

    it('should search without email', () => {
        component.search = 'BORIS';
        component.doSearch();
        expect(component.search).toEqual('BORIS');

        component.search = 'dagobert@duck.net';
        component.doSearch();
        expect(component.search).toEqual('');
    });

    it('should remove sensitive informations', () => {
        expect(component.filterTitle('dagobert@duck.net')).toEqual('***@email');
        expect(component.filterTitle('Hello Dagobert (dagobert@duck.net)!')).toEqual('Hello Dagobert (***@email)!');

        expect(component.filterBody('dagobert@duck.net')).toEqual('***@email');
        expect(component.filterBody('Hello Dagobert (dagobert@duck.net)!')).toEqual('Hello Dagobert (***@email)!');
        expect(component.filterBody('+49 511 64609-146')).toEqual('***');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */

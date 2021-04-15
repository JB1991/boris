import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';

import { NotfoundComponent } from './notfound.component';

describe('Static.Notfound.NotfoundComponent', () => {
    let component: NotfoundComponent;
    let fixture: ComponentFixture<NotfoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                Title,
                Meta
            ],
            declarations: [
                NotfoundComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(NotfoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { ModalElementComponent } from './modal-element.component';
import { StorageService } from '../storage.service';

describe('Fragebogen.Editor.ModelElement.ModalElementComponent', () => {
    let component: ModalElementComponent;
    let fixture: ComponentFixture<ModalElementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                FormsModule,
                ModalModule.forRoot()
            ],
            providers: [
                StorageService,
                BsModalService
            ],
            declarations: [ModalElementComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalElementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */

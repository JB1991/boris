import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ModalminiComponent } from './modalmini.component';

describe('Shared.ModalminiComponent', () => {
    let component: ModalminiComponent;
    let fixture: ComponentFixture<ModalminiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ModalModule.forRoot()
            ],
            declarations: [
                ModalminiComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalminiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

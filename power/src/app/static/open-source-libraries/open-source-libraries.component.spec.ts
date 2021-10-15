import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OpenSourceLibrariesComponent } from './open-source-libraries.component';

describe('OpenSourceLibrariesComponent', () => {
    let component: OpenSourceLibrariesComponent;
    let fixture: ComponentFixture<OpenSourceLibrariesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            declarations: [OpenSourceLibrariesComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OpenSourceLibrariesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should find @', () => {
        const libs = OpenSourceLibrariesComponent.findLibs('\n@lib\nMIT');
        expect(libs.length).toEqual(1);
    });

    it('should not find --', () => {
        const libs = OpenSourceLibrariesComponent.findLibs('\n----\n-----');
        expect(libs.length).toEqual(0);
    });

    it('should not find white char', () => {
        const libs = OpenSourceLibrariesComponent.findLibs('\n asd\nMIT');
        expect(libs.length).toEqual(0);
    });

    it('should not find without license', () => {
        const libs = OpenSourceLibrariesComponent.findLibs('\n asd');
        expect(libs.length).toEqual(0);
    });

    it('should have MIT', () => {
        const libs = OpenSourceLibrariesComponent.findLibs('\nngx-bootstrap/accordion\n');
        expect(libs.length).toEqual(1);
        expect(libs[0].license).toEqual('MIT');
    });

});

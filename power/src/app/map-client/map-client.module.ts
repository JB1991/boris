import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapClientComponent } from './map-client.component';

@NgModule({
    declarations: [
        MapClientComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        MapClientComponent,
    ]
})
export class MapClientModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';
import { FormularComponent } from './formular/formular.component';

import { PendingChangesGuard } from './pendingchanges.guard';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'editor', component: EditorComponent, canDeactivate: [PendingChangesGuard]},
  {path: 'formular', component: FormularComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FragebogenRoutingModule { }

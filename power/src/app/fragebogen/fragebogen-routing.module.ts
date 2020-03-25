import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditorComponent } from './editor/editor.component';
import { FormularComponent } from './formular/formular.component';

import { PendingChangesGuard } from './pendingchanges.guard';


const routes: Routes = [
  {path: '', component: FormularComponent},
  {path: 'editor', component: EditorComponent, canDeactivate: [PendingChangesGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FragebogenRoutingModule { }

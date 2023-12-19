import {RouterModule, Routes} from '@angular/router';
import {BlogEditComponent} from './blog-edit.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: BlogEditComponent,
  },
  {
    path: ':id',
    component: BlogEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogEditRoutingModule {
}

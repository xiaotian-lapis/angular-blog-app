import { RouterModule, Routes } from '@angular/router';
import { BlogContentComponent } from './blog-content.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: BlogContentComponent,
  },
  {
    path: ':id',
    component: BlogContentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogContentRoutingModule {}

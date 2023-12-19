import { Routes } from '@angular/router';
import { BlogEditComponent } from './blog-edit.component';

export const BLOG_EDIT_ROUTES: Routes = [
  {
    path: '',
    component: BlogEditComponent,
  },
  {
    path: ':id',
    component: BlogEditComponent,
  },
];

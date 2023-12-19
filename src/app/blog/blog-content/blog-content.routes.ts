import { Routes } from '@angular/router';
import { BlogContentComponent } from './blog-content.component';

export const BLOG_CONTENT_ROUTES: Routes = [
  {
    path: '',
    component: BlogContentComponent,
  },
  {
    path: ':id',
    component: BlogContentComponent,
  },
];

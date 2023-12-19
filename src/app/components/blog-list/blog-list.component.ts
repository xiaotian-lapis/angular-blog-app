import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IBlog } from '../../shared/models/blog.model';
import { Observable } from 'rxjs';
import {
  selectAllBlogs,
  selectBlogsViewStatus,
} from '../../state/selectors/blog.selector';
import { Store } from '@ngrx/store';
import * as BlogActions from '../../state/actions/blog.action';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ViewStatus } from '../../shared/constants/status.constant';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { equals, or } from '../../shared/utils/ramda-functions.util';
import { IBlogState } from '../../state/reducers/blog.reducer';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    AsyncPipe,
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressBarModule,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent implements OnInit {
  private blogStore = inject(Store<IBlogState>);

  blogList$: Observable<IBlog[]> = this.blogStore.select(selectAllBlogs);
  viewStatus$: Observable<ViewStatus> = this.blogStore.select(
    selectBlogsViewStatus,
  );

  protected readonly ViewStatus = ViewStatus;
  protected readonly equals = equals;
  protected readonly or = or;

  ngOnInit(): void {
    // dispatch load action to load logs into store
    this.blogStore.dispatch(BlogActions.loadBlogs());
  }

  /**
   * Delete blog by id
   * @param blogId blog id
   */
  deleteBlog(blogId: string): void {
    this.blogStore.dispatch(
      BlogActions.removeBlog({
        id: blogId,
      }),
    );
  }
}

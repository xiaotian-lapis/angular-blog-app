import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IBlog } from '../../shared/models/blog.model';
import { Observable } from 'rxjs';
import {
  selectAllBlogs,
  selectBlogsViewStatus,
} from '../../state/selectors/blog.selector';
import { Store } from '@ngrx/store';
import { BlogActions } from '../../state/actions/blog.action';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {ViewStatus} from "../../shared/constants/status.constant";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'blog-list',
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
  styleUrl: './blog-list.component.css',
})
export class BlogListComponent implements OnInit {
  blogList$: Observable<IBlog[]> = this.store.select(selectAllBlogs);

  viewStatus$: Observable<ViewStatus> = this.store.select(selectBlogsViewStatus);

  constructor(private store: Store) {}

  ngOnInit(): void {
    // dispatch load action to load logs into store
    this.store.dispatch(BlogActions.loadBlogs());
  }

  /**
   * Delete blog by id
   * @param blogId blog id
   */
  deleteBlog(blogId: string): void {
    this.store.dispatch(
      BlogActions.removeBlog({
        id: blogId,
      })
    );
  }

  protected readonly ViewStatus = ViewStatus;
}

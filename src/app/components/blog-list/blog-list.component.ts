import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {IBlog} from "../../shared/models/blog.model";
import {Observable} from "rxjs";
import {
  selectAllBlogs,
  selectBlogsError,
  selectBlogsInitialized,
  selectBlogsLoading
} from "../../state/selectors/blog.selector";
import {Store} from "@ngrx/store";
import {BlogActions} from "../../state/actions/blog.action";

@Component({
  selector: 'blog-list',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css'
})
export class BlogListComponent implements OnInit {
  blogList$: Observable<IBlog[]> = this.store.select(selectAllBlogs);

  // load and error selector
  loading$: Observable<boolean> = this.store.select(selectBlogsLoading);
  error$: Observable<any> = this.store.select(selectBlogsError);
  isInitialized$: Observable<boolean> = this.store.select(selectBlogsInitialized);

  // TODO constuctor -> inject
  constructor(private store: Store) {
  }

  ngOnInit(): void {
    // dispatch load action to load logs into store
    this.store.dispatch(BlogActions.loadBlogs());
  }

  /**
   * Delete blog by id
   * @param blogId blog id
   */
  deleteBlog(blogId: string): void {
    this.store.dispatch(BlogActions.removeBlog({
      id: blogId
    }));
  }
}

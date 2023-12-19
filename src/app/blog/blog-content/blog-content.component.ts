import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllBlogs } from '../blog.selector';
import { map, Subscription } from 'rxjs';
import { equals } from '../../shared/utils/ramda-functions.util';
import { IBlogState } from '../blog.reducer';

@Component({
  selector: 'app-blog-content',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-content.component.html',
  styleUrl: './blog-content.component.scss',
})
export class BlogContentComponent implements OnInit, OnDestroy {
  blogContent = '';
  title = '';
  createdTime = new Date();
  updatedTime = new Date();
  blogAuthor = '';
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly location = inject(Location);
  private blogStore = inject(Store<IBlogState>);
  private readonly canGoBack: boolean;

  private subscription = new Subscription();

  constructor() {
    this.canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const blogId = params.get('id')!;

      // get blog from store
      this.subscription.add(
        this.blogStore
          .select(selectAllBlogs)
          .pipe(map((blogs) => blogs.find((blog) => equals(blog.id, blogId))))
          .subscribe((blog) => {
            if (blog) {
              this.blogContent = blog.content;
              this.title = blog.title;
              this.createdTime = blog.createdTime;
              this.updatedTime = blog.updatedTime;
              this.blogAuthor = blog.author;
            }
          }),
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Go back to previous page
   */
  goBack(): void {
    if (this.canGoBack) {
      // We can safely go back to the previous location as
      // we know it's within our app.
      this.location.back();
    } else {
      // There's no previous navigation.
      // Here we decide where to go. For example, let's say the
      // upper level is the index page, so we go up one level.
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }
}

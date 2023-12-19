import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IBlog } from '../blog.model';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as BlogActions from '../blog.action';
import { ActivatedRoute, Router } from '@angular/router';
import { selectAllBlogs } from '../blog.selector';
import { genRandomId } from '../../shared/utils/random.util';
import { catchError, map, of, Subscription, tap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LocationService } from '../../shared/services/location.service';
import { NgIf } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IBlogState } from '../blog.reducer';
import { equals } from '../../shared/utils/ramda-functions.util';

@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    MatProgressBarModule,
  ],
  templateUrl: './blog-edit.component.html',
  styleUrl: './blog-edit.component.scss',
})
export class BlogEditComponent implements OnInit, OnDestroy {
  @Input()
  blog?: IBlog;
  isloading = false;
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private locationService = inject(LocationService);
  private blogStore = inject(Store<IBlogState>);
  private fb = inject(FormBuilder);
  blogForm = this.fb.group({
    title: new FormControl<string>(this.blog?.title || '', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    description: new FormControl<string>(this.blog?.description || ''),
    content: new FormControl<string>(this.blog?.content || '', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    author: new FormControl<string>(
      {
        value: this.blog?.author || '',
        disabled: this.blog != null,
      },
      {
        nonNullable: true,
      },
    ),
  });
  private subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.route.paramMap.subscribe((params) => {
        // get request parameter
        const blogId = params.get('id')!;
        // select blog from store
        this.blogStore
          .select(selectAllBlogs)
          .pipe(map((blogs) => blogs.find((blog) => equals(blog.id, blogId))))
          .subscribe((blog) => {
            this.blog = blog;
            this.blogForm.patchValue({
              title: blog?.title,
              description: blog?.description,
              content: blog?.content,
              author: blog?.author,
            });
          });
      }),
    );
  }

  ngOnDestroy() {
    // gc
    this.subscription.unsubscribe();
  }

  async onSubmit() {
    console.log(this.blogForm.value);
    this.isloading = true;

    this.subscription.add(
      this.locationService
        .getPosition()
        .pipe(
          tap((pos) => {
            console.log(`Position get!: ${pos.lng} ${pos.lat}`);
          }),
          catchError((err) => {
            console.error('Error getting location', err);
            return of(undefined);
          }),
        )
        .subscribe((pos) => {
          const blogData: IBlog = {
            id: this.blog?.id || genRandomId(),
            title: this.blogForm.value.title || '',
            description: this.blogForm.value.description || '',
            content: this.blogForm.value.content || '',
            author: this.blogForm.value.author || '',
            createdTime: this.blog?.createdTime || new Date(),
            updatedTime: new Date(),
            // default location
            location: {
              lat: -37.81636266086154,
              lng: 144.9566577681617,
              addr: '8/575 Bourke St, Melbourne VIC 3000',
            },
          };

          // if location service is working, replace with the real location
          if (pos) {
            blogData.location.lat = pos.lat;
            blogData.location.lng = pos.lng;
          }

          if (this.blog) {
            console.log('update');
            this.blogStore.dispatch(BlogActions.updateBlog({ ...blogData }));
          } else {
            console.log('add');
            this.blogStore.dispatch(BlogActions.addBlog({ ...blogData }));
          }

          // Jump back to the home page
          this.isloading = false;
          this.router.navigate(['/home']);
        }),
    );
  }

  async goBack() {
    await this.router.navigate(['/home']);
  }
}

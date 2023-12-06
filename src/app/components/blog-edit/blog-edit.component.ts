import {Component, Input} from '@angular/core';
import {Blog} from "../../shared/models/blog.model";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {BlogActions} from "../../state/actions/blog.action";

@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './blog-edit.component.html',
  styleUrl: './blog-edit.component.css'
})
export class BlogEditComponent {
  @Input() blog?: Blog; // Existing blog for editing

  blogForm = this.fb.group({
    title: new FormControl<string>(this.blog?.title || '', {
      validators: [Validators.required],
      nonNullable: true
    }),
    description: new FormControl<string>(this.blog?.description || ''),
    content: new FormControl<string>(this.blog?.content || '', {
      validators: [Validators.required],
      nonNullable: true
    }),
    author: new FormControl<string>({
      value: this.blog?.author || 'Default Author',
      disabled: this.blog != null
    }, {
      nonNullable: true
    })
  });

  constructor(private store: Store, private fb: FormBuilder) {}

  onSubmit(): void {
    const randomId = Math.random().toString(36).substring(2, 12);

    const blogData: Blog = {
      id: this.blog?.id || randomId,
      title: this.blogForm.value.title || 'Default Title',
      description: this.blogForm.value.description || 'No Description',
      content: this.blogForm.value.content || 'No Content',
      author: this.blogForm.value.author || 'Anonymous',
      createdTime: this.blog?.createdTime || new Date(),
      updatedTime: new Date()
    };

    if (this.blog) {
      // Dispatch update action
      this.store.dispatch(BlogActions.updateBlog({ ...blogData }));
    } else {
      // Dispatch add action
      this.store.dispatch(BlogActions.addBlog({ ...blogData }));
    }
  }

}

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
    if (this.blog) {
      // Dispatch update action
      this.store.dispatch(BlogActions.updateBlog({
        id: this.blog.id,
        title: this.blogForm.value.title ?? '', // Provide default value
        description: this.blogForm.value.description ?? '',
        content: this.blogForm.value.content ?? '',
        author: this.blogForm.value.author ?? 'Default Author', // Provide default value
        updatedTime: new Date()
      }));
    } else {
      // Dispatch add action
      const newBlog: Blog = {
        id: 'generate-id', // Replace with actual ID generation logic
        title: this.blogForm.value.title ?? '',
        description: this.blogForm.value.description ?? '',
        content: this.blogForm.value.content ?? '',
        author: this.blogForm.value.author ?? 'Default Author',
        createdTime: new Date(),
        updatedTime: new Date()
      };
      this.store.dispatch(BlogActions.addBlog(newBlog));
    }
  }
}

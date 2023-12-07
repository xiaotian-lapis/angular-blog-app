import {Component, Input, OnInit} from '@angular/core';
import {Blog} from "../../shared/models/blog.model";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {BlogActions} from "../../state/actions/blog.action";
import {ActivatedRoute, Router} from "@angular/router";
import {selectAllBlogs} from "../../state/selectors/blog.selector";
import {genRandomId} from "../../shared/utils/random.util";
import {map} from "rxjs";

@Component({
    selector: 'app-blog-edit',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './blog-edit.component.html',
    styleUrl: './blog-edit.component.css'
})
export class BlogEditComponent implements OnInit {
    @Input() blog?: Blog;

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
            value: this.blog?.author || '',
            disabled: this.blog != null
        }, {
            nonNullable: true
        })
    });

    constructor(private store: Store,
                private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            // get request parameter
            const blogId = params.get('id')!;
            // select blogs from store
            this.store.select(selectAllBlogs).pipe(
                map(blogs => blogs.find(blog => blog.id === blogId))
            ).subscribe(blog => {
                this.blog = blog;
                this.blogForm.patchValue({
                    title: blog?.title,
                    description: blog?.description,
                    content: blog?.content,
                    author: blog?.author,
                });
            });
        });
    }

    onSubmit(): void {
        console.log(this.blogForm.value)

        const blogData: Blog = {
            id: this.blog?.id || genRandomId(),
            title: this.blogForm.value.title || '',
            description: this.blogForm.value.description || '',
            content: this.blogForm.value.content || '',
            author: this.blogForm.value.author || '',
            createdTime: this.blog?.createdTime || new Date(),
            updatedTime: new Date()
        };

        if (this.blog) {
            console.log("update")
            this.store.dispatch(BlogActions.updateBlog({...blogData}));
        } else {
            console.log("add")
            this.store.dispatch(BlogActions.addBlog({...blogData}));
        }

        // jump back to home page
        this.router.navigate(['/home']);
    }

    goBack(): void {
        this.router.navigate(['..'], {relativeTo: this.route});
    }

}

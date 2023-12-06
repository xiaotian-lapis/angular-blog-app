import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Blog} from "../../shared/models/blog.model";
import {first, Observable} from "rxjs";
import {selectAllBlogs} from "../../state/selectors/blog.selector";
import {Store} from "@ngrx/store";
import {BlogActions} from "../../state/actions/blog.action";

@Component({
    selector: 'blog-list',
    standalone: true,
    imports: [
        NgForOf,
        RouterLink,
        AsyncPipe,
    ],
    templateUrl: './blog-list.component.html',
    styleUrl: './blog-list.component.css'
})
export class BlogListComponent implements OnInit {
    blogList$: Observable<Blog[]> = this.store.select(selectAllBlogs);

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.blogList$ = this.store.select(selectAllBlogs);
        // debug
        this.blogList$.pipe().subscribe((blogs) => {
            console.log(blogs);
        });
    }

    deleteBlog(blogId: string): void {
        this.store.dispatch(BlogActions.removeBlog({
            id: blogId
        }));
    }
}

import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Blog} from "../../shared/models/blog.model";
import {Observable} from "rxjs";
import {selectAllBlogs} from "../../state/selectors/blog.selector";
import {Store} from "@ngrx/store";

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
    constructor(private store: Store) {}

    ngOnInit(): void {
        this.blogList$ = this.store.select(selectAllBlogs);
        // Optionally, dispatch an action to load blogs if they are not loaded yet
    }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DatePipe, Location} from '@angular/common';
import {Store} from "@ngrx/store";
import {selectAllBlogs} from "../../state/selectors/blog.selector";
import {map} from "rxjs";

@Component({
    selector: 'blog-content',
    standalone: true,
    imports: [
        RouterLink,
        DatePipe
    ],
    templateUrl: './blog-content.component.html',
    styleUrl: './blog-content.component.css'
})
export class BlogContentComponent implements OnInit {

    blogContent: string = "";
    blogTitle: string = "";
    createdTime: Date = new Date();
    updatedTime: Date = new Date();
    blogAuthor: string = "";
    private readonly canGoBack: boolean;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private readonly location: Location,
                private store: Store,
    ) {
        // https://stackoverflow.com/questions/35446955/how-to-go-back-last-page
        this.canGoBack = !!(this.router.getCurrentNavigation()?.previousNavigation);
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const blogId = params.get('id')!;

            // get blog from store
            this.store.select(selectAllBlogs).pipe(
                map(blogs => blogs.find(blog => blog.id === blogId))
            ).subscribe(blog => {
                if (blog) {
                    this.blogContent = blog.content;
                    this.blogTitle = blog.title;
                    this.createdTime = blog.createdTime;
                    this.updatedTime = blog.updatedTime;
                    this.blogAuthor = blog.author;
                }
            });
        });
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
            this.router.navigate(['..'], {relativeTo: this.route});
        }
    }
}

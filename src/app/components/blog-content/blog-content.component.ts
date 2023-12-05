import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {dummyBlogList} from "../../data/dummyBlogList";
import {DummyDataItemType} from "../../types/data.type";
import { Location } from '@angular/common';

@Component({
    selector: 'blog-content',
    standalone: true,
    imports: [
        RouterLink
    ],
    templateUrl: './blog-content.component.html',
    styleUrl: './blog-content.component.css'
})
export class BlogContentComponent implements OnInit {
    blogId: string = "";
    blogContent: string = "";
    blogTitle: string = "";
    private readonly canGoBack: boolean;


    constructor(private route: ActivatedRoute, private router: Router, private readonly location: Location) {
        // https://stackoverflow.com/questions/35446955/how-to-go-back-last-page
        this.canGoBack = !!(this.router.getCurrentNavigation()?.previousNavigation);
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.blogId = params.get('id')!;
            const blogData: DummyDataItemType | undefined = dummyBlogList.find(blog => blog.id === this.blogId);
            if (blogData === undefined) {
                this.blogContent = "Blog not found";
                this.blogTitle = "Blog not found";
            } else {
                this.blogContent = blogData.content;
                this.blogTitle = blogData.title;
            }
        });
    }

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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {dummyBlogList} from "../../data/dummyBlogList";
import {DummyDataItemType} from "../../types/dataTypes";

@Component({
    selector: 'blog-content',
    standalone: true,
    imports: [],
    templateUrl: './blog-content.component.html',
    styleUrl: './blog-content.component.css'
})
export class BlogContentComponent implements OnInit {
    blogId: string = "";
    blogContent: string = "";
    blogTitle: string = "";

    constructor(private route: ActivatedRoute) {
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
}

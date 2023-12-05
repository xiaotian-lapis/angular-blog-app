import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {BlogService} from "../../shared/services/blog.service";
import {DummyDataListType} from "../../shared/types/data.type";

@Component({
    selector: 'blog-list',
    standalone: true,
    imports: [
        NgForOf,
        RouterLink,
    ],
    templateUrl: './blog-list.component.html',
    styleUrl: './blog-list.component.css'
})
export class BlogListComponent implements OnInit {
    blogList: DummyDataListType = [];

    constructor(private blogService: BlogService) {
    }

    ngOnInit(): void {
        this.blogList = this.blogService.getBlogList();
    }
}

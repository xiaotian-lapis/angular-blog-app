import { Injectable } from '@angular/core';
import {DummyDataItemType, DummyDataListType} from "../types/data.type";

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    // dummy data for testing
    private blogList: DummyDataListType = [
        {
            "id": "1",
            "author": "good author",
            "title": "good job title",
            "description": "good blog description",
            "createdTime": "2021-09-01T00:00:00.000Z",
            "content": "this is good blog content"
        },
        {
            "id": "2",
            "author": "bad author",
            "title": "bad job title",
            "description": "bad blog description",
            "createdTime": "2023-08-01T00:00:00.000Z",
            "content": "this is bad blog content"
        },
        // ... more blogs
    ];

    constructor() { }

    getBlogList(): DummyDataListType {
        return this.blogList;
    }

    findBlogById(id: string): DummyDataItemType {
        const blog = this.blogList.find(blog => blog.id === id);
        if (!blog) {
            throw new Error('BlogModel not found');
        }
        return blog;
    }

}

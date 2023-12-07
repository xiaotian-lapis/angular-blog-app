import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Blog} from "../shared/models/blog.model";
import {environment} from "../../environments/nvironment";

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    private apiUrl = `${environment.apiUrl}/blogs`;

    constructor(private http: HttpClient) {
    }

    /**
     * Get blogs from backend api
     */
    getBlogs(): Observable<Blog[]> {
        return this.http.get<Blog[]>(this.apiUrl);
    }
}

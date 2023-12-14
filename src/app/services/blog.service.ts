import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IBlog} from '../shared/models/blog.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/blogs`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get blogs from backend api
   */
  getBlogs(): Observable<IBlog[]> {
    return this.http.get<IBlog[]>(this.apiUrl);
  }
}

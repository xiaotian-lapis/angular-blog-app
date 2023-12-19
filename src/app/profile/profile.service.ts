import { IProfile } from './profile.model';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileService {
  /**
   * Get profile from mock data
   */
  getProfile(): Observable<IProfile> {
    return of({
      id: '1',
      name: 'John Doe',
      email: 'test@google.com',
      bio: 'I am a software engineer',
      password: 'password',
      age: 20,
      updatedTime: new Date(),
    });
  }
}

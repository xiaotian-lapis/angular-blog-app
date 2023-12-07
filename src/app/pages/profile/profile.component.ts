import {Component} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePipe, Location, NgIf} from '@angular/common';
import {CookieService} from "ngx-cookie-service";
import {LAST_UPDATED_DATE_COOKIE_NAME} from "../../shared/constants/cookie.constant";
import {Profile} from "./profile.model";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    DatePipe,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [DatePipe]
})
export class ProfileComponent {
  profileForm = this.fb.group({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    bio: new FormControl<string | null>(''),
    password: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
    age: new FormControl<number>(0, {
      validators: [Validators.required, Validators.min(18)],
      nonNullable: true,
    }),
  });

  constructor(private cookieService: CookieService, private readonly location: Location, private fb: FormBuilder) {
  }

  getLastEdited(): string {
    // get last updated date string from cookie
    const lastEditedISOString = this.cookieService.get(LAST_UPDATED_DATE_COOKIE_NAME);
    if (!lastEditedISOString) {
      return 'Not updated yet';
    }
    return lastEditedISOString
  }

  onSubmit() {
    // set current date in cookie as last updated date
    this.cookieService.set(LAST_UPDATED_DATE_COOKIE_NAME, new Date().toISOString());

    // debug show form value
    const formValue: Profile = {
      name: this.profileForm.value.name ?? '',
      email: this.profileForm.value.email ?? '',
      bio: this.profileForm.value.bio ?? '',
      password: this.profileForm.value.password ?? '',
      age: this.profileForm.value.age ?? 0,
    };
    console.log(formValue);
  }

  goBack(): void {
    this.location.back();
  }
}

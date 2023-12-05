import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';
import {CookieService} from "ngx-cookie-service";
import {Location} from '@angular/common';
import {LAST_UPDATED_DATE_COOKIE_NAME} from "../../shared/constants/cookie.constant";

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
  profileForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    bio: new FormControl<string | null>(''),
  });

  constructor(private datePipe: DatePipe, private cookieService: CookieService, private readonly location: Location) {
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
    console.log(this.profileForm.value);
  }

  goBack(): void {
    this.location.back();
  }
}

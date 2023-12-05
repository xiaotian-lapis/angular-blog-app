import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';
import {CookieService} from "ngx-cookie-service";
import {Location} from '@angular/common';
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
    profileForm = new FormGroup({
        name: new FormControl<string>('', Validators.required),
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        bio: new FormControl<string | null>(''),
        password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
        age: new FormControl<number>(0, [Validators.required, Validators.min(18)]),
    });

    constructor(private cookieService: CookieService, private readonly location: Location) {
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

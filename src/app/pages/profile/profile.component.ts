import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {DatePipe, NgIf} from '@angular/common';
import {CookieService} from "ngx-cookie-service";
import { Location } from '@angular/common';

const LAST_UPDATED_DATE_COOKIE_NAME = 'lastUpdatedDate';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgIf,
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    providers: [DatePipe]
})
export class ProfileComponent {
    profileForm = new FormGroup({
        name: new FormControl<string>('', Validators.required),
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        bio: new FormControl<string|null>(''),
    });

    constructor(private datePipe: DatePipe, private cookieService: CookieService, private readonly location: Location) {
    }

    getLastEdited(): string {
        const lastEdited = this.cookieService.get(LAST_UPDATED_DATE_COOKIE_NAME);
        if (!lastEdited) {
            return 'Not updated yet';
        }
        const formattedDate = this.datePipe.transform(lastEdited, 'dd/MM/yyyy HH:mm:ss');
        return formattedDate ?? 'not valid date';
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

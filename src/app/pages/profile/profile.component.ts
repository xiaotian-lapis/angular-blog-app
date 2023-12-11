import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, DatePipe, Location, NgIf} from '@angular/common';
import {CookieService} from "ngx-cookie-service";
import {LAST_UPDATED_DATE_COOKIE_NAME} from "../../shared/constants/cookie.constant";
import {first, Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAllProfiles, selectProfileById, selectProfilesLoading} from "../../state/selectors/profile.selector";
import {IProfile} from "../../shared/models/profile.model";
import {ProfileActions} from "../../state/actions/profile.action";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    DatePipe,
    AsyncPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [DatePipe]
})
export class ProfileComponent implements OnInit{

  private profileId: string = '1';

  loading$: Observable<boolean> = this.store.select(selectProfilesLoading);
  error$: Observable<any> = this.store.select(selectProfilesLoading);
  isInitialized$: Observable<boolean> = this.store.select(selectProfilesLoading);
  profile$: Observable<IProfile | undefined> = this.store.select(selectProfileById(this.profileId));

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

  ngOnInit(): void {
    // dispatch load action to load logs into store
    console.log("load profile");
    this.store.dispatch(ProfileActions.loadProfile());
    console.log("load profile done");
    const profiles$ = this.store.select(selectAllProfiles);
    console.log("select all profiles");
    profiles$.pipe().subscribe(profiles => {
      if (profiles.length > 0) {
        // prefill form with profile
        this.profileForm.patchValue(profiles[0]);
        this.profileId = profiles[0].id;
        console.log(this.profileId);
      }
    });
  }

  constructor(
    private cookieService: CookieService,
    private readonly location: Location,
    private fb: FormBuilder,
    private store: Store,
    ) {}

  onSubmit() {
    // set current date in cookie as last updated date
    this.cookieService.set(LAST_UPDATED_DATE_COOKIE_NAME, new Date().toISOString());

    // debug show form value
    const formValue: IProfile = {
      id: '1',
      name: this.profileForm.value.name ?? '',
      email: this.profileForm.value.email ?? '',
      bio: this.profileForm.value.bio ?? '',
      password: this.profileForm.value.password ?? '',
      age: this.profileForm.value.age ?? 0,
      updatedTime: new Date(),
    };
    console.log(formValue);

    // update profile
    this.store.dispatch(ProfileActions.updateProfile(
      formValue
    ));
  }

  goBack() {
    this.location.back();
  }
}

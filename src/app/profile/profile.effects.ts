import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ProfileService } from './profile.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as ProfileActions from './profile.action';
import { selectProfilesViewStatus } from './profile.selector';
import { ViewStatus } from '../shared/constants/status.constant';
import { equals } from '../shared/utils/ramda-functions.util';

@Injectable()
export class ProfileEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      // select Initialized info from store to determine whether to load blog from backend api
      concatLatestFrom(() => this.store.select(selectProfilesViewStatus)),
      mergeMap(([_, viewStatus]) => {
        if (equals(viewStatus, ViewStatus.Reloading)) {
          console.log(
            'already initialized, dispatch loaded success with null in profile',
          );
          return of(ProfileActions.profileLoadedSuccess({ profile: null }));
        } else {
          console.log('not initialized, load profile from backend api');
          // not initialized, load blog from backend api
          return this.profileService.getProfile().pipe(
            map((profile) => {
              console.log('successful load profile: ', profile);
              return ProfileActions.profileLoadedSuccess({ profile });
            }),
            catchError((error: { message: string }) =>
              of(ProfileActions.profileLoadedError({ error })),
            ),
          );
        }
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
    private store: Store,
  ) {}
}

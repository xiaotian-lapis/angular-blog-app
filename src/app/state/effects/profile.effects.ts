import {Injectable} from '@angular/core';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {ProfileService} from '../../services/profile.service';
import {catchError, map, mergeMap, of} from 'rxjs';
import {ProfileActions, ProfileApiActions} from '../actions/profile.action';
import {selectProfilesViewStatus} from "../selectors/profile.selector";
import {ViewStatus} from "../../shared/constants/status.constant";

@Injectable()
export class ProfileEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      // select Initialized info from store to determine whether to load blogs from backend api
      concatLatestFrom(() => this.store.select(selectProfilesViewStatus)),
      mergeMap(([_, viewStatus]) => {
        if (viewStatus === ViewStatus.Reloading) {
          console.log(
            'already initialized, dispatch loaded success with null in profile'
          );
          return of(ProfileApiActions.profileLoadedSuccess({profile: null}));
        } else {
          console.log('not initialized, load profile from backend api');
          // not initialized, load blogs from backend api
          return this.profileService.getProfile().pipe(
            map(profile => {
              console.log('successful load profile: ', profile);
              return ProfileApiActions.profileLoadedSuccess({profile});
            }),
            catchError((error: { message: string }) =>
              of(ProfileApiActions.profileLoadedError({error}))
            )
          );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
    private store: Store
  ) {
  }
}

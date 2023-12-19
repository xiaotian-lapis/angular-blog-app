import { createAction, props } from '@ngrx/store';
import { IProfile } from './profile.model';

export const loadProfile = createAction('[Profile] Load Profile');

export const updateProfile = createAction(
  '[Profile] Update Profile',
  props<IProfile>(),
);

export const profileLoadedSuccess = createAction(
  '[Profile API] Profile Loaded Success',
  props<{ profile: IProfile | null }>(),
);

export const profileLoadedError = createAction(
  '[Profile API] Profile Loaded Error',
  props<{ error: { message: string } }>(),
);

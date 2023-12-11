import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {IProfile} from "../../shared/models/profile.model";


export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Load Profile': emptyProps(),
    'Update Profile': props<IProfile>(),
  },
});

export const ProfileApiActions = createActionGroup({
  source: 'Profile API',
  events: {
    'Profile Loaded Success': props<{ profile: IProfile | null }>(),
    'Profile Loaded Error': props<{ error: { message: string } }>(),
  },
});

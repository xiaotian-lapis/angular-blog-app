import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {ProfileActions, ProfileApiActions} from '../actions/profile.action';
import {IProfile} from '../../shared/models/profile.model';
import {ViewStatus} from "../../shared/constants/status.constant";

export interface ProfileState extends EntityState<IProfile> {
  error: any;
  viewStatus: ViewStatus;
}

export const adapter: EntityAdapter<IProfile> = createEntityAdapter();

export const initialState: ProfileState = adapter.getInitialState({
  error: null,
  viewStatus: ViewStatus.Initial,
});

export const profileReducer = createReducer(
  initialState,
  on(ProfileActions.loadProfile, state => {
    console.log('loadProfile action triggered');
    if (state.viewStatus === ViewStatus.Initial) {
      return {...state, viewStatus: ViewStatus.Loading};
    } else {
      // if already initialized, just set view status to reloading,
      // and prevent loading from backend api
      return {...state, viewStatus: ViewStatus.Reloading};
    }
  }),
  on(
    ProfileActions.updateProfile,
    (state, {id, name, email, bio, password, age, updatedTime}) => {
      console.log('updateProfile reducer triggered');
      console.log(state.entities);
      const changes = {name, email, bio, password, age, updatedTime};
      return adapter.updateOne({id, changes}, state);
    }
  ),
  on(ProfileApiActions.profileLoadedSuccess, (state, {profile}) => {
    if (profile == null) {
      // if incoming profile is null, just set loading state to false.
      console.log(
        'profileLoadedSuccess reducer triggered, and profile is null'
      );
      return {...state, viewStatus: ViewStatus.Success};
    }
    console.log(
      'profileLoadedSuccess reducer triggered, and profile is not null'
    );
    return adapter.addOne(profile, {
      ...state,
      viewStatus: ViewStatus.Success,
    });
  }),
  on(ProfileApiActions.profileLoadedError, (state, {error}) => {
    console.log('profileLoadedError reducer triggered');
    return {...state, error, viewStatus: ViewStatus.Failure};
  })
);

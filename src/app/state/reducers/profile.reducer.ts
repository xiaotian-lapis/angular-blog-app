import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {createReducer, on} from "@ngrx/store";
import {ProfileActions, ProfileApiActions} from "../actions/profile.action";
import {IProfile} from "../../shared/models/profile.model";

export interface ProfileState extends EntityState<IProfile> {
  loading: boolean;
  error: any;
  initialized: boolean;
};

export const adapter: EntityAdapter<IProfile> = createEntityAdapter();

export const initialState: ProfileState = adapter.getInitialState({
  loading: false,
  error: null,
  initialized: false,
});

export const profileReducer = createReducer(
  initialState,
  on(ProfileActions.loadProfile, (state) => {
    console.log("loadProfile action triggered");
    return {...state, loading: true, error: null};
  }),
  on(ProfileActions.updateProfile, (state, {
    id,
    name,
    email,
    bio,
    password,
    age,
    updatedTime,
  }) => {
    console.log("updateProfile reducer triggered")
    console.log(state.entities)
    const changes = {name, email, bio, password, age, updatedTime};
    return adapter.updateOne({id, changes}, state);
  }),
  on(ProfileApiActions.profileLoadedSuccess, (state, {profile}) => {
    if (profile == null) {
      // if incoming profile is null, just set loading state to false.
      console.log("profileLoadedSuccess reducer triggered, and profile is null");
      return {...state, loading: false};
    }
    console.log("profileLoadedSuccess reducer triggered, and profile is not null");
    return adapter.addOne(profile, {...state, loading: false, initialized: true});
  }),
  on(ProfileApiActions.profileLoadedError, (state, {error}) => {
    console.log("profileLoadedError reducer triggered");
    return {...state, loading: false, error};
  }),
);

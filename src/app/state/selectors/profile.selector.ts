import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PROFILE_STATE_NAME } from '../../shared/constants/state.constant';
import { adapter, ProfileState } from '../reducers/profile.reducer';

export const selectProfileState =
  createFeatureSelector<ProfileState>(PROFILE_STATE_NAME);

export const {
  selectIds: selectProfileIds,
  selectEntities: selectProfileEntities,
  selectAll: selectAllProfiles,
  selectTotal: selectTotalProfiles,
} = adapter.getSelectors(selectProfileState);

export const selectProfilesLoading = createSelector(
  selectProfileState,
  (state: ProfileState) => state.loading
);

export const selectProfilesError = createSelector(
  selectProfileState,
  (state: ProfileState) => state.error
);

export const selectProfilesInitialized = createSelector(
  selectProfileState,
  (state: ProfileState) => state.initialized
);

export const selectProfileById = (id: string) =>
  createSelector(selectProfileEntities, entities => {
    console.log('selectProfileById selector triggered');
    if (entities) {
      return entities[id];
    } else {
      return undefined;
    }
  });

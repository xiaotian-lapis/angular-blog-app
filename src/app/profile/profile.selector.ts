import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PROFILE_STATE_NAME } from '../shared/constants/state.constant';
import { adapter, IProfileState } from './profile.reducer';

export const selectProfileState =
  createFeatureSelector<IProfileState>(PROFILE_STATE_NAME);

export const {
  selectIds: selectProfileIds,
  selectEntities: selectProfileEntities,
  selectAll: selectAllProfiles,
  selectTotal: selectTotalProfiles,
} = adapter.getSelectors(selectProfileState);

export const selectProfilesError = createSelector(
  selectProfileState,
  (state: IProfileState) => state.error,
);

export const selectProfilesViewStatus = createSelector(
  selectProfileState,
  (state: IProfileState) => state.viewStatus,
);

export const selectProfileById = (id: string) =>
  createSelector(selectProfileEntities, (entities) => {
    console.log('selectProfileById selector triggered');
    if (entities) {
      return entities[id];
    } else {
      return undefined;
    }
  });

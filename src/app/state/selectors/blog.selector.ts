import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, BlogState} from "../reducers/blog.reducer";
import {Blog} from "../../shared/models/blog.model";
import {BLOGS_STATE_NAME} from "../../shared/constants/state.constant";

export const selectBlogState = createFeatureSelector<BlogState>(BLOGS_STATE_NAME);

export const {
  selectIds: selectBlogIds,
  selectEntities: selectBlogEntities,
  selectAll: selectAllBlogs,
  selectTotal: selectTotalBlogs,
} = adapter.getSelectors(selectBlogState);

export const selectBlogsLoading = createSelector(
  selectBlogState,
  (state: BlogState) => state.loading
);

export const selectBlogsError = createSelector(
  selectBlogState,
  (state: BlogState) => state.error
);

export const selectBlogsInitialized = createSelector(
  selectBlogState,
  (state: BlogState) => state.initialized
);

export const selectBlogById = createSelector(
  selectBlogEntities,
  (entities: any, props: { id: string }) => entities[props.id] as Blog
);

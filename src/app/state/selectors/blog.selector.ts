import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, BlogState} from "../reducers/blog.reducer";

export const selectBlogState = createFeatureSelector<BlogState>('blogs');

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

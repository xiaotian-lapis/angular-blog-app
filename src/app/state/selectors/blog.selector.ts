import {createFeatureSelector} from '@ngrx/store';
import {adapter, BlogState} from "../reducers/blog.reducer";

export const selectBlogState = createFeatureSelector<BlogState>('blogs');

export const {
    selectIds: selectBlogIds,
    selectEntities: selectBlogEntities,
    selectAll: selectAllBlogs,
    selectTotal: selectTotalBlogs,
} = adapter.getSelectors(selectBlogState);

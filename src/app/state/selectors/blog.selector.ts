import {createFeatureSelector} from '@ngrx/store';
import {adapter, BlogState} from "../reducers/blog.reducer";


// Select the feature state
export const selectBlogState = createFeatureSelector<BlogState>('blogs');

// Use the selectors provided by the entity adapter
export const {
    selectIds: selectBlogIds,
    selectEntities: selectBlogEntities,
    selectAll: selectAllBlogs,
    selectTotal: selectTotalBlogs,
} = adapter.getSelectors(selectBlogState);

import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {Blog} from '../../shared/models/blog.model';
import {BlogActions, BlogApiActions} from '../actions/blog.action';

export interface BlogState extends EntityState<Blog> {
}

export const adapter: EntityAdapter<Blog> = createEntityAdapter<Blog>();

export const initialState: BlogState = adapter.getInitialState();

export const blogReducer = createReducer(
    initialState,
    on(BlogApiActions.retrievedBlogList, (state, {blogs}) => {
        // TODO debug need to remove
        console.log("retrievedBlogList reducer triggered")
        console.log(state.entities)
        return adapter.setAll(blogs, state);
    }),
    on(BlogActions.addBlog, (state, {id, author, title, description, content, createdTime}) => {
        // TODO debug need to remove
        console.log("addBlog reducer triggered")
        console.log(state.entities)
        const newBlog: Blog = {id, author, title, description, content, createdTime, updatedTime: createdTime};
        return adapter.addOne(newBlog, state);
    }),
    on(BlogActions.updateBlog, (state, {id, author, title, description, content, updatedTime}) => {
        // TODO debug need to remove
        console.log("updateBlog reducer triggered")
        console.log(state.entities)
        const changes = {author, title, description, content, updatedTime};
        return adapter.updateOne({id, changes}, state);
    }),
    on(BlogActions.removeBlog, (state, {id}) => {
        // TODO debug need to remove
        console.log("removeBlog reducer triggered")
        console.log(state.entities)
        return adapter.removeOne(id, state);
    }),
    on(BlogApiActions.retrievedBlog, (state, {blog}) => adapter.upsertOne(blog, state))
);

import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Blog } from '../../shared/models/blog.model';
import { BlogActions, BlogApiActions } from '../actions/blog.action';

// Define the state interface
export interface BlogState extends EntityState<Blog> {}

// Create the entity adapter
export const adapter: EntityAdapter<Blog> = createEntityAdapter<Blog>();

// Define the initial state
export const initialState: BlogState = adapter.getInitialState();

// Create the reducer
export const blogReducer = createReducer(
    initialState,
    on(BlogApiActions.retrievedBlogList, (state, { blogs }) => adapter.setAll(blogs, state)),
    on(BlogActions.addBlog, (state, { id, author, title, description, content, createdTime }) => {
        const newBlog: Blog = { id, author, title, description, content, createdTime, updatedTime: createdTime };
        return adapter.addOne(newBlog, state);
    }),
    on(BlogActions.updateBlog, (state, { id, author, title, description, content, updatedTime }) => {
        const changes = { author, title, description, content, updatedTime };
        return adapter.updateOne({ id, changes }, state);
    }),
    on(BlogActions.removeBlog, (state, { id }) => adapter.removeOne(id, state)),
    on(BlogApiActions.retrievedBlog, (state, { blog }) => adapter.upsertOne(blog, state))
);

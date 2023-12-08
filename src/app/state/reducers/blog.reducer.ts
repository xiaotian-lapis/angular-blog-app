import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {IBlog} from '../../shared/models/blog.model';
import {BlogActions, BlogApiActions} from '../actions/blog.action';

export interface BlogState extends EntityState<IBlog> {
  loading: boolean;
  error: any;
  initialized: boolean;
}

export const adapter: EntityAdapter<IBlog> = createEntityAdapter<IBlog>();

export const initialState: BlogState = adapter.getInitialState({
  loading: false,
  error: null,
  initialized: false,
});

export const blogReducer = createReducer(
  initialState,
  on(BlogActions.loadBlogs, (state) => {
    console.log("loadBlogs action triggered");
    return {...state, loading: true, error: null};
  }),
  on(BlogActions.addBlog, (state, {
    id,
    author,
    title,
    description,
    content,
    createdTime
  }) => {
    console.log("addBlog reducer triggered")
    console.log(state.entities)
    const newBlog: IBlog = {id, author, title, description, content, createdTime, updatedTime: createdTime};
    return adapter.addOne(newBlog, state);
  }),
  on(BlogActions.updateBlog, (state, {
    id,
    author,
    title,
    description,
    content,
    updatedTime
  }) => {
    console.log("updateBlog reducer triggered")
    console.log(state.entities)
    const changes = {author, title, description, content, updatedTime};
    return adapter.updateOne({id, changes}, state);
  }),
  on(BlogActions.removeBlog, (state, {id}) => {
    console.log("removeBlog reducer triggered")
    console.log(state.entities)
    return adapter.removeOne(id, state);
  }),
  on(BlogApiActions.blogsLoadedSuccess, (state, {blogs}) => {
    if (blogs == null) {
      // if incoming blogs is null, just set loading state to false.
      console.log("blogsLoadedSuccess reducer triggered, and blogs is null");
      return {...state, loading: false, error: null};
    }
    console.log("blogsLoadedSuccess reducer triggered")
    console.log(state.entities)
    return adapter.setAll(blogs, {...state, loading: false, error: null, initialized: true});
  }),
  on(BlogApiActions.blogsLoadedError, (state, {error}) => {
    console.log("blogsLoadedError reducer triggered")
    console.log(state.entities)
    return {...state, loading: false, error: error.message};
  }),
);

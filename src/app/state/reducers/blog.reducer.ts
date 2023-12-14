import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {IBlog} from '../../shared/models/blog.model';
import {BlogActions, BlogApiActions} from '../actions/blog.action';
import {ViewStatus} from "../../shared/constants/status.constant";

export interface BlogState extends EntityState<IBlog> {
  error: any;
  viewStatus: ViewStatus;
}

export const adapter: EntityAdapter<IBlog> = createEntityAdapter<IBlog>();

export const initialState: BlogState = adapter.getInitialState({
  error: null,
  viewStatus: ViewStatus.Initial,
});

export const blogReducer = createReducer(
  initialState,
  on(BlogActions.loadBlogs, state => {
    console.log('loadBlogs action triggered');
    if (state.viewStatus === ViewStatus.Initial) {
      return {...state, viewStatus: ViewStatus.Loading};
    } else {
      // if already initialized, just set view status to reloading,
      // and prevent loading blogs from backend api
      return {...state, viewStatus: ViewStatus.Reloading};
    }

  }),
  on(
    BlogActions.addBlog,
    (
      state,
      {id, author, title, description, content, createdTime, location}
    ) => {
      console.log('addBlog reducer triggered');
      console.log(state.entities);
      const newBlog: IBlog = {
        id,
        author,
        title,
        description,
        content,
        createdTime,
        updatedTime: createdTime,
        location: location,
      };
      return adapter.addOne(newBlog, state);
    }
  ),
  on(
    BlogActions.updateBlog,
    (
      state,
      {id, author, title, description, content, updatedTime, location}
    ) => {
      console.log('updateBlog reducer triggered');
      console.log(state.entities);
      const changes = {
        author,
        title,
        description,
        content,
        updatedTime,
        location,
      };
      return adapter.updateOne({id, changes}, state);
    }
  ),
  on(BlogActions.removeBlog, (state, {id}) => {
    console.log('removeBlog reducer triggered');
    console.log(state.entities);
    return adapter.removeOne(id, state);
  }),
  on(BlogApiActions.blogsLoadedSuccess, (state, {blogs}) => {
    if (blogs == null) {
      // if incoming blogs is null, just set loading state to false.
      console.log('blogsLoadedSuccess reducer triggered, and blogs is null');
      return {...state, viewStatus: ViewStatus.Success};
    }
    console.log('blogsLoadedSuccess reducer triggered');
    console.log(state.entities);
    return adapter.setAll(blogs, {
      ...state,
      viewStatus: ViewStatus.Success,
    });
  }),
  on(BlogApiActions.blogsLoadedError, (state, {error}) => {
    console.log('blogsLoadedError reducer triggered');
    console.log(state.entities);
    return {...state, error: error.message, viewStatus: ViewStatus.Failure};
  })
);

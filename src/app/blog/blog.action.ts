import { createAction, props } from '@ngrx/store';
import { IBlog } from './blog.model';

/**
 * Blog Actions
 */
export const loadBlogs = createAction('[Blog] Load Blogs');
export const addBlog = createAction(
  '[Blog] Add Blog',
  props<{
    id: string;
    author: string;
    title: string;
    description: string;
    content: string;
    createdTime: Date;
    updatedTime: Date;
    location: {
      lat: number;
      lng: number;
      addr: string;
    };
  }>(),
);
export const removeBlog = createAction(
  '[Blog] Remove Blog',
  props<{ id: string }>(),
);
export const updateBlog = createAction(
  '[Blog] Update Blog',
  props<{
    id: string;
    author: string;
    title: string;
    description: string;
    content: string;
    createdTime: Date;
    updatedTime: Date;
    location: {
      lat: number;
      lng: number;
      addr: string;
    };
  }>(),
);

// Define each action for Blog API
export const blogsLoadedSuccess = createAction(
  '[Blog API] Blogs Loaded Success',
  props<{ blogs: IBlog[] | null }>(),
);
export const blogsLoadedError = createAction(
  '[Blog API] Blogs Loaded Error',
  props<{ error: { message: string } }>(),
);

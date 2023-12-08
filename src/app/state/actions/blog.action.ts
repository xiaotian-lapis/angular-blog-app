import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {Blog} from "../../shared/models/blog.model";

/**
 * Blog Actions
 */
export const BlogActions = createActionGroup({
  source: 'Blog',
  events: {
    'Load Blogs': emptyProps(),
    'Add Blog': props<{
      id: string,
      author: string,
      title: string,
      description: string,
      content: string,
      createdTime: Date,
      updatedTime: Date,
    }>(),
    'Remove Blog': props<{
      id: string,
    }>(),
    'Update Blog': props<{
      id: string,
      author: string,
      title: string,
      description: string,
      content: string,
      createdTime: Date,
      updatedTime: Date,
    }>(),
  },

});

/**
 * Blog API Actions
 */
export const BlogApiActions = createActionGroup({
  source: 'Blog API',
  events: {
    'Blogs Loaded Success': props<{ blogs: Blog[] | null }>(),  // Action for successful blog load
    'Blogs Loaded Error': emptyProps(),  // Action for error in loading blogs
  },
});

import {createActionGroup, props} from "@ngrx/store";
import {Blog} from "../../shared/models/blog.model";

/**
 * Blog Actions
 */
export const BlogActions = createActionGroup({
    source: 'Blog',
    events: {
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
        'Get Blog by ID': props<{ id: string }>(),
    },

});

/**
 * Blog API Actions
 */
export const BlogApiActions = createActionGroup({
    source: 'Blog API',
    events: {
        'Retrieved Blog List': props<{
            blogs: Blog[],
        }>(),
        'Retrieved Blog': props<{ blog: Blog }>(),
    }
});

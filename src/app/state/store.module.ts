import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {blogReducer} from "./reducers/blog.reducer";


@NgModule({
    imports: [
        StoreModule.forRoot({blogs: blogReducer}), // Root store configuration
    ]
})
export class StoreRootModule {
}

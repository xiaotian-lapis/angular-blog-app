import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {BlogContentComponent} from "./components/blog-content/blog-content.component";
import {ProfileComponent} from "./pages/profile/profile.component";

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'blog/:id', component: BlogContentComponent},
    {path: 'profile', component: ProfileComponent},
];

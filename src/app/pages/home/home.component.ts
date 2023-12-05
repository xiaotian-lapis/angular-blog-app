import { Component } from '@angular/core';
import {BlogListComponent} from "../../components/blog-list/blog-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BlogListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

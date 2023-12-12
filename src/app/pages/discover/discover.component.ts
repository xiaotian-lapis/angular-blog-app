import {Component, OnInit} from '@angular/core';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {icon, latLng, Layer, marker, tileLayer} from "leaflet";
import {Store} from "@ngrx/store";
import {selectAllBlogs} from "../../state/selectors/blog.selector";
import {BlogActions} from "../../state/actions/blog.action";
import {Router} from "@angular/router";

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    LeafletModule
  ],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css'
})
export class DiscoverComponent implements OnInit {

  constructor(
    private store: Store,
    private router: Router,
  ) {
  }

  options = {
    layers: [
      tileLayer(
        'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
        {maxZoom: 18, attribution: '...'})
    ],
    zoom: 15,
    center: latLng(-37.81638808755261, 144.9566792258329)
  };

  // Array to hold the markers
  layers: Layer[] = [];

  selectBlogs$ = this.store.select(selectAllBlogs);

  ngOnInit(): void {

    // dispatch load action to load logs into store
    this.store.dispatch(BlogActions.loadBlogs());

    this.selectBlogs$.subscribe(blogs => {
      console.log("blogs for discover page: ", blogs);
      this.layers = blogs.map(
        blog => {
          const popupContent =
            `
              <h3>${blog.title}</h3>
              <strong>By: ${blog.author}</strong>
              <hr>
              <button id="view-blog-${blog.id}" class="leaflet-popup-button">View</button>
            `;

          const blogMarker = marker(
            [blog.location.lat, blog.location.lng],
            {
              title: blog.title,
              riseOnHover: true,
              icon: icon({
                iconUrl: './assets/marker-icon.png',
                iconSize: [20, 35]
              })
            }
          ).bindPopup(popupContent);

          // attach event listener to the button for jumping to blog page
          blogMarker.on('popupopen', () => {
            const button = document.getElementById(`view-blog-${blog.id}`);
            button?.addEventListener('click', () => {
              this.router.navigate(['/blog', blog.id]);
            });
          });

          return blogMarker;
        }
      )
    });
  }
}

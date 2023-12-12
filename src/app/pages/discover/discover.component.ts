import {Component, OnInit} from '@angular/core';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {Store} from "@ngrx/store";
import {selectAllBlogs} from "../../state/selectors/blog.selector";
import {BlogActions} from "../../state/actions/blog.action";
import {Router} from "@angular/router";
import {LeafletMarkerClusterModule} from "@asymmetrik/ngx-leaflet-markercluster";

console.log(window.L === L)
console.log(typeof L.MarkerClusterGroup)

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    LeafletModule,
    LeafletMarkerClusterModule,
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
      L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
    ],
    zoom: 15,
    center: L.latLng(-37.81638808755261, 144.9566792258329)
  };

  // Array to hold the markers
  markerClusterData: L.Layer[] = [];

  selectBlogs$ = this.store.select(selectAllBlogs);

  ngOnInit(): void {

    // dispatch load action to load logs into store
    this.store.dispatch(BlogActions.loadBlogs());

    this.selectBlogs$.subscribe(blogs => {
      console.log("blogs for discover page: ", blogs);
      this.markerClusterData = blogs.map(
        blog => {
          const popupContent =
            `
              <h3>${blog.title}</h3>
              <strong>By: ${blog.author}</strong>
              <hr>
              <button id="view-blog-${blog.id}" class="leaflet-popup-button">View</button>
            `;

          const blogMarker = L.marker(
            [blog.location.lat, blog.location.lng],
            {
              title: blog.title,
              riseOnHover: true,
              icon: L.icon({
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

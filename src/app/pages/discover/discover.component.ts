import {Component, OnInit} from '@angular/core';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {icon, latLng, Layer, marker, tileLayer} from "leaflet";
import {Store} from "@ngrx/store";
import {selectAllBlogs} from "../../state/selectors/blog.selector";

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
  ) {
  }

  options = {
    layers: [
      tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 18, attribution: '...' })
    ],
    zoom: 15,
    center: latLng(-37.81638808755261, 144.9566792258329)
  };

  // Array to hold the markers
  layers: Layer[] = [];

  selectBlogs$ = this.store.select(selectAllBlogs);

  ngOnInit(): void {
    this.selectBlogs$.subscribe(blogs => {
      console.log("blogs for discover page: ", blogs);
      this.layers = blogs.map(
        blog => {
          return marker(
            [blog.location.lat, blog.location.lng],
            {
              title: blog.title,
              riseOnHover: true,
              icon: icon({
                iconUrl: './assets/marker-icon.png',
                iconSize: [30, 40]
              })
            }
          ).bindPopup(`
            <h3>${blog.title}</h3>
            <a>View</a>`
          );
        }
      )
    });
  }
}

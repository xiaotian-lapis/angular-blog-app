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
  markerClusterGroup!: L.MarkerClusterGroup;
  markerClusterData: L.Layer[] = [];

  selectBlogs$ = this.store.select(selectAllBlogs);

  map!: L.Map;
  legend!: L.Control;

  ngOnInit(): void {

    this.initializeMap();
    this.createLegend();

    // dispatch load action to load logs into store
    this.store.dispatch(BlogActions.loadBlogs());

    this.selectBlogs$.subscribe(blogs => {
      console.log("blogs for discover page: ", blogs);
      this.updateMarkers(blogs);
    });
  }

  initializeMap(): void {
    this.map = L.map('discovery-map', this.options); // Ensure 'map' is the ID of your map container

    const markerCluster = L.markerClusterGroup();
    markerCluster.addLayers(this.markerClusterData);
    this.map.addLayer(markerCluster);
  }

  createLegend(): void {
    const legend = L.Control.extend({
      options: {
        position: 'bottomright'
      },

      onAdd: function (map: L.Map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        let legendHtml = `
        <h4>Map Legend</h4>
        <div><span style="background-color: red; height: 10px; width: 10px; display: inline-block; margin-right: 5px;"></span>Blogs</div>
      `;
        div.innerHTML = legendHtml;
        return div;
      }
    });

    this.legend = new legend();
    this.legend.addTo(this.map);
  }


  updateMarkers(blogs: any[]): void {
    this.markerClusterData = blogs.map(blog => {
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
    });

    this.updateMarkerCluster(); // Update the marker cluster after creating new markers
  }

  updateMarkerCluster(): void {
    try {
      if (this.map && this.markerClusterGroup) {
        this.map.removeLayer(this.markerClusterGroup);
      }
    } catch (error) {
      console.error('Error removing marker cluster group from map:', error);
    }

    this.markerClusterGroup = L.markerClusterGroup();
    this.markerClusterGroup.addLayers(this.markerClusterData);
    this.map.addLayer(this.markerClusterGroup);
  }
}

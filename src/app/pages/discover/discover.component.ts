import { Component, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Store } from '@ngrx/store';
import {
  selectAllBlogs,
  selectBlogsLoading,
} from '../../state/selectors/blog.selector';
import { BlogActions } from '../../state/actions/blog.action';
import { Router } from '@angular/router';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { catchError, distinctUntilChanged, map, Observable, of } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  BASEMAP_URL,
  L_COORDINATE_MELBOURNE,
  MAP_MAX_ZOOM,
} from '../../shared/constants/geo.constant';
import { LocationService } from '../../services/location.service';
import { SearchControl } from 'leaflet-geosearch';

console.log(window.L === L);
console.log(typeof L.MarkerClusterGroup);

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [LeafletModule, LeafletMarkerClusterModule, AsyncPipe, NgIf],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.css',
})
export class DiscoverComponent implements OnInit {
  // map options
  options = {
    layers: [
      L.tileLayer(BASEMAP_URL, {
        maxZoom: MAP_MAX_ZOOM,
      }),
    ],
    zoom: MAP_MAX_ZOOM,
    center: L_COORDINATE_MELBOURNE,
  };
  // Array to hold the markers
  markerClusterGroup: L.MarkerClusterGroup = L.markerClusterGroup();
  // selector for the blogs
  selectBlogs$ = this.store.select(selectAllBlogs);
  loading$: Observable<boolean> = this.store.select(selectBlogsLoading);
  // map instance
  map!: L.Map;

  constructor(
    private store: Store,
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.initializeMap();
    this.createLegend();
    this.createScale();
    this.createGetSearch();

    // dispatch load action to load logs into store
    this.store.dispatch(BlogActions.loadBlogs());

    // convert the blogs to marker observables
    const markerClusterData$ = this.selectBlogs$.pipe(
      map(blogs => this.transformBlogsToMarkers(blogs)),
      distinctUntilChanged(),
      catchError(error => {
        console.error('Error processing blog data:', error);
        return of([]);
      })
    );

    // Subscribe to the markerClusterData$ observable
    markerClusterData$.subscribe(markerData => {
      try {
        this.markerClusterGroup.addLayers(markerData);
      } catch (error) {
        console.error('Error updating marker cluster:', error);
      }
    });
  }

  /**
   * Initialize the map
   */
  private initializeMap(): void {
    this.map = L.map('discovery-map', this.options);
    this.map.locate({ setView: true, maxZoom: MAP_MAX_ZOOM });
    this.map.addLayer(this.markerClusterGroup);
  }

  /**
   * Create the legend for the map
   */
  private createLegend(): void {
    const legend = L.Control.extend({
      options: {
        position: 'bottomright',
      },

      onAdd: function (map: L.Map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        const legendHtml = `
        <h4>Map Legend</h4>
        <div><span style="background-color: red; height: 10px; width: 10px; display: inline-block; margin-right: 5px;"></span>Blogs</div>
      `;
        div.innerHTML = legendHtml;
        return div;
      },
    });

    // add the legend to the map
    new legend().addTo(this.map);
  }

  /**
   * Create the scale bar for the map
   * @private
   */
  private createScale(): void {
    L.control.scale().addTo(this.map);
  }

  private createGetSearch(): void {
    // @ts-ignore
    const searchControl = new SearchControl({
      provider: this.locationService.getGeoSearchProvider(),
      style: 'bar',
      showMarker: true,
      showPopup: true,
      notFoundMessage: 'Sorry, that address could not be found.',
      marker: {
        icon: L.icon({
          iconUrl: './assets/red-marker.png',
          iconSize: [35, 35],
        }),
      },
    });

    this.map.addControl(searchControl);
  }

  /**
   * construct the marker Layers from the blog data
   * @param blogs
   * @private
   */
  private transformBlogsToMarkers(blogs: any[]): L.Layer[] {
    return blogs.map(blog => {
      const popupContent = `
              <h3>${blog.title}</h3>
              <strong>By: ${blog.author}</strong>
              <hr>
              <button id="view-blog-${blog.id}" class="leaflet-popup-button">View</button>
            `;

      const blogMarker = L.marker([blog.location.lat, blog.location.lng], {
        title: blog.title,
        riseOnHover: true,
        icon: L.icon({
          iconUrl: './assets/marker-icon.png',
          shadowUrl: './assets/marker-shadow.png',
          iconSize: [20, 35],
        }),
      }).bindPopup(popupContent);

      // attach event listener to the button for jumping to blog page
      blogMarker.on('popupopen', () => {
        const button = document.getElementById(`view-blog-${blog.id}`);
        button?.addEventListener('click', () => {
          this.router.navigate(['/blog', blog.id]);
        });
      });

      return blogMarker;
    });
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-draw';
import 'leaflet-measure';
import { Store } from '@ngrx/store';
import { selectAllBlogs, selectBlogsViewStatus } from '../blog/blog.selector';
import * as BlogActions from '../blog/blog.action';
import { Router } from '@angular/router';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { catchError, distinctUntilChanged, map, of, Subscription } from 'rxjs';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import {
  BASEMAP_URL,
  L_COORDINATE_MELBOURNE,
  MAP_MAX_ZOOM,
} from '../shared/constants/geo.constant';
import { LocationService } from '../shared/services/location.service';
import { SearchControl } from 'leaflet-geosearch';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ViewStatus } from '../shared/constants/status.constant';
import { equals, or } from '../shared/utils/ramda-functions.util';
import {
  blogMarkerIcon,
  blueMarkerIcon,
  redMarkerIcon,
} from '../shared/resource/map/marker-icon.resource';
import { CoordinatesControl } from './map-controls/coordinates.control';
import { measureControl } from './map-controls/measure.control';
import { LegendControl } from './map-controls/legend.control';
import { IBlogState } from '../blog/blog.reducer';

// fix rect draw issue: https://github.com/Leaflet/Leaflet.draw/issues/1026
// @ts-expect-error - fix rect draw issue
window.type = '';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [
    LeafletModule,
    LeafletMarkerClusterModule,
    AsyncPipe,
    NgIf,
    LeafletDrawModule,
    FileUploadComponent,
    JsonPipe,
  ],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.scss',
})
export class DiscoverComponent implements OnInit, OnDestroy {
  private blogStore = inject(Store<IBlogState>);
  private router = inject(Router);
  private locationService = inject(LocationService);

  // layer for drawn items
  drawnItemsLayer: L.FeatureGroup = L.featureGroup();

  // blog marker cluster layer
  blogMarkerClusterGroupLayer: L.MarkerClusterGroup = L.markerClusterGroup();

  // GeoJson data layer
  geoJsonDataLayer = L.geoJson();

  // map instance
  map!: L.Map;

  // map options
  options = {
    layers: [
      L.tileLayer(BASEMAP_URL, {
        maxZoom: MAP_MAX_ZOOM,
      }),
    ],
    zoom: 15,
    center: L_COORDINATE_MELBOURNE,
  };

  // leaflet draw options
  drawOptions = {
    draw: {
      marker: {
        icon: blueMarkerIcon,
      },
    },
    edit: {
      featureGroup: this.drawnItemsLayer,
    },
  };

  // selector for the blog
  selectBlogs$ = this.blogStore.select(selectAllBlogs);
  selectBlogViewStatus$ = this.blogStore.select(selectBlogsViewStatus);
  protected readonly ViewStatus = ViewStatus;
  private subscription = new Subscription();

  ngOnInit(): void {
    console.log('DiscoverComponent initialized');
    // dispatch load action to load logs into store
    this.blogStore.dispatch(BlogActions.loadBlogs());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Adds the created layer to the drawnItems layer group.
   *
   * @param e - The event object containing the created layer.
   */
  onDrawCreated(e: any) {
    this.drawnItemsLayer.addLayer((e as L.DrawEvents.Created).layer);
  }

  /**
   * Hook of map ready event
   *
   * @param {L.Map} map - The Leaflet map object from html event input.
   */
  onMapReady(map: L.Map) {
    console.log('map ready', map);
    this.map = map;
    this.initializeMap();
  }

  /**
   * Handle the GeoJSON data.
   */
  handleGeoJson = (data: any) => {
    this.geoJsonDataLayer.addData(data);
    console.log('Received GeoJSON:', data);
  };

  /**
   * Initialize the map
   */
  private initializeMap(): void {
    // zoom the map to the user's current location
    this.map.locate({ setView: true, maxZoom: 15 });

    // init UI Layers
    this.createLegend();
    this.createScale();
    this.createMeasure();
    this.createCoordinates();
    this.createGeoSearch();

    // convert the blog to marker observables
    const markerClusterData$ = this.selectBlogs$.pipe(
      map((blogs) => this.transformBlogsToMarkers(blogs)),
      distinctUntilChanged(),
      catchError((error) => {
        console.error('Error processing blog data:', error);
        return of([]);
      }),
    );

    // Subscribe to the markerClusterData$ observable
    this.subscription.add(
      markerClusterData$.subscribe((markerData) => {
        try {
          this.blogMarkerClusterGroupLayer.addLayers(markerData);
        } catch (error) {
          console.error('Error updating marker cluster:', error);
        }
      }),
    );
  }

  /**
   * Create the legend for the map
   */
  private createLegend(): void {
    this.map.addControl(new LegendControl());
  }

  /**
   * Create the scale bar for the map
   * @private
   */
  private createScale(): void {
    L.control.scale().addTo(this.map);
  }

  /**
   * Creates a measure control and adds it to the map.
   *
   * @private
   */
  private createMeasure(): void {
    this.map.addControl(measureControl);
  }

  private createCoordinates(): void {
    this.map.addControl(new CoordinatesControl());
  }

  private createGeoSearch(): void {
    // @ts-expect-error - referred from the leaflet-geosearch example
    const searchControl = new SearchControl({
      provider: this.locationService.getGeoSearchProvider(),
      style: 'bar',
      showMarker: true,
      showPopup: true,
      notFoundMessage: 'Sorry, that address could not be found.',
      marker: {
        icon: redMarkerIcon,
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
    return blogs.map((blog) => {
      const popupContent = `
              <h3>${blog.title}</h3>
              <strong>By: ${blog.author}</strong>
              <hr>
              <button id="view-blog-${blog.id}" class="leaflet-popup-button">View</button>
            `;

      const blogMarker = L.marker([blog.location.lat, blog.location.lng], {
        title: blog.title,
        riseOnHover: true,
        icon: blogMarkerIcon,
      }).bindPopup(popupContent);

      // attach event listener to the button for jumping to blog page
      blogMarker.on('popupopen', () => {
        const button = document.getElementById(`view-blog-${blog.id}`);
        button?.addEventListener('click', () => {
          this.router.navigate(['/blog', blog.id]).then((r) => r);
        });
      });

      return blogMarker;
    });
  }

  protected readonly equals = equals;
  protected readonly or = or;
}

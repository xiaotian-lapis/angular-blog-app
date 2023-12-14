import {Component, OnDestroy, OnInit} from '@angular/core';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-draw';
import {Store} from '@ngrx/store';
import {selectAllBlogs, selectBlogsViewStatus,} from '../../state/selectors/blog.selector';
import {BlogActions} from '../../state/actions/blog.action';
import {Router} from '@angular/router';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
import {catchError, distinctUntilChanged, map, of, Subscription} from 'rxjs';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';
import {BASEMAP_URL, L_COORDINATE_MELBOURNE, MAP_MAX_ZOOM,} from '../../shared/constants/geo.constant';
import {LocationService} from '../../services/location.service';
import {SearchControl} from 'leaflet-geosearch';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import {FileUploadComponent} from '../../components/file-upload/file-upload.component';
import {ViewStatus} from "../../shared/constants/status.constant";

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
  styleUrl: './discover.component.css',
})
export class DiscoverComponent implements OnInit, OnDestroy {
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
    zoom: MAP_MAX_ZOOM,
    center: L_COORDINATE_MELBOURNE,
  };

  // leaflet draw options
  drawOptions = {
    draw: {
      marker: {
        icon: L.icon({
          iconUrl: './assets/marker-icon.png',
          iconSize: [35, 35],
        }),
      },
    },
    edit: {
      featureGroup: this.drawnItemsLayer,
    },
  };

  // selector for the blogs
  selectBlogs$ = this.store.select(selectAllBlogs);
  selectBlogViewStatus$ = this.store.select(selectBlogsViewStatus);
  protected readonly ViewStatus = ViewStatus;
  private subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private locationService: LocationService
  ) {
  }

  ngOnInit(): void {
    console.log('DiscoverComponent initialized');
    // dispatch load action to load logs into store
    this.store.dispatch(BlogActions.loadBlogs());
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
    this.map.locate({setView: true, maxZoom: MAP_MAX_ZOOM});

    // init UI Layers
    this.createLegend();
    this.createScale();
    this.createGeoSearch();

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
    this.subscription.add(
      markerClusterData$.subscribe(markerData => {
        try {
          this.blogMarkerClusterGroupLayer.addLayers(markerData);
        } catch (error) {
          console.error('Error updating marker cluster:', error);
        }
      })
    );
  }

  /**
   * Create the legend for the map
   */
  private createLegend(): void {
    const legend = L.Control.extend({
      options: {
        position: 'bottomright',
      },

      onAdd: function () {
        const div = L.DomUtil.create('div', 'info legend');
        div.style.backgroundColor = 'white';
        div.innerHTML = `
        <h4>Map Legend</h4>
        <div>
        <span style="background-color: red; height: 10px;
            width: 10px; display: inline-block; margin-right: 5px;">
        </span>
        Blogs
        </div>
      `;
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

  private createGeoSearch(): void {
    // @ts-expect-error - referred from the leaflet-geosearch example
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
          this.router.navigate(['/blog', blog.id]).then(r => r);
        });
      });

      return blogMarker;
    });
  }
}

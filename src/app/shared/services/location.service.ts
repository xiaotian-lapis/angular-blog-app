import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly geoSearchProvider;

  constructor() {
    // this.geoSearchProvider = new GoogleProvider(
    //   {
    //     apiKey: environment.googleMapApiKey,
    //   }
    // );
    this.geoSearchProvider = new OpenStreetMapProvider();
  }

  /**
   * Get current position
   */
  getPosition(): Observable<any> {
    return new Observable((observer) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          observer.next({
            lng: resp.coords.longitude,
            lat: resp.coords.latitude,
          });
          observer.complete();
        },
        (err) => {
          observer.error(err);
        },
      );
    });
  }

  /**
   * Get geo search provider
   */
  getGeoSearchProvider() {
    return this.geoSearchProvider;
  }

  /**
   * Get place name by coordinate
   * @param lat
   * @param lng
   */
  getPlaceNameByCoordinate(lat: number, lng: number): Observable<any> {
    return of(this.geoSearchProvider.search({ query: `${lat}, ${lng}` }));
  }

  /**
   * Get coordinate by place name
   * @param placeName
   */
  getCoordinateByPlaceName(placeName: string): Observable<any> {
    return of(this.geoSearchProvider.search({ query: placeName }));
  }
}

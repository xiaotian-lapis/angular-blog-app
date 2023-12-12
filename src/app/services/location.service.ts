import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  getPosition(): Observable<any> {
    return new Observable(observer => {
      navigator.geolocation.getCurrentPosition(
        resp => {
          observer.next({ lng: resp.coords.longitude, lat: resp.coords.latitude });
          observer.complete();
        },
        err => {
          observer.error(err);
        }
      );
    });
  }
}

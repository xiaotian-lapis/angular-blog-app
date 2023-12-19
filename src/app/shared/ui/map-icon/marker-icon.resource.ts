import * as L from 'leaflet';

export const redMarkerIcon = L.icon({
  iconUrl: './assets/red-marker.png',
  iconSize: [25, 35],
  shadowSize: [25, 35],
});

export const blueMarkerIcon = L.icon({
  iconUrl: './assets/marker-icon.png',
  iconSize: [25, 35],
  shadowSize: [25, 35],
});

export const blogMarkerIcon = L.icon({
  iconUrl: './assets/marker-icon.png',
  shadowUrl: './assets/marker-shadow.png',
  iconSize: [25, 35],
  shadowSize: [25, 35],
});

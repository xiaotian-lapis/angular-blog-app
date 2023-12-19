import * as L from 'leaflet';

export const CoordinatesControl = L.Control.extend({
  options: {
    position: 'bottomleft',
  },
  onAdd: (map: L.Map) => {
    const container = L.DomUtil.create('div');
    map.addEventListener('mousemove', (e) => {
      container.innerHTML = `
        <p style="background: white; ">Lng: ${e.latlng.lng.toFixed(
          4,
        )} Lat: ${e.latlng.lat.toFixed(4)} </p>`;
    });

    return container;
  },
});

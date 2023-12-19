import * as L from 'leaflet';

export const LegendControl = L.Control.extend({
  options: {
    position: 'bottomright',
  },

  onAdd: function () {
    const div = L.DomUtil.create('div', 'info legend');
    div.style.backgroundColor = 'white';
    div.innerHTML = `
        <div style="padding: 10px;">
        <h4>Map Legend</h4>
        <span style="background-color: red; height: 10px;
            width: 10px; display: inline-block; margin-right: 5px;">
        </span>
        Blogs
        </div>
      `;
    return div;
  },
});

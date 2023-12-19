import * as L from 'leaflet';
import 'leaflet-easybutton';

export const centerBtnControl = L.easyButton({
  position: 'topright',
  leafletClasses: true,
  states: [
    {
      stateName: 'center',
      onClick: function (btn, map) {
        map.locate({ setView: true });
      },
      title: 'Get Center',
      icon: 'fa-globe',
    },
  ],
});

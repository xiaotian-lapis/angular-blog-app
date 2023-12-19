import * as L from 'leaflet';
import { redMarkerIcon } from '../../shared/ui/map-icon/marker-icon.resource';

// @ts-expect-error - measure plugin doesn't have @types for angular 17
export const measureControl = L.control.measure({
  primaryLengthUnit: 'km',
  primaryAreaUnit: 'km2',
  secondaryLengthUnit: undefined,
  secondaryAreaUnit: undefined,
  units: {
    km: {
      factor: 0.001,
      display: 'km',
      decimals: 2,
    },
    km2: {
      factor: 0.000001,
      display: 'km2 Area',
      decimals: 2,
    },
  },
  marker: {
    icon: redMarkerIcon,
  },
});

import * as L from "leaflet";

// Augment the existing Leaflet types
declare module "leaflet" {
  namespace Routing {
    interface ControlOptions {
      waypoints: L.LatLng[];
      lineOptions?: {
        styles?: Array<{
          color?: string;
          weight?: number;
        }>;
        extendToWaypoints?: boolean;
        missingRouteTolerance?: number;
      };
      show?: boolean;
      addWaypoints?: boolean;
      routeWhileDragging?: boolean;
      draggableWaypoints?: boolean; // The property TypeScript is complaining about
      fitSelectedRoutes?: boolean;
    }

    class Control extends L.Control {
      constructor(options: ControlOptions);
      setWaypoints(waypoints: L.LatLng[]): this;
    }

    function control(options: ControlOptions): Control;
  }
}

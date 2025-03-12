import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingControlProps {
  start: [number, number];
  end: [number, number];
}

const RoutingControl = ({ start, end }: RoutingControlProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Use type assertion to resolve TypeScript error
    const routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: true,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
};

export default RoutingControl;

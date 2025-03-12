import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { Navigation, Crosshair } from "lucide-react";
import { Alert, Box, IconButton, Snackbar } from "@mui/material";
import L from "leaflet";
import "leaflet-routing-machine";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationUpdaterProps {
  onLocationFound: (coords: [number, number]) => void;
}

// Component to handle location updates
const LocationUpdater = ({ onLocationFound }: LocationUpdaterProps) => {
  const map = useMap();

  useEffect(() => {
    map.locate({ watch: true, enableHighAccuracy: true });

    const handleLocationFound = (e: L.LocationEvent) => {
      if (e.latlng) {
        const { lat, lng } = e.latlng;
        onLocationFound([lat, lng]);
      } else {
        console.error("Location data is undefined");
      }
    };

    map.on("locationfound", handleLocationFound);

    return () => {
      map.stopLocate();
      map.off("locationfound", handleLocationFound);
    };
  }, [map, onLocationFound]);

  return null;
};

interface RoutingControlProps {
  start: [number, number];
  end: [number, number];
}

// Component to handle routing
const RoutingControl = ({ start, end }: RoutingControlProps) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start), L.latLng(end)],
      routeWhileDragging: true,
      showAlternatives: true,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#1976d2", weight: 6 }],
      },
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
};

interface CampusMapProps {
  destination?: [number, number];
}

export const CampusMap = ({ destination }: CampusMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [center] = useState<[number, number]>([-33.917, 151.231]); // Default center
  const [error, setError] = useState<string | null>(null);

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(newLocation);
          setError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Couldn't access your location. Please check your browser permissions."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const MapView = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();

    useEffect(() => {
      if (center) {
        map.flyTo(center, 16);
      }
    }, [center, map]);

    return null;
  };

  return (
    <Box sx={{ height: "100vh", width: "100%", position: "relative" }}>
      <IconButton
        onClick={handleGetCurrentLocation}
        sx={{
          position: "absolute",
          top: "80px",
          right: "16px",
          zIndex: 1000,
          backgroundColor: "background.paper",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
        title="Get current location"
      >
        <Crosshair />
      </IconButton>

      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationUpdater onLocationFound={setUserLocation} />

        {/* Add the MapView component to navigate to user location */}
        {userLocation && <MapView center={userLocation} />}

        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Navigation style={{ width: 16, height: 16 }} />
                <span>Your Location</span>
              </Box>
            </Popup>
          </Marker>
        )}

        {userLocation && destination && (
          <RoutingControl start={userLocation} end={destination} />
        )}
      </MapContainer>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

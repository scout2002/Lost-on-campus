import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  // useMapEvents,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import RoutingControl from "./RoutingControl";
import {
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

// Fix icon paths to use default Leaflet icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Navigation2OffIcon } from "lucide-react";

// Create default blue icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Create red icon for clicked location
// Create red icon for clicked location
// const RedIcon = L.icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

// Set default icon for all markers
// L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks
// const MapEvents = ({
//   setDestination,
// }: {
//   setDestination: (position: [number, number]) => void;
// }) => {
//   useMapEvents({
//     click: (e) => {
//       setDestination([e.latlng.lat, e.latlng.lng]);
//     },
//   });
//   return null;
// };

// Component to center map on user location
const LocationMarker = ({
  position,
}: {
  position: [number, number] | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      // Use flyTo for smooth animation when changing position
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return null;
};

interface MapComponentProps {
  destination?: [number, number];
  setDestination: (position: [number, number] | undefined) => void;
}

const MapComponent = ({ destination, setDestination }: MapComponentProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const [initialLocation, setInitialLocation] = useState<[number, number]>([
    51.505, -0.09,
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  // Function to get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }
    setDestination(undefined);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLocation: [number, number] = [latitude, longitude];
        setUserLocation(currentLocation);
        setInitialLocation(currentLocation);
        setError(null);
        setIsLocating(false);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Attempt to get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      {isLocating && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: 2,
            borderRadius: 1,
          }}
        >
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2, color: "white" }}>
            Finding your location...
          </Typography>
        </Box>
      )}

      {/* <Box
        sx={{
          position: "absolute",
          bottom: "70px",
          left: "10px",
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.7)",
          padding: 1,
          borderRadius: 1,
          color: "white",
          maxWidth: "70%",
        }}
      >
        <Typography variant="body2">
          Click anywhere on the map to place a red marker and find a route
        </Typography>
      </Box> */}

      {destination !== undefined && (
        <IconButton
          onClick={() => {
            setDestination(undefined);
            getCurrentLocation();
          }}
          sx={{
            position: "absolute",
            bottom: isMobile ? "90px" : "24px",
            right: "75px",
            zIndex: 1000,
            backgroundColor: theme.palette.background.paper,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            boxShadow: 2,
          }}
          title="Get my location"
        >
          <Navigation2OffIcon />
        </IconButton>
      )}
      <IconButton
        onClick={getCurrentLocation}
        sx={{
          position: "absolute",
          bottom: isMobile ? "90px" : "24px",
          right: "24px",
          zIndex: 1000,
          backgroundColor: theme.palette.background.paper,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          boxShadow: 2,
        }}
        title="Get my location"
      >
        <MyLocationIcon />
      </IconButton>

      <MapContainer
        center={initialLocation}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Add map events handler */}
        {/* <MapEvents setDestination={setDestination} /> */}

        {/* Add location marker to center map */}
        {userLocation && <LocationMarker position={userLocation} />}

        {userLocation && (
          <Marker position={userLocation} icon={DefaultIcon}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}

        {/* {destination && (
          <Marker position={destination} icon={RedIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )} */}

        {/* Show routing to destination if provided */}
        {userLocation && destination && (
          <RoutingControl start={userLocation} end={destination} />
        )}
      </MapContainer>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MapComponent;

import { SearchBar } from "./components/SearchBar";
import { useState } from "react";
import { Box } from "@mui/material";
import MapComponent from "./components/Map";

// Example coordinates for testing with proper tuple typing
const PINNED_LOCATIONS: Record<string, [number, number]> = {
  home: [21.097963930102694, 79.07823801040651],
  ujjwal_nagar_metro_station: [21.09621738149476, 79.06633973121643],
  maxcare_hospital: [21.10650287928534, 79.08214330673219],
  sanjeevni_hospital: [21.091667890651248, 79.07702028751375],
};

function App() {
  // Explicitly define the type for setDestination to accept undefined
  const [destination, setDestination] = useState<[number, number] | undefined>(
    undefined
  );

  // Define the type for the component's setDestination prop
  type SetDestinationType = React.Dispatch<
    React.SetStateAction<[number, number] | undefined>
  >;

  const handleSearch = (query: string) => {
    // Simple example of location search
    const locationKey = query.toLowerCase();

    if (locationKey in PINNED_LOCATIONS) {
      // Exact match found
      setDestination(
        PINNED_LOCATIONS[locationKey as keyof typeof PINNED_LOCATIONS]
      );
    } else {
      // Check for partial matches
      const matches = Object.keys(PINNED_LOCATIONS).filter((key) =>
        key.toLowerCase().includes(locationKey)
      );

      if (matches.length > 0) {
        // Use the first partial match found
        setDestination(
          PINNED_LOCATIONS[matches[0] as keyof typeof PINNED_LOCATIONS]
        );
      } else {
        // Try to parse coordinates if provided in format "lat,lng"
        const coords = query.split(",").map(Number);
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          // Explicitly type as tuple to ensure type safety
          setDestination([coords[0], coords[1]] as [number, number]);
        } else {
          // If no match found, explicitly set to undefined
          setDestination(undefined);
        }
      }
    }
  };

  // Create a wrapper function if needed to explicitly handle undefined
  const handleSetDestination: SetDestinationType = (value) => {
    setDestination(value);
  };

  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      <SearchBar onSearch={handleSearch} />
      <MapComponent
        destination={destination}
        setDestination={handleSetDestination}
      />
    </Box>
  );
}

export default App;

import { CampusMap } from "./components/Map";
import { SearchBar } from "./components/SearchBar";
import { useState } from "react";
import { Box } from "@mui/material";

// Example coordinates for testing
const EXAMPLE_LOCATIONS = {
  library: [-33.917, 151.231],
  cafeteria: [-33.918, 151.232],
  gym: [-33.916, 151.23],
};

function App() {
  const [destination, setDestination] = useState<
    [number, number] | undefined
  >();

  const handleSearch = (query: string) => {
    // Simple example of location search
    const locationKey = query.toLowerCase();
    if (locationKey in EXAMPLE_LOCATIONS) {
      setDestination(
        EXAMPLE_LOCATIONS[locationKey as keyof typeof EXAMPLE_LOCATIONS]
      );
    } else {
      // Try to parse coordinates if provided in format "lat,lng"
      const coords = query.split(",").map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        setDestination([coords[0], coords[1]]);
      }
    }
  };

  return (
    <Box position="relative">
      <SearchBar onSearch={handleSearch} />
      <CampusMap destination={destination} />
    </Box>
  );
}

export default App;

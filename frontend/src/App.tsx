import { SearchBar } from "./components/SearchBar";
import { useState } from "react";
import { Box } from "@mui/material";
import MapComponent from "./components/Map";

// Example coordinates for testing with proper tuple typing
const EXAMPLE_LOCATIONS: Record<string, [number, number]> = {
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
        // Explicitly type as tuple to ensure type safety
        setDestination([coords[0], coords[1]] as [number, number]);
      }
    }
  };

  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
      <SearchBar onSearch={handleSearch} />
      <MapComponent destination={destination} />
    </Box>
  );
}

export default App;

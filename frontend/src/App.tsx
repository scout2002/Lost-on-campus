import { ChatBox } from "./components/ChatBox";
import { useState } from "react";
import { Box } from "@mui/material";
import MapComponent from "./components/Map";
import Header from "./components/Header";

function App() {
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [destination, setDestination] = useState<[number, number] | undefined>(
    undefined
  );

  const handleSetDestination = (value: [number, number]) => {
    setDestination(value);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
        }}
      >
        <ChatBox
          handleSetDestination={handleSetDestination}
          currentLocation={currentLocation}
        />
        <MapComponent
          destination={destination}
          setCurrentLocation={setCurrentLocation}
          setDestination={handleSetDestination}
        />
      </Box>
    </>
  );
}

export default App;

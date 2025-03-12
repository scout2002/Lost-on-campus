import { useState } from "react";
import { TextField, IconButton, Box, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        position: "absolute",
        top: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "100%",
        maxWidth: "500px",
      }}
    >
      <Box position="relative" width="100%">
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a location..."
          variant="outlined"
          InputProps={{
            endAdornment: (
              <IconButton
                type="submit"
                edge="end"
                aria-label="search"
                sx={{ color: theme.palette.primary.main }}
              >
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.paper,
              borderRadius: "8px",
              boxShadow: `0 4px 6px ${
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.3)"
                  : "rgba(0, 0, 0, 0.1)"
              }`,
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 0.7,
            },
          }}
        />
      </Box>
    </Box>
  );
};

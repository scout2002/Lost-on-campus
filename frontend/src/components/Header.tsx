import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Lost on Campus" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {/* Logo and Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              mr: 1.5,
            }}
          >
            <LocationOnIcon fontSize={isMobile ? "small" : "medium"} />
          </Avatar>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="h1"
            sx={{
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

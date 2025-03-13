import { useState, useRef, useEffect } from "react";
import {
  TextField,
  IconButton,
  Box,
  Paper,
  Typography,
  List,
  Divider,
  useTheme,
  SwipeableDrawer,
  Popover,
  useMediaQuery,
  Fab,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBoxProps {
  onSearch: (query: string) => void;
}

export const ChatBox = ({ onSearch }: ChatBoxProps) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I can help you find locations on campus. Where would you like to go?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const latestBotMessage = messages.filter((m) => !m.isUser).pop();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      text: query,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Call the search function
    onSearch(query);

    // Add bot response
    setTimeout(() => {
      const botResponse: Message = {
        text: `I'll help you find "${query}". Check the map!`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);

    // Clear input
    setQuery("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const popoverOpen = Boolean(popoverAnchor);

  // Render messages list - reused in both desktop and mobile views
  const renderMessages = () => (
    <List
      sx={{
        flexGrow: 1,
        overflow: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        scrollbarWidth: "none", // Hide scrollbar for Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar for Chrome, Safari, Edge
        },
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            alignSelf: message.isUser ? "flex-end" : "flex-start",
            mb: 2,
            maxWidth: "80%",
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              backgroundColor: message.isUser
                ? theme.palette.primary.main
                : theme.palette.action.hover,
              color: message.isUser
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              borderRadius: 2,
              position: "relative",
            }}
          >
            <Typography variant="body1">{message.text}</Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "right",
                mt: 0.5,
                color: message.isUser
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary,
              }}
            >
              {formatTime(message.timestamp)}
            </Typography>
          </Paper>
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </List>
  );

  // Mobile view
  if (isMobile) {
    return (
      <>
        {/* Bot avatar with popover for latest message */}
        <Fab
          color="primary"
          aria-label="assistant"
          sx={{
            position: "absolute",
            top: "80px",
            right: "16px",
            zIndex: 1100,
          }}
          onClick={(e) => {
            e.stopPropagation(); // Stop event propagation
            handlePopoverOpen(e);
          }}
        >
          <SmartToyIcon />
        </Fab>

        <Popover
          open={popoverOpen}
          anchorEl={popoverAnchor}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClick={(e) => e.stopPropagation()} // Stop clicks from propagating
        >
          <Box sx={{ p: 2, maxWidth: 220 }}>
            <Typography variant="body2">
              {latestBotMessage?.text || "How can I help you?"}
            </Typography>
          </Box>
        </Popover>

        {/* Input field at bottom of screen */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(e);
          }}
          onClick={(e) => e.stopPropagation()} // Stop clicks from propagating
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            alignItems: "center",
            borderTop: `1px solid ${theme.palette.divider}`,
            zIndex: 1200, // Increased z-index to ensure it's above other elements
          }}
        >
          <IconButton
            sx={{ mr: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              setDrawerOpen(true);
            }}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
          <TextField
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              // Explicitly focus the input
              e.currentTarget.focus();
            }}
            onFocus={(e) => e.stopPropagation()}
            placeholder="Where would you like to go?"
            variant="outlined"
            size="small"
            sx={{
              mr: 1,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            autoComplete="off"
          />
          <IconButton
            type="submit"
            color="primary"
            aria-label="send message"
            onClick={(e) => e.stopPropagation()}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Drawer for chat history */}
        <SwipeableDrawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
          swipeAreaWidth={56}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              height: "70%",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            },
          }}
          onClick={(e) => e.stopPropagation()} // Stop clicks from propagating
        >
          <Box
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setDrawerOpen(false);
              }}
            >
              <ExpandLessIcon />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ px: 2 }}>
            Chat History
          </Typography>
          {renderMessages()}
        </SwipeableDrawer>
      </>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        top: "55%",
        right: "24px",
        transform: "translateY(-50%)",
        zIndex: 1100,
        width: "400px",
        height: "70vh",
        maxHeight: "70vh",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Chat header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
        }}
      >
        <Typography variant="h6">Campus Navigator</Typography>
        <Typography variant="body2">
          Ask for directions or search for places
        </Typography>
      </Box>

      {/* Messages area */}
      {renderMessages()}

      <Divider />

      {/* Input area */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Where would you like to go?"
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
        />
        <IconButton type="submit" color="primary" aria-label="send message">
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

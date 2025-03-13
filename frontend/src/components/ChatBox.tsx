import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Add axios import
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
  handleSetDestination: (value: [number, number]) => void;
  currentLocation: [number, number] | null; // Add current location prop
}

export const ChatBox = ({
  handleSetDestination,
  currentLocation,
}: ChatBoxProps) => {
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
  const [chatId, setChatId] = useState<string | null>(null); // Add chatId state
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const latestBotMessage = messages.filter((m) => !m.isUser).pop();

  const fabRef = useRef<HTMLButtonElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const popoverOpen = Boolean(popoverAnchor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: Message = {
      text: query,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call API
      const response = await axios.post(
        "http://localhost:8000/v1/find-location",
        {
          user_corrdinate: currentLocation,
          chat_id: chatId,
          user_message: query,
        }
      );
      console.log(response.data);
      // Store chat ID if we received it
      if (response.data.chat_id && !chatId) {
        setChatId(response.data.chat_id);
      }

      // Process response
      const responseData = response.data.parsedResponse;

      // Add bot response based on API
      const botResponse: Message = {
        text: responseData.agent_message,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);

      // If there's location data in the response, pass it to the map
      if (responseData.final_coordinates) {
        console.log("Setting coordinates:", responseData.final_coordinates);
        handleSetDestination(responseData.final_coordinates);
      }
    } catch (error) {
      console.error("API call failed:", error);
      // Add error message
      const errorMessage: Message = {
        text: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuery(""); // Clear input
    }
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

  useEffect(() => {
    // Check if a new message was added and it's from the bot
    if (messages.length > prevMessagesLengthRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser && isMobile && fabRef.current) {
        setPopoverAnchor(fabRef.current);

        setTimeout(() => {
          setPopoverAnchor(null);
        }, 3000);
      }
    }

    // Update the previous length reference
    prevMessagesLengthRef.current = messages.length;
  }, [messages, isMobile]);

  // Mobile view
  if (isMobile) {
    return (
      <>
        {/* Bot avatar with popover for latest message */}
        <Fab
          ref={fabRef}
          color="primary"
          aria-label="assistant"
          sx={{
            position: "absolute",
            top: "80px",
            right: "16px",
            zIndex: 1100,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handlePopoverOpen(e);
            setTimeout(() => setPopoverAnchor(null), 3000);
          }}
        >
          <SmartToyIcon />
        </Fab>

        <Popover
          open={popoverOpen}
          anchorEl={popoverAnchor}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            left: "-3px",
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
    <>
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
    </>
  );
};

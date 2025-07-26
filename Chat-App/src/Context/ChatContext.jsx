import { createContext, useContext, useState } from "react";

// Create the context
const ChatContext = createContext();

// Provider component to wrap around your app
export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider value={{ roomId, setRoomId, currentUser, setCurrentUser, connected, setConnected }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the context
export const useChatContext = () => useContext(ChatContext);

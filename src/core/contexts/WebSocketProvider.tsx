import React, { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../../api/server";
import { useQueryClient } from "react-query";
import { useAuth } from "../../auth/contexts/AuthProvider";

// Define the type for the context value
interface WebSocketContextType {
  notifications: Notification[];
}

// Provide a default value matching the type
const defaultContextValue: WebSocketContextType = {
  notifications: [],
};

const WebSocketContext =
  createContext<WebSocketContextType>(defaultContextValue);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { authKey } = useAuth();

  useEffect(() => {
    // const wsUrl = `wss://${baseUrl.replace(
    //   /^http(s)?:\/\//,
    //   ""
    // )}ws/notifications?token=${authKey}&client=web`;
    const wsUrl = `wss://${baseUrl.replace(
      /^https?:\/\//,
      ""
    )}ws/notifications?token=${authKey}&client=web`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const newNotification: Notification = JSON.parse(event.data);
      // console.log("new notification: ", newNotification);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);

      queryClient.invalidateQueries("notifications");
      queryClient.invalidateQueries("leave_requests");
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      // Optionally, handle reconnection logic
    };

    // Handle any errors
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    return () => {
      ws.close();
    };
  }, [authKey, queryClient]);

  return (
    <WebSocketContext.Provider value={{ notifications }}>
      {children}
    </WebSocketContext.Provider>
  );
};

import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  Popover,
  ListItemText,
} from "@mui/material";

import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Empty from "../../core/components/Empty";
import Loader from "../../core/components/Loader";
import Result from "../../core/components/Result";
// import { useDateLocale } from "../../core/hooks/useDateLocale";
import { notificationKeys } from "../config/notification";
import { useNotifications } from "../hooks/useNotifications";
// import { useWebSocket } from "../contexts/WebSocketProvider";
import { useAuth } from "../../auth/contexts/AuthProvider";
import { getNotificationLink } from "../helpers/notification";
import { distanceToNow } from "../../helpers/dayjs";
import { Notification } from "../types/notification";

const RecentNotifications = () => {
  // const locale = useDateLocale();
  const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    data,
    isError,
    isLoading,
    refetch: refetchNotifications,
  } = useNotifications();
  // const { notifications: realTimeNotifications } = useWebSocket();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (data) {
      refetchNotifications();
    }
  }, [data, refetchNotifications]);

  // const combinedNotifications = useMemo(() => {
  //   // Combine WebSocket notifications with fetched notifications
  //   const uniqueNotifications = new Map();
  //   realTimeNotifications.forEach((n) => uniqueNotifications.set(n.id, n));
  //   data?.forEach((n) => uniqueNotifications.set(n.id, n));
  //   return Array.from(uniqueNotifications.values());
  // }, [data, realTimeNotifications]);

  // console.log(conbine)

  const open = Boolean(anchorEl);

  const unreadCount = useMemo(
    () => data && data.filter((notification) => notification.unread).length,
    [data]
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        id="notifications-button"
        aria-controls="notifications-popover"
        aria-haspopup="true"
        aria-expanded={open ? "true" : "false"}
        aria-label="show recent notifications"
        color="primary"
        onClick={handleClick}
      >
        <Badge color="error" variant="dot" invisible={!unreadCount}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id="notifications-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ width: 360 }}>
          {!isLoading && !isError && data && data.length > 0 && (
            <List
              component="nav"
              aria-label="notifications popover"
              sx={{ px: 2 }}
            >
              {data.map((notification) => {
                return (
                  // <ListItem
                  //   button
                  //   component={NavLink}
                  //   key={notification.id}
                  //   to={getNotificationLink(notification.code)}
                  // >
                  <ListItemButton
                    component={NavLink}
                    key={notification.id}
                    to={getNotificationLink(notification.code)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Trans
                          components={{ bold: <strong /> }}
                          // defaults="<bold>{{ user }}</bold> did someting <bold>{{ quantity }}</bold> times"
                          defaults={
                            i18n.language === "en"
                              ? "<bold>{{staff}}</bold> did something"
                              : "<bold>{{staff}}</bold> did something"
                          }
                          i18nKey={notificationKeys[notification.code]}
                          values={{
                            ...notification.params,
                            user: `${userInfo?.first_name} ${userInfo?.last_name}`,
                            staff: `${
                              notification.params.staff?.japanese_name
                                ? notification.params.staff?.japanese_name
                                : ""
                            }`,
                          }}
                        />
                      }
                      secondary={distanceToNow(
                        notification.created_at.valueOf()
                      )}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          )}
          {!isLoading && !isError && (!data || data.length === 0) && (
            <Empty title={t("admin.header.notifications.empty.title")} />
          )}
          {isError && (
            <Result
              status="error"
              subTitle={t("common.errors.unexpected.subTitle")}
              title={t("common.errors.unexpected.title")}
            />
          )}
          {isLoading && <Loader />}
          <Box sx={{ px: 2, pb: 2 }}>
            <Button
              color="secondary"
              fullWidth
              sx={{ bgcolor: "background.default" }}
              variant="contained"
            >
              {t("admin.header.notifications.seeAll")}
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default RecentNotifications;

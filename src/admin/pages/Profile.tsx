import { Avatar, Box, Fab, Grid, Tabs, Tab, Typography, useTheme } from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthProvider";
import QueryWrapper from "../../core/components/QueryWrapper";
import { useSnackbar } from "../../core/contexts/SnackbarProvider";
import AdminAppBar from "../components/AdminAppBar";
import AdminToolbar from "../components/AdminToolbar";
import CircleProgressWidget from "../widgets/CircleProgressWidget";
import RecentNotifications from "../components/RecentNotifications";


const profileMenuItems = [
  {
    key: "profile.menu.activity",
    path: "",
  },
  {
    key: "profile.menu.info",
    path: "./information",
  },
  {
    key: "profile.menu.password",
    path: "./password",
  },
];

const Profile = () => {
  const { isLoggingOut, logout, userInfo } = useAuth();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();

  const handleLogout = () => {
    logout().catch(() =>
      snackbar.error(t("common.errors.unexpected.subTitle"))
    );
  };

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar>
          <RecentNotifications />

          <Fab
            sx={{ ml: 2 }}
            aria-label="logout"
            color="secondary"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            <ExitToAppIcon />
          </Fab>
        </AdminToolbar>
      </AdminAppBar>
      <Grid container spacing={12}>
        <Grid item xs={12} md={4} marginTop={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              mb: 6,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "background.paper",
                mb: 3,
                height: 160,
                width: 160,
              }}
            >
              <PersonIcon sx={{ fontSize: 120 }} />
            </Avatar>
            <Typography
              component="div"
              variant="h4"
            >{`${userInfo?.first_name} ${userInfo?.last_name}`}</Typography>
            <Typography variant="body2">{userInfo?.role}</Typography>
          </Box>
          <CircleProgressWidget
            height={244}
            title={t("profile.completion.title")}
            value={50}
          />
        </Grid>
        <Grid item xs={12} md={8} marginTop={3}>
          <Box sx={{ mb: 4 }}>
            <Tabs aria-label="profile nav tabs" value={false}>
              {profileMenuItems.map((item) => (
                <Tab
                  key={item.key}
                  sx={() => ({
                    "&.active": {
                      color: theme.palette.primary.contrastText,
                      backgroundColor: theme.palette.primary.light,
                      // Other styles for the active state
                    },
                  })}
                  end={true}
                  component={NavLink}
                  label={t(item.key)}
                  to={item.path}
                />
              ))}
            </Tabs>
          </Box>
          <QueryWrapper>
            <Outlet />
          </QueryWrapper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Profile;

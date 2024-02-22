import React from "react";
import { Grid } from "@mui/material";
import AdminAppBar from "../components/AdminAppBar";
import AdminToolbar from "../components/AdminToolbar";
import RecentNotifications from "../components/RecentNotifications";
import AchievementWidget from "../widgets/AchievementWidget";
import FollowersWidget from "../widgets/FollowersWidget";
import MeetingWidgets from "../widgets/MeetingWidgets";
import PersonalTargetsWidget from "../widgets/PersonalTargetsWidget";
import ViewsWidget from "../widgets/ViewsWidget";
import WelcomeWidget from "../widgets/WelcomeWidget";
import OverallRecordsWidget from "../widgets/OverallRecordsWidget";
import BirthdayWidget from "../widgets/BirthdayWidget";

const Home = () => {
  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar>
          <RecentNotifications />
        </AdminToolbar>
      </AdminAppBar>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <WelcomeWidget />
          {/* <AchievementWidget /> */}
        </Grid>
        <Grid item xs={12} md={5} lg={3}>
          {/* <FollowersWidget /> */}
          <OverallRecordsWidget />
          <ViewsWidget />
        </Grid>
        <Grid item xs={12} md={7} lg={5}>
          {/* <PersonalTargetsWidget /> */}
          <BirthdayWidget />
          <MeetingWidgets />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Home;

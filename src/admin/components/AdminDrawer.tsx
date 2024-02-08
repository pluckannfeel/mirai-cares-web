import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

// import AccountTreeIcon from "@material-ui/icons/AccountTree";
// import EventIcon from "@material-ui/icons/Event";
// import HelpCenterIcon from "@material-ui/icons/HelpCenter";
// import BadgeIcon from "@material-ui/icons/Badge"

import {
  BarChart as BarChartIcon,
  WorkHistory as WorkHistoryIcon,
  Event as EventIcon,
  EventNote as EventNoteIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Groups as GroupsIcon,
  GroupAdd as GroupAddIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  AccountBalance as AccountBalanceIcon,
  LocalHospitalRounded as LocalHospitalRoundedIcon,
  Subject as SubjectIcon,
  Diversity1 as Diversity1Icon,
  AutoStories as AutoStoriesIcon,
  RecentActors as RecentActorsIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatListNumberedOutlined as FormatListNumberedOutlinedIcon,
  Storage as StorageIcon,
  SettingsAccessibility as SettingsAccessibilityIcon,
  Diversity2Outlined as Diversity2OutlinedIcon,
  LocalHospital as LocalHospitalIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Source as SourceIcon,
  Calculate as CalculateIcon,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import { NavLink, NavLinkProps } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthProvider";
import Logo from "../../core/components/Logo";
import { drawerCollapsedWidth, drawerWidth } from "../../core/config/layout";
import React from "react";
import MenuItemComponent from "../../core/components/MenuItemComponent";

type AdminDrawerProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onSettingsToggle: () => void;
};

export let menuItems = [
  {
    icon: HomeIcon,
    key: "admin.drawer.menu.home",
    path: "/admin",
  },
  {
    icon: BarChartIcon,
    key: "admin.drawer.menu.dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: EventIcon,
    key: "admin.drawer.menu.nested.shift.label",
    // path: "/admin/settings",
    children: [
      {
        icon: EventIcon,
        key: "admin.drawer.menu.nested.shift.label",
        path: "/admin/staff-work-schedule",
      },
      {
        icon: AccountBalanceIcon,
        key: "admin.drawer.menu.payslip",
        path: "/admin/staff-payslip",
      },
      {
        icon: Diversity2OutlinedIcon,
        key: "admin.drawer.menu.nested.shift.children.dayOff",
        path: "/admin/day-off",
      },
      {
        icon: SubjectIcon,
        key: "admin.drawer.menu.nested.shift.children.leaveRequests",
        path: "/admin/leave-request",
      },
    ],
  },
  {
    icon: AutoStoriesIcon,
    key: "admin.drawer.menu.nested.legalBooks.label",
    // path: "/admin/settings",
    children: [
      {
        icon: RecentActorsIcon,
        key: "admin.drawer.menu.nested.legalBooks.children.employeeList",
        path: "/admin/employee-list",
      },
      {
        icon: PlaylistAddCheckIcon,
        key: "admin.drawer.menu.nested.legalBooks.children.attendanceRecord",
        path: "/admin/attendance-record",
      },
      {
        icon: FormatListNumberedIcon,
        key: "admin.drawer.menu.nested.legalBooks.children.wageLedger",
        path: "/admin/wage-ledger",
      },
      {
        icon: FormatListNumberedOutlinedIcon,
        key: "admin.drawer.menu.nested.legalBooks.children.paymentDeductionList",
        path: "/admin/payment-deduction",
      },
    ],
  },
  {
    icon: StorageIcon,
    key: "admin.drawer.menu.nested.masterDatabase.label",
    // path: "/admin/settings",
    children: [
      {
        icon: SettingsAccessibilityIcon,
        key: "admin.drawer.menu.nested.masterDatabase.children.staff",
        path: "/admin/staff-management",
      },
      {
        icon: Diversity1Icon,
        key: "admin.drawer.menu.nested.masterDatabase.children.patient",
        path: "/admin/patient-management",
      },
      {
        icon: LocalHospitalIcon,
        key: "admin.drawer.menu.nested.masterDatabase.children.medicalInstitution",
        path: "/admin/medical-institution-management",
      },
      {
        icon: AdminPanelSettingsIcon,
        key: "admin.drawer.menu.nested.masterDatabase.children.user",
        path: "/admin/user-management",
      },
    ],
  },
  {
    icon: SourceIcon,
    key: "admin.drawer.menu.documentCreation",
    path: "/admin/company-information/documents",
  },
  {
    icon: CalculateIcon,
    key: "admin.drawer.menu.salaryCalculation",
    path: "/admin/salary-calculation",
  },
  // {
  //   icon: PeopleIcon,
  //   key: "admin.drawer.menu.userManagement",
  //   path: "/admin/user-management",
  // },
  // {
  //   icon: BusinessIcon,
  //   key: "admin.drawer.menu.companyInformation",
  //   path: "/admin/company-information",
  // },
  // {
  //   icon: GroupsIcon,
  //   key: "admin.drawer.menu.staffManagement",
  //   path: "/admin/staff-management",
  // },
  // {
  //   icon: WorkHistoryIcon,
  //   key: "admin.drawer.menu.staffWorkSchedule",
  //   path: "/admin/staff-work-schedule",
  // },

  // {
  //   icon: EventNoteIcon,
  //   key: "admin.drawer.menu.leaveRequest",
  //   path: "/admin/leave-request",
  // },
  // {
  //   icon: GroupAddIcon,
  //   key: "admin.drawer.menu.patientManagement",
  //   path: "/admin/patient-management",
  // },
  // {
  //   icon: LocalHospitalRoundedIcon,
  //   key: "admin.drawer.menu.medicalInstitutionManagement",
  //   path: "/admin/medical-institution-management",
  // },

  // {
  //   icon: BadgeIcon,
  //   key: "admin.drawer.menu.employeeManagement",
  //   path: "/admin/employee-management",
  // },
  // {
  //   icon: EventIcon,
  //   key: "admin.drawer.menu.calendar",
  //   path: "/admin/calendar",
  // },
  // {
  //   icon: AccountTreeIcon,
  //   key: "admin.drawer.menu.projects",
  //   path: "/admin/projects",
  // },
  // {
  //   icon: HelpCenterIcon,
  //   key: "admin.drawer.menu.help",
  //   path: "/admin/help",
  // },
];

// Custom NavLink component
const CustomNavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props, ref) => <NavLink ref={ref} {...props} />
);

CustomNavLink.displayName = "CustomNavLink";

const AdminDrawer = ({
  collapsed,
  mobileOpen,
  onDrawerToggle,
  onSettingsToggle,
}: AdminDrawerProps) => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();

  // modified == don't show if role is not admin
  if (userInfo?.role !== "Admin") {
    // remove user management
    console.log(userInfo?.role);
    menuItems = menuItems.filter(
      (item) => item.key !== "admin.drawer.menu.userManagement"
    );
  }

  const width = collapsed ? drawerCollapsedWidth : drawerWidth;

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <Logo sx={{ display: "flex", p: 4 }} />
      {/* <List component="nav" sx={{ px: 2 }}>
        {menuItems.map((item) => (
          // <ListItem
          //   button
          //   component={NavLink}
          //   key={item.path}
          //   activeClassName="Mui-selected"
          //   end={true}
          //   to={`/${process.env.PUBLIC_URL}${item.path}`}4
          // >
          //   <ListItemAvatar>
          //     <Avatar sx={{ color: "inherit", bgcolor: "transparent" }}>
          //       <item.icon />
          //     </Avatar>
          //   </ListItemAvatar>
          //   <ListItemText
          //     primary={t(item.key)}
          //     sx={{
          //       display: collapsed ? "none" : "block",
          //     }}
          //   />
          // </ListItem>

          <ListItem
            button
            key={item.path}
            component={CustomNavLink}
            to={item.path}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemAvatar>
              <Avatar sx={{ color: "inherit", bgcolor: "transparent" }}>
                <item.icon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t(item.key)}
              sx={{
                display: collapsed ? "none" : "block",
              }}
            />
          </ListItem>
        ))}
      </List> */}
      <List component="nav" sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <MenuItemComponent item={item} key={item.key} />
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List component="nav" sx={{ p: 2 }}>
        {/* Company Information */}

        {/* <ListItemButton
          component={(props) => (
            <NavLink
              {...props}
              end={true}
              activeClassName="Mui-selected"
              to={`/admin/company-information`}
            />
          )}
        > */}
        <ListItem
          button
          component={CustomNavLink}
          end={true}
          sx={{ textDecoration: "none", color: "inherit" }}
          // activeClassName="Mui-selected"
          to={`/admin/company-information`}
        >
          <ListItemAvatar>
            <Avatar>
              <BusinessIcon />
            </Avatar>
          </ListItemAvatar>
          {userInfo && (
            <ListItemText
              primary={t("admin.drawer.menu.companyInformation")}
              sx={{
                display: collapsed ? "none" : "block",
              }}
            />
          )}
        </ListItem>
        {/* <ListItem
          button
          component={NavLink}
          to={`/${process.env.PUBLIC_URL}/admin/company-information`}
        >
          <ListItemAvatar>
            <Avatar>
              <BusinessIcon />
            </Avatar>
          </ListItemAvatar>
          {userInfo && (
            <ListItemText
              primary={t("admin.drawer.menu.companyInformation")}
              sx={{
                display: collapsed ? "none" : "block",
              }}
            />
          )}
        </ListItem> */}

        {/* <ListItemButton
          activeClassName="Mui-selected"
          to={`/admin/profile`}
          end={true}
          component={(props) => (
            <NavLink
              {...props}
              end={true}
              activeClassName="Mui-selected"
              to={`/admin/profile`}
            />
          )}
        > */}
        <ListItem
          button
          component={CustomNavLink}
          end={true}
          // activeClassName="Mui-selected"
          sx={{ textDecoration: "none", color: "inherit" }}
          to={`/admin/profile`}
        >
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          {userInfo && (
            <ListItemText
              primary={`${userInfo.first_name} ${userInfo.last_name}`}
              primaryTypographyProps={{ component: "div" }}
              sx={{
                display: collapsed ? "none" : "block",
              }}
            />
          )}
        </ListItem>

        {/* <ListItem
          button
          component={NavLink}
          to={`/${process.env.PUBLIC_URL}/admin/profile`}
        >
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          {userInfo && (
            <ListItemText
              primary={`${userInfo.first_name} ${userInfo.last_name}`}
              sx={{
                display: collapsed ? "none" : "block",
              }}
            />
          )}
        </ListItem> */}

        <ListItemButton onClick={onSettingsToggle}>
          <ListItemAvatar>
            <Avatar>
              <SettingsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("admin.drawer.menu.settings")}
            sx={{
              display: collapsed ? "none" : "block",
            }}
          />
        </ListItemButton>

        {/* <ListItem button onClick={onSettingsToggle}>
          <ListItemAvatar>
            <Avatar>
              <SettingsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("admin.drawer.menu.settings")}
            sx={{
              display: collapsed ? "none" : "block",
            }}
          />
        </ListItem> */}
      </List>
    </Box>
  );

  return (
    <Box
      aria-label="Admin drawer"
      component="nav"
      sx={{
        width: { lg: width },
        flexShrink: { lg: 0 },
      }}
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminDrawer;

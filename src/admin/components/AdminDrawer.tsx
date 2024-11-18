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
  // WorkHistory as WorkHistoryIcon,
  Event as EventIcon,
  // EventNote as EventNoteIcon,
  Home as HomeIcon,
  // People as PeopleIcon,
  // Groups as GroupsIcon,
  // GroupAdd as GroupAddIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  AccountBalance as AccountBalanceIcon,
  // LocalHospitalRounded as LocalHospitalRoundedIcon,
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
  LocalHospitalOutlined as LocalHospitalOutlinedIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Source as SourceIcon,
  // Calculate as CalculateIcon,
  Archive as ArchiveIcon,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import { NavLink, NavLinkProps } from "react-router-dom";
import { useAuth } from "../../auth/contexts/AuthProvider";
import Logo from "../../core/components/Logo";
import { drawerCollapsedWidth, drawerWidth } from "../../core/config/layout";
import React, { useMemo } from "react";
import MenuItemComponent from "../../core/components/MenuItemComponent";

type AdminDrawerProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onSettingsToggle: () => void;
};

export const menuItems = [
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
  // {
  //   icon: EventIcon,
  //   key: "admin.drawer.menu.nested.shift.label",
  //   // path: "/admin/settings",
  //   children: [
  //     {
  //       icon: EventIcon,
  //       key: "admin.drawer.menu.nested.shift.label",
  //       path: "/admin/staff-work-schedule",
  //     },
  //     // {
  //     //   icon: AccountBalanceIcon,
  //     //   key: "admin.drawer.menu.payslip",
  //     //   path: "/admin/staff-payslip",
  //     // },
  //     {
  //       icon: Diversity2OutlinedIcon,
  //       key: "admin.drawer.menu.nested.shift.children.dayOff",
  //       path: "/admin/day-off",
  //     },
  //     {
  //       icon: SubjectIcon,
  //       key: "admin.drawer.menu.nested.shift.children.leaveRequests",
  //       path: "/admin/leave-request",
  //     },
  //   ],
  // },
  {
    icon: AutoStoriesIcon,
    key: "admin.drawer.menu.nested.legalBooks.label",
    // path: "/admin/settings",
    children: [
      {
        icon: RecentActorsIcon,
        key: "admin.drawer.menu.nested.legalBooks.children.employeeList",
        // path: "/admin/employee-list",
        path: "https://payroll.moneyforward.com/reports/employee_rosters",
        outsource: true,
      },
      {
        icon: PlaylistAddCheckIcon,
        key: "admin.drawer.menu.nested.legalBooks.children.attendanceRecord",
        path: "/admin/attendance-record",
      },
      {
        icon: FormatListNumberedIcon,
        key: "admin.drawer.menu.nested.legalBooks.children.wageLedger",
        // path: "/admin/wage-ledger",
        path: "https://payroll.moneyforward.com/reports/payroll_book",
        outsource: true,
      },
      {
        icon: FormatListNumberedOutlinedIcon,
        key: "admin.drawer.menu.nested.legalBooks.children.paymentDeductionList",
        // path: "/admin/payment-deduction",
        path: "https://payroll.moneyforward.com/reports/payment_deductions",
        outsource: true,
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
        icon: LocalHospitalOutlinedIcon,
        key: "admin.drawer.menu.nested.masterDatabase.children.visitingNursingStationManagement",
        path: "/admin/visiting-nursing-station-management",
      },
      {
        icon: AdminPanelSettingsIcon,
        key: "admin.drawer.menu.nested.masterDatabase.children.user",
        path: "/admin/user-management",
      },
    ],
  },
  {
    icon: EventIcon,
    key: "admin.drawer.menu.nested.shift.children.leaveRequests",
    path: "/admin/leave-request",
  },
  {
    icon: SourceIcon,
    key: "admin.drawer.menu.documentCreation",
    path: "/admin/company-information/documents",
  },
  {
    // icon: CalculateIcon,
    icon: AccountBalanceIcon,
    key: "admin.drawer.menu.salaryManagement",
    // path: "/admin/salary-calculation",
    path: "/admin/salary-management/staff-payslip",
  },
  {
    icon: ArchiveIcon,
    key: "admin.drawer.menu.archive",
    path: "/admin/archive",
  },
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

  const filteredMenuItems = useMemo(() => {
    let items = [...menuItems]; // Create a shallow copy to avoid mutating the original array

    // If role is not Admin, modify the items to remove specific nested items
    if (userInfo?.role !== "Admin") {
      items = items.map((item) => {
        // Check if this item has children and needs filtering
        if (item.children) {
          // Filter out the user management item from the children
          const filteredChildren = item.children.filter(
            (child) =>
              child.key !==
              "admin.drawer.menu.nested.masterDatabase.children.user"
          );
          return { ...item, children: filteredChildren };
        }
        return item;
      });
    }

    // If role is User or Staff, remove payslip
    if (
      userInfo?.role === "User" ||
      userInfo?.role === "Staff" ||
      userInfo?.role === "Manager"
    ) {
      items = items.filter(
        (item) => item.key !== "admin.drawer.menu.salaryManagement"
      );
    }

    return items;
  }, [userInfo?.role]); // Recompute when the user's role changes

  const width = collapsed ? drawerCollapsedWidth : drawerWidth;

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <Logo sx={{ display: "flex", pt: 1 }} />
      <List component="nav" sx={{ px: 2 }}>
        {filteredMenuItems.map((item) => (
          <MenuItemComponent item={item} key={item.key} />
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List component="nav" sx={{ p: 2 }}>
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

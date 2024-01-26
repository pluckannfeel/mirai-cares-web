import React from "react";
import { useTranslation } from "react-i18next";
import { Tab, Tabs, useTheme } from "@mui/material";
import QueryWrapper from "../../core/components/QueryWrapper";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";

const staffCategories = [
  {
    key: "staffManagement.menuTabs.staff",
    path: "./",
  },
  // {
  //   key: "staffManagement.menuTabs.user",
  //   path: "./user",
  // },
  // {
  //   key: 'employeeManagement.menuTabs.relativesEmploymentSchoolHistory',
  //   path: './res-history',
  // },
  // {
  //   key: 'employeeManagement.menuTabs.qualificationsLicenses',
  //   path: './qualifications-licenses',
  // },
];

const StaffManagement = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <React.Fragment>
      <Tabs
        sx={{
          display: "none",
          margin: "0",
          padding: "0",
        }}
        aria-label="staff nav tabs"
        centered
        value={false}
      >
        {staffCategories.map((item) => (
          <Tab
            key={item.key}
            // activeClassName="Mui-selected"
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

      <QueryWrapper>
        <Outlet />
      </QueryWrapper>
    </React.Fragment>
  );
};

export default StaffManagement;

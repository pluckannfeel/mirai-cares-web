import React from "react";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useTranslation } from "react-i18next";
import { Box, Grid, Tab, Tabs, useTheme } from "@mui/material";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import QueryWrapper from "../../core/components/QueryWrapper";

const companyMenuItems = [
  {
    key: "company.menu.information",
    path: "",
  },
  {
    key: "company.menu.staffCodeList",
    path: "./staff-code-list",
  },
  {
    key: "company.menu.documents",
    path: "./documents",
  },
];

const CompanyManagement = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("company.toolbar.title")}>
          {/* <Fab
              aria-label="logout"
              color="primary"
              disabled={processing}
              onClick={() => handleOpenStaffDialog()}
              size="small"
            > */}
          {/* <AddIcon />
            </Fab> */}
        </AdminToolbar>
      </AdminAppBar>

      <Grid container spacing={12}>
        <Grid item xs={12} md={8} marginTop={3}>
          <Box sx={{ mb: 4 }}>
            <Tabs aria-label="profile nav tabs" value={false}>
              {companyMenuItems.map((item) => (
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

export default CompanyManagement;

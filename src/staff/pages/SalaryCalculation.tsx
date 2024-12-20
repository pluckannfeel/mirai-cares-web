import React from "react";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useTranslation } from "react-i18next";
import { Box, Grid, Tab, Tabs, useTheme } from "@mui/material";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import QueryWrapper from "../../core/components/QueryWrapper";

const menuItems = [
  {
    key: "salaryManagement.menuTabs.payslip",
    // path: "./staff-payslip",
    path: "./staff-payslip",
  },
  {
    key: "salaryManagement.menuTabs.timeSheet",
    path: "",
  },
  {
    key: "salaryManagement.menuTabs.taxcertificate",
    path: "./staff-taxcertificate",
  },
  // {
  //   key: "salaryManagement.menuTabs.transportationSheet",
  //   path: "./transportation",
  // },
];

const SalaryCalculation = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("salaryCalculation.toolbar.title")}>
          {/* <Fab
            aria-label="logout"
            color="primary"
            // disabled={processing}
            // onClick={() => handleOpenStaffDialog()}
            size="small"
          >
            <FileDownloadIcon />
          </Fab> */}
        </AdminToolbar>
      </AdminAppBar>

      <Grid container spacing={12}>
        <Grid
          item
          xs={12}
          // md={12}
          // marginTop={3}
        >
          <Box sx={{ mb: 4 }}>
            <Tabs aria-label="profile nav tabs" value={false}>
              {menuItems.map((item) => (
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
        </Grid>
      </Grid>

      <QueryWrapper>
        <Outlet />
      </QueryWrapper>
    </React.Fragment>
  );
};

export default SalaryCalculation;

import { Grid } from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  ShoppingBasket as ShoppingBasketIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../components/AdminAppBar";
import AdminToolbar from "../components/AdminToolbar";
import ActivityWidget from "../widgets/ActivityWidget";
import BudgetWidget from "../widgets/BudgetWidget";
import CircleProgressWidget from "../widgets/CircleProgressWidget";
import OverviewWidget from "../widgets/OverviewWidget";
import ProgressWidget from "../widgets/ProgressWidget";
import SalesByAgeWidget from "../widgets/SalesByAgeWidget";
import SalesByCategoryWidget from "../widgets/SalesByCategoryWidget";
import SalesHistoryWidget from "../widgets/SalesHistoryWidget";
import TeamProgressWidget from "../widgets/TeamProgressWidget";
import UsersWidget from "../widgets/UsersWidget";
import { useRecord } from "../../payslip/hooks/useRecord";
import { OverallRecord } from "../../payslip/types/record";
import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
import TotalServiceWidget from "../widgets/TotalServiceWidget";
import TotalServiceCategoryWidget from "../widgets/TotalServiceCategoryWidget";
import TotalPatientServicesWidget from "../widgets/TotalPatientServicesWidget";

// const overviewItems = [
//   {
//     unit: "dashboard.overview.visits",
//     value: "20 700",
//   },
//   {
//     unit: "dashboard.overview.sales",
//     value: "$ 1 550",
//   },
//   {
//     unit: "dashboard.overview.orders",
//     value: "149",
//   },
//   {
//     unit: "dashboard.overview.users",
//     value: "657",
//   },
// ];

const Dashboard = () => {
  const { t } = useTranslation();

  //get total work hours
  const { isLoading: isRecordLoading, data: records } = useRecord();
  const { isLoading: isStaffSelectionLoading, data: initialStaffSelect } =
    useStaffSelect();

  const [overallRecord, setOverallRecord] = useState<OverallRecord>({
    total_employees: initialStaffSelect ? initialStaffSelect.length : 0,
    total_hours: 0,
  });

  // create an over all loading
  const isLoading = isRecordLoading || isStaffSelectionLoading;

  // define total service time goal
  const goal = 5000;

  // overview data
  const overviewItems = [
    {
      unit: "payslip.overview.totalEmployees", // total of employees
      value: `${overallRecord.total_employees}人`,
      backgroundColor: "#ff9800",
    },
    // {
    //   unit: "payslip.overview.netSalarythisMonth", // total net salary paid
    //   value: "¥ 500万円",
    //   backgroundColor: "#f44336",
    // },
    // {
    //   unit: "payslip.overview.totalDeduction", // total deductions
    //   value: "￥ 100万円",
    //   backgroundColor: "#ff9800",
    // },
    {
      unit: "payslip.overview.totalHoursWorked", // total hours worked
      value: `${overallRecord.total_hours} 作業時間`,
      backgroundColor: "#1976D2",
    },
  ];

  // Calculate the percentage of total_hours relative to the goal
  const progressPercentage = Math.min(
    Math.round((overallRecord.total_hours / goal) * 100),
    100
  );

  useEffect(() => {
    if (records && initialStaffSelect) {
      setOverallRecord({
        total_employees: initialStaffSelect.length,
        total_hours: records.total_hours,
      });
    }
  }, [records, initialStaffSelect]);

  // Check loading state
  if (isLoading) {
    return <div>Loading...</div>; // Add your loading indicator
  }

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("dashboard.title")} />
      </AdminAppBar>
      <Grid container spacing={2}>
        {overviewItems.map((item, index) => (
          <Grid key={index} item xs={6} md={3}>
            <OverviewWidget
              backgroundColor={item.backgroundColor}
              description={t(item.unit)}
              title={item.value}
            />
          </Grid>
        ))}
        <Grid item xs={12} md={8}>
          {/* <ActivityWidget /> */}
          <TotalServiceWidget />
        </Grid>
        <Grid item xs={12} md={4}>
          {/* <BudgetWidget /> */}
          <TotalServiceCategoryWidget />
        </Grid>
        <Grid item xs={12} md={9}>
          {/* <SalesHistoryWidget value={567} /> */}
          <TotalPatientServicesWidget />
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <ProgressWidget
            avatar={<SupervisorAccountIcon />}
            mb={2}
            title={t("dashboard.visitProgress.title")}
            value={75}
          />
          <ProgressWidget
            avatar={<ShoppingBasketIcon />}
            mb={2}
            title={t("dashboard.orderProgress.title")}
            value={50}
          />
          <ProgressWidget
            avatar={<AttachMoneyIcon />}
            title={t("dashboard.salesProgress.title")}
            value={25}
          />
        </Grid> */}
        <Grid item xs={12} md={3}>
          <CircleProgressWidget
            height={204}
            // title={t("dashboard.progress.title")}
            title={`合計サービス時間の目標:  
               ${overallRecord.total_hours} / ${goal}`}
            value={progressPercentage}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <UsersWidget />
        </Grid>
        <Grid item xs={12} md={8}>
          {/* <TeamProgressWidget /> */}
        </Grid>
        {/* <Grid item xs={12} md={4}>
          <SalesByCategoryWidget />
        </Grid>
        <Grid item xs={12} md={8}>
          <SalesByAgeWidget />
        </Grid> */}
      </Grid>
    </React.Fragment>
  );
};

export default Dashboard;

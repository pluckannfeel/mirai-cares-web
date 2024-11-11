// Hiatus, this is a little bit hard to implement

// import React, { useState, useEffect } from "react";
// import { Responsive, WidthProvider } from "react-grid-layout";
// import { useTranslation } from "react-i18next";
// import AdminAppBar from "../components/AdminAppBar";
// import AdminToolbar from "../components/AdminToolbar";
// import OverviewWidget from "../widgets/OverviewWidget";
// import TotalServiceWidget from "../widgets/TotalServiceWidget";
// import TotalServiceCategoryWidget from "../widgets/TotalServiceCategoryWidget";
// import TotalPatientServicesWidget from "../widgets/TotalPatientServicesWidget";
// import CircleProgressWidget from "../widgets/CircleProgressWidget";
// import UsersWidget from "../widgets/UsersWidget";
// import TeamProgressWidget from "../widgets/TeamProgressWidget";
// import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";

// const ResponsiveGridLayout = WidthProvider(Responsive);

// const Dashboard = () => {
//   const { t } = useTranslation();

//   // Define breakpoints for wider screens
//   const breakpoints = {
//     xxl: 1920,
//     xl: 1600,
//     lg: 1200,
//     md: 996,
//     sm: 768,
//     xs: 480,
//   };
//   const cols = { xxl: 16, xl: 14, lg: 12, md: 10, sm: 6, xs: 4 };

//   const layouts = {
//     xxl: [
//       { i: "overview1", x: 0, y: 0, w: 3, h: 1 },
//       { i: "overview2", x: 3, y: 0, w: 3, h: 1 },
//       { i: "totalService", x: 0, y: 1, w: 8, h: 2 },
//       { i: "serviceCategory", x: 8, y: 1, w: 4, h: 2 },
//       { i: "patientServices", x: 0, y: 3, w: 8, h: 2 },
//       { i: "circleProgress", x: 8, y: 3, w: 4, h: 2 },
//       { i: "users", x: 0, y: 5, w: 4, h: 2 },
//       { i: "teamProgress", x: 4, y: 5, w: 8, h: 2 },
//     ],
//     xl: [
//       { i: "overview1", x: 0, y: 0, w: 3, h: 1 },
//       { i: "overview2", x: 3, y: 0, w: 3, h: 1 },
//       { i: "totalService", x: 0, y: 1, w: 8, h: 2 },
//       { i: "serviceCategory", x: 8, y: 1, w: 3, h: 2 },
//       { i: "patientServices", x: 0, y: 3, w: 8, h: 2 },
//       { i: "circleProgress", x: 8, y: 3, w: 3, h: 2 },
//       { i: "users", x: 0, y: 5, w: 3, h: 2 },
//       { i: "teamProgress", x: 3, y: 5, w: 8, h: 2 },
//     ],
//     lg: [
//       { i: "overview1", x: 0, y: 0, w: 2, h: 1 },
//       { i: "overview2", x: 2, y: 0, w: 2, h: 1 },
//       { i: "totalService", x: 0, y: 1, w: 6, h: 2 },
//       { i: "serviceCategory", x: 6, y: 1, w: 3, h: 2 },
//       { i: "patientServices", x: 0, y: 3, w: 6, h: 2 },
//       { i: "circleProgress", x: 6, y: 3, w: 3, h: 2 },
//       { i: "users", x: 0, y: 5, w: 3, h: 2 },
//       { i: "teamProgress", x: 3, y: 5, w: 6, h: 2 },
//     ],
//     md: [
//       { i: "overview1", x: 0, y: 0, w: 2, h: 1 },
//       { i: "overview2", x: 2, y: 0, w: 2, h: 1 },
//       { i: "totalService", x: 0, y: 1, w: 5, h: 2 },
//       { i: "serviceCategory", x: 5, y: 1, w: 5, h: 2 },
//       { i: "patientServices", x: 0, y: 3, w: 5, h: 2 },
//       { i: "circleProgress", x: 5, y: 3, w: 5, h: 2 },
//       { i: "users", x: 0, y: 5, w: 5, h: 2 },
//       { i: "teamProgress", x: 5, y: 5, w: 5, h: 2 },
//     ],
//     sm: [
//       { i: "overview1", x: 0, y: 0, w: 2, h: 1 },
//       { i: "overview2", x: 2, y: 0, w: 2, h: 1 },
//       { i: "totalService", x: 0, y: 1, w: 6, h: 2 },
//       { i: "serviceCategory", x: 0, y: 3, w: 6, h: 2 },
//       { i: "patientServices", x: 0, y: 5, w: 6, h: 2 },
//       { i: "circleProgress", x: 0, y: 7, w: 6, h: 2 },
//       { i: "users", x: 0, y: 9, w: 6, h: 2 },
//       { i: "teamProgress", x: 0, y: 11, w: 6, h: 2 },
//     ],
//     xs: [
//       { i: "overview1", x: 0, y: 0, w: 4, h: 1 },
//       { i: "overview2", x: 0, y: 1, w: 4, h: 1 },
//       { i: "totalService", x: 0, y: 2, w: 4, h: 2 },
//       { i: "serviceCategory", x: 0, y: 4, w: 4, h: 2 },
//       { i: "patientServices", x: 0, y: 6, w: 4, h: 2 },
//       { i: "circleProgress", x: 0, y: 8, w: 4, h: 2 },
//       { i: "users", x: 0, y: 10, w: 4, h: 2 },
//       { i: "teamProgress", x: 0, y: 12, w: 4, h: 2 },
//     ],
//   };

//   return (
//     <React.Fragment>
//       <AdminAppBar>
//         <AdminToolbar title={t("dashboard.title")} />
//       </AdminAppBar>
//       <ResponsiveGridLayout
//         className="layout"
//         layouts={layouts}
//         breakpoints={breakpoints}
//         cols={cols}
//         rowHeight={100}
//         draggableHandle=".drag-handle"
//         autoSize={true}
//         compactType="horizontal"
//       >
//         <div key="overview1" className="drag-handle">
//           <OverviewWidget
//             backgroundColor="#ff9800"
//             description={t("Total Employees")}
//             title="31人"
//           />
//         </div>
//         <div key="overview2" className="drag-handle">
//           <OverviewWidget
//             backgroundColor="#1976D2"
//             description={t("Total Hours")}
//             title="3720 作業時間"
//           />
//         </div>
//         <div key="totalService" className="drag-handle">
//           <TotalServiceWidget />
//         </div>
//         <div key="serviceCategory" className="drag-handle">
//           <TotalServiceCategoryWidget />
//         </div>
//         <div key="patientServices" className="drag-handle">
//           <TotalPatientServicesWidget />
//         </div>
//         <div key="circleProgress" className="drag-handle">
//           <CircleProgressWidget
//             title="合計サービス時間の目標: 3720 / 5000"
//             value={74}
//             height={300}
//           />
//         </div>
//         <div key="users" className="drag-handle">
//           <UsersWidget />
//         </div>
//         <div key="teamProgress" className="drag-handle">
//           <TeamProgressWidget />
//         </div>
//       </ResponsiveGridLayout>
//     </React.Fragment>
//   );
// };

// export default Dashboard;
export {};


// // original dashboard 
// import { Grid } from "@mui/material";
// import {
//   AttachMoney as AttachMoneyIcon,
//   ShoppingBasket as ShoppingBasketIcon,
//   SupervisorAccount as SupervisorAccountIcon,
// } from "@mui/icons-material";
// import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import AdminAppBar from "../components/AdminAppBar";
// import AdminToolbar from "../components/AdminToolbar";
// import ActivityWidget from "../widgets/ActivityWidget";
// import BudgetWidget from "../widgets/BudgetWidget";
// import CircleProgressWidget from "../widgets/CircleProgressWidget";
// import OverviewWidget from "../widgets/OverviewWidget";
// import ProgressWidget from "../widgets/ProgressWidget";
// import SalesByAgeWidget from "../widgets/SalesByAgeWidget";
// import SalesByCategoryWidget from "../widgets/SalesByCategoryWidget";
// import SalesHistoryWidget from "../widgets/SalesHistoryWidget";
// import TeamProgressWidget from "../widgets/TeamProgressWidget";
// import UsersWidget from "../widgets/UsersWidget";
// import { useRecord } from "../../payslip/hooks/useRecord";
// import { OverallRecord } from "../../payslip/types/record";
// import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
// import TotalServiceWidget from "../widgets/TotalServiceWidget";
// import TotalServiceCategoryWidget from "../widgets/TotalServiceCategoryWidget";
// import TotalPatientServicesWidget from "../widgets/TotalPatientServicesWidget";
// import PersonalTargetsWidget from "../widgets/PersonalTargetsWidget";
// import FollowersWidget from "../widgets/FollowersWidget";
// import MeetingWidgets from "../widgets/MeetingWidgets";

// // const overviewItems = [
// //   {
// //     unit: "dashboard.overview.visits",
// //     value: "20 700",
// //   },
// //   {
// //     unit: "dashboard.overview.sales",
// //     value: "$ 1 550",
// //   },
// //   {
// //     unit: "dashboard.overview.orders",
// //     value: "149",
// //   },
// //   {
// //     unit: "dashboard.overview.users",
// //     value: "657",
// //   },
// // ];

// const Dashboard = () => {
//   const { t } = useTranslation();

//   //get total work hours
//   const { isLoading: isRecordLoading, data: records } = useRecord();
//   const { isLoading: isStaffSelectionLoading, data: initialStaffSelect } =
//     useStaffSelect();

//   const [overallRecord, setOverallRecord] = useState<OverallRecord>({
//     total_employees: initialStaffSelect ? initialStaffSelect.length : 0,
//     total_hours: 0,
//   });

//   // create an over all loading
//   const isLoading = isRecordLoading || isStaffSelectionLoading;

//   // define total service time goal
//   const goal = 5000;

//   // overview data
//   const overviewItems = [
//     {
//       unit: "payslip.overview.totalEmployees", // total of employees
//       value: `${overallRecord.total_employees}人`,
//       backgroundColor: "#ff9800",
//     },
//     // {
//     //   unit: "payslip.overview.netSalarythisMonth", // total net salary paid
//     //   value: "¥ 500万円",
//     //   backgroundColor: "#f44336",
//     // },
//     // {
//     //   unit: "payslip.overview.totalDeduction", // total deductions
//     //   value: "￥ 100万円",
//     //   backgroundColor: "#ff9800",
//     // },
//     {
//       unit: "payslip.overview.totalHoursWorked", // total hours worked
//       value: `${overallRecord.total_hours} 作業時間`,
//       backgroundColor: "#1976D2",
//     },
//   ];

//   // Calculate the percentage of total_hours relative to the goal
//   const progressPercentage = Math.min(
//     Math.round((overallRecord.total_hours / goal) * 100),
//     100
//   );

//   useEffect(() => {
//     if (records && initialStaffSelect) {
//       setOverallRecord({
//         total_employees: initialStaffSelect.length,
//         total_hours: records.total_hours,
//       });
//     }
//   }, [records, initialStaffSelect]);

//   // Check loading state
//   if (isLoading) {
//     return <div>Loading...</div>; // Add your loading indicator
//   }

//   return (
//     <React.Fragment>
//       <AdminAppBar>
//         <AdminToolbar title={t("dashboard.title")} />
//       </AdminAppBar>
//       <Grid container spacing={2}>
//         {overviewItems.map((item, index) => (
//           <Grid key={index} item xs={6} md={3}>
//             <OverviewWidget
//               backgroundColor={item.backgroundColor}
//               description={t(item.unit)}
//               title={item.value}
//             />
//           </Grid>
//         ))}
//         <Grid item xs={12} md={8}>
//           {/* <ActivityWidget /> */}
//           <TotalServiceWidget />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           {/* <BudgetWidget /> */}
//           <TotalServiceCategoryWidget />
//         </Grid>
//         <Grid item xs={12} md={9}>
//           {/* <SalesHistoryWidget value={567} /> */}
//           <TotalPatientServicesWidget />
//         </Grid>
//         {/* <Grid item xs={12} md={4}>
//           <ProgressWidget
//             avatar={<SupervisorAccountIcon />}
//             mb={2}
//             title={t("dashboard.visitProgress.title")}
//             value={75}
//           />
//           <ProgressWidget
//             avatar={<ShoppingBasketIcon />}
//             mb={2}
//             title={t("dashboard.orderProgress.title")}
//             value={50}
//           />
//           <ProgressWidget
//             avatar={<AttachMoneyIcon />}
//             title={t("dashboard.salesProgress.title")}
//             value={25}
//           />
//         </Grid> */}
//         <Grid item xs={12} md={3}>
//           <CircleProgressWidget
//             height={204}
//             // title={t("dashboard.progress.title")}
//             title={`合計サービス時間の目標:
//                ${overallRecord.total_hours} / ${goal}`}
//             value={progressPercentage}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <UsersWidget />
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <TeamProgressWidget />
//           {/* <MeetingWidgets/> */}
//         </Grid>
//         {/* <Grid item xs={12} md={4}>
//           <SalesByCategoryWidget />
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <SalesByAgeWidget />
//         </Grid> */}
//       </Grid>
//     </React.Fragment>
//   );
// };

// export default Dashboard;

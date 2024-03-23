import { lazy } from "react";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";

import PrivateRoute from "./core/components/PrivateRoute";

// const publicUrl = import.meta.env.BASE_URL;

// Admin
const Admin = lazy(() => import("./admin/pages/Admin"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
// const Faq = lazy(() => import("./admin/pages/Faq"));
// const HelpCenter = lazy(() => import("./admin/pages/HelpCenter"));
const Home = lazy(() => import("./admin/pages/Home"));
const Profile = lazy(() => import("./admin/pages/Profile"));
const ProfileActivity = lazy(() => import("./admin/pages/ProfileActivity"));
const ProfileInformation = lazy(
  () => import("./admin/pages/ProfileInformation")
);
const ProfilePassword = lazy(() => import("./admin/pages/ProfilePassword"));

// Auth
const ForgotPassword = lazy(() => import("./auth/pages/ForgotPassword"));
const ForgotPasswordSubmit = lazy(
  () => import("./auth/pages/ForgotPasswordSubmit")
);
const Login = lazy(() => import("./auth/pages/Login"));
const Register = lazy(() => import("./auth/pages/Register"));

// Calendar
// const CalendarApp = lazy(() => import("./calendar/pages/CalendarApp"));

// Core
const Forbidden = lazy(() => import("./core/pages/Forbidden"));
const NotFound = lazy(() => import("./core/pages/NotFound"));
const UnderConstructions = lazy(
  () => import("./core/pages/UnderConstructions")
);

// Landing
// const Landing = lazy(() => import('./landing/pages/Landing'));

// Users
const UserManagement = lazy(() => import("./users/pages/UserManagement"));

// Staff
const StaffManagement = lazy(() => import("./staff/pages/StaffManagement"));
const StaffTab = lazy(() => import("./staff/components/StaffTab"));
// const StaffUserTab = lazy(() => import("./staff/components/StaffUserTab"));

const StaffWorkSchedule = lazy(() => import("./shift/pages/Shift"));

const PayslipManagement = lazy(
  () => import("./payslip/pages/PayslipManagement")
);

const LeaveRequestManagement = lazy(
  () => import("./leave_request/pages/LeaveRequestManagement")
);

const PatientManagement = lazy(
  () => import("./patients/pages/PatientManagement")
);

// Company
const CompanyManagement = lazy(
  () => import("./company/pages/CompanyManagement")
);

const CompanyInformation = lazy(
  () => import("./company/pages/CompanyInformation")
);

const CompanyStaffCode = lazy(() => import("./company/pages/CompanyStaffCode"));

const CompanyDocuments = lazy(() => import("./company/pages/CompanyDocuments"));

//Medical Institution
const MedicalInsitutionManagement = lazy(
  () => import("./medical_institution/pages/MedicalInstitutionManagement")
);

//Salary Calculation
const SalaryManagement = lazy(() => import("./staff/pages/SalaryCalculation"));
const TimeCalculationSheetTab = lazy(
  () => import("./staff/pages/TimeCalculationSheetTab")
);
const TransportationCalculationSheetTab = lazy(
  () => import("./staff/pages/TransportationCalculationSheetTab")
);

//Archive
const Archive = lazy(() => import("./archive/pages/ArchiveManagement"));

//Attendance Records
const AttendanceRecord = lazy(
  () => import("./attendance/pages/AttendanceRecord")
);

const AppRoutes = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* <Route path="/" element={<Landing />} /> */}
        <Route path="/" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="projects"
            element={<Navigate to={`under-construction`} replace />}
          />

          <Route path="user-management" element={<UserManagement />} />

          <Route path="staff-management" element={<StaffManagement />}>
            <Route index element={<StaffTab />} />
          </Route>

          <Route path="staff-work-schedule" element={<StaffWorkSchedule />} />

          <Route path="leave-request" element={<LeaveRequestManagement />} />

          <Route path="patient-management" element={<PatientManagement />} />

          <Route
            path="medical-institution-management"
            element={<MedicalInsitutionManagement />}
          />

          <Route path="salary-management" element={<SalaryManagement />}>
            <Route index element={<TimeCalculationSheetTab />} />
            <Route path="staff-payslip" element={<PayslipManagement />} />
            {/* <Route path="staff-payslip" element={<PayslipManagement />} /> */}
            <Route
              path="transportation"
              element={<TransportationCalculationSheetTab />}
            />
          </Route>

          <Route path="archive" element={<Archive />} />

          <Route path="attendance-record" element={<AttendanceRecord />} />

          <Route path="company-information" element={<CompanyManagement />}>
            <Route index element={<CompanyInformation />} />
            <Route path="staff-code-list" element={<CompanyStaffCode />} />
            <Route path="documents" element={<CompanyDocuments />} />
          </Route>

          <Route path="profile" element={<Profile />}>
            <Route index element={<ProfileActivity />} />
            <Route path="information" element={<ProfileInformation />} />
            <Route path="password" element={<ProfilePassword />} />
          </Route>
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route
          path="forgot-password-submit"
          element={<ForgotPasswordSubmit />}
        />
        <Route path="register" element={<Register />} />
        <Route path="under-construction" element={<UnderConstructions />} />
        <Route path="403" element={<Forbidden />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to={`404`} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

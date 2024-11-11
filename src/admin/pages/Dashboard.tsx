import { Button, Grid, Menu, MenuItem } from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  ShoppingBasket as ShoppingBasketIcon,
  SupervisorAccount as SupervisorAccountIcon,
  FilterAlt as FilterAltIcon,
} from "@mui/icons-material";
import React, {
  useState,
  useEffect,
  useRef,
  MouseEvent,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import AdminAppBar from "../components/AdminAppBar";
import AdminToolbar from "../components/AdminToolbar";
import OverviewWidget from "../widgets/OverviewWidget";
import TotalServiceWidget from "../widgets/TotalServiceWidget";
import TotalServiceCategoryWidget from "../widgets/TotalServiceCategoryWidget";
import TotalPatientServicesWidget from "../widgets/TotalPatientServicesWidget";
import CircleProgressWidget from "../widgets/CircleProgressWidget";
import UsersWidget from "../widgets/UsersWidget";
import TeamProgressWidget from "../widgets/TeamProgressWidget";
import { useRecord } from "../../payslip/hooks/useRecord";
import { OverallRecord } from "../../payslip/types/record";
import { useStaffSelect } from "../../staff/hooks/useStaffSelection";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ja"; // Japanese locale

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Memoize the months to prevent re-creation on each render
  const months = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, index) =>
        dayjs()
          .month(11 - index)
          .startOf("month")
      ),
    []
  );

  // Fetch total work hours and staff selection data
  const { isLoading: isRecordLoading, data: records } = useRecord(
    currentMonth.format("YYYY-MM-DD")
  );
  const { isLoading: isStaffSelectionLoading, data: initialStaffSelect } =
    useStaffSelect();

  const [overallRecord, setOverallRecord] = useState<OverallRecord>({
    total_employees: initialStaffSelect ? initialStaffSelect.length : 0,
    total_hours: 0,
  });

  // Check if either of the fetch calls is loading
  const isLoading = isRecordLoading || isStaffSelectionLoading;

  // Define total service time goal
  const goal = 5000;

  // Overview data to display in widgets
  const overviewItems = [
    {
      unit: "payslip.overview.totalEmployees", // total of employees
      value: `${overallRecord.total_employees}人`,
      backgroundColor: "#ff9800",
    },
    {
      unit: "payslip.overview.totalHoursWorked", // total hours worked
      value: `${overallRecord.total_hours} 作業時間`,
      backgroundColor: "#1976D2",
    },
  ];

  // Calculate the progress percentage for total hours relative to the goal
  const progressPercentage = Math.min(
    Math.round((overallRecord.total_hours / goal) * 100),
    100
  );

  // Update overall record when records or initial staff selection data changes
  useEffect(() => {
    if (records && initialStaffSelect) {
      setOverallRecord({
        total_employees: initialStaffSelect.length,
        total_hours: records.total_hours,
      });
    }
  }, [records, initialStaffSelect]);

  // Event handler to open the menu
  const handleMenuOpen = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  // Event handler to close the menu
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Event handler to change the month and close the menu
  const handleMonthChange = useCallback(
    (month: Dayjs) => {
      handleMenuClose();
      setTimeout(() => {
        setCurrentMonth(month);
      }, 0);
    },
    [handleMenuClose]
  );

  // Format current month based on locale
  const formattedMonth = currentMonth.format(
    i18n.language === "ja" ? "YYYY年M月" : "MMM YYYY"
  );

  if (isLoading) {
    return <div>Loading...</div>; // Add your loading indicator
  }

  return (
    <React.Fragment>
      <AdminAppBar>
        <AdminToolbar title={t("dashboard.title")}>
          <Button
            ref={buttonRef}
            size="medium"
            variant="text"
            sx={{ fontSize: 24, color: "#45525C" }}
            startIcon={<FilterAltIcon />}
            onClick={handleMenuOpen}
          >
            {formattedMonth}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              style: {
                width: buttonRef.current
                  ? buttonRef.current.offsetWidth
                  : "auto",
              },
            }}
          >
            {months.map((month, index) => {
              const isCurrentMonth = month.isSame(currentMonth, "month");

              return (
                <MenuItem
                  sx={{
                    color: isCurrentMonth ? "#ffffff" : "#45525C",
                    fontWeight: "bold",
                    backgroundColor: isCurrentMonth ? "#45525C" : "transparent",
                    "&:hover": {
                      backgroundColor: isCurrentMonth ? "#1565C0" : "#f5f5f5",
                    },
                  }}
                  key={index}
                  onClick={() => handleMonthChange(month)}
                >
                  {month.format(
                    i18n.language === "ja" ? "YYYY年M月" : "MMM YYYY"
                  )}
                </MenuItem>
              );
            })}
          </Menu>
        </AdminToolbar>
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
          <TotalServiceWidget />
        </Grid>
        <Grid item xs={12} md={4}>
          <TotalServiceCategoryWidget />
        </Grid>
        <Grid item xs={12} md={9}>
          <TotalPatientServicesWidget
            selectedDate={currentMonth.format("YYYY-MM-DD")}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <CircleProgressWidget
            height={204}
            title={`${formattedMonth} 合計サービス時間の目標: ${overallRecord.total_hours} / ${goal}`}
            value={progressPercentage}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <UsersWidget />
        </Grid>
        <Grid item xs={12} md={8}>
          <TeamProgressWidget
            selectedDate={currentMonth.format("YYYY-MM-DD")}
            formattedDate={formattedMonth}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Dashboard;

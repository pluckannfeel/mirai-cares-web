import React, { useState } from "react";
import { StaffWorkSchedule } from "../types/StaffWorkSchedule";
import { Box, Grid, Typography, Paper } from "@mui/material";
import dayjs from "dayjs";
import SelectDateButtons from "../../core/components/SelectDateButtons";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type ShiftsByStaff = {
  [key: string]: StaffWorkSchedule[];
};

type ShiftTimelineProps = {
  shifts: StaffWorkSchedule[];
};

const ShiftTimeline: React.FC<ShiftTimelineProps> = ({ shifts }) => {
  const hourWidth = "100px"; // This defines the width of each hour blockc
  console.log(shifts);

  const [selectedDate, setSelectedDate] = useState(dayjs());

  const calculateShiftStyle = (
    shift: StaffWorkSchedule
  ): React.CSSProperties => {
    const startOfDay = dayjs(shift.start).startOf("day");
    const startOfShift = dayjs(shift.start);
    const endOfShift = dayjs(shift.end);

    const left: number = startOfShift.diff(startOfDay, "minute");
    const width: number = endOfShift.diff(startOfShift, "minute");
    const totalMinutesInDay = 1440; // 24 * 60

    return {
      position: "absolute",
      left: `${(left / totalMinutesInDay) * 100}%`,
      width: `${(width / totalMinutesInDay) * 100}%`,
      backgroundColor: shift.color || "grey",
      height: "20px",
      overflow: "hidden",
      whiteSpace: "nowrap",
    };
  };

  const shiftStyle: React.CSSProperties = {
    display: "inline-block",
    borderRadius: "4px",
    color: "white",
    textAlign: "center",
    lineHeight: "20px",
    fontSize: "0.75rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    margin: "0 2px", // Adjusted for closer spacing
    position: "relative",
  };

  const renderShift = (shift: StaffWorkSchedule) => (
    <Paper
      key={shift.id}
      style={{
        ...shiftStyle,
        ...calculateShiftStyle(shift),
      }}
      elevation={3}
    >
      <Typography variant="caption" style={{ padding: "0 4px" }}>
        {shift.patient === "nan" ? shift.service_type : shift.patient}
      </Typography>
    </Paper>
  );

  const shiftsByStaff: ShiftsByStaff = shifts.reduce(
    (acc: ShiftsByStaff, shift: StaffWorkSchedule) => {
      const staffShifts = acc[shift.staff] || [];
      staffShifts.push(shift);
      acc[shift.staff] = staffShifts.sort((a, b) =>
        dayjs(a.start).diff(dayjs(b.start))
      );
      return acc;
    },
    {}
  );

  // Header that contains the hours, wrapped in a scrollable Box
  const renderHeader = () => (
    <Box
      style={{
        overflowX: "auto",
        display: "flex",
        width: `calc(24 * ${hourWidth})`,
      }}
    >
      {Array.from({ length: 24 }, (_, index) => (
        <Box key={index} style={{ width: hourWidth, textAlign: "center" }}>
          <Typography variant="caption">{`${index}:00`}</Typography>
        </Box>
      ))}
    </Box>
  );

  // Mapping over each staff member to render their shifts
  const renderStaffShifts = (
    staffName: string,
    staffShifts: StaffWorkSchedule[]
  ) => (
    <Grid container alignItems="center" key={staffName}>
      <Grid item xs={2}>
        <Typography variant="subtitle1">{staffName}</Typography>
      </Grid>
      <Grid item xs={10}>
        <Box
          style={{
            position: "relative",
            width: `calc(24 * ${hourWidth})`,
            overflowX: "auto",
          }}
        >
          {staffShifts.map(renderShift)}
        </Box>
      </Grid>
    </Grid>
  );

  // Main component rendering
  return (
    <Paper style={{ padding: "16px" }}>
      <SelectDateButtons
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <Box sx={{ width: "100%", overflowX: "hidden" }}>
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={10}>
            {renderHeader()}
          </Grid>
        </Grid>
        {Object.entries(shiftsByStaff).map(([staffName, staffShifts]) =>
          renderStaffShifts(staffName, staffShifts)
        )}
      </Box>
    </Paper>
  );
};

export default ShiftTimeline;

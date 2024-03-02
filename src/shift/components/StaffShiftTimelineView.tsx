import React, { useEffect, useState } from "react";
import { StaffWorkSchedule } from "../types/StaffWorkSchedule";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useScheduleByDate } from "../hooks/useScheduleByDate";
import { Box, Container, Grid, Paper, useTheme } from "@mui/material";
import SelectDateButtons from "../../core/components/SelectDateButtons";
import Empty from "../../core/components/Empty";
import { timelineShiftType } from "../helpers/timelineView";
import { trimStringWithEllipsis } from "../../staff/helpers/functions";
import { useTranslation } from "react-i18next";
dayjs.extend(utc);

type ShiftsByStaff = {
  [key: string]: StaffWorkSchedule[];
};

type ShiftTimelineProps = {
  shifts?: StaffWorkSchedule[];
};

const ShiftTimeline: React.FC<ShiftTimelineProps> = (props) => {
  const hourWidth = 95; // This defines the width of each hour block in pixels
  const theme = useTheme();
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(dayjs().utc());
  const { data: initialShifts, isLoading } = useScheduleByDate(
    selectedDate.format("YYYY-MM-DD")
  );

  useEffect(() => {
    if (initialShifts) {
      setShifts(initialShifts);
    }
  }, [initialShifts]);

  const [shifts, setShifts] = useState<StaffWorkSchedule[]>([]);

  const calculateLeftOffset = (start: string) => {
    const startTime = dayjs(start).utc();
    const startHour = startTime.hour();
    const startMinute = startTime.minute();
    return startHour * hourWidth + (startMinute * hourWidth) / 60;
  };

  const calculateWidth = (start: string, end: string) => {
    const startTime = dayjs(start).utc();
    const endTime = dayjs(end).utc();

    let durationHours = endTime.diff(startTime, "hour", true);

    // If the end time is at the top of the hour, reduce the duration slightly so the bar doesn't extend into the next hour.
    if (endTime.minute() === 0 && durationHours % 1 === 0) {
      durationHours -= 0.01; // Slight reduction to bring the bar end inside the correct hour mark
    }

    return durationHours * hourWidth;
  };

  const groupedShifts = (shifts || []).reduce<ShiftsByStaff>((acc, shift) => {
    const staffKey = shift.staff;
    if (!acc[staffKey]) {
      acc[staffKey] = [];
    }
    acc[staffKey].push(shift);
    return acc;
  }, {});

  return (
    <div
      style={{
        // padding: "10px" /*  */,
        width: "calc(90vw - 128px)",
      }}
    >
      <div style={{ padding: 10 }}>
        <SelectDateButtons
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div
        style={{
          overflow: "auto",
          height: "calc(80vh - 100px)",
          padding: "5px 10px",
          width: "100%",
        }}
      >
        {/* Adjust maxHeight as needed */}
        <table
          style={{
            // minWidth: `${24 * hourWidth}px`,
            borderCollapse: "collapse",
            backgroundColor: "#f0f0f0", // Light grey background to mimic the image
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  minWidth: "250px",
                  width: "100%",
                  position: "sticky",
                  border: "1px solid #ccc",
                  height: "30px",
                  top: 0,
                  backgroundColor: "white",
                  //   color: theme.palette.primary.dark,
                  zIndex: 1,
                }}
              >
                {t("staffWorkSchedule.timelineView.headers.staffName")}
              </th>
              {[...Array(24)].map((_, index) => (
                <th
                  key={index}
                  style={{
                    minWidth: `${hourWidth}px`,
                    position: "sticky",
                    border: "1px solid #ccc",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                  }}
                >
                  {`${index}:00`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* {Object.entries(groupedShifts).length === 0 && (
              <tr>
                <Empty title="No shifts found for this date" />
              </tr>
            )} */}

            {Object.entries(groupedShifts).map(([staffName, shifts]) => (
              <tr key={staffName}>
                <td
                  style={{
                    backgroundColor: "white",
                    zIndex: 1,
                    paddingLeft: "10px",
                    border: "1px solid #ccc", // Apply cell borders
                  }}
                >
                  {staffName}
                </td>
                <td
                  colSpan={25}
                  style={{
                    position: "relative",
                    height: "50px",
                    border: "1px solid #ccc", // Apply cell borders
                  }}
                >
                  {shifts.map((shift) => {
                    const barType = timelineShiftType(shift.service_details);

                    const barColor =
                      barType === "success"
                        ? theme.palette.success.main
                        : barType === "warning"
                        ? theme.palette.warning.main
                        : theme.palette.primary.light;

                    return (
                      <div
                        key={shift.id}
                        style={{
                          position: "absolute",
                          left: `${calculateLeftOffset(
                            shift.start.toString()
                          )}px`,
                          width: `${calculateWidth(
                            shift.start.toString(),
                            shift.end.toString()
                          )}px`,
                          height: "100%",
                          bottom: "0",
                          backgroundColor: barColor as string,
                          padding: "2px",
                          fontWeight: "semi-bold",
                          borderRadius: "5px",
                          color: "#000",
                          zIndex: 0,
                        }}
                      >
                        {dayjs(shift.start).utc().format("HH:mm")} -{" "}
                        {dayjs(shift.end).utc().format("HH:mm")}{" "}
                        {shift.patient !== "nan"
                          ? shift.patient + " : " + shift.service_type
                          : trimStringWithEllipsis(
                              shift.service_details as string,
                              8
                            )}
                        {}
                      </div>
                    );
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftTimeline;

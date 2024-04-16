import FullCalendar from "@fullcalendar/react";
import {
  // EventApi,
  // DateSelectArg,
  EventClickArg,
  EventContentArg,
  CalendarOptions,
  // formatDate,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Typography,
  alpha,
  experimentalStyled as styled,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Event as EventIcon,
} from "@mui/icons-material";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StaffWorkSchedule, staffColors } from "../types/StaffWorkSchedule";
import {
  getGenderColor,
  trimStringWithEllipsis,
} from "../../staff/helpers/functions";
import dayjs from "dayjs";
import ShiftTimelineView from "./StaffShiftTimelineView";

const StyledWrapper = styled("div")(
  ({ theme }) => `
    .fc-theme-standard .fc-scrollgrid {
      border-color: ${theme.palette.divider};
    }
  
    .fc th {
      border-right: none;
      border-left: none;
      // padding: 8px 0;
    }
  
    .fc-theme-standard .fc-scrollgrid {
      border-right: none;
      border-left: none;
      border-bottom: none;
    }
  
    .fc-theme-standard td, .fc-theme-standard th {
      border-right: none;
    }
  
    .fc-theme-standard td, .fc-theme-standard th {
      border-color: ${theme.palette.divider};
    }
  
    .fc .fc-daygrid-day-number {
      color: ${theme.palette.text.secondary};
      font-size: auto;
      font-weight: ${theme.typography.fontWeightMedium};
      // padding: 12px;
    }
  
    .fc .fc-daygrid-day.fc-day-today {
      background-color: ${alpha(theme.palette.primary.main, 0.15)};
    }

    .fc-day-other {
      /* Hide the days from adjacent months */
      visibility: hidden;
    }
  `
);

function convertToTimeString(date: Date): string {
  // Ensuring leading zeros for hours and minutes
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

type CalendarProps = {
  schedule?: StaffWorkSchedule[];
  onEventClick: (schedule?: StaffWorkSchedule) => void;
} & CalendarOptions;

const SWSCalendar = ({
  schedule = [],
  onEventClick,
  ...calendarProps
}: CalendarProps) => {
  const theme = useTheme();
  const { i18n, t } = useTranslation();

  // console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"))

  // const initialNow = new Date();

  const [viewTitle, setViewTitle] = useState("");
  const [calendarRef, setCalendarRef] = useState<FullCalendar | null>(null);

  const onCalendarRefSet = useCallback((ref: FullCalendar) => {
    if (ref !== null) {
      setCalendarRef(ref);
    }
  }, []);

  const handleEventClick = (arg: EventClickArg) => {
    if (onEventClick) {
      const event = schedule.find((e) => e.id === arg.event.id);
      onEventClick(event);
    }
  };

  const handleNext = () => {
    if (calendarRef) {
      calendarRef.getApi().next();
      setViewTitle(calendarRef.getApi().view.title);
    }
  };

  const handlePrev = () => {
    if (calendarRef) {
      calendarRef.getApi().prev();
      setViewTitle(calendarRef.getApi().view.title);
    }
  };

  const handleToday = () => {
    if (calendarRef) {
      calendarRef.getApi().today();
      setViewTitle(calendarRef.getApi().view.title);
    }
  };

  useEffect(() => {
    if (calendarRef) {
      setViewTitle(calendarRef.getApi().view.title);

      // timeline view
    }
  }, [calendarRef, schedule]);

  const handleViewChange = (viewType: string) => {
    // Generic handler for changing views
    // if (viewType === "day") {
    //   // setCustomTimelineView(true);
    // } else {
    // }
    if (calendarRef) {
      calendarRef.getApi().changeView(viewType);
      setViewTitle(calendarRef.getApi().view.title);
    }
  };

  const handleMonthView = () => handleViewChange("dayGridMonth");
  const handleWeekView = () => handleViewChange("dayGridWeek");
  const handleListView = () => handleViewChange("listMonth"); // Adjust to your specific day view

  const scheduleSource = useMemo(() => {
    return schedule.map((schedule: StaffWorkSchedule) => {
      if (schedule.color && staffColors.includes(schedule.color)) {
        return { ...schedule, color: theme.palette[schedule.color].main };
      }
      return schedule;
    });
  }, [schedule, theme]);

  // console.log(scheduleSource);

  return (
    <React.Fragment>
      {/* Start - Custom Header Bar */}
      <Box
        paddingX={2.5}
        //   marginBottom={}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ display: "inline-flex" }} variant="h5">
          <EventIcon sx={{ mr: 2 }} />
          {viewTitle}
        </Typography>
        <Box>
          <IconButton
            aria-label="previous"
            component="span"
            onClick={handlePrev}
          >
            <ArrowLeftIcon />
          </IconButton>
          <Button onClick={handleToday}>{t("common.thisMonth")}</Button>
          <IconButton
            aria-label="next"
            component="span"
            edge="end"
            onClick={handleNext}
          >
            <ArrowRightIcon />
          </IconButton>

          {/* Add view change buttons */}
          <ButtonGroup
            variant="contained"
            size="small"
            disableElevation
            color="primary"
            aria-label="outlined button group"
            sx={{
              marginLeft: "2rem",
              marginY: "0.5rem",
              "& .MuiButton-root": {
                borderColor: "transparent", // Remove border color
                // Target the buttons within the ButtonGroup
                padding: "8px 20px", 
                // Other styles here if needed
              },
            }}
          >
            <Button onClick={handleMonthView}>
              {t("calendar.buttons.month")}
            </Button>

            <Button onClick={handleWeekView}>
              {t("calendar.buttons.week")}
            </Button>
            <Button onClick={handleListView}>
              {t("calendar.buttons.list")}
            </Button>
            {/* <Button onClick={handleListView}>
              {t("calendar.buttons.day")}
            </Button> */}
          </ButtonGroup>
        </Box>
      </Box>
      {/* End - Custom Header Bar */}

      <StyledWrapper>
        <FullCalendar
          // contentHeight={800}
          contentHeight={"auto"}
          headerToolbar={false}
          plugins={[dayGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          listDayFormat={{
            month: "long",
            day: "numeric",
            weekday: "long",
          }}
          // height={"100vh"}
          height={"auto"}
          locale={i18n.language}
          timeZone="Asia/Tokyo"
          // timeZone="UTC"
          firstDay={1}
          ref={onCalendarRefSet}
          events={scheduleSource}
          eventClick={handleEventClick}
          // selectable={true}
          // eventTimeFormat={{
          //   hour: "2-digit",
          //   minute: "2-digit",
          //   meridiem: false, // Set to false to use 24-hour format
          // }}
          eventContent={(arg: EventContentArg) => {
            // customize render content here
            // console.log(arg.event.backgroundColor);

            const gender =
              arg.event.extendedProps.gender === "男性"
                ? "male"
                : arg.event.extendedProps.gender === "女性"
                ? "female"
                : "other";
            const eventColor =
              arg.event.backgroundColor !== "null"
                ? arg.event.backgroundColor
                : getGenderColor(gender, arg);

            const eventStyle = {
              backgroundColor: eventColor, // Set the background color based on event properties
              color: "#000", // Set the text color based on event properties
              // padding: "5px 10px",
              padding: "2px",
              // margin: "0 5px",
              width: "100%",
              borderRadius: "5px",
              fontSize: "0.8rem",
              // textAlign: "justify" as "justify",
            };

            const patient_or_service_details =
              arg.event.extendedProps.patient !== "nan"
                ? arg.event.extendedProps.patient
                : arg.event.extendedProps.service_details;

            return (
              <Box sx={eventStyle}>
                <div style={{fontSize: "0.7rem",}}>
                  {`${convertToTimeString(
                    arg.event.start as Date
                  )} - ${convertToTimeString(arg.event.end as Date)}`}
                </div>
                <div style={{ fontWeight: "bold" }}>
                  {/* check if the current view is not month, dont trim arg.event.extendedProps.staff  */}
                  {arg.view.type !== "listWeek"
                    ? trimStringWithEllipsis(arg.event.extendedProps.staff, 12)
                    : arg.event.extendedProps.staff}
                </div>

                {/* <div>
                  {patient_or_service_details} -{" "}
                  {arg.event.extendedProps.service_type}
                </div> */}
                {/* <div>{arg.event.extendedProps.service_details}</div> */}
              </Box>
            );
          }}
          // selectable={true}
          // selectMirror={true}
          {...calendarProps}
        />
      </StyledWrapper>
    </React.Fragment>
  );
};

export default SWSCalendar;

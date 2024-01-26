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
  Tooltip,
  experimentalStyled as styled,
  // useTheme,
} from "@mui/material";

import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LeaveRequest } from "../types/LeaveRequest";
// import Calendar from "../../calendar/components/Calendar";

const StyledWrapper = styled("div")(
  ({ theme }) => `
      .fc-theme-standard .fc-scrollgrid {
        border-color: ${theme.palette.divider};
        background-color: #fff; // White-grey background
        border-radius: 12px
      }
    
      .fc th {
        border-right: none;
        border-left: none;
        padding: 10px 0;
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
        font-size: 14px;
        font-weight: ${theme.typography.fontWeightBold};
        padding: 12px;
      }
    
      .fc .fc-daygrid-day.fc-day-today {
        background-color: ${alpha(theme.palette.primary.main, 0.1)};
      }

      .fc-event-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `
);

// function convertToTimeString(date: Date | null | undefined): string {
//   if (!date) {
//     return ""; // Or return a placeholder string like 'N/A'
//   }
//   // Ensuring leading zeros for hours and minutes
//   const hours = date.getUTCHours().toString().padStart(2, "0");
//   const minutes = date.getUTCMinutes().toString().padStart(2, "0");
//   return `${hours}:${minutes}`;
// }

type CalendarProps = {
  requests?: LeaveRequest[];
  onEventClick: (request?: LeaveRequest) => void;
} & CalendarOptions;

const LeaveRequestCalendar = ({
  requests = [],
  onEventClick,
  ...calendarProps
}: CalendarProps) => {
  // const theme = useTheme();
  const { i18n, t } = useTranslation();

  // console.log("requests", requests);

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
      const event = requests.find((e) => e.id === arg.event.id);
      onEventClick(event);
    }
  };

  const handleNext = () => {
    // if (calendarRef) {
    //   calendarRef.getApi().next();
    //   setViewTitle(calendarRef.getApi().getCurrentData().viewTitle);
    // }
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

  const handleMonthView = () => {
    if (calendarRef) {
      calendarRef.getApi().changeView("dayGridMonth");
      setViewTitle(calendarRef.getApi().view.title);
    }
  };

  const handleWeekView = () => {
    if (calendarRef) {
      calendarRef.getApi().changeView("dayGridWeek");
      setViewTitle(calendarRef.getApi().view.title);
    }
  };

  const handleDayView = () => {
    if (calendarRef) {
      calendarRef.getApi().changeView("listWeek");
      setViewTitle(calendarRef.getApi().view.title);
    }
  };

  useEffect(() => {
    if (calendarRef) {
      setViewTitle(calendarRef.getApi().view.title);
    }
  }, [calendarRef]);

  const requestSource = useMemo(() => {
    return requests.map((request: LeaveRequest) => {
      const start = request.start_date;
      let end = request.end_date.toString();

      // Check if end date is a full day (not a datetime)
      if (end && !end.includes("T")) {
        // Convert to a Date object and add one day
        const endDate = new Date(end);
        endDate.setDate(endDate.getDate() + 1);
        // Convert back to an ISO string (date part only)
        end = endDate.toISOString().split("T")[0];
      }

      const backgroundColor =
        request.status === "pending"
          ? "orange"
          : request.status === "approved"
          ? "green"
          : "red";

      return {
        ...request,
        start,
        end,
        title: request.details, // Using 'details' as the title
        backgroundColor, // Set the background color for the event
      };
    });
  }, [requests]);

  // console.log(requestSource);
  return (
    <React.Fragment>
      <Box
        paddingX={2.5}
        //   marginBottom={}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "12px",
          marginBottom: "15px",
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
          <Button onClick={handleToday}>{t("common.today")}</Button>
          <IconButton
            aria-label="next"
            component="span"
            edge="end"
            onClick={handleNext}
          >
            <ArrowRightIcon />
          </IconButton>

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
                padding: "8px 20px", // Adjust padding to your preference
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
            <Button onClick={handleDayView}>
              {t("calendar.buttons.list")}
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
      {/* End - Custom Header Bar */}
      <StyledWrapper>
        <FullCalendar
          contentHeight={1020}
          headerToolbar={false}
          plugins={[dayGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          // now={initialNow.getTime()}
          locale={i18n.language}
          // timeZone='Asia/Tokyo'
          timeZone="UTC"
          firstDay={1}
          ref={onCalendarRefSet}
          events={requestSource}
          eventClick={handleEventClick}
          // selectable={true}
          // eventTimeFormat={{
          //   hour: "2-digit",
          //   minute: "2-digit",
          //   meridiem: false, // Set to false to use 24-hour format
          // }}
          eventContent={(arg: EventContentArg) => {
            // const eventColor = arg.event.backgroundColor || theme.palette.primary.main;

            const eventStyle = {
              backgroundColor: arg.event.backgroundColor,
              color: "#fff",
              padding: "5px 10px",
              margin: "0 5px",
              borderRadius: "5px",
              fontSize: "17px",
            };

            const status =
              arg.event.extendedProps.status === "pending"
                ? t("leaveRequest.screen.row.status.pending")
                : arg.event.extendedProps.status === "approved"
                ? t("leaveRequest.screen.row.status.approved")
                : t("leaveRequest.screen.row.status.declined");

            return (
              <Tooltip
                title={
                  i18n.language === "en"
                    ? arg.event.extendedProps.staff?.english_name
                    : arg.event.extendedProps.staff?.japanese_name
                }
              >
                <Box sx={eventStyle}>
                  <div
                    style={{ fontWeight: "bold" }}
                    className="fc-event-title"
                  >
                    {/* Ensure that the properties you access exist on extendedProps */}
                    {`（${status}）`}
                    {i18n.language === "en"
                      ? arg.event.extendedProps.staff?.english_name
                      : arg.event.extendedProps.staff?.japanese_name}
                  </div>

                  <div>
                    {/* {`${convertToTimeString(
                    arg.event.start as Date
                  )} - ${convertToTimeString(arg.event.end as Date)}`} */}
                  </div>
                  <div>
                    {/* - {" "} */}
                    {/* {arg.event.extendedProps.service_type} */}
                  </div>
                </Box>
              </Tooltip>
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

export default LeaveRequestCalendar;

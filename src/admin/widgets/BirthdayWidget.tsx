import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import {
  // EventApi,
  // DateSelectArg,
  EventClickArg,
  EventContentArg,
  CalendarOptions,
  // formatDate
} from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
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
  Cake as CakeIcon,
} from "@mui/icons-material";
import BirthdaySvg from "../../core/assets/birthday.svg?react";
import CakeSvg from "../../core/assets/cake.svg?react";

import { useTranslation } from "react-i18next";
import { useBirthdays } from "../hooks/useBirthdays";
import { Birthday } from "../types/birthday";

const StyledWrapper = styled("div")(
  ({ theme }) => `
        .fc-theme-standard .fc-scrollgrid {
          border-color: ${theme.palette.divider};
          background-color: #fff; // White-grey background
          border-radius: 0
        }
      
        .fc th {
          border-right: none;
          border-left: none;
          padding: 2px 0;
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
          font-size: 12px;
          font-weight: ${theme.typography.fontWeightBold};
          padding: 2px;
        }
      
        .fc .fc-daygrid-day.fc-day-today {
            background-color: transparent; // Clear the default background
            background-image: linear-gradient(135deg, #B8E0D2 0%, #EBC8E4 100%);
        }
  
        .fc-event-title {
            overflow: visible;
            text-overflow: clip;
            white-space: normal;
            border: none;
            line-height: 1.2; // Adjust line height for better readability
            padding-bottom: 4px; // Adds some space at the bottom
          }

        /* Removing borders from event items */
        .fc-event {
          border: none !important; /* Use !important to override FullCalendar's default styles */
          box-shadow: none !important; /* Optionally remove shadows if present */
        }
      `
);

type CalendarProps = {
  onEventClick?: (birthday?: Birthday) => void;
} & CalendarOptions;

// Define a type for the argument passed to dayCellDidMount
type DayCellArg = {
  date: Date;
  el: HTMLElement;
};

const BirthdayWidget = ({ onEventClick, ...calendarProps }: CalendarProps) => {
  const { t, i18n } = useTranslation();
  const today = dayjs();
  const currentYear = dayjs().year();

  const { data: birthdayList } = useBirthdays();

  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [viewTitle, setViewTitle] = useState("");
  const [calendarRef, setCalendarRef] = useState<FullCalendar | null>(null);

  const onCalendarRefSet = useCallback((ref: FullCalendar) => {
    if (ref !== null) {
      setCalendarRef(ref);
    }
  }, []);

  const handleEventClick = (arg: EventClickArg) => {
    if (onEventClick) {
      const event = birthdays.find((e) => e.id === arg.event.id);
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

  const handleThisMonth = () => {
    if (calendarRef) {
      calendarRef.getApi().today();
      setViewTitle(calendarRef.getApi().view.title);
    }
  };

  useEffect(() => {
    if (birthdayList) {
      setBirthdays(birthdayList);
    }

    if (calendarRef) {
      setViewTitle(calendarRef.getApi().view.title);
    }
  }, [calendarRef]);

  const birthdayEvents = useMemo(() => {
    return birthdays.map((birthday) => {
      const birthdayDate = dayjs(birthday.birth_date);
      const birthYear = birthdayDate.year();

      // Calculate age
      const age = currentYear - birthYear;

      // Adjust the birthday to the current year
      const adjustedBirthdayDate = birthdayDate
        .year(currentYear)
        .format("YYYY-MM-DD");
      // Determine if the birthday is today, in the future, or in the past
      // Note: This checks if the birthday is today by comparing month and day
      const isToday =
        birthdayDate.month() === today.month() &&
        birthdayDate.date() === today.date();
      // Checks if the birthday has already occurred this year
      const isPast =
        birthdayDate.month() < today.month() ||
        (birthdayDate.month() === today.month() &&
          birthdayDate.date() < today.date());

      let backgroundColor: string;
      //   if (isToday) {
      //     backgroundColor = "#FFCC00"; // Yellow for today's birthdays
      //   } else if (!isPast) {
      //     backgroundColor = "#00CC00"; // Green for future birthdays
      //   } else {
      //     backgroundColor = "transparent"; // Red for past birthdays
      //   }

      backgroundColor = "transparent"; // Red for past birthdays

      return {
        id: birthday.id,
        title:
          i18n.language === "ja"
            ? birthday.japanese_name
            : birthday.english_name,
        date: adjustedBirthdayDate, // Use the adjusted date
        backgroundColor,
        age,
      };
    });
  }, [birthdays, i18n.language]);

  const dayCellDidMount = useCallback(
    (arg: DayCellArg) => {
      const cellDateStr = dayjs(arg.date).format("YYYY-MM-DD");
      const currentYear = dayjs().year();
      const todayStr = dayjs().format("YYYY-MM-DD");

      // Directly style today's cell for text color
      if (cellDateStr === todayStr) {
        const dayNumberEl = arg.el.querySelector(
          ".fc-daygrid-day-number"
        ) as HTMLElement | null;
        if (dayNumberEl) {
          dayNumberEl.style.color = "#4A90E2";
          dayNumberEl.style.fontSize = "14px";
          // Change to your preferred text color for today
        }
      }

      birthdays.forEach((birthday) => {
        const birthdayDateStr = dayjs(birthday.birth_date)
          .year(currentYear)
          .format("YYYY-MM-DD");

        if (birthdayDateStr === cellDateStr) {
          arg.el.style.backgroundColor =
            "linear-gradient(135deg, #B8E0D2 0%, #EBC8E4 100%)"; // Directly setting the style on the day cell

          // Use type assertion to assure TypeScript that the element is indeed an HTMLElement
          const dayNumberEl = arg.el.querySelector(
            ".fc-daygrid-day-number"
          ) as HTMLElement | null;
          if (dayNumberEl) {
            dayNumberEl.style.color = "#4A90E2"; // Now TypeScript knows `style` exists on `dayNumberEl`
          }

          // Adding an icon or other marker
          // Ensure you adjust the path and styling as needed
          //   const iconHTML = `<img src="${BirthdaySvg}" alt="Birthday" style="width: 20px; height: 20px; position: absolute; bottom: 0; left: 0;">`;
          //   arg.el.insertAdjacentHTML("beforeend", iconHTML);
        }
      });
    },
    [birthdays]
  );

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title={t("admin.home.birthdays.title")} />
      <CardContent sx={{ position: "relative" }}>
        <Box
          paddingX={2.5}
          //   marginBottom={}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
            // borderRadius: "12px",
            marginBottom: "5px",
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
            <Button onClick={handleThisMonth}>{t("common.thisMonth")}</Button>
            <IconButton
              aria-label="next"
              component="span"
              edge="end"
              onClick={handleNext}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>
        </Box>
        <StyledWrapper>
          <FullCalendar
            contentHeight={"auto"}
            headerToolbar={false}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            showNonCurrentDates={false}
            // now={initialNow.getTime()}
            locale={i18n.language}
            timeZone='Asia/Tokyo'
            // timeZone="UTC"
            firstDay={1}
            ref={onCalendarRefSet}
            events={birthdayEvents}
            eventClick={handleEventClick}
            dayCellDidMount={dayCellDidMount}
            eventContent={(arg: EventContentArg) => {
              // const eventColor = arg.event.backgroundColor || theme.palette.primary.main;

              const eventStyle = {
                backgroundColor: arg.event.backgroundColor,
                color: "#000",
                padding: "5px 10px",
                // margin: "0 5px",
                // borderRadius: "5px",
                fontSize: "12px",
              };

              return (
                <Tooltip
                  title={
                    i18n.language === "en"
                      ? arg.event.extendedProps.staff?.english_name
                      : arg.event.extendedProps.staff?.japanese_name
                  }
                >
                  <Box sx={eventStyle}>
                    {/* <CakeIcon
                      style={{ fontSize: "1rem", marginRight: "4px" }}
                    /> */}
                    <div
                      style={{ fontWeight: "bold" }}
                      className="fc-event-title"
                    >
                      {
                        <CakeIcon
                          style={{ fontSize: "1rem", color: "#CC99FF", marginRight: "2px", }}
                        />
                      }
                      {arg.event.title}
                    </div>

                    <div>
                      {/* {`${convertToTimeString(
                    arg.event.start as Date
                  )} - ${convertToTimeString(arg.event.end as Date)}`} */}
                    </div>
                  </Box>
                </Tooltip>
              );
            }}
            {...calendarProps}
          />
        </StyledWrapper>
        {/* Floating SVG */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            // left: "22%",
            right: "10px",
            transform: "translate(-50%, -50%)",
            textAlign: "center", // Center the icon if it has accompanying text
          }}
        >
          <CakeSvg style={{ height: "50px", width: "auto" }} />
        </div>

        <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
          <BirthdaySvg style={{ height: "50px", width: "auto" }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BirthdayWidget;

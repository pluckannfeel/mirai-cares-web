import React, { useState } from "react";
import dayjs, { locale } from "dayjs";
import utc from "dayjs/plugin/utc";
import { Button, ButtonGroup, IconButton, Popover } from "@mui/material";
import {
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
} from "@mui/icons-material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en"; // English
import "dayjs/locale/ja"; // Japanese
import { formatDateWithDayjs } from "../../helpers/dayjs";
import { useTranslation } from "react-i18next";

dayjs.extend(utc);

interface DateButtonGroupProps {
  selectedDate: dayjs.Dayjs;
  setSelectedDate: (date: dayjs.Dayjs) => void;
}

const SelectDateButtons: React.FC<DateButtonGroupProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePrevDay = () => setSelectedDate(selectedDate.subtract(1, "day"));
  const handleNextDay = () => setSelectedDate(selectedDate.add(1, "day"));
  const handlePrevMonth = () =>
    setSelectedDate(selectedDate.subtract(1, "month"));
  const handleNextMonth = () => setSelectedDate(selectedDate.add(1, "month"));
  const handleToday = () => setSelectedDate(dayjs());
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      handleClose(); // Close the popover after selecting a date
    }
  };

  return (
    <>
      <ButtonGroup
        size="small"
        variant="contained"
        aria-label="date navigation buttons"
        sx={{
        //   marginLeft: "2rem",
        //   marginY: "0.5rem",
          "& .MuiButton-root": {
            borderColor: "transparent", // Remove border color
            // Target the buttons within the ButtonGroup
            padding: "8px 20px", // Adjust padding to your preference
            // Other styles here if needed
          },
        }}
      >
        <Button onClick={handlePrevMonth}>
          <KeyboardDoubleArrowLeftIcon />{" "}
        </Button>
        <Button onClick={handlePrevDay}>
          <KeyboardArrowLeftIcon />
        </Button>
        <Button onClick={handleToday}>
          {formatDateWithDayjs(
            selectedDate.toDate(),
            " MMM DD ddd",
            i18n.language
          )}
        </Button>
        <Button aria-label="calendar" onClick={handleClick}>
          <CalendarTodayIcon />
        </Button>
        <Button onClick={handleNextDay}>
          <KeyboardDoubleArrowRightIcon />
        </Button>
        <Button onClick={handleNextMonth}>
          <KeyboardArrowRightIcon />
        </Button>
      </ButtonGroup>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <DateCalendar
          value={dayjs.utc(selectedDate)}
          onChange={(newValue) =>
            handleDateChange(newValue ? dayjs.utc(newValue) : null)
          }
        />
      </Popover>
    </>
  );
};

export default SelectDateButtons;

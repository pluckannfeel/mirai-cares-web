import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

// Extend Day.js with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);

export const DayJS = dayjs;

export const formatDateWithDayjs = (
  date: Date,
  format: string,
  locale: string
) => {
  dayjs.locale(locale); // Set the locale
  return dayjs(date).format(format);
};

// Function to convert a date to a specific timezone
export function toZonedTime(
  date: string | Date | number,
  timeZone: string
): number {
  return dayjs(date).tz(timeZone).valueOf();
}

// Function to convert a date to UTC
export function toUTC(date: string | Date, timeZone: string): number {
  return dayjs.tz(date, timeZone).utc().valueOf();
}

export function differenceInMinutes(end: string | Date, start: string | Date) {
  return dayjs(end).diff(dayjs(start), "minute");
}

export const serviceHours = (start: Date | number, end: Date | number) => {
  const startTime = dayjs(start).utc().format("HH:mm");
  const endTime = dayjs(end).utc().format("HH:mm");

  // console.log("startTime", startTime);
  // console.log("endTime", endTime);
  return `${startTime} ~ ${endTime}`;
};

export const toJapaneseCalendar = (d: Date) => {
  // Initialize dayjs with the input date, without converting to UTC
  const date = dayjs(d).locale("ja");

  // Use the local year for calculations, not the UTC year
  const gregorianYear = date.year();
  let japaneseYear = gregorianYear - 2018; // Subtract the start year of Reiwa era (2019) minus 1
  let era = "令和";

  // Adjust for dates before the Reiwa era
  if (gregorianYear < 2019) {
    japaneseYear = gregorianYear - 1988; // Example for Heisei, starting from 1989
    era = "平成";
  }

  // Format the date using the local time, not UTC
  return `${era}${japaneseYear}年${date.format("M月")}`;
};

export function formatDateToJapanese(date: Date | number) {
  // Define a mapping for Japanese day names
  const japaneseDayNames: { [key: string]: string } = {
    "0": "日", // Sunday
    "1": "月", // Monday
    "2": "火", // Tuesday
    "3": "水", // Wednesday
    "4": "木", // Thursday
    "5": "金", // Friday
    "6": "土", // Saturday
  };

  // Convert to a Day.js object
  const day = dayjs(date);

  // Get the day of the week and map it to the Japanese day name
  const dayOfWeek = day.utc().day().toString();
  const dayName = japaneseDayNames[dayOfWeek];

  // Construct the formatted date string
  const formattedDate = `${day.format("M月D日")}(${dayName})`;

  return formattedDate;
}

export const getDuration = (start: Date, end: Date) => {
  // Ensure the dates are in UTC
  const startDate = dayjs(start).utc();
  const endDate = dayjs(end).utc();

  // Calculate the difference in milliseconds and convert to minutes
  const diffInMinutes = endDate.diff(startDate, "minute");

  return diffInMinutes;
};

export function distanceToNow(createdAt: number) {
  return dayjs(createdAt).locale("ja").fromNow();
}

export const createMonthObjects = (locale: string) => {
  dayjs.locale(locale); // Set the locale

  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1; // Month numbers start from 1
    return {
      value: month,
      label: dayjs(new Date(2000, i, 1)).format("MMMM"), // Format to get the full month name
    };
  });
};

export function formatLastModified(lastModified: string, locale = "en") {
  if (lastModified === "") return lastModified;

  // Set the locale for dayjs
  dayjs.locale(locale);

  // Convert the lastModified date to UTC, then to Japan time by adding 9 hours
  const modifiedDate = dayjs.utc(lastModified).add(9, "hour");
  const now = dayjs().utc().add(9, "hour"); // Assuming 'now' is also in Japan time for comparison

  const diffInDays = now.diff(modifiedDate, "day");
  const diffInMinutes = now.diff(modifiedDate, "minute");

  if (diffInMinutes < 1) {
    return locale === "en" ? "less than a minute ago" : "1分未満";
  }

  if (diffInMinutes < 60) {
    return dayjs().utc().add(9, "hour").to(modifiedDate); // Use Japan time
  }

  if (diffInDays === 0) {
    return locale === "en"
      ? `Today at ${modifiedDate.format("HH:mm:ss")}`
      : `今日 ${modifiedDate.format("HH:mm:ss")}`;
  }

  if (diffInDays === 1) {
    return locale === "en" ? "Yesterday" : "昨日";
  }

  if (diffInDays <= 30) {
    return dayjs().utc().add(9, "hour").to(modifiedDate); // Use Japan time
  }

  // For dates older than 30 days, return the date in the format yyyy/mm/dd
  return modifiedDate.format("YYYY/MM/DD");
}

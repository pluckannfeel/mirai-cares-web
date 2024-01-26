// import { format } from "date-fns";
// import { enUS } from "date-fns/locale";

import { createMonthObjects } from "../../helpers/dayjs";

export const filterOptions = [
  { value: "date", label: "payslip.filter.filterByDate" },
  { value: "staff", label: "payslip.filter.filterByStaff" },
];

// Function to create month objects
// const createMonthObjects = (locale: Locale) => {
//   return Array.from({ length: 12 }, (_, i) => {
//     const month = i + 1; // Month numbers start from 1
//     return {
//       value: month,
//       label: format(new Date(2000, i), "MMMM", { locale }),
//     };
//   });
// };

// English and Japanese month objects
export const months = createMonthObjects("en-US");
export const japaneseMonthObjects = [
  { value: 1, label: "1月" },
  { value: 2, label: "2月" },
  { value: 3, label: "3月" },
  { value: 4, label: "4月" },
  { value: 5, label: "5月" },
  { value: 6, label: "6月" },
  { value: 7, label: "7月" },
  { value: 8, label: "8月" },
  { value: 9, label: "9月" },
  { value: 10, label: "10月" },
  { value: 11, label: "11月" },
  { value: 12, label: "12月" },
];

// Year objects (current year + 15 years)
// const currentYear = new Date().getFullYear();
// export const years = Array.from({ length: 16 }, (_, i) => (
//   {
//   value: currentYear + i,
//   label: (currentYear + i).toString(),
//   }
// ));

// with last years date
// export const years = Array.from({ length: 31 }, (_, i) => {
//   const year =
//     i < 15
//       ? subYears(new Date(), 15 - i).getFullYear()
//       : addYears(new Date(), i - 15).getFullYear();
//   return {
//     value: year,
//     label: year.toString(),
//   };
// });
export const years = [
  {
    value: 2023,
    label: "2023",
  },
  {
    value: 2024,
    label: "2024",
  },
  {
    value: 2025,
    label: "2025",
  },
];

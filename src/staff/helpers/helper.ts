export const staff_group = [
  {
    label: "staffManagement.form.staff_group.options.staff",
    value: "スタッフ",
  },
  { label: "staffManagement.form.staff_group.options.user", value: "利用者" },
];

export const genders = [
  { label: "staffManagement.form.gender.options.f", value: "女性" },
  { label: "staffManagement.form.gender.options.m", value: "男性" },
  { label: "staffManagement.form.gender.options.n", value: "その他" },
];

export const duty_types = [
  {
    label: "staffManagement.form.duty_type.options.fullTime1",
    value: "常勤 - 専従",
  },
  {
    label: "staffManagement.form.duty_type.options.fullTime2",
    value: "常勤 - 兼務",
  },
  {
    label: "staffManagement.form.duty_type.options.partTime1",
    value: "非常勤 - 専従",
  },
  {
    label: "staffManagement.form.duty_type.options.partTime2",
    value: "非常勤 - 兼務",
  },
];

export const calendarViews = [
  { label: "staffWorkSchedule.calendarViews.options.staff", value: "staff" },
  {
    label: "staffWorkSchedule.calendarViews.options.patient",
    value: "patient",
  },
];

export type TransportType = "walk" | "bus" | "train" | "car_taxi" | "other";

export const transport_types = [
  {
    label: "shiftReport.dialog.form.transport_type.options.walk",
    value: "walk",
  },
  { label: "shiftReport.dialog.form.transport_type.options.bus", value: "bus" },
  {
    label: "shiftReport.dialog.form.transport_type.options.train",
    value: "train",
  },
  {
    label: "shiftReport.dialog.form.transport_type.options.car_taxi",
    value: "car_taxi",
  },
  {
    label: "shiftReport.dialog.form.transport_type.options.other",
    value: "others",
  },
];

export const support_hours = [
  { label: "shiftReport.dialog.form.support_hours.options.1", value: "0.5" },
  { label: "shiftReport.dialog.form.support_hours.options.2", value: "1.0" },
  { label: "shiftReport.dialog.form.support_hours.options.3", value: "1.5" },
  { label: "shiftReport.dialog.form.support_hours.options.4", value: "2.0" },
  { label: "shiftReport.dialog.form.support_hours.options.5", value: "2.5" },
  { label: "shiftReport.dialog.form.support_hours.options.6", value: "3.0" },
  { label: "shiftReport.dialog.form.support_hours.options.7", value: "3.5" },
  { label: "shiftReport.dialog.form.support_hours.options.8", value: "4.0" },
];

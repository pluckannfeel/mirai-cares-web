export const getNotificationLink = (code: string) => {
  switch (code) {
    case "newComment":
      return `/admin/`;
    case "unreadMessages":
      return `/admin/`;
    case "leaveRequest":
      return `/admin/leave-request/`;
    case "updateLeaveRequest":
      return `/admin/leave-request/`;
    default:
      return `/admin/`;
  }
};

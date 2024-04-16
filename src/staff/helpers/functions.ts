/* eslint-disable @typescript-eslint/no-explicit-any */
type EventArg<T extends Record<string, any>> = {
  event: {
    backgroundColor: string;
    extendedProps: T;
  };
};

export const getGenderColor = <T extends Record<string, any>>(
  gender: string,
  arg: EventArg<T>
) => {
  switch (gender) {
    case "female":
      return "#FA5252"; // Yellow for Female
    case "male":
      // return "#7FBCD2"; // Blue for Male
      return "#15AABF";
    case "other":
      // baby pink for other
      return "#C0D1B0";
    // return ; // Red for Other
    default:
      return arg.event.backgroundColor;
  }
};

export const trimStringWithEllipsis = (str: string, maxLength: number) => {
  return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};

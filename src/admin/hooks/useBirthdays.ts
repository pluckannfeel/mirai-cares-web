import { useQuery } from "react-query";
import { Birthday } from "../types/birthday";
import { axiosInstance } from "../../api/server";

const fetchBirthdays = async (): Promise<Birthday[]> => {
  const { data } = await axiosInstance.get("/staff/birthdays");

  return data;
};

export function useBirthdays() {
  return useQuery("staff-birthdays", () => fetchBirthdays(), {
    // suspense: false,
  });
}

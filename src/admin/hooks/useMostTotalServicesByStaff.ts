import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { MostServicesByStaff } from "../types/colibriData";

const fetchMostTotalServicesByStaff = async (
  selectedDate?: string
): Promise<MostServicesByStaff[]> => {
  const { data } = await axiosInstance(
    "/shift/get_most_total_services_by_staff/?selected_date=" + selectedDate
  );

  return data;
};

export function useMostTotalServicesByStaff(selectedDate?: string) {
  return useQuery(
    ["colibri_most_total_services_by_staff", selectedDate],
    () => fetchMostTotalServicesByStaff(selectedDate),
    {
      enabled: !!selectedDate,
    }
  );
}

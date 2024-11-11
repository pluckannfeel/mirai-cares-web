import { useQuery } from "react-query";
import { OverallRecord } from "../types/record";
import { axiosInstance } from "../../api/server";

const fetchRecord = async (selectedDate?: string): Promise<OverallRecord> => {
  const { data } = await axiosInstance(
    "/shift/total_work_hours/?selected_date=" + selectedDate
  );

  return data;
};

export function useRecord(selectedDate?: string) {
  return useQuery(["record", selectedDate], () => fetchRecord(selectedDate), {
    enabled: !!selectedDate,
  });
}

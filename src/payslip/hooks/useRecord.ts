import { useQuery } from "react-query";
import { OverallRecord } from "../types/record";
import { AxiosInstance } from "axios";
import { axiosInstance } from "../../api/server";

const fetchRecord = async (): Promise<OverallRecord> => {
  const { data } = await axiosInstance("/shift/total_work_hours");

  return data;
};

export function useRecord() {
  return useQuery(["record"], () => fetchRecord(), {});
}

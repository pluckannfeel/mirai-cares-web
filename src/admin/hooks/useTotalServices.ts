import { useQuery } from "react-query";
import { axiosInstance } from "../../api/server";
import { Services } from "../types/colibriData";

const fetchTotalServices = async (): Promise<Services[]> => {
  const { data } = await axiosInstance("/shift/total_services_by_month");

  return data;
};

export function useTotalServices() {
  return useQuery(["colibri_total_services"], () => fetchTotalServices(), {});
}

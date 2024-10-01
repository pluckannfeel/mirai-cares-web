import { useQuery } from "react-query";
import { NursingStation } from "../types/NursingStation";
import { axiosInstance } from "../../api/server";

const fetchNursingStations = async (): Promise<NursingStation[]> => {
  const { data } = await axiosInstance.get("nursing_stations");
  return data;
};

export function useNursingStations() {
  return useQuery(["nursing_stations"], () => fetchNursingStations());
}

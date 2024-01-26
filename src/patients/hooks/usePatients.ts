import { useQuery } from "react-query";
import { Patient } from "../types/patient";
import { axiosInstance } from "../../api/server";

const fetchPatients = async (): Promise<Patient[]> => {
  const { data } = await axiosInstance.get("patients");
  // you can add affiliation later on if you want to filter by affiliation like angel care services etc..
  return data;
};

export function usePatients() {
  return useQuery(["patients"], () => fetchPatients(), {});
}

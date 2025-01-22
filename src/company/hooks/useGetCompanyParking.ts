import { useQuery } from "react-query";
import { CompanyParking } from "../types/companyInfo";
import { axiosInstance } from "../../api/server";

const fetchCompanyParking = async (): Promise<CompanyParking[]> => {
  const { data } = await axiosInstance.get("companies/company_parking_list");
  return data;
};

export function useGetCompanyParking() {
  return useQuery(["company_parking"], () => fetchCompanyParking(), {
    // staleTime: Infinity,
  });
}

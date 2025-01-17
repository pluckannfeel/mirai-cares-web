import { useQuery } from "react-query";
import { CompanyHousing } from "../types/companyInfo";
import { axiosInstance } from "../../api/server";

const fetchCompanyHousing = async (): Promise<CompanyHousing[]> => {
  const { data } = await axiosInstance.get("companies/company_housing_list");
  return data;
};

export function useGetCompanyHousing() {
  return useQuery(["company_housing"], () => fetchCompanyHousing(), {
    // staleTime: Infinity,
  });
}

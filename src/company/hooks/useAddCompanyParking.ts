import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { CompanyParking } from "../types/companyInfo";
import { axiosInstance } from "../../api/server";

const addCompanyParking = async (
  companyParking: CompanyParking
): Promise<CompanyParking> => {
  const companyParkingData = {
    ...companyParking,
  };

  const formData = new FormData();
  formData.append("company_parking_json", JSON.stringify(companyParkingData));

  const { data } = await axiosInstance.post(
    "companies/add_company_parking",
    formData
  );
  return data;
};

export const useAddCompanyParking = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addCompanyParking, {
    onSuccess: (newCompanyParking: CompanyParking) => {
      queryClient.setQueryData<CompanyParking[]>(
        ["company_parking"],
        (oldCompanyParking) => addOne(oldCompanyParking, newCompanyParking)
      );
    },
  });

  return { isAdding: isLoading, addCompanyParking: mutateAsync };
};

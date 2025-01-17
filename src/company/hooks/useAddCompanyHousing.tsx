import { useMutation, useQueryClient } from "react-query";
import { addOne } from "../../core/utils/crudUtils";
import { CompanyHousing } from "../types/companyInfo";
import { axiosInstance } from "../../api/server";

const addCompanyHousing = async (
  companyHousing: CompanyHousing
): Promise<CompanyHousing> => {
  const companyHousingData = {
    ...companyHousing,
  };

  const formData = new FormData();
  formData.append("company_housing_json", JSON.stringify(companyHousingData));

  const { data } = await axiosInstance.post(
    "companies/add_company_housing",
    formData
  );
  return data;
};

export const useAddCompanyHousing = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(addCompanyHousing, {
    onSuccess: (newCompanyHousing: CompanyHousing) => {
      queryClient.setQueryData<CompanyHousing[]>(
        ["company_housing"],
        (oldCompanyHousing) => addOne(oldCompanyHousing, newCompanyHousing)
      );
    },
  });

  return { isAdding: isLoading, addCompanyHousing: mutateAsync };
};

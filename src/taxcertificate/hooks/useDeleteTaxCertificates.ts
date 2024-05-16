import { useMutation, useQueryClient } from "react-query";
import { axiosInstance } from "../../api/server";
// import { TaxCertificate } from "../types/taxcertificate";
// import { removeMany } from "../../core/utils/crudUtils";

const deleteTaxCertificate = async (
  taxcertificate_ids: string[]
): Promise<string[]> => {
  const formData = new FormData();
  taxcertificate_ids.forEach((id) => formData.append("taxcertificate_ids", id));

  const { data } = await axiosInstance.delete<string[]>(
    "/taxcertificate/delete_taxcertificate",
    {
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export function useDeleteTaxCertificates() {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteTaxCertificate, {
    onSuccess: () => {
      // queryClient.setQueryData<TaxCertificate[]>(
      //     ["taxcertificates"],
      //     (oldTaxCertificates) =>
      //     removeMany(oldTaxCertificates, taxcertificateIds))
      queryClient.invalidateQueries("taxcertificates");
    },
    // onError: (error: any) => {
    //   // Handle error appropriately
    //   console.error("Error deleting taxcertificates:", error);
    // },
  });

  return { isDeleting: isLoading, deleteTaxCertificates: mutateAsync };
}

import { useMutation } from "react-query";
import { GenerateCompanyDocument } from "../types/companyDocuments";
import { axiosInstance } from "../../api/server";

const generateDocument = async (documentDetails: GenerateCompanyDocument) => {
  const formData = new FormData();
  formData.append("details", JSON.stringify(documentDetails));

  const response = await axiosInstance.post("/companies/generate_document", formData, 
//   {
//     responseType: "blob",
//   }
  );

  return response.data;
};

export function useCompanyGenerateDocument() {
  //   const queryClient = useQueryClient();

  const { mutateAsync: generateDocumentMutation, isLoading } = useMutation(
    generateDocument
    // ,
    // {
    //   onSettled: () => {
    //     // After the mutation is completed, you can invalidate related queries
    //     queryClient.invalidateQueries("your-query-key"); // Replace 'your-query-key' with the key of the query you want to invalidate
    //   },
    // }
  );

  return {
    isGenerating: isLoading,
    generateDocument: generateDocumentMutation,
  };
}

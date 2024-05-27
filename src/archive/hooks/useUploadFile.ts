import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { APIRequestResponse } from "../types/archive";
import { axiosInstance } from "../../api/server";

// Presigned URL received from the server
type Payload = {
  url: string;
  fields: {
    key: string;
    AWSAccessKeyId: string;
    policy: string;
    signature: string;
  };
};

// Function to upload the file using the presigned URL
const uploadFileUsingPresignedUrl = async (payload: Payload, file: File) => {
  console.log("Starting file upload to presigned URL...");
  console.log(payload);

  const formData = new FormData();
  formData.append("key", payload.fields.key);
  formData.append("AWSAccessKeyId", payload.fields.AWSAccessKeyId);
  formData.append("policy", payload.fields.policy);
  formData.append("signature", payload.fields.signature);
  formData.append("file", file);

  const response = await axios.post(payload.url, formData);

  if (response.status === 204) {
    console.log("File uploaded successfully to S3.");
  } else {
    console.error("File upload to S3 failed:", response);
    console.log("Response data:", response.data);
  }

  return response;
};

// Function to request the presigned URL and upload the file
const requestPresignedUrlAndUploadFile = async ({
  file,
  currentPath,
  userName,
}: {
  file: File;
  currentPath: string;
  userName?: string;
}): Promise<APIRequestResponse> => {
  console.log("Requesting presigned URL from the server...");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("current_path", currentPath);
  formData.append("user_name", userName || "unknown");

  // Request presigned URL
  const { data } = await axiosInstance.post("/archive/upload_file", formData);

  console.log("Presigned URL received:", data.url);

  // Upload the file using the presigned URL
  console.log("Uploading file to presigned URL...");
  await uploadFileUsingPresignedUrl(data as Payload, file);

  console.log("File upload process completed.");
  return { code: "success", message: "File uploaded successfully" };
};

// React hook to manage file upload
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync, isError } = useMutation(
    requestPresignedUrlAndUploadFile,
    {
      onSuccess: (response) => {
        if (response.code === "success") {
          console.log("File upload succeeded, invalidating queries...");
          queryClient.invalidateQueries("archive-current-files");
        }
      },
      onError: (error) => {
        console.error("File upload failed:", error);
      },
    }
  );

  return { isUploading: isLoading, uploadFile: mutateAsync, isError };
};

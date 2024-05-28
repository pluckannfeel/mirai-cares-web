import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIRequestResponse } from "../types/archive";

// Function to generate presigned PUT URL
const generatePresignedPutUrl = async ({
  file,
  currentPath,
  userName,
}: {
  file: File;
  currentPath: string;
  userName?: string;
}) => {
  const client = new S3Client({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEYID as string,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESSKEY as string,
    },
  });

  const bucket = "ews-bucket";
  const key = `${currentPath}${file.name}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Metadata: {
      last_modified_by: userName || "unknown",
    },
  });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
};

// Function to upload the file using the presigned URL
const uploadFileUsingPresignedUrl = async (url: string, file: File) => {
  try {
    const response = await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return response.status === 200;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("File upload failed:", error.response?.data);
    return false;
  }
};

// Function to handle the complete process
const requestPresignedUrlAndUploadFile = async ({
  file,
  currentPath,
  userName,
}: {
  file: File;
  currentPath: string;
  userName?: string;
}): Promise<APIRequestResponse> => {
  const url = await generatePresignedPutUrl({ file, currentPath, userName });

  if (url) {
    const success = await uploadFileUsingPresignedUrl(url, file);
    if (success) {
      return { code: "success", message: "File uploaded successfully" };
    } else {
      return { code: "error", message: "File upload failed" };
    }
  } else {
    return { code: "error", message: "Failed to generate a presigned URL" };
  }
};

// React hook to manage file upload
export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const { isLoading, mutateAsync, isError } = useMutation(requestPresignedUrlAndUploadFile, {
    onSuccess: () => {
      console.log("File upload succeeded, invalidating queries...");
      queryClient.invalidateQueries("archive-current-files");
    },
    onError: (error) => {
      console.error("File upload failed:", error);
    },
  });

  return {
    isUploading: isLoading,
    uploadFile: mutateAsync,
    isError,
  };
};
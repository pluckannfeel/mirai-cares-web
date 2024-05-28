/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
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
    console.log("Uploading file using presigned URL...");
    const response = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return response.status === 200;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("File upload failed:", error.response?.data);
    return false;
  }
};

// Function to check if the file exists
const checkFileExists = async ({
  bucket,
  key,
}: {
  bucket: string;
  key: string;
}) => {
  const client = new S3Client({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEYID as string,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESSKEY as string,
    },
  });

  const command = new HeadObjectCommand({ Bucket: bucket, Key: key });
  try {
    await client.send(command);
    return true;
  } catch (error: any) {
    if (error.name === "NotFound") {
      return false;
    }
    throw error;
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
  console.log("Presigned URL generated for replacement.");

  if (url) {
    const success = await uploadFileUsingPresignedUrl(url, file);
    if (success) {
      console.log("File uploaded successfully");
      return { code: "success", message: "File uploaded successfully" };
    } else {
      console.error("File upload failed");
      return { code: "error", message: "File upload failed" };
    }
  } else {
    console.error("Failed to generate a presigned URL");
    return { code: "error", message: "Failed to generate a presigned URL" };
  }
};

// React hook to manage file replacement
export const useReplaceFile = () => {
  const queryClient = useQueryClient();

  const {
    isLoading: isChecking,
    mutateAsync: checkFile,
    isError: checkError,
  } = useMutation(checkFileExists);
  const {
    isLoading: isReplacing,
    mutateAsync: uploadFile,
    isError: uploadError,
  } = useMutation(requestPresignedUrlAndUploadFile, {
    onSuccess: () => {
      console.log("File upload succeeded, invalidating queries...");
      queryClient.invalidateQueries("archive-current-files");
    },
    onError: (error) => {
      console.error("File upload failed:", error);
    },
  });

  const replaceFile = async ({
    file,
    currentPath,
    userName,
  }: {
    file: File;
    currentPath: string;
    userName?: string;
  }) => {
    const bucket = "ews-bucket";
    const key = `${currentPath}${file.name}`;
    const exists = await checkFile({ bucket, key });
    console.log("File exists, replacing...");
    if (exists) {
      // Show confirmation dialog to the user, if confirmed then call uploadFile
      return uploadFile({ file, currentPath, userName });
    } else {
      return { code: "error", message: "File does not exist" };
    }
  };

  return {
    isChecking,
    isReplacing,
    replaceFile,
    isError: checkError || uploadError,
  };
};

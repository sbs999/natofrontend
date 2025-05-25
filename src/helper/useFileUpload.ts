// src/hooks/useFileUpload.ts
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  IGeneratePreSignedUrlResponse,
  IGetPreSignedUrlCredentials,
} from "../interfaces";
import useAxios from "./useAxios";
import { ISelectedFileData } from "../interfaces/products-to-bring/selected-file.interface";
import { extractKeyFromUrl } from "./extract-key-form-url.helper";

export function useFileUpload(data: {
  uploadFileUrls: string[];
  selectedFiles: (Blob | string)[];
}) {
  // Exactly as original, do not modify
  const [selectedFiles, setSelectedFiles] = useState<(Blob | string)[]>(
    data.selectedFiles
  );
  const [uploadFileUrls, setUploadFileUrls] = useState<string[]>(
    data.uploadFileUrls
  );
  const [submitStatus, setSubmitStatus] = useState(false);
  const { getData, deleteData } = useAxios();

  const getPresignedUrl = async (credentials: IGetPreSignedUrlCredentials) => {
    const query = `contentType=${credentials.contentType}`;
    const data: IGeneratePreSignedUrlResponse = await getData(
      `media/generate-pre-signed-url?${query}`
    );

    return data;
  };

  const handleFileChange = async (event: any) => {
    if (
      [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "image/bmp",
        "image/tiff",
        "image/heic",
        "image/avif",
      ].includes(event.target.files[0]?.type)
    ) {
      const file = event.target.files[0];
      setSelectedFiles((files) => [...files, file]);
      await handleUpload(file);
    }
  };

  const handleUpload = async (file: ISelectedFileData) => {
    try {
      setSubmitStatus(true);
      const presignedUrlData = await getPresignedUrl({
        contentType: file?.type,
      });

      await axios.put(presignedUrlData.preSignedUrl, file);
      setUploadFileUrls((urls) => [...urls, presignedUrlData.objectUrl]);
      setSubmitStatus(false);
      console.log("Successfully Upload Image.");
    } catch (error) {
      setSubmitStatus(false);
      console.error("Error uploading file:", error);
      toast.error("ვერ აიტვირთა სურათი.");
      setSelectedFiles((files) => files.slice(0, -1));
    }
  };

  const deleteObject = async (objectUrl: string) => {
    const key = extractKeyFromUrl(objectUrl);
    try {
      await deleteData(`media/object/${key}`);
      console.log("Successfully delete object.");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const file = selectedFiles[indexToRemove];
    setSelectedFiles((files) =>
      files.filter((_, index) => index !== indexToRemove)
    );

    if (typeof file !== "string") {
      await deleteObject(uploadFileUrls[indexToRemove]);
    }

    setUploadFileUrls((urls) =>
      urls.filter((_, index) => index !== indexToRemove)
    );
  };

  return {
    selectedFiles,
    uploadFileUrls,
    submitStatus,
    handleFileChange,
    handleUpload,
    deleteObject,
    removeImage,
  };
}

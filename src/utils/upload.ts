import type { AxiosError } from "axios";

import { service } from "@/lib/authClient";

export const getUploadErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;

  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message;
  }

  if (axiosError?.message) {
    return axiosError.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Зургийг хуулж байх үед алдаа гарлаа.";
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await service.post<{ url?: string }>(
    "/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  const uploadedUrl = response?.data?.url;

  if (!uploadedUrl) {
    throw new Error("Серверээс зургийн холбоос ирсэнгүй.");
  }

  return uploadedUrl;
};

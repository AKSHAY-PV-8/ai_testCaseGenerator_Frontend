import type { ApiResponse } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const uploadFile = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json(); // ← read ONCE

  if (!response.ok) {
    throw new Error(data.message || "Upload failed"); // ← reuse same data
  }

  console.log(data);
  return data;
};
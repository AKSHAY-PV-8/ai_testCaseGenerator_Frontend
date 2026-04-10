import type { ApiResponse } from "../types";


const BASE_URL = import.meta.env.VITE_API_URL;


// "http://localhost:5000";

export const uploadFile = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Upload failed");
  }

  console.log(data);

  return data;
};
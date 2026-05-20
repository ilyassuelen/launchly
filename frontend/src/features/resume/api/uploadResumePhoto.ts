const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export async function uploadResumePhoto(
  file: File,
) {
  const token =
    localStorage.getItem(
      "access_token",
    );

  const formData =
    new FormData();

  formData.append(
    "file",
    file,
  );

  const response = await fetch(
    `${API_BASE_URL}/resumes/upload-photo`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Upload failed",
    );
  }

  return data;
}
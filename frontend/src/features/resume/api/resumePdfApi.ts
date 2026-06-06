const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function exportResumePdf(resumeId: string | number) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}/resumes/${resumeId}/export-pdf`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not export resume PDF");
  }

  const contentDisposition = response.headers.get("Content-Disposition");

  let filename = "Resume.pdf";

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);

    if (match?.[1]) {
      filename = match[1];
    }
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

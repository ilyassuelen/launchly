const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function exportCoverLetterPdf(
  coverLetterId: string | number,
) {
  const token = localStorage.getItem("access_token");

  if (!coverLetterId) {
    throw new Error("Missing cover letter id");
  }

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(
    `${API_BASE}/cover-letters/${encodeURIComponent(String(coverLetterId))}/export-pdf`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Could not export cover letter PDF");
  }

  const contentDisposition =
    response.headers.get("Content-Disposition");

  let filename = "Cover_Letter.pdf";

  if (contentDisposition) {
    const match =
      contentDisposition.match(/filename="(.+)"/);

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

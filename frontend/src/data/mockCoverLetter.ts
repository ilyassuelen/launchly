import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

export const mockCoverLetter: CoverLetter =
  {
    title:
      "New Cover Letter",

    language: "english",

    template: "classic",

    typography: {
      fontFamily: "Inter",

      fontSize: 15,

      lineHeight: 1.9,
    },

    sender: {
      fullName: "",

      street: "",

      zip: "",

      city: "",

      email: "",

      phone: "",
    },

    recipient: {
      companyName: "",

      contactName: "",

      street: "",

      zip: "",

      city: "",
    },

    date: new Date().toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    ),

    jobPosting: "",

    tone: "Confident",

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),

    content: {
      subject:
        "Application for",

      body: `When I discovered your company and the role, I was immediately excited by the opportunity to contribute my skills and continue growing as a professional.

I enjoy building thoughtful digital experiences and solving real-world problems through clean, scalable solutions.

I would love the opportunity to contribute to your team and further develop my technical and professional abilities in a fast-paced environment.`,

      closing:
        "Sincerely,",
    },
  };
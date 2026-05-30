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

      currentRole: "",

      skills: [],

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
        "",

      body: ``,

      closing:
        "Sincerely,",
    },
  };
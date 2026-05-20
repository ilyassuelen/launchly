export type ResumeTemplate =
  | "aurora"
  | "mono"
  | "executive"
  | "gradient";

export type ResumeTemplateOption = {
  id: ResumeTemplate;
  n: string;
  c: string;
};

export const templates: ResumeTemplateOption[] = [
  {
    id: "aurora",
    n: "Aurora",
    c: "from-violet-500 to-cyan-400",
  },
  {
    id: "mono",
    n: "Mono",
    c: "from-zinc-300 to-zinc-100",
  },
  {
    id: "executive",
    n: "Executive",
    c: "from-amber-700 to-yellow-500",
  },
  {
    id: "gradient",
    n: "Gradient",
    c: "from-cyan-400 to-violet-500",
  },
];
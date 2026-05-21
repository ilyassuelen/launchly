import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

interface Props {
  coverLetter: CoverLetter;
}

export function ClassicCoverLetter({
  coverLetter,
}: Props) {
  const typography =
    coverLetter.typography || {
      fontFamily: "Inter",

      fontSize: 15,

      lineHeight: 1.9,
    };

  const scale =
    typography.fontSize / 15;

  const isGerman =
    coverLetter.language === "german";

  const recipientLabel =
    isGerman
      ? "Empfänger"
      : "Recipient";

  const dateLabel =
    isGerman
      ? "Datum"
      : "Date";

  return (
    <div className="relative box-border h-[1123px] w-[794px] overflow-hidden bg-[#fcfcfb]">

      {/* paper texture */}
      <div className="absolute inset-0 opacity-[0.018] [background-image:radial-gradient(#000_0.6px,transparent_0.6px)] [background-size:18px_18px]" />

      <div
        className="relative flex flex-col px-[72px] py-[78px] text-[oklch(0.18_0.02_270)]"
        style={{
          fontFamily:
            typography.fontFamily,

          fontSize:
            `${typography.fontSize}px`,

          lineHeight:
            typography.lineHeight,
        }}
      >

        {/* HEADER */}
        <div className="border-b border-black/8 pb-8">

          <div className="flex items-start justify-between gap-10">

            <div className="flex-1">

              <div
                className="mt-1 font-semibold leading-none tracking-[-0.04em] text-black"
                style={{
                  fontSize: `${38 * scale}px`,
                }}
              >
                {coverLetter.sender.fullName}
              </div>

              <div className="mt-3 h-[3px] w-16 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />

              <div
                className="mt-6 space-y-1.5 text-black/60"
                style={{
                  fontSize: `${14 * scale}px`,
                }}
              >

                {coverLetter.sender.street && (
                  <div>{coverLetter.sender.street}</div>
                )}

                {(coverLetter.sender.zip ||
                  coverLetter.sender.city) && (
                  <div>
                    {coverLetter.sender.zip} {coverLetter.sender.city}
                  </div>
                )}

                {coverLetter.sender.email && (
                  <div>{coverLetter.sender.email}</div>
                )}

                {coverLetter.sender.phone && (
                  <div>{coverLetter.sender.phone}</div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* RECIPIENT */}
        <div
          className="mt-12 grid grid-cols-2 gap-16 text-black/72"
          style={{
            fontSize: `${14 * scale}px`,
          }}
        >

          <div>

            <div
              className="mb-3 font-semibold uppercase tracking-[0.24em] text-black/35"
              style={{
                fontSize: `${11 * scale}px`,
              }}
            >
              {recipientLabel}
            </div>

            <div className="space-y-1.5">

              <div>
                {
                  coverLetter
                    .recipient
                    .companyName
                }
              </div>

              {coverLetter
                .recipient
                .contactName && (
                <div>
                  {
                    coverLetter
                      .recipient
                      .contactName
                  }
                </div>
              )}

              {coverLetter
                .recipient
                .street && (
                <div>
                  {
                    coverLetter
                      .recipient
                      .street
                  }
                </div>
              )}

              {(
                coverLetter.recipient
                  .zip ||
                coverLetter.recipient
                  .city
              ) && (
                <div>
                  {
                    coverLetter
                      .recipient
                      .zip
                  }{" "}
                  {
                    coverLetter
                      .recipient
                      .city
                  }
                </div>
              )}

            </div>
          </div>

          <div className="text-right">

            <div
              className="mb-3 font-semibold uppercase tracking-[0.24em] text-black/35"
              style={{
                fontSize: `${11 * scale}px`,
              }}
            >
              {dateLabel}
            </div>

            <div
              className="font-medium text-black/75"
              style={{
                fontSize: `${15 * scale}px`,
              }}
            >
              {coverLetter.date}
            </div>

          </div>

        </div>

        {/* SUBJECT */}
        <div className="mt-16">

          <div
            className="font-semibold leading-tight tracking-[-0.03em] text-black"
            style={{
              fontSize: `${26 * scale}px`,
            }}
          >
            {coverLetter.content.subject}
          </div>

        </div>

        {/* BODY */}
        <div className="mt-10 border-l-[3px] border-violet-500/70 pl-7 text-black/78">

          <div className="space-y-4">

            {coverLetter.content.body
              .split("\n\n")
              .map(
                (
                  paragraph,
                  index,
                ) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ),
              )}

          </div>

          <div className="mt-6 whitespace-pre-line text-black/82">
            {coverLetter.content.closing}

            <div
              className="mt-6 font-semibold text-black"
              style={{
                fontSize: `${16 * scale}px`,
              }}
            >
              {coverLetter.sender.fullName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
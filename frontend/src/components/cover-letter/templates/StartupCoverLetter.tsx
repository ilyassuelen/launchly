import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

interface Props {
  coverLetter: CoverLetter;
}

export function StartupCoverLetter({
  coverLetter,
}: Props) {
  const typography =
    coverLetter.typography || {
      fontFamily: "Inter",
      fontSize: 15,
      lineHeight: 1.85,
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

  const preparedForLabel =
      isGerman
        ? "Unternehmen"
        : "Prepared For";

  return (
    <div className="relative box-border h-[1123px] w-[794px] overflow-hidden rounded-[30px] bg-[#f8fafc] shadow-[0_60px_180px_rgba(0,0,0,0.42)]">

      {/* accent */}
      <div className="absolute left-0 top-0 h-full w-[10px] bg-gradient-to-b from-violet-500 via-fuchsia-500 to-cyan-400" />

      <div
        className="relative flex flex-col px-[78px] py-[78px]"
        style={{
          fontFamily: typography.fontFamily,
          fontSize: `${typography.fontSize}px`,
          lineHeight: typography.lineHeight,
        }}
      >

        {/* HEADER */}
        <div className="flex items-start justify-between">

          <div>

            <div
              className="font-semibold tracking-[-0.06em] text-black"
              style={{
                fontSize: `${44 * scale}px`,
              }}
            >
              {coverLetter.sender.fullName}
            </div>

            <div
              className="mt-4 max-w-[420px] text-black/58"
              style={{
                fontSize: `${14 * scale}px`,
                lineHeight: typography.lineHeight,
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

          <div className="rounded-2xl bg-black px-5 py-4 text-right text-white shadow-xl">

            <div
              className="uppercase tracking-[0.24em] text-white/50"
              style={{
                fontSize: `${10 * scale}px`,
              }}
            >
              {preparedForLabel}
            </div>

            <div
              className="mt-2 font-semibold"
              style={{
                fontSize: `${14 * scale}px`,
              }}
            >
              {coverLetter.recipient.companyName}
            </div>

          </div>

        </div>

        {/* GRID */}
        <div className="mt-16 grid grid-cols-[1fr_180px] gap-14">

          {/* LEFT */}
          <div>

            <div
              className="font-semibold leading-tight tracking-[-0.04em] text-black"
              style={{
                fontSize: `${29 * scale}px`,
              }}
            >
              {coverLetter.content.subject}
            </div>

            <div className="mt-10 border-l-[3px] border-cyan-400 pl-7 text-black/78">

              <div className="space-y-7">

                {coverLetter.content.body
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}

              </div>

              <div className="mt-6 whitespace-pre-line text-black/82">
                {coverLetter.content.closing}

                <div className="mt-8 font-semibold text-black">
                  {coverLetter.sender.fullName}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div>

            <div className="rounded-[24px] border border-black/6 bg-white px-5 py-6 shadow-sm">

              <div
                className="font-semibold uppercase tracking-[0.22em] text-violet-500"
                style={{
                  fontSize: `${10 * scale}px`,
                }}
              >
                {recipientLabel}
              </div>

              <div
                className="mt-4 space-y-2 text-black/72"
                style={{
                  fontSize: `${13 * scale}px`,
                  lineHeight: typography.lineHeight,
                }}
              >

                <div className="font-semibold text-black">
                  {coverLetter.recipient.companyName}
                </div>

                {coverLetter.recipient.contactName && (
                  <div>
                    {coverLetter.recipient.contactName}
                  </div>
                )}

                {coverLetter.recipient.street && (
                  <div>
                    {coverLetter.recipient.street}
                  </div>
                )}

                {(coverLetter.recipient.zip ||
                  coverLetter.recipient.city) && (
                  <div>
                    {coverLetter.recipient.zip}{" "}
                    {coverLetter.recipient.city}
                  </div>
                )}

              </div>

              <div className="mt-8 border-t border-black/6 pt-5">

                <div
                  className="font-semibold uppercase tracking-[0.22em] text-violet-500"
                  style={{
                    fontSize: `${10 * scale}px`,
                  }}
                >
                  {dateLabel}
                </div>

                <div
                  className="mt-3 text-black/70"
                  style={{
                    fontSize: `${13 * scale}px`,
                  }}
                >
                  {coverLetter.date}
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
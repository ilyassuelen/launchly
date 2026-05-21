import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

interface Props {
  coverLetter: CoverLetter;
}

export function ModernCoverLetter({
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
    <div className="relative box-border h-[1123px] w-[794px] overflow-hidden rounded-[28px] bg-[#fbfbfd] shadow-[0_60px_180px_rgba(0,0,0,0.42)]">

      {/* ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_35%)]" />

      <div
        className="relative flex flex-col px-[72px] py-[74px]"
        style={{
          fontFamily: typography.fontFamily,
          fontSize: `${typography.fontSize}px`,
          lineHeight: typography.lineHeight,
        }}
      >

        {/* TOP */}
        <div className="flex items-start justify-between">

          <div>

            <div
              className="font-semibold tracking-[-0.05em] text-black"
              style={{
                fontSize: `${40 * scale}px`,
              }}
            >
              {coverLetter.sender.fullName}
            </div>

            <div className="mt-4 h-[4px] w-20 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />

          </div>

          <div className="rounded-2xl border border-black/5 bg-white px-5 py-4 text-right shadow-sm">

            <div
              className="font-semibold uppercase tracking-[0.24em] text-violet-500"
              style={{
                fontSize: `${11 * scale}px`,
              }}
            >
              {dateLabel}
            </div>

            <div
              className="mt-2 text-black/75"
              style={{
                fontSize: `${14 * scale}px`,
              }}
            >
              {coverLetter.date}
            </div>

          </div>

        </div>

        {/* CONTACT */}
        <div
          className="mt-8 grid grid-cols-2 gap-8 text-black/60"
          style={{
            fontSize: `${13 * scale}px`,
          }}
        >

          <div className="space-y-1.5">

            {coverLetter.sender.street && (
              <div>{coverLetter.sender.street}</div>
            )}

            {(coverLetter.sender.zip ||
              coverLetter.sender.city) && (
              <div>
                {coverLetter.sender.zip} {coverLetter.sender.city}
              </div>
            )}

          </div>

          <div className="space-y-1.5 text-right">

            {coverLetter.sender.email && (
              <div>{coverLetter.sender.email}</div>
            )}

            {coverLetter.sender.phone && (
              <div>{coverLetter.sender.phone}</div>
            )}

          </div>

        </div>

        {/* RECIPIENT */}
        <div className="mt-16 rounded-[24px] border border-black/5 bg-white/80 px-7 py-6 shadow-sm backdrop-blur-sm">

          <div
              className="font-semibold uppercase tracking-[0.24em] text-violet-500/80"
              style={{
                fontSize: `${11 * scale}px`,
              }}
          >
            {recipientLabel}
          </div>

          <div
              className="mt-4 space-y-1.5 text-black/72"
              style={{
                fontSize: `${14 * scale}px`,
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

        </div>

        {/* SUBJECT */}
        <div
          className="mt-16 font-semibold leading-tight tracking-[-0.04em] text-black"
          style={{
            fontSize: `${28 * scale}px`,
          }}
        >
          {coverLetter.content.subject}
        </div>

        {/* BODY */}
        <div className="mt-10 text-black/78">

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

            <div
              className="mt-7 font-semibold text-black"
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
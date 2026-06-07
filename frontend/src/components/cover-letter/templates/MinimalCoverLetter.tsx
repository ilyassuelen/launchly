import type { CoverLetter } from "@/features/cover-letter/types/coverLetter";

interface Props {
  coverLetter: CoverLetter;
}

export function MinimalCoverLetter({
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

  return (
    <div className="relative box-border min-h-[1123px] w-[794px] overflow-hidden bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)]">

      <div
        className="relative flex flex-col px-[78px] py-[82px] text-black"
        style={{
          fontFamily: typography.fontFamily,
          fontSize: `${typography.fontSize}px`,
          lineHeight: typography.lineHeight,
        }}
      >

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-black/10 pb-8">

          <div>
            <div
              className="font-light tracking-[-0.05em]"
              style={{
                fontSize: `${42 * scale}px`,
              }}
            >
              {coverLetter.sender.fullName}
            </div>

            <div
              className="mt-6 space-y-1 text-black/60"
              style={{
                fontSize: `${13 * scale}px`,
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

          <div
            className="text-right text-black/50"
            style={{
              fontSize: `${13 * scale}px`,
            }}
          >
            {coverLetter.date}
          </div>

        </div>

        {/* RECIPIENT */}
        <div
          className="mt-14 text-black/72"
          style={{
            fontSize: `${14 * scale}px`,
          }}
        >

          <div className="space-y-1.5">

            <div className="font-medium text-black">
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
          className="mt-16 font-light leading-tight tracking-[-0.04em] text-black"
          style={{
            fontSize: `${30 * scale}px`,
          }}
        >
          {coverLetter.content.subject}
        </div>

        {/* BODY */}
        <div className="mt-12 text-black/78">

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

            <div className="mt-8 font-medium text-black">
              {coverLetter.sender.fullName}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
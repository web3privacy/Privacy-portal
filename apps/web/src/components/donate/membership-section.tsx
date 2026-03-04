import Link from "next/link";

const TIERS = [
  {
    title: "Individual",
    description: "For individuals who want to join our community and support us.",
    benefits: ["Access to members-only content", "Early access to events", "Voting rights"],
    price: "€100 / Year",
    cta: "BECOME A MEMBER",
    href: "https://web3privacy.info/membership/",
  },
  {
    title: "Organizations",
    description: "For organizations who want to support our mission and get involved.",
    benefits: ["Visibility on our website", "Co-host events", "Partnership opportunities"],
    price: "€15K - €100K / Year",
    cta: "REQUEST MEMBERSHIP",
    href: "https://web3privacy.info/membership/",
  },
  {
    title: "Event Sponsor",
    description: "For organizations who want to sponsor an event and get maximum visibility.",
    benefits: ["Brand visibility at events", "Speaking opportunities", "Networking access"],
    price: "€1K - €40K / Event",
    cta: "BECOME A SPONSOR",
    href: "https://web3privacy.info/membership/",
  },
];

export function MembershipSection() {
  return (
    <section className="border-b border-[#e0e0e0] bg-white px-4 py-12 dark:border-[#2c3139] dark:bg-[#0f1318] sm:py-16 md:px-6 md:py-20">
      <div className="viewport-range-shell mx-auto max-w-[1140px] lg:max-w-[75vw]">
        <h2 className="text-center font-serif text-[22px] font-bold leading-tight text-[#121212] dark:text-[#f2f4f6] sm:text-[28px] md:text-[32px]">
          Membership
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd] sm:mt-4 sm:text-[15px]">
          Join our community as a member and get exclusive benefits while supporting our cause.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.title}
              className="flex flex-col rounded-xl border border-[#e0e0e0] bg-[#f7f7f7] p-5 dark:border-[#2c3139] dark:bg-[#181d25] sm:p-6"
            >
              <h3 className="font-sans text-base font-semibold text-[#121212] dark:text-[#f2f4f6] sm:text-lg">
                {tier.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd]">
                {tier.description}
              </p>
              <ul className="mt-4 list-inside list-disc space-y-1 text-[14px] text-[#616161] dark:text-[#a7b0bd]">
                {tier.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="mt-4 font-semibold text-[#121212] dark:text-[#f2f4f6]">{tier.price}</p>
              <Link
                href={tier.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#70ff88] px-5 py-3 font-semibold text-black transition-colors hover:bg-[#5eef70] sm:mt-6 sm:w-fit sm:py-2.5"
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

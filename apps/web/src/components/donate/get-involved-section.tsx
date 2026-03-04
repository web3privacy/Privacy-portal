import Link from "next/link";

const CARDS = [
  {
    title: "Volunteer 40+ hrs/month",
    description: "Help with various tasks – events, research, community management, and more.",
    cta: "APPLY NOW",
    href: "https://web3privacy.info/contribute",
    external: true,
  },
  {
    title: "Project Contribution 10+ hrs/month",
    description: "Contribute to specific projects. Code, design, write, or support the ecosystem.",
    cta: "APPLY NOW",
    href: "https://web3privacy.info/contribute",
    external: true,
  },
  {
    title: "Node Run",
    description: "Run a node for the network. Support decentralization and earn rewards.",
    cta: "READ MORE",
    href: "https://web3privacy.info",
    external: true,
  },
];

export function GetInvolvedSection() {
  return (
    <section className="border-b border-[#e0e0e0] bg-white px-4 py-12 dark:border-[#2c3139] dark:bg-[#0f1318] sm:py-16 md:px-6 md:py-20">
      <div className="viewport-range-shell mx-auto max-w-[1140px] lg:max-w-[75vw]">
        <h2 className="text-center font-serif text-[26px] font-bold text-[#121212] dark:text-[#f2f4f6] sm:text-[32px] md:text-[40px]">
          GET INVOLVED
        </h2>
        <p className="mt-2 text-center text-[14px] text-[#616161] dark:text-[#a7b0bd] sm:text-[15px]">
          Contribute. Build with Us.
        </p>
        <p className="mx-auto mt-3 max-w-[640px] text-center text-[14px] leading-relaxed text-[#121212]/80 dark:text-[#f2f4f6]/80 sm:mt-4 sm:text-[15px]">
          Choose how you want to support us and become a part of the Web3 Privacy movement.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-xl border border-[#e0e0e0] bg-[#f7f7f7] p-5 transition-colors dark:border-[#2c3139] dark:bg-[#181d25] sm:p-6"
            >
              <h3 className="font-sans text-base font-semibold text-[#121212] dark:text-[#f2f4f6] sm:text-lg">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd]">
                {card.description}
              </p>
              <Link
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className="mt-5 inline-flex min-h-[44px] w-fit items-center justify-center rounded-lg bg-[#70ff88] px-5 py-3 font-semibold text-black transition-colors hover:bg-[#5eef70] sm:mt-6 sm:py-2.5"
              >
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

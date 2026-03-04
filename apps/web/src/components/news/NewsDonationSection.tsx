"use client";

export type DonationTier = {
  amount: string;
  label: string;
  url?: string;
};

type Props = {
  tiers: DonationTier[];
};

export function NewsDonationSection({ tiers }: Props) {
  if (tiers.length === 0) return null;

  return (
    <section className="rounded-xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-[#151a21] md:p-12">
      <h2 className="text-center text-xl font-bold text-black dark:text-white md:text-2xl">
        Consider a donation to support our future work
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {tiers.map((tier) => (
          <a
            key={tier.amount}
            href={tier.url || "#"}
            target={tier.url ? "_blank" : undefined}
            rel={tier.url ? "noopener noreferrer" : undefined}
            className="flex flex-col items-center rounded-xl border-2 border-black/10 p-6 transition-colors hover:border-[#70ff88] dark:border-white/10 dark:hover:border-[#70ff88]"
          >
            <span className="text-2xl font-bold text-black dark:text-white md:text-3xl">
              {tier.amount}
            </span>
            <p className="mt-2 text-center text-sm text-black/65 dark:text-white/65">
              {tier.label}
            </p>
            <span className="mt-4 inline-flex rounded-lg bg-[#70ff88] px-5 py-2 font-semibold text-black transition-colors hover:bg-[#5eef70]">
              Donate Now
            </span>
          </a>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-black/55 dark:text-white/55">
        Note: Recurring donations are tax-deductible.{" "}
        <a href="https://web3privacy.info" className="underline hover:text-[#70ff88]">
          FAQ
        </a>
      </p>
    </section>
  );
}

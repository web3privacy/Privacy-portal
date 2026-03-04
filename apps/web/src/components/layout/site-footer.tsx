import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#121212] text-white dark:border-[#2f353f] dark:bg-[#0c1117]">
      <div className="viewport-range-shell mx-auto flex w-full max-w-[1140px] flex-col items-start justify-between gap-4 px-4 py-6 md:flex-row md:items-center md:px-6 lg:max-w-[75vw]">
        <a
          href="https://web3privacy.info"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
        >
          <Image src="/logo-white.svg" alt="Web3Privacy logo" width={180} height={30} className="h-7 w-auto" />
        </a>

        <a
          href="https://web3privacy.info"
          target="_blank"
          rel="noreferrer"
          className="text-[14px] tracking-[0.03em] text-white/90 transition-colors duration-200 hover:text-white"
        >
          web3privacy.info
        </a>
      </div>
    </footer>
  );
}

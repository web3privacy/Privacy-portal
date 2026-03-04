const NFT_ITEMS = [
  { price: "0.05 ETH", description: "Mint one if you want to support privacy.", image: "/images/nft-placeholder-1.png" },
  { price: "0.1 ETH", description: "Mint more if you want to support privacy more.", image: "/images/nft-placeholder-2.png" },
  { price: "1 ETH", description: "Maximum support – mint our premium NFT.", image: "/images/nft-placeholder-3.png" },
];

export function NftPlaceholderSection() {
  return (
    <section className="border-b border-[#e0e0e0] bg-white px-4 py-12 dark:border-[#2c3139] dark:bg-[#0f1318] sm:py-16 md:px-6 md:py-20">
      <div className="viewport-range-shell mx-auto max-w-[1140px] lg:max-w-[75vw]">
        <h2 className="text-center font-serif text-[22px] font-bold leading-tight text-[#121212] dark:text-[#f2f4f6] sm:text-[28px] md:text-[32px]">
          Support privacy on-chain by minting W3PN NFTs
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd] sm:mt-4 sm:text-[15px]">
          By acquiring an NFT from our exclusive collection, you directly support our mission.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {NFT_ITEMS.map((item) => (
            <div
              key={item.price}
              className="flex flex-row overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#f7f7f7] dark:border-[#2c3139] dark:bg-[#181d25] md:flex-col"
            >
              <div className="h-[100px] w-[100px] shrink-0 bg-[#252b35] dark:bg-[#1a1f27] md:h-auto md:w-full md:aspect-square">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="material-symbols-rounded text-[40px] text-[#4a5568] md:text-[64px]">image</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-4 md:justify-start">
                <div>
                  <span className="font-semibold text-[#121212] dark:text-[#f2f4f6]">{item.price}</span>
                  <p className="mt-0.5 text-[13px] text-[#616161] dark:text-[#a7b0bd] sm:text-[14px]">{item.description}</p>
                </div>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="mt-3 min-h-[44px] w-full rounded-lg bg-[#70ff88] px-4 py-3 font-semibold text-black opacity-70 cursor-not-allowed md:mt-4 md:py-2.5"
                >
                  MINT W3PN NFT
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-[13px] text-[#616161] dark:text-[#a7b0bd]">
          NFT minting coming soon.
        </p>
      </div>
    </section>
  );
}

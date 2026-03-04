"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import type { EventDetailFaq } from "@/types/event-detail";

type Props = { section: EventDetailFaq };

export function DetailFaq({ section }: Props) {
  if (!section.enabled || !section.items?.length) return null;

  return (
    <section id="faq" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        FAQ
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {section.items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="rounded-lg border border-[#e0e0e0] bg-[#f8f8f8] px-4 dark:border-[#303640] dark:bg-[#1a1f27]"
          >
            <AccordionTrigger className="py-4 text-left font-medium text-[#121212] hover:no-underline data-[state=open]:pb-2 dark:text-white [&[data-state=open]>svg]:rotate-180">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-[#3a3a3a] dark:text-[#a7b0bd]">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

// src/components/page-sections.tsx
import { ChecklistCard } from "@/components/checklist-card";
import type { PageSection } from "@/content/types";

type PageSectionsProps = {
  sections: readonly PageSection[];
};

export function PageSections({ sections }: PageSectionsProps) {
  return (
    <>
      {sections.map((section, i) => (
        <div key={i} className="mt-11">
          {section.heading && (
            <h2 className="mb-4 font-heading text-[22px] font-semibold tracking-[-0.01em]">
              {section.heading}
            </h2>
          )}
          {section.paragraphs?.map((paragraph, j) => (
            <p
              key={j}
              className="mb-[18px] max-w-[66ch] text-[17px] leading-[1.65] text-body text-pretty last:mb-0"
            >
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul className="mt-4 grid gap-[10px]">
              {section.list.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[16px] leading-[1.5] text-ink-soft">
                  <span className="flex-none font-semibold text-teal">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {section.checklistCard && (
            <div className={section.paragraphs?.length ? "mt-6" : undefined}>
              <ChecklistCard
                heading={section.checklistCard.heading}
                items={section.checklistCard.items}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

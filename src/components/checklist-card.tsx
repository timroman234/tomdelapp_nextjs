// src/components/checklist-card.tsx
type ChecklistCardProps = {
  heading: string;
  items: readonly string[];
};

export function ChecklistCard({ heading, items }: ChecklistCardProps) {
  return (
    <div className="border border-t-4 border-line border-t-teal bg-white p-9 pb-[30px]">
      <h2 className="mb-6 font-heading text-[26px] leading-[1.2] tracking-[-0.015em]">
        {heading}
      </h2>
      <div className="grid gap-[13px]">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 border-b border-line-5 pb-[13px] text-base leading-[1.5] text-ink-soft"
          >
            <span className="flex-none font-semibold text-teal">✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

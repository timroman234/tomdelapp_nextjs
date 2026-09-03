// src/components/newsletter-form.tsx
"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="mt-[6px] flex gap-[10px]"
    >
      <input
        type="email"
        required
        placeholder="you@district.org"
        aria-label="Email address"
        name="email"
        className="min-w-0 flex-1 border border-[rgba(251,248,245,0.3)] bg-[rgba(31,22,20,0.28)] px-4 py-[15px] font-body text-[15px] text-cream placeholder:text-[rgba(251,248,245,0.5)]"
      />
      <button
        type="submit"
        className="bg-cream px-6 py-[15px] font-body text-[15px] font-semibold text-red-dark hover:bg-white"
      >
        {submitted ? "Thanks" : "Notify me"}
      </button>
    </form>
  );
}

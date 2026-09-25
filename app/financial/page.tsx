/**
 * File: app/financial/page.tsx
 * Purpose: Define the financial-information route and its document metadata.
 * Key Decision: Keep route metadata in this server page while delegating the
 * browser-sized chart to the client component in financialSection.tsx.
 */

import FinancialSection from "./financialSection";

// Optional: This adds the correct title to the browser tab!
export const metadata = {
  title: 'Public Financials | The Diaspora Project',
  description: 'Transparency in our funding and distribution.',
};

export default function FinancialsPage() {
  return (
    <main>
      {/* This renders the pie chart section we just finished! */}
      <FinancialSection />
    </main>
  );
}
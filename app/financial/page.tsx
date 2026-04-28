/**
 * File: app/financials/page.tsx
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
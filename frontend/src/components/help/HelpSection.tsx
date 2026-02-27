import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { FALLBACK_BENEFITS } from '@/constants/defaults';
import type { AustralianState } from '@/types';
import { formatDollar } from '@/lib/formatters';

const STATE_POLICY_LINKS: Record<AustralianState, { name: string; grantUrl: string; dutyUrl: string }> = {
  NSW: {
    name: 'New South Wales',
    grantUrl: 'https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer',
    dutyUrl: 'https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty',
  },
  VIC: {
    name: 'Victoria',
    grantUrl: 'https://www.sro.vic.gov.au/buying-property/first-home-owner-grant',
    dutyUrl: 'https://www.sro.vic.gov.au/land-transfer-duty',
  },
  QLD: {
    name: 'Queensland',
    grantUrl: 'https://www.qld.gov.au/housing/buying-owning-home/home-buyers-financial-help/first-home-owner-grant',
    dutyUrl: 'https://qro.qld.gov.au/duties/transfer-duty/concessions/homes/home-concession/',
  },
  WA: {
    name: 'Western Australia',
    grantUrl: 'https://www.wa.gov.au/organisation/department-of-treasury-and-finance/first-home-owner-grant-fhog',
    dutyUrl: 'https://www.wa.gov.au/organisation/department-of-finance/transfer-duty',
  },
  SA: {
    name: 'South Australia',
    grantUrl: 'https://www.revenuesa.sa.gov.au/grants-and-concessions/first-home-owners',
    dutyUrl: 'https://www.revenuesa.sa.gov.au/stamp-duty-land',
  },
  TAS: {
    name: 'Tasmania',
    grantUrl: 'https://www.sro.tas.gov.au/first-home-owner',
    dutyUrl: 'https://www.sro.tas.gov.au/property-transfer-duties',
  },
  ACT: {
    name: 'Australian Capital Territory',
    grantUrl: 'https://www.revenue.act.gov.au/home-buyer-assistance/home-buyer-concession-scheme',
    dutyUrl: 'https://www.revenue.act.gov.au/duties/conveyance-duty',
  },
  NT: {
    name: 'Northern Territory',
    grantUrl: 'https://nt.gov.au/property/home-owner-assistance/first-home-owners/first-home-owner-grant',
    dutyUrl: 'https://nt.gov.au/property/buying-and-selling-a-home/settle-the-sale/stamp-duty-buying-or-selling-a-home',
  },
};

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-600 underline hover:text-sky-800"
    >
      {children}
    </a>
  );
}

export function HelpSection() {
  const states = Object.keys(STATE_POLICY_LINKS) as AustralianState[];

  return (
    <section id="help">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Definitions, Formulas & References</h2>

      <Accordion>
        {/* Key definitions */}
        <AccordionItem title="Key Definitions" defaultOpen>
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>LVR (Loan-to-Value Ratio):</strong> total_loan / purchase_price. Lenders use this to assess risk. LVR above 80% typically triggers LMI.</li>
            <li><strong>LMI (Lenders Mortgage Insurance):</strong> A one-off fee charged when your deposit is less than 20% of the property price. It protects the lender, not you. Modeled here as an upfront cost added to the loan.</li>
            <li><strong>Stamp Duty (Transfer Duty):</strong> A state government tax on property purchases. Each state has different rates, thresholds, and concessions for first home buyers.</li>
            <li><strong>First Home Owner Grant (FHOG):</strong> A one-off grant from state governments to eligible first home buyers. Amount and eligibility criteria vary by state.</li>
            <li><strong>Stamp Duty Concession:</strong> A reduction in stamp duty for eligible first home buyers. May be a full exemption or partial concession depending on property price and state.</li>
            <li><strong>Upfront cash needed:</strong> deposit + (stamp duty after concessions) + other upfront costs - first home grant.</li>
            <li><strong>Total monthly cost:</strong> Mortgage (P&I) + council rates + water rates + strata + insurance + maintenance estimate.</li>
            <li><strong>Net position (year t):</strong> property_value(t) - cumulative_costs(t). Represents your total financial position from the investment.</li>
            <li><strong>Equity:</strong> property_value - remaining_loan_balance. The portion of the property you truly "own".</li>
            <li><strong>P&I (Principal & Interest):</strong> A repayment type where each payment covers both interest charges and reduces the loan balance.</li>
          </ul>
        </AccordionItem>

        {/* All formulas */}
        <AccordionItem title="Formulas Used in Calculations">
          <div className="space-y-4">
            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Mortgage Payment (P&I)</h4>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                M = P * r * (1+r)^n / ((1+r)^n - 1)
              </code>
              <p className="mt-1 text-xs text-gray-500">
                Where: P = loan principal, r = monthly interest rate (annual_rate / 100 / 12), n = total months (years * 12)
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Loan to Value Ratio</h4>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                LVR = (total_loan / purchase_price) * 100
              </code>
              <p className="mt-1 text-xs text-gray-500">
                Where: total_loan = (purchase_price - deposit) + LMI
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Upfront Cash Needed</h4>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                upfront = deposit + max(0, stamp_duty - concession) + other_costs - grant
              </code>
              <p className="mt-1 text-xs text-gray-500">
                Other costs = legal + inspection + loan application + valuation + mortgage registration + title fees + moving + repairs
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Monthly Costs</h4>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                total_monthly = mortgage + (council_rates + water_rates)/12 + strata/12 + insurance/12 + (price * maintenance%)/12
              </code>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Property Value Growth (Forecast)</h4>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                value(t) = value(t-1) * (1 + growth_rate / 100)
              </code>
              <p className="mt-1 text-xs text-gray-500">
                Compound annual growth applied each year. Default: 5% p.a.
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Annual Interest & Principal (Forecast)</h4>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                annual_interest = loan_balance * rate / 100{'\n'}
                monthly_pmt = balance * (r*(1+r)^remaining) / ((1+r)^remaining - 1){'\n'}
                annual_principal = min(balance, monthly_pmt*12 - annual_interest)
              </code>
              <p className="mt-1 text-xs text-gray-500">
                Each year, the payment is recalculated based on remaining balance and remaining term. Rate increases by the "rate bump" parameter from year 2.
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Net Position (Forecast)</h4>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                cumulative_cost(t) = cumulative_cost(t-1) + principal + interest + ongoing_costs - mortgage_portion{'\n'}
                net_position(t) = property_value(t) - cumulative_cost(t)
              </code>
              <p className="mt-1 text-xs text-gray-500">
                Tracks total money spent vs. what the property is worth. A positive net position means the investment has been profitable.
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-semibold text-gray-700">Scenario Analysis</h4>
              <code className="block rounded bg-gray-100 p-2 text-xs">
                scenario_loan = (base_price + price_increase) - deposit + LMI{'\n'}
                scenario_rate = base_rate + rate_increase{'\n'}
                scenario_monthly = mortgage(scenario_loan, scenario_rate, term) + ongoing_costs
              </code>
              <p className="mt-1 text-xs text-gray-500">
                When price increases, stamp duty scales proportionally and first-home concessions/grants may be lost (threshold-based).
              </p>
            </div>
          </div>
        </AccordionItem>

        {/* Default input values */}
        <AccordionItem title="Default Input Values">
          <div className="space-y-3">
            <p className="text-xs text-gray-500">These are the default values pre-filled in the calculator. Adjust them in the sidebar to match your situation.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-3 py-2 text-left font-semibold">Input</th>
                    <th className="px-3 py-2 text-right font-semibold">Default</th>
                    <th className="px-3 py-2 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ['Purchase price', '$500,000', 'Median house price benchmark'],
                    ['Stamp duty', '$10,500', 'WA rate for ~$500K property'],
                    ['Your deposit', '$90,000', ''],
                    ['Partner deposit', '$40,000', 'Total deposit = $130,000 (26%)'],
                    ['Interest rate', '6.15% p.a.', 'Variable rate benchmark'],
                    ['Loan term', '30 years', 'Standard Australian mortgage'],
                    ['Council rates', '$1,300/yr', 'Varies by LGA'],
                    ['Water rates', '$850/yr', 'Varies by provider'],
                    ['Insurance', '$950/yr', 'Building + contents estimate'],
                    ['Maintenance', '1% of value/yr', 'Rule-of-thumb allowance'],
                    ['Legal fees', '$2,000', 'Conveyancing/settlement'],
                    ['Inspection', '$600', 'Building & pest inspection'],
                    ['Loan application', '$600', 'Lender processing fee'],
                    ['Valuation', '$300', 'Bank valuation fee'],
                    ['Mortgage registration', '$165', 'State government fee'],
                    ['Title fees', '$250', 'Title search/transfer'],
                    ['Moving costs', '$1,500', 'Removalist estimate'],
                    ['Initial repairs', '$5,000', 'Post-settlement works'],
                    ['Property growth', '5% p.a.', 'Long-term AU average'],
                    ['Rate increase yr 2', '+0.5 pp', 'Buffer for rate rises'],
                  ].map(([input, value, notes]) => (
                    <tr key={input}>
                      <td className="px-3 py-2 text-gray-700">{input}</td>
                      <td className="px-3 py-2 text-right font-medium">{value}</td>
                      <td className="px-3 py-2 text-gray-500">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AccordionItem>

        {/* State benefits reference table */}
        <AccordionItem title="State Benefits Reference (First Home Buyers)">
          <p className="mb-3 text-xs text-gray-500">
            Default grant and stamp duty concession values used in the calculator. These are approximations - actual amounts depend on property price, dwelling type, and eligibility. Always verify with your state revenue office.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left font-semibold">State</th>
                  <th className="px-3 py-2 text-right font-semibold">FHOG</th>
                  <th className="px-3 py-2 text-right font-semibold">Stamp Duty Concession</th>
                  <th className="px-3 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {states.map((state) => {
                  const b = FALLBACK_BENEFITS[state];
                  return (
                    <tr key={state}>
                      <td className="px-3 py-2 font-medium text-gray-700">{state}</td>
                      <td className="px-3 py-2 text-right">{formatDollar(b.grant)}</td>
                      <td className="px-3 py-2 text-right">{formatDollar(b.stampDutyConcession)}</td>
                      <td className="px-3 py-2 text-right font-semibold text-sky-600">
                        {formatDollar(b.grant + b.stampDutyConcession)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AccordionItem>

        {/* Government policy links */}
        <AccordionItem title="Government Policy Links">
          <p className="mb-3 text-xs text-gray-500">
            Official state government pages for first home buyer grants, stamp duty rates, and concessions. Use these to verify current rates and eligibility.
          </p>
          <div className="space-y-4">
            {states.map((state) => {
              const info = STATE_POLICY_LINKS[state];
              return (
                <div key={state} className="rounded border border-gray-100 bg-gray-50 p-3">
                  <h4 className="mb-1 text-sm font-semibold text-gray-700">{info.name} ({state})</h4>
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-gray-500">First Home Grant: </span>
                      <ExternalLink href={info.grantUrl}>{info.grantUrl}</ExternalLink>
                    </div>
                    <div>
                      <span className="text-gray-500">Stamp / Transfer Duty: </span>
                      <ExternalLink href={info.dutyUrl}>{info.dutyUrl}</ExternalLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionItem>

        {/* Sensitivity analysis guide */}
        <AccordionItem title="Risk Analysis: How to Read">
          <ul className="list-disc space-y-2 pl-5">
            <li><strong>Custom scenario:</strong> Adjust the "house costs more" and "rate increases" sliders to see the impact on your monthly payment, upfront cash, and 10-year net position.</li>
            <li><strong>Impact colors:</strong> Red indicates a negative impact (higher costs), green indicates positive. The severity color of the impact panel changes based on how significant the impact is.</li>
            <li><strong>Pre-built scenarios:</strong> The bar charts compare your current situation against common "what-if" scenarios: +$50K price, +$100K price, +1% rate, +2% rate, and a worst case combining +$100K and +2%.</li>
            <li><strong>Net position chart:</strong> Shows your 10-year financial position. Below zero means you've spent more than the property is worth (not accounting for rental savings).</li>
            <li><strong>Concession loss:</strong> In scenarios where the price increases, first-home buyer grants and stamp duty concessions are removed (they typically have price caps).</li>
          </ul>
        </AccordionItem>

        {/* Caveats */}
        <AccordionItem title="Important Caveats">
          <ul className="list-disc space-y-2 pl-5">
            <li>This calculator is for <strong>educational and planning purposes only</strong>. It is not financial advice.</li>
            <li>Stamp duty concessions vary by dwelling type (new vs established), property price caps, and specific eligibility criteria.</li>
            <li>FHOG amounts and eligibility change - always confirm with your state revenue office before making decisions.</li>
            <li>The forecast uses a fixed annual growth rate. Real property values fluctuate and can decline.</li>
            <li>Interest rates are modeled as fixed, but most Australian mortgages are variable rate.</li>
            <li>The calculator does not account for: rental income, tax deductions, capital gains tax, or opportunity cost of the deposit.</li>
            <li>LMI costs vary significantly by lender and LVR. Use your lender's LMI calculator for an accurate figure.</li>
            <li>Council rates, water rates, and insurance costs increase over time but are modeled as fixed here.</li>
          </ul>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

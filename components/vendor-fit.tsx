import { assessVendor } from '@/lib/planner';
import type { Brief, Vendor } from '@/lib/planner';
import { getVendorEvidence } from '@/lib/vendor-evidence';

export function VendorFit({ vendor, brief, expanded = false }: { vendor: Vendor; brief: Brief; expanded?: boolean }) {
  const fit = assessVendor(vendor, brief);
  const evidence = getVendorEvidence(vendor.id);
  return <div className={`vendor-fit ${fit.status === 'mismatch' ? 'fit-mismatch' : ''}`}>
    <strong>{fit.status === 'mismatch' ? 'A requirement needs a different option' : 'Why consider this place?'}</strong>
    <ul>{fit.reasons.slice(0, expanded ? 10 : 2).map(reason => <li key={reason}>{reason}</li>)}</ul>
    <details open={expanded || undefined}><summary>What still needs an answer</summary><ul>{fit.unresolved.map(item => <li key={item}>{item}</li>)}</ul></details>
    {expanded && evidence && <>
      <h3>What the official sources establish</h3><p>{evidence.decisionSummary}</p>
      {evidence.capacity?.length ? <ul>{evidence.capacity.map(item => <li key={item.label}><strong>{item.label}:</strong> {item.guests} {item.format === 'rooms' ? 'rooms' : 'guests'} · {item.format}</li>)}</ul> : null}
      <h3>Access and arrival</h3><ul>{evidence.accessibility.details.map(item => <li key={item}>{item}</li>)}</ul>
      <h3>Your booking sequence</h3><ol>{evidence.bookingSteps.map(item => <li key={item}>{item}</li>)}</ol>
      <h3>Ask this provider</h3><ul>{evidence.questions.map(item => <li key={item}>{item}</li>)}</ul>
      <div className="evidence-links">{evidence.sources.map(source => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗ <small>Checked {source.checkedAt}</small></a>)}</div>
    </>}
  </div>;
}

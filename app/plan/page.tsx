import type { Metadata } from 'next';
import PlannerWorkspace from './planner-workspace';
export const metadata: Metadata = { title: { absolute: 'Build Your Santa Cruz Reunion Plan | Free Preview' }, description: 'Create a Santa Cruz shortlist, editable provider inquiries, workbooks, a weekend schedule, and a downloadable guest guide. Saves in your browser.', robots: { index: false, follow: true }, alternates: { canonical: '/plan' } };
export default function PlanPage() { return <PlannerWorkspace />; }

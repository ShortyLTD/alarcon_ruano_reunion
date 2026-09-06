import type { Metadata } from 'next';
import PlannerWorkspace from './planner-workspace';
export const metadata: Metadata = { title: 'Your reunion planner', description: 'Build your Santa Cruz reunion shortlist, inquiries, schedule, and guest guide.', robots: { index: false, follow: true }, alternates: { canonical: '/plan' } };
export default function PlanPage() { return <PlannerWorkspace />; }

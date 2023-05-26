import DashboardServer from '@/app/(client)/(dashboards)/dashboard.server';
import { authenticateGuard } from '@/src/auth';

export default async function Page ({ params }: any) {
  await authenticateGuard(`/dashboards/${encodeURIComponent(params.name)}/edit`);
  return <DashboardServer name={params.name} />;
}

export const dynamic = 'force-dynamic';

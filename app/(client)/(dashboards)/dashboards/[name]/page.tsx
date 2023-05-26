import DashboardServer from '@/components/pages/Dashboard/dashboard.server';
import React from 'react';

export default async function Page ({ params }: any) {
  return <DashboardServer name={params.name} />;
}

export const dynamic = 'force-dynamic';

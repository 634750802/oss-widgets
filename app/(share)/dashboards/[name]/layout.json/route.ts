import { getDashboard } from '@/app/(client)/api/layout/operations';
import { isReadonly } from '@/utils/server/auth';
import { LayoutConfig } from '@/utils/types/config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (req: NextRequest, { params }: any) {
  const readonly = isReadonly(req);
  const [dashboard, library] = await getDashboard(params.name, readonly);

  const config: LayoutConfig = {
    version: 2,
    library,
    dashboard: {
      [params.name]: dashboard,
    },
  };

  return NextResponse.json(config);
}

export const dynamic = 'force-dynamic';

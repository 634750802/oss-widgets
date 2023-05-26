'use client';

import { commands, currentDashboard } from '@/app/bind';
import { singletons, whenReady } from '@/packages/ui/hooks/bind';
import { useWhenReady } from '@/packages/ui/hooks/bind/hooks';
import Dashboard from '@/src/_pages/Dashboard';
import { defaultLayoutConfig } from '@/src/components/WidgetsManager/defaults';
import { Dashboard as DashboardConfig } from '@/src/types/config';
import { useSelectedLayoutSegments } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardClient () {
  const [, name = 'default', mode] = useSelectedLayoutSegments();
  const editing = mode === 'edit';

  useWhenReady(singletons, 'dashboard', (canvas, sub) => {
    sub.add(currentDashboard.subscribe(next => {
      if (next) {
        commands.inactiveScope(() => {
          canvas.current.syncWith(next);
        });
      }
    }));

    if (currentDashboard.current) {
      canvas.current.syncWith(currentDashboard.current);
    }

    sub.add(() => {
      canvas.current.dispose();
    });
  }, []);

  useEffect(() => {
    const sub = whenReady(singletons, 'dashboard', (canvas, sub) => {
      sub.add(currentDashboard.subscribe(next => {
        if (next) {
          commands.inactiveScope(() => {
            canvas.current.syncWith(next);
          });
        }
      }));

      sub.add(() => canvas.current.dispose());
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <>
      <Dashboard dashboardName={name} editMode={editing} />
    </>
  );
}

const defaultDashboard = (): DashboardConfig => {
  return {
    layout: { ...defaultLayoutConfig },
    items: [],
  };
};

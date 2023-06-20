'use client';
import { useWindowVerticallyScrolling } from '@/utils/useScrolling';
import cu from '@ossinsight-lite/widgets/src/widgets/oh-my-github/curr_user.sql?unique';
import * as Menubar from '@radix-ui/react-menubar';
import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg';
import clsx from 'clsx';
import Link from 'next/link';
import { AddWidget } from './AddWidget';
import DownloadLayoutJson from './DownloadLayoutJson';
import { MenuDashboardItem } from './MenuDashboardItem';
import { SQLEditorButton } from './SQLEditorButton';
import { UserMenuItems } from './UserMenuItems';

export interface SiteHeaderProps {
  contentGroup?: 'dashboard' | 'admin' | 'public';
  dashboardNames?: string[];
}

export function SiteHeader ({ dashboardNames = [], contentGroup = 'dashboard' }: SiteHeaderProps) {
  const scrolling = useWindowVerticallyScrolling();

  return (
    <Menubar.Root asChild>
      <header className={clsx('site-header', { scrolling })}>
        <span className="site-title">
          {`${cu.login}'s ${contentGroup === 'admin' ? 'Admin' : 'Dashboard'}`}
        </span>
        {contentGroup === 'dashboard' && (
          <>
            <DownloadLayoutJson />
            <MenuDashboardItem dashboardNames={dashboardNames} />
            <SQLEditorButton />
          </>
        )}
        <span className="spacer" />
        <AddWidget />
        {contentGroup === 'admin' && (
          <Link className="site-header-item btn btn-link" href="/" prefetch={false}>
            <ChevronLeftIcon />
            Back to home
          </Link>
        )}
        <UserMenuItems contentGroup={contentGroup} />
      </header>
    </Menubar.Root>
  );
}
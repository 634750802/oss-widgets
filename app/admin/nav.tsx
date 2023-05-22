'use client';
import { useSelectedLayoutSegments } from 'next/navigation';
import Link from 'next/link';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

const navs = [
  {
    key: 'repositories',
    title: 'Tracking Repos',
    href: '/admin/repositories',
  },
  {
    key: 'dashboards',
    title: 'Dashboards Management',
    href: '/admin/dashboards',
  },
  {
    key: 'widgets',
    title: 'Widgets Management',
    href: '/admin/widgets',
  },
] as const;

export default function Nav () {
  const [first] = useSelectedLayoutSegments();

  return (
    <NavigationMenu.Root orientation="vertical" className="nav-menu">
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href='/'>
              Home
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        {navs.map(nav => (
          <NavigationMenu.Item key={nav.key}>
            <NavigationMenu.Link asChild active={first === nav.key}>
              <Link href={nav.href}>
                {nav.title}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
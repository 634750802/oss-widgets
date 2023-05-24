import * as RuiToolbar from '@radix-ui/react-toolbar';
import { MenuContentProps } from '../menu';
import Link from 'next/link';

export const renderSeparator: MenuContentProps['renderSeparator'] = (item) => {
  return <span style={{ order: item.order }} className='flex-1'></span>;
};

export const renderParentItem: MenuContentProps['renderParentItem'] = () => {
  throw new Error('ToolbarMenu does not support parent item.');
};

export const renderItem: MenuContentProps['renderItem'] = (item) => {
  return (
    <RuiToolbar.Button
      style={{ order: item.order }}
      className="p-1 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-opacity"
      onClick={item.action}
      key={item.id}
    >
      {item.text}
    </RuiToolbar.Button>
  );
};

export const renderCustomItem: MenuContentProps['renderCustomItem'] = (item) => {
  return (
    <span
      style={{ order: item.order }}
      className="p-1 flex items-center justify-center rounded opacity-100"
      key={item.id}
    >
      {item.children}
    </span>
  );
};

export const renderLinkItem: MenuContentProps['renderLinkItem'] = (item) => {
  return (
    <RuiToolbar.Link
      style={{ order: item.order }}
      key={item.id}
      className="p-1 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-opacity"
      asChild
    >
      <Link href={item.href}>
        {item.text}
      </Link>
    </RuiToolbar.Link>
  );
};

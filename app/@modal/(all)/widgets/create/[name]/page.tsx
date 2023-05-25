'use client';
import { ModalContext } from '@/app/@modal/(all)/context';
import { currentDashboard, library } from '@/app/bind';
import { widgets } from '@/app/bind-client';
import RoughBox from '@/packages/ui/components/roughness/shape/box';
import { readItem } from '@/packages/ui/hooks/bind';
import EditWidgetInstance from '@/src/_pages/EditWidgetInstance';
import { useCallback, useContext, useState } from 'react';
import colors from 'tailwindcss/colors';

export default function ({ params }: any) {
  const name = decodeURIComponent(params.name);
  const widget = readItem(widgets, name);
  const { closeModal } = useContext(ModalContext);

  const [props, setProps] = useState(() => {
    return { ...widget.current.defaultProps };
  });

  const handlePropsChange = useCallback((key: string, value: any) => {
    setProps(props => ({ ...props, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    const id = `${name}-${Date.now()}`;
    library.add(id, {
      id,
      name,
      props,
    });
    if (currentDashboard.current) {
      currentDashboard.current.items.add(id, {
        id,
        rect: widget.current.defaultRect ?? [0, 0, 8, 3],
      });
    }
    closeModal();
  }, []);

  return (
    <div className='h-full flex flex-col justify-stretch'>
      <div className="flex items-center justify-end">
        <button className="block relative" onClick={handleSave}>
          <span className="relative z-10 px-4 font-bold inline-flex gap-2 items-center text-blue-700">
            Save
          </span>
          <RoughBox color={colors.blue['400']} />
        </button>
      </div>
      <div className='flex-1'>
        <EditWidgetInstance
          props={props}
          onPropsChange={handlePropsChange}
          name={name} creating
        />
      </div>
    </div>
  );
}
'use client';
import { widgets } from '@/app/bind-client';
import { readItem } from '@/packages/ui/hooks/bind';
import { useVisible } from '@/packages/ui/hooks/visible';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import clientOnly from '@/src/utils/clientOnly';
import WidgetContext from '@ossinsight-lite/ui/context/widget';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { forwardRef, lazy, Suspense, useMemo } from 'react';

export interface EditWidgetInstanceProps {
  name: string;
  props: any;
  onPropsChange: (key: string, value: any) => void;
  creating?: boolean
}

function EditWidgetInstance ({ name, props, onPropsChange, creating = false }: EditWidgetInstanceProps) {
  const widget = readItem(widgets, name).current;
  const Widget = useMemo(() => {
    const fn = widget.configureComponent;
    if (!fn) {
      return () => <div>Widget is not configurable.</div>;
    }
    return dynamic(async () => {
      return forwardRef((await fn()).default);
    });
  }, [widget]);
  const { ref: visibleRef, visible } = useVisible<HTMLDivElement>();

  return (
    <WidgetContext.Provider
      value={{
        configuring: true,
        visible,
        creating,
        onPropChange: onPropsChange,
        props: { ...props, ...widget.configurablePropsOverwrite },
      }}
    >
      <Widget
        {...props}
        {...widget.configurablePropsOverwrite}
        className={clsx('w-full h-full', widget.configurablePropsOverwrite?.className, props.className)}
        ref={visibleRef}
      />
    </WidgetContext.Provider>
  );
}

export default clientOnly(EditWidgetInstance, () => (
  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg gap-2">
    <LoadingIndicator />
    Widget loading...
  </div>
));

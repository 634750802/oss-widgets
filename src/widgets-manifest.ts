/// IMPORTANT:
/// This file is a slot, will be actually loaded by buildtool/webpack/loaders/widgets-manifest

import { CSSProperties, ForwardedRef, HTMLProps } from 'react';

type Widgets = Record<string, Widget>
type WidgetModule = {
  default: (props: HTMLProps<HTMLDivElement>, ref: ForwardedRef<HTMLDivElement>) => JSX.Element,
  preferredSize?: CSSProperties,
  defaultProps?: Record<string, any>,
  configurable?: boolean | ((props: any) => boolean),
  configurablePropsOverwrite?: Record<string, any>,
  widgetListItemPropsOverwrite?: Record<string, any>,
}
type Widget = {
  module: () => Promise<WidgetModule>
  source: string
  cssSource: string | undefined
}

export default {} as Widgets;

export type {
  Widget,
  Widgets,
  WidgetModule,
};

throw new Error('This file is a slot, will be actually loaded by buildtool/webpack/loaders/widgets-manifest. Check your config.')

import RoughSvg from '@ossinsight-lite/roughness/components/RoughSvg';
import { BarChartIcon } from '@radix-ui/react-icons';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import clsx from 'clsx';
import { forwardRef } from 'react';
import GraphUpIcon from '../../icons/twbs/graph-up.svg';
import TableIcon from '../../icons/twbs/table.svg';

interface ChartTypeToggleProps<T> {
  className?: string;
  value: T;
  onChange: (value: T) => void;
}

const itemClasses = 'bg-opacity-60 hover:bg-gray-400 color-gray-700 data-[state=on]:bg-gray-300 flex h-[35px] w-[35px] items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:outline-none transition-colors';

const ChartTypeToggle = forwardRef<HTMLDivElement, ChartTypeToggleProps<any>>(({ className, value, onChange }, ref) => {
  return (
    <ToggleGroup.Root
      className={clsx('inline-flex bg-gray-200 rounded border space-x-px', className)}
      type="single"
      ref={ref}
      value={value}
      onValueChange={onChange}
    >
      <ToggleGroup.Item className={itemClasses} value="gauge" aria-label="Gauge">
        <span>
          42
        </span>
      </ToggleGroup.Item>
      <ToggleGroup.Item className={itemClasses} value="table" aria-label="Raw table">
        <RoughSvg>
          <TableIcon />
        </RoughSvg>
      </ToggleGroup.Item>
      <ToggleGroup.Item className={itemClasses} value="chart:line" aria-label="Line chart">
        <RoughSvg>
          <GraphUpIcon />
        </RoughSvg>
      </ToggleGroup.Item>
      <ToggleGroup.Item className={itemClasses} value="chart:bar" aria-label="Bar chart">
        <RoughSvg>
          <BarChartIcon />
        </RoughSvg>
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
});

export default ChartTypeToggle;

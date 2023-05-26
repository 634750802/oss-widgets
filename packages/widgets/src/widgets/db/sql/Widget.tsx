import WidgetContext from '@ossinsight-lite/ui/context/widget';
import { ForwardedRef, HTMLProps, useContext, useEffect, useRef } from 'react';
import { VisualizeType } from '../../../components/visualize/common';
import { useOperation } from '../../../utils/operation';
import { doDbSqlQuery } from '../../../utils/query';
import ResultDisplay from './ResultDisplay';

export enum WidgetMode {
  EDITOR = 'editor',
  VISUALIZATION = 'visualization',
}

export interface WidgetProps extends HTMLProps<HTMLDivElement> {
  defaultDb?: string;
  defaultSql?: string;
  currentDb?: string;
  sql?: string;
  /** @deprecated */
  mode?: WidgetMode;
  visualize?: VisualizeType;
  onPropChange?: (name: string, value: any) => void;
}

export default function Widget ({ defaultSql, defaultDb, sql, currentDb, visualize, mode, ...props }: WidgetProps, forwardedRef: ForwardedRef<HTMLDivElement>) {
  const { visible } = useContext(WidgetContext);
  const firstExecuted = useRef(false);
  const { execute, running, result, error } = useOperation<{ sql: string, db: string, force: boolean }, any>(doDbSqlQuery);

  useEffect(() => {
    if ((sql || defaultSql) && currentDb && visible && !firstExecuted.current) {
      firstExecuted.current = true;
      execute({ sql: sql || defaultSql, db: currentDb, force: false });
    }
  }, [visible]);

  return (
    <div {...props} ref={forwardedRef}>
      <ResultDisplay visualize={visualize} running={running} error={error} result={result} />
    </div>
  );
}

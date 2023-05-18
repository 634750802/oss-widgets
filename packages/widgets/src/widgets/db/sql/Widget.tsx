import { ForwardedRef, HTMLProps, Suspense, useCallback, useContext, useEffect, useState } from 'react';
import SQLEditor from './SQLEditor';
import SQLEditorHeader from './SQLEditorHeader';
import clsx from 'clsx';
import { useSize } from '../../../utils/size';
import { useOperation } from '../../../utils/operation';
import ResultDisplay from './ResultDisplay';
import { VisualizeType } from './visualize/common';
import useRefCallback from '@oss-widgets/ui/hooks/ref-callback';
import updatePartial from '@oss-widgets/ui/utils/update-partial';
import * as Dialog from '@radix-ui/react-dialog';
import { VisualizeContext } from './visualize/context';
import { Form } from '@oss-widgets/ui/components/form';
import VisualizeConfig from './visualize/VisualizeConfig';
import { migrate } from './visualize/guess';
import { MenuItem } from '@oss-widgets/ui/components/menu';
import WidgetContext from '@oss-widgets/ui/context/widget';
import mergeRefs from '@oss-widgets/ui/utils/merge-refs';
import { getCache, setCache } from './cache';

export enum WidgetMode {
  EDITOR = 'editor',
  VISUALIZATION = 'visualization',
}

export interface WidgetProps extends HTMLProps<HTMLDivElement> {
  defaultDb?: string;
  defaultSql?: string;
  currentDb?: string;
  sql?: string;
  mode?: WidgetMode;
  visualize?: VisualizeType;
  onPropChange?: (name: string, value: any) => void;
}

export default function Widget ({ defaultSql, defaultDb, sql, currentDb, mode = WidgetMode.EDITOR, visualize, ...props }: WidgetProps, forwardedRef: ForwardedRef<HTMLDivElement>) {
  const { onPropChange, enabled, configurable, configure } = useContext(WidgetContext);

  const { size, ref } = useSize<HTMLDivElement>();
  const [openVisualizeDialog, setOpenVisualizeDialog] = useState(false);

  const onSqlChange = useCallback((sql: string) => {
    onPropChange?.('sql', sql);
  }, [onPropChange]);

  const onCurrentDbChange = useCallback((db: string) => {
    onPropChange?.('currentDb', db);
  }, [onPropChange]);

  const onVisualizeChange = useRefCallback((partialVisualize: Partial<VisualizeType>) => {
    updatePartial(visualize, partialVisualize);
    onPropChange?.('visualize', { ...visualize });
  });

  const onVisualizeTypeChange = useRefCallback((type: VisualizeType['type']) => {
    if (!result) {
      return;
    }
    onPropChange?.('visualize', migrate(visualize, type, result));
  });

  const { execute, running, result, error } = useOperation<{ sql: string, db: string, force: boolean }, any>(doQuery);

  useEffect(() => {
    if ((sql || defaultSql) && currentDb) {
      execute({ sql: sql || defaultSql, db: currentDb, force: false });
    }
  }, []);

  if (mode === WidgetMode.VISUALIZATION) {
    return (
      <div {...props} ref={forwardedRef}>
        {enabled && (
          <Suspense fallback={<></>}>
            <MenuItem id="configure" text="Configure" action={configure} order={1} disabled={!configurable} />
          </Suspense>
        )}
        <ResultDisplay visualize={visualize} running={running} error={error} result={result} />
      </div>
    );
  }
  return (
    <div ref={mergeRefs(ref, forwardedRef)} {...props} className={clsx('relative', props.className)}>
      <div className={clsx('w-full h-full flex flex-col')}>
        <SQLEditorHeader
          currentDb={currentDb}
          onCurrentDbChange={onCurrentDbChange}
          onRun={() => {
            execute({ sql, db: currentDb, force: true });
          }}
          running={running}
        />
        <div className="min-h-[240px] max-h-[320px] w-full">
          <SQLEditor sql={sql} defaultSql={defaultSql} onSqlChange={onSqlChange} />
        </div>
        <div className="flex-1 w-full overflow-hidden">
          <ResultDisplay
            editing
            visualize={visualize}
            onVisualizeTypeChange={onVisualizeTypeChange}
            onClickVisualizeOptions={() => {
              setOpenVisualizeDialog(true);
            }}
            running={running}
            result={result}
            error={error}
          />
          <Dialog.Root open={openVisualizeDialog} onOpenChange={setOpenVisualizeDialog}>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black bg-opacity-70 data-[state=open]:animate-overlayShow fixed inset-0" />
              <Dialog.Content className="z-10 backdrop-blur data-[state=open]:animate-contentShow fixed top-[40px] left-0 max-h-[85vh] w-full p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-white m-0 text-xl font-medium">Visualization</Dialog.Title>
                <VisualizeContext.Provider value={{ result: result?.data, running, error, columns: result?.columns }}>
                  <Form className="overflow-auto p-2" values={visualize} onChange={onVisualizeChange}>
                    <Suspense fallback="Loading...">
                      <VisualizeConfig {...visualize} />
                    </Suspense>
                  </Form>
                </VisualizeContext.Provider>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
}

async function doQuery (prop: { sql: string, db: string, force: boolean }, signal: AbortSignal): Promise<any> {
  let invalidCache;
  if (!prop.force) {
    const data = await getCache(prop.db, prop.sql);
    if (data && (!isFinite(data.expired) || data.expired > Date.now())) {
      return data;
    }
    invalidCache = data;
  }

  const res = await fetch(`/api/db/${prop.db}?force=${prop.force}`, {
    method: 'post',
    body: prop.sql,
    signal,
  });
  if (res.ok) {
    const data = await res.json();
    if (isFinite(data.ttl)) {
      data.expired = Date.now() + data.ttl * 1000;
    }
    await setCache(prop.db, prop.sql, data);
    return data;
  } else {
    try {
      if (invalidCache) {
        return invalidCache;
      }
      const response = await res.json();
      return Promise.reject(new Error(response?.message ?? JSON.stringify(response)));
    } catch {
      return Promise.reject(new Error(`${res.status} ${res.statusText}`));
    }
  }
}

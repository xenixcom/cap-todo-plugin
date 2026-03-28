export type PipelineStepStatus = 'passed' | 'failed' | 'skipped';

export interface PipelineStepResult {
  id: string;
  status: PipelineStepStatus;
  detail: string;
  data?: unknown;
}

export interface PipelineRunResult {
  ok: boolean;
  steps: PipelineStepResult[];
}

export interface PipelinePermissionStatus {
  microphone: string;
}

export interface PipelineStatusResult {
  status: string;
}

export interface PipelineOptionsResult {
  enabled: boolean;
  debug: boolean;
}

export interface PipelineEchoResult {
  value: string;
}

export interface PipelineEventRecord {
  eventName: string;
  payload: Record<string, unknown> | null;
}

export interface PipelineHost {
  getStatus(): Promise<PipelineStatusResult>;
  getOptions(): Promise<PipelineOptionsResult>;
  setOptions(options: Partial<PipelineOptionsResult>): Promise<void>;
  resetOptions(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  reset(): Promise<void>;
  checkPermissions(): Promise<PipelinePermissionStatus>;
  requestPermissions?(): Promise<PipelinePermissionStatus>;
  echo(options: { value: string }): Promise<PipelineEchoResult>;
  subscribeStatusChange?(): Promise<() => PipelineEventRecord[]>;
}

export interface PipelineRunOptions {
  includeLifecycle?: boolean;
  includePermissionRequest?: boolean;
  includeStatusEvent?: boolean;
}

function step(
  id: string,
  status: PipelineStepStatus,
  detail: string,
  data?: unknown,
): PipelineStepResult {
  return { id, status, detail, data };
}

function toDetail(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export async function runSinglePipeline(
  host: PipelineHost,
  options: PipelineRunOptions = {},
): Promise<PipelineRunResult> {
  const steps: PipelineStepResult[] = [];

  try {
    const status = await host.getStatus();
    steps.push(step('getStatus', 'passed', 'resolved', status));
  } catch (error) {
    steps.push(step('getStatus', 'failed', toDetail(error)));
  }

  try {
    const currentOptions = await host.getOptions();
    steps.push(step('getOptions', 'passed', 'resolved', currentOptions));
  } catch (error) {
    steps.push(step('getOptions', 'failed', toDetail(error)));
  }

  try {
    const echo = await host.echo({ value: 'pipeline-probe' });
    steps.push(
      step(
        'echo',
        echo.value === 'pipeline-probe' ? 'passed' : 'failed',
        echo.value === 'pipeline-probe'
          ? 'echo returned expected value'
          : 'echo returned unexpected value',
        echo,
      ),
    );
  } catch (error) {
    steps.push(step('echo', 'failed', toDetail(error)));
  }

  try {
    const permissions = await host.checkPermissions();
    steps.push(step('checkPermissions', 'passed', 'resolved', permissions));
  } catch (error) {
    steps.push(step('checkPermissions', 'failed', toDetail(error)));
  }

  if (options.includePermissionRequest && host.requestPermissions) {
    try {
      const permissions = await host.requestPermissions();
      steps.push(step('requestPermissions', 'passed', 'resolved', permissions));
    } catch (error) {
      steps.push(step('requestPermissions', 'failed', toDetail(error)));
    }
  } else {
    steps.push(
      step(
        'requestPermissions',
        'skipped',
        'permission request not enabled for this host',
      ),
    );
  }

  if (options.includeLifecycle) {
    try {
      await host.resetOptions();
      await host.stop().catch(() => undefined);
      await host.start();
      await host.stop();
      await host.reset();
      steps.push(step('lifecycle', 'passed', 'sequence completed'));
    } catch (error) {
      steps.push(step('lifecycle', 'failed', toDetail(error)));
    }
  } else {
    steps.push(step('lifecycle', 'skipped', 'lifecycle sequence not enabled'));
  }

  if (options.includeStatusEvent && host.subscribeStatusChange) {
    try {
      const flush = await host.subscribeStatusChange();
      await host.start().catch(() => undefined);
      await host.stop().catch(() => undefined);
      const events = flush();
      const ok = events.some(
        event =>
          event.eventName === 'statusChange' &&
          event.payload?.status === 'running',
      );
      steps.push(
        step(
          'statusChange',
          ok ? 'passed' : 'failed',
          ok ? 'statusChange event observed' : 'statusChange event missing',
          events,
        ),
      );
    } catch (error) {
      steps.push(step('statusChange', 'failed', toDetail(error)));
    }
  } else {
    steps.push(
      step(
        'statusChange',
        'skipped',
        'status event probe not enabled for this host',
      ),
    );
  }

  return {
    ok: steps.every(result => result.status !== 'failed'),
    steps,
  };
}

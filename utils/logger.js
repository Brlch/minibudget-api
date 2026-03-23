const VALID_LOG_TARGETS = new Set(['console', 'external', 'disabled']);

const getExternalLogger = () => globalThis.__MINIBUDGET_API_LOG__;
const normalizeTarget = value => {
  if (!value || value === 'undefined' || value === 'null') {
    return 'console';
  }

  return value;
};

const writeConsole = (level, message, details) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...details,
  };

  if (level === 'error') {
    console.error('[api]', payload);
    return;
  }

  if (level === 'warn') {
    console.warn('[api]', payload);
    return;
  }

  console.info('[api]', payload);
};

const writeLog = (level, message, details = {}) => {
  const target = normalizeTarget(process.env.LOG_TARGET?.trim());

  if (!VALID_LOG_TARGETS.has(target)) {
    writeConsole('warn', 'logger.invalid_target', {
      configuredTarget: target,
    });
    writeConsole(level, message, details);
    return;
  }

  if (target === 'disabled') {
    return;
  }

  if (target === 'external') {
    const externalLogger = getExternalLogger();
    if (typeof externalLogger === 'function') {
      externalLogger({
        timestamp: new Date().toISOString(),
        level,
        message,
        ...details,
      });
      return;
    }

    writeConsole('warn', 'logger.external_missing', {});
  }

  writeConsole(level, message, details);
};

export const logger = {
  info(message, details) {
    writeLog('info', message, details);
  },
  warn(message, details) {
    writeLog('warn', message, details);
  },
  error(message, details) {
    writeLog('error', message, details);
  },
};

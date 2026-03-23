const REQUIRED_ENV_KEYS = [
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'DB_HOST',
  'JWT_SECRET',
];

const PLACEHOLDER_SECRETS = new Set([
  'your_jwt_secret_key_here_change_in_production',
  'your_jwt_secret',
  'changeme',
]);
const VALID_LOG_TARGETS = new Set(['console', 'external', 'disabled']);
const normalizeOptionalValue = value => {
  if (!value || value === 'undefined' || value === 'null') {
    return null;
  }

  return value;
};

const parsePort = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid port value "${value}".`);
  }

  return parsed;
};

export const getNodeEnv = env => {
  const value = env.NODE_ENV || 'development';
  if (!['development', 'test', 'production'].includes(value)) {
    throw new Error(
      `Invalid NODE_ENV "${value}". Expected development, test, or production.`
    );
  }

  return value;
};

export const validateRuntimeEnv = (env = process.env) => {
  const nodeEnv = getNodeEnv(env);
  const missing = REQUIRED_ENV_KEYS.filter(key => !env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (
    nodeEnv === 'production' &&
    PLACEHOLDER_SECRETS.has((env.JWT_SECRET || '').trim())
  ) {
    throw new Error('JWT_SECRET must be replaced before running in production.');
  }

  const logTarget =
    normalizeOptionalValue(env.LOG_TARGET?.trim()) || 'console';
  if (!VALID_LOG_TARGETS.has(logTarget)) {
    throw new Error(
      `Invalid LOG_TARGET "${logTarget}". Expected console, external, or disabled.`
    );
  }

  return {
    nodeEnv,
    dbPort: parsePort(env.DB_PORT, 5432),
    appPort: parsePort(env.PORT, 4000),
    logTarget,
  };
};

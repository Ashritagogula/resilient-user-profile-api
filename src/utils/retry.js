const retryWithExponentialBackoff = async (
  action,
  maxAttempts = parseInt(process.env.RETRY_MAX_ATTEMPTS || "3", 10),
  baseDelay = parseInt(process.env.RETRY_BASE_DELAY_MS || "200", 10)
) => {
  let attempt = 1;

  while (attempt <= maxAttempts) {
    try {
      return await action();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      // Optional jitter
      const jitter = Math.random() * 50;
      
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
      attempt++;
    }
  }
};

module.exports = {
  retryWithExponentialBackoff
};

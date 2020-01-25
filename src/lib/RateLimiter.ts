interface RateLimitOptions {
  time: number;
  max: number;
  store: RateLimiterStrategy;
  message: string;
}

interface RateLimitObject {
  lastTimestamp: number;
  count: number;
}

/**
 * Storage Strategy
 */
export interface RateLimiterStrategy {
  get(
    key: any,
    limiter?: RateLimiter
  ): Promise<RateLimitObject | null | undefined>;
  set(
    key: any,
    rate: RateLimitObject,
    limiter?: RateLimiter
  ): Promise<RateLimitObject>;
  del(key: any, limiter?: RateLimiter): Promise<void>;
}

/**
 * In Memory Storage
 */
export class RateLimiterMemoryStrategy implements RateLimiterStrategy {
  private memory = new Map<any, RateLimitObject>();

  async get(key: any) {
    return this.memory.get(key);
  }

  async set(key: any, rate: RateLimitObject, limiter: RateLimiter) {
    this.memory.set(key, rate);
    return rate;
  }

  async del(key: any): Promise<void> {
    this.memory.delete(key);
  }
}

/**
 * RateLimiter
 */
export class RateLimiter {
  public options: RateLimitOptions;
  constructor(options: Partial<RateLimitOptions> = {}) {
    this.options = Object.assign(
      {
        time: 1000,
        max: 10,
        store: new RateLimiterMemoryStrategy(),
        message: "too many taps"
      },
      options
    );
  }

  /**
   * Resolves if the rate limit is not reached
   * @param key Key for storage
   */
  async tap(key?: any) {
    const { store, time, max, message } = this.options;
    const timestamp = Date.now();

    let rate = (await store.get(key, this)) || {
      lastTimestamp: 0,
      count: 0
    };

    // Check time and reset expired
    if (!rate.lastTimestamp || timestamp - rate.lastTimestamp > time) {
      rate.count = 1;
      rate.lastTimestamp = timestamp;
      await store.set(key, rate, this);
      return true;
    }

    // Check attemps
    if (rate.count >= max) {
      throw new Error(message);
    }

    rate.count++;

    // Save
    await store.set(key, rate, this);

    return true;
  }
}

import Redis from "ioredis";
const config = process.env.DATABASE_URL;

export const pub = new Redis(config);
export const sub = new Redis(config);
export const redis = new Redis(config);

export const get = (key: string): any => {
  return new Promise((res) => {
    redis.get(key, (err: any, result: any) => {
      return res(result);
    });
  });
};

export const set = (key: string, value: string) => redis.set(key, value);

import { redisClient } from "../redis.js";
import { generateShortCode } from "../utils.js";
import {
 createUrl,
  deleteUrlByCode,
  findStatsByCode,
  findUrlByCode,
  incrementClicks,
  updateUrlByCode,
} from '../repositories/url.repository.js';

const CACHE_TTL_SECONDS = 3600

export const shortenUrl = async (originalUrl: string) => {
    const shortCode = generateShortCode();
    const record = await createUrl(originalUrl, shortCode)

    await redisClient.set(`url:${shortCode}`, originalUrl, { EX: CACHE_TTL_SECONDS });

    return record;
}

export const resolveUrl = async (shortCode: string) => {
    const cacheKey = `url:${shortCode}`;
    const cachedUrl = await redisClient.get(cacheKey);

    if (cachedUrl) {
        console.log(`[Cache HIT] Redirecting to ${cachedUrl}`);
        void incrementClicks(shortCode).catch(console.error)
        return cachedUrl;
    }

    console.log(`[Cache MISS] Fetching ${shortCode} from Postgres`);
    const record = await findUrlByCode(shortCode);
    if (!record) return null;

    await redisClient.set(cacheKey, record.original_url, { EX: CACHE_TTL_SECONDS });

    void incrementClicks(shortCode).catch(console.error);

    return record.original_url;
}

export const updateShortUrl = async (shortCode: string, newUrl: string) => {
    const record = await updateUrlByCode(shortCode, newUrl);
    if (!record) return null;
    await redisClient.set(`url:${shortCode}`, newUrl, { EX: CACHE_TTL_SECONDS });

    return record
}

export const retrieveOriginalUrl = async (shortCode: string) => {
    const cacheKey = `url:${shortCode}`;
    const cachedUrl = await redisClient.get(cacheKey);

    if (cachedUrl) return cachedUrl;

    const record = await findUrlByCode(shortCode);

    if (!record) return null;

    await redisClient.set(cacheKey, record.original_url, { EX: CACHE_TTL_SECONDS })

    return record.original_url
}

export const getUrlStats = async (shortCode: string) => {
    return findStatsByCode(shortCode)
}

export const deleteShortUrl = async (shortCode: string) => {
    const record = await deleteUrlByCode(shortCode);
    if (!record) return null
    await redisClient.del(`url:${shortCode}`);

    return record;
}
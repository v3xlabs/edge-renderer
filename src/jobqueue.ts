import { RedisClientType } from '.';
import { logger } from './logger';
import { screenshot } from './screenshot';

export const processJob = async (redis: RedisClientType, task: string) => {
    logger.debug('processingJob', task);

    let url: URL;

    try {
        // Will fail if not a valid url
        url = new URL(task);
    } catch {
        logger.error('Invalid task', task);

        return;
    }

    const images = await screenshot(task);

    logger.debug('images', images);

    for (const [resolution, data] of Object.entries(images)) {
        redis.hSet(`images:${url.hostname}`, resolution, data);
    }

    // Expire after x amount of time
    // redis.expire(`images:${url.hostname}`, 10);
};

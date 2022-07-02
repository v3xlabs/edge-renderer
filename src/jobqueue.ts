import { RedisClientType } from '.';
import { logger } from './logger';
import { JobData, screenshot } from './screenshot';

export const processJob = async (redis: RedisClientType, task: JobData) => {
    logger.debug('processingJob', task);

    let url: URL;

    try {
        // Will fail if not a valid url
        url = new URL(task.url);
    } catch {
        logger.error('Invalid task', task);

        return;
    }

    const images = await screenshot(task);

    logger.debug('images', Object.keys(images));

    for (const [variant, data] of Object.entries(images)) {
        redis.hSet(`images:${task.id}`, variant, data);
        redis.expire(`images:${task.id}`, 60 * 60 * 24 * 30 * 3); // 90 days
    }

    // Expire after x amount of time
    // redis.expire(`images:${url.hostname}`, 10);
};

import { RedisClientType } from '.';
import { logger } from './logger';

export const processJob = async (redis: RedisClientType, task: string) => {
    logger.debug('processingJob', task);

    await new Promise<void>((accumulator) => {
        setTimeout(accumulator, 2000);
    });
};

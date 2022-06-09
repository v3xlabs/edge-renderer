import { ProceduralQueue } from 'ps-std';

import { RedisClientType } from '.';
import { logger } from './logger';
import { screenshot } from './screenshot';

export const queue = new ProceduralQueue(screenshot);

export const processJob = async (redis: RedisClientType, task: string) => {
    logger.debug('processingJob', task);

    await new Promise<void>((accumulator) => {
        setTimeout(accumulator, 2000);
    });
};

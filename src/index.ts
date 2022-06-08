import { createClient } from 'redis';

import { processJob } from './jobqueue';

const REDIS_QUEUE = 'edge_render_q';
const REDIS_WORKDER = 'edge_render_q_1';

const client = createClient({
    url: 'redis://localhost:6379',
});

await client.connect();

while (client.isOpen) {
    const current_task = await client.lIndex(REDIS_WORKDER, 0);

    console.log('current_task', current_task);

    if (current_task) {
        await processJob(current_task);
        await client.lRem(REDIS_WORKDER, -1, current_task);
    }

    const next_task = await client.brPopLPush(REDIS_QUEUE, REDIS_WORKDER, 0);

    console.log('next_task', current_task);

    await processJob(next_task);

    await client.lRem(REDIS_WORKDER, -1, next_task);
}

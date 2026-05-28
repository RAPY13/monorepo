import { createQueue, createWorker, createQueueEvents } from '@utils/queue';

const QUEUE_NAME = 'rapyard-jobs';

const queue = createQueue(QUEUE_NAME);
const worker = createWorker(QUEUE_NAME, async job => {
  console.log('Processing job', job.id, job.data);
});

const events = createQueueEvents(QUEUE_NAME);
events.on('completed', ({ jobId }) => console.log('Job completed', jobId));
events.on('failed', ({ jobId, failedReason }) => console.error('Job failed', jobId, failedReason));

console.log('RapYard Worker online');

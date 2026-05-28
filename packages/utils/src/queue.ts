import { Queue, Worker, QueueEvents } from 'bullmq';

const connection = {
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? 6379)
};

export const createQueue = (name: string) =>
  new Queue(name, { connection });

export const createWorker = (name: string, processor: any) =>
  new Worker(name, processor, { connection });

export const createQueueEvents = (name: string) =>
  new QueueEvents(name, { connection });

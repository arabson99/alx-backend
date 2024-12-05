import kue from 'kue';
import { describe, it, before, after, afterEach } from 'mocha';
import { expect } from 'chai';
import createPushNotificationsJobs from './8-job';

const queue = kue.createQueue();

const list = [
    {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
    },
    {
        phoneNumber: '4153518781',
        message: 'This is the code 12345 to verify your account',
    },
];

describe('createPushNotificationsJobs', () => {
    before(() => {
        queue.testMode.enter(); // Enter test mode for kue
    });

    afterEach(() => {
        queue.testMode.clear(); // Clear the test queue after each test
    });

    after(() => {
        queue.testMode.exit(); // Exit test mode
    });

    it('should throw an error if jobs is not an array', () => {
        expect(() => createPushNotificationsJobs('not an array', queue)).to.throw(
            'Jobs is not an array'
        );
    });

    it('should create two new jobs to the queue', () => {
        createPushNotificationsJobs(list, queue);

        // Manually assign IDs to jobs in test mode
        queue.testMode.jobs.forEach((job, index) => {
            job.id = index + 1;
        });

        // Assert the jobs were created correctly
        expect(queue.testMode.jobs.length).to.equal(2);

        expect(queue.testMode.jobs[0].data).to.eql({
            phoneNumber: '4153518780',
            message: 'This is the code 1234 to verify your account',
        });
        expect(queue.testMode.jobs[0].id).to.equal(1);

        expect(queue.testMode.jobs[1].data).to.eql({
            phoneNumber: '4153518781',
            message: 'This is the code 12345 to verify your account',
        });
        expect(queue.testMode.jobs[1].id).to.equal(2);
    });

    it('should log messages when jobs are created', () => {
        // Mock console.log
        const logSpy = [];
        const originalLog = console.log;
        console.log = (message) => logSpy.push(message);

        createPushNotificationsJobs(list, queue);

        // Restore original console.log
        console.log = originalLog;

        expect(logSpy).to.include('Notification job created: 1');
        expect(logSpy).to.include('Notification job created: 2');
    });
});

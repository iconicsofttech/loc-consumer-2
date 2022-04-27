
const Consumer = require('../consumer');
// require('../kafka/kafka-producer');

jest.mock('../database.js', () => {
    return {
        connectToServer: jest.fn((cb) => { return cb({}); }),
        getDb: jest.fn(() => { return {}; })
    };
});
jest.mock('../logger', () => {
    return {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
    };
});
jest.mock('../logger/prod-logger');
jest.mock('kafkajs');
jest.mock('../models/message');
jest.mock('mongoose');

describe('Test consumer.js', () => {
    let consumer = new Consumer();
    jest.spyOn(consumer, 'onConnect');
    jest.spyOn(consumer, 'onSubscribe');
    jest.spyOn(consumer, 'onRun');
    jest.spyOn(consumer, 'onError');
    jest.spyOn(consumer, 'consumerRun');
    test("check on connect", () => {
        consumer.onConnect('test');
        expect(consumer.onConnect).toHaveBeenCalledTimes(1);
    });
    test("check on subscribe", () => {
        consumer.onSubscribe();
        expect(consumer.onSubscribe).toHaveBeenCalledTimes(1);
    });
    test("check on running kafka", () => {
        consumer.onRun('Test', 'Test', { value: 'test', offset: 'test offset' });
        expect(consumer.onRun).toHaveBeenCalledTimes(1);
    });
    test("check on onError", () => {
        consumer.onError('Test', {});
        expect(consumer.onError).toHaveBeenCalledTimes(1);
    });
    test("check on consumerRun", () => {
        consumer.consumerRun();
        expect(consumer.consumerRun).toHaveBeenCalledTimes(1);

    });
});


const Consumer = require('../consumer');
jest.mock('kafkajs');

const { Kafka } = require('../__mock__/kafkajs');

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
jest.mock('../models/message');
jest.mock('mongoose');

describe('Test consumer.js', () => {
    let consumerObj = new Consumer();
    const kafkatest = new Kafka({
        brokers: 'broker',
        clientId: 'testclient'
    });
    consumerObj.consumer= kafkatest.consumer('mongo-app-nodejs');

    jest.spyOn(consumerObj, 'onConnect');
    jest.spyOn(consumerObj, 'onSubscribe');
    jest.spyOn(consumerObj, 'onRun');
    jest.spyOn(consumerObj, 'onError');
    jest.spyOn(consumerObj, 'consumerRun');
    test("check on connect", () => {
        consumerObj.onConnect('test');
        expect(consumerObj.onConnect).toHaveBeenCalledTimes(1);
    });

    test("check on subscribe", () => {
        consumerObj.onSubscribe();
        expect(consumerObj.onSubscribe).toHaveBeenCalledTimes(1);
    });
    test("check on running kafka", () => {
        consumerObj.onRun('Test', 'Test', { value: 'test', offset: 'test offset' });
        expect(consumerObj.onRun).toHaveBeenCalledTimes(1);
    });
    test("check on onError", () => {
        consumerObj.onError('Test', {});
        expect(consumerObj.onError).toHaveBeenCalledTimes(1);
    });
    test("check on consumerRun", () => {
        consumerObj.consumerRun();
        expect(consumerObj.consumerRun).toHaveBeenCalledTimes(1);

    });
});

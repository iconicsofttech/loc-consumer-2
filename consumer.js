const { Kafka } = require("kafkajs");
const dotenv = require("dotenv");
let mongoUtil = require('./database');
dotenv.config();

const config = {
  /// clientId: process.env.consumerClientId,
  brokers: process.env.KAFKA_BROKERS.split(","),
  // sasl: {
  //   mechanism: "SCRAM-SHA-256",
  //   username: process.env.KAFKA_SASL_USERNAME,
  //   password: process.env.KAFKA_SASL_PASSWORD,
  // },
};
// const consumer = kafka.consumer({
//   groupId: process.env.KAFKA_CONSUMER_GROUP_LOCATION_SERVICE,
// });
const topic = process.env.KAFKA_TOPIC_LOCATION_SERVICE;
let logger;
let rider_location;
class Consumer {
  constructor() {
    this.connection = new Kafka(config);
    this.consumer = this.connection.consumer({
      groupId: process.env.KAFKA_CONSUMER_GROUP_LOCATION_SERVICE,
    });
    mongoUtil.connectToServer((err) => {
      if (err) console.log(err);
      // start the rest of your app here
      logger = require('./logger');
      rider_location = require("./models/message");
      const run = async () => {
        // consuming
        await this.consumerRun();
      };
      run().catch(err => { logger.error("Consumer connection error", { errorStack: err }); });
    });
  }
  consumerRun() {
    this.consumer.connect().then(
      (info) => {
        this.onConnect(info);
      },
      (err) => {
        logger.error("Consumer connection error", { errorStack: err });
      }
    );

    this.consumer.subscribe({ topic, fromBeginning: true }).then(() => {
      this.onSubscribe();
    });

    this.consumer.run({
      autoCommit: true,
      eachMessage: async ({ topic, partition, message }) => {
        this.onRun(topic, partition, message);
      },
    });
  }
  onConnect(info) {
    logger.info("Consumer connect", info);
  }
  onSubscribe() {
    logger.info("Consumer Subscribe");
  }
  onRun(topic, partition, message) {
    try {
      new rider_location({ message: message.value.toString() }).save((err) => {
        if (err) {
          logger.error("data insertion error", { errorStack: err });
        } else {
//           this.consumer.commitOffsets([
//             { topic, partition, offset: message.offset },
//           ]);
        }
      });
    }
    catch (error) {
      logger.error("data insertion error", { errorStack: error });
    }
  }
  onError(title, err) {
    logger.error(title, { errorStack: err });
  }
}
module.exports = Consumer;

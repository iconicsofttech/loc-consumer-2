const { Kafka } = require("kafkajs");
const dotenv = require("dotenv");
let mongoUtil = require('./database');
dotenv.config();

const config = {
  /// clientId: process.env.consumerClientId,
  brokers: process.env.KAFKA_BROKERS.split(","),
  sasl: {
    mechanism: "SCRAM-SHA-256",
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  },
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
      let getJsonMessage =this.formatMessage(message.value.toString());
      new rider_location(getJsonMessage).save((err) => {
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
  formatMessage(stringMessage){
    const arrayMessage=stringMessage.split("|");
    let jsonMessage={};
    if(arrayMessage.length>0){
      jsonMessage.message=stringMessage;
      jsonMessage.grab_id=arrayMessage[0];
      jsonMessage.device_imei=arrayMessage[1];
      jsonMessage.datetime=arrayMessage[2];
      jsonMessage.lat=arrayMessage[3];
      jsonMessage.lon=arrayMessage[4];
      jsonMessage.speed=arrayMessage[5];
      jsonMessage.alt=arrayMessage[6];
      jsonMessage.gps_status=arrayMessage[7];
      jsonMessage.battery=arrayMessage[8];
      jsonMessage.provider=arrayMessage[9];
      jsonMessage.realtime_nanos=arrayMessage[10];
      jsonMessage.bearing=arrayMessage[11];
      jsonMessage.accuracy=arrayMessage[12];
      jsonMessage.appversion=arrayMessage[13];
      jsonMessage.timestamp=arrayMessage[14];
      jsonMessage.sid=arrayMessage[15];
      }
      return jsonMessage;
    }

  
}
module.exports = Consumer;

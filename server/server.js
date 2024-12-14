const express = require('express');
const path = require('path');
const rti = require('rticonnextdds-connector');
const app = express();
const bodyParser = require('body-parser');
const configFile = path.join(__dirname, 'QSystem.xml');

app.use(bodyParser.json());

let data = [];
const connector2 = new rti.Connector('KitchenScreenDomainParticipantLibrary::MyPubParticipant', configFile);
const output2 = connector2.getOutput('MyPublisher::MySquareWriter');

const run = async () => {
  const connector = new rti.Connector('KitchenScreenDomainParticipantLibrary::MySubParticipant', configFile);
  const input = connector.getInput('MySubscriber::MySquareReader');
  try {
    console.log('Waiting for publications...');
    await input.waitForPublications();

    console.log('Waiting for data...');
    while (true) { // This will run indefinitely
      await input.wait();
      input.take();
      for (const sample of input.samples.validDataIter) {
        const jsonData = sample.getJson();
        console.log('Received data: ' + JSON.stringify(jsonData));
        data.push({
          fromDevice: jsonData.fromDevice,
          toDevice: jsonData.toDevice,
          orderNum: jsonData.orderNum,
        });
      }
    }
  } catch (err) {
    console.log('Error encountered: ' + err);
  } finally {
    connector.close();
  }
};

app.get('/api', (req, res) => {
  res.json(data);
  data.length = 0; // Clear the data array after sending it
});

app.post('/write', async (req, res) => {
  const { fromDevice, toDevice, orderNum } = req.body;
  console.log(req.body);



  try {
    // console.log('Waiting for subscriptions...');
    // const waitTime = 5000; // Timeout in milliseconds
    // const hasSubscriptions = await output.waitForSubscriptions(waitTime);

    // if (!hasSubscriptions) {
    //   throw new Error('No subscriptions found');
    // }

    console.log('Writing...');
    output2.instance.setString('fromDevice', fromDevice);
    output2.instance.setString('toDevice', toDevice);
    output2.instance.setNumber('orderNum', orderNum);
    output2.write();

    res.status(200).send('Data written successfully');
  } catch (err) {
    console.error('Error encountered:', err);
    res.status(500).send('Failed to write data: ' + err.message);
  }
});

app.listen(5001, async () => {
  console.log("Server started on port 5001");
  await run();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing connector');
  connector.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing connector');
  connector.close();
  process.exit(0);
});
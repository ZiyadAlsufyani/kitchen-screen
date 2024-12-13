const express = require('express');
const path = require('path');
const rti = require('rticonnextdds-connector');
const app = express();
const bodyParser = require('body-parser');
const configFile = path.join(__dirname, 'QSystem.xml');

app.use(bodyParser.json());

const data = []; // Moved outside the function to ensure it is accessible

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

// Define the API route outside the run function
app.get('/api', (req, res) => {
  res.json(data);
  data.length = 0; // Clear the data array after sending it
});

app.post('/write', async (req, res) => {
  const { fromDevice, toDevice, orderNum } = req.body;
  console.log(req.body);

  const connector = new rti.Connector('KitchenScreenDomainParticipantLibrary::MyPubParticipant', configFile);
  const output = connector.getOutput('MyPublisher::MySquareWriter');

  try {
    console.log('Waiting for subscriptions...');
    const waitTime = 5000; // Timeout in milliseconds
    const hasSubscriptions = await output.waitForSubscriptions(waitTime);

    if (!hasSubscriptions) {
      throw new Error('No subscriptions found');
    }

    console.log('Writing...');
    output.instance.setString('fromDevice', fromDevice);
    output.instance.setString('toDevice', toDevice);
    output.instance.setNumber('orderNum', orderNum);
    output.write();

    res.status(200).send('Data written successfully');
  } catch (err) {
    console.error('Error encountered:', err);
    res.status(500).send('Failed to write data: ' + err.message);
  } finally {
    connector.close();
  }
});

app.listen(5001, async () => {
  console.log("Server started on port 5001");
  await run();
});
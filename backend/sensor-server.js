const express = require('express');
const { SerialPort, ReadlineParser } = require('serialport');
const cors = require('cors');

const app = express();
const PORT = 5700;

app.use(cors());

const port = new SerialPort({
  path: 'COM7',          // <-- change to your Arduino port
  baudRate: 115200
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

let latestData = { heart: 0, temp: 0 };

parser.on('data', line => {
  try {
    const json = JSON.parse(line);
    latestData = json;
  } catch (err) {
    console.error('Bad JSON:', line);
  }
});

app.get('/api/sensor', (req, res) => {
  res.json(latestData);
});

app.listen(PORT, () => console.log(`Sensor server running on ${PORT}`));

// src/utils/generateSensorPoint.js
export default function generateSensorPoint() {
  return {
    time: new Date().toLocaleTimeString(),
    value: Math.floor(Math.random() * 100) + 50 // random “sensor value”
  };
}

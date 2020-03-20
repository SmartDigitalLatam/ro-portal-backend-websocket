// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const path = require("path");
// const EventHubReader = require("../scripts/event-hub-reader");
// const port = process.env.PORT || 4001
// // const ip = process.env.IP || "172.19.112.1"
// // const ip = "10.170.2.85";
// // const port = "4001";

// // Strings de conexão com o IOTHUB
// const iotHubConnectionString = "HostName=HubOR.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=d5/5QXY1fciq7SvnKn+mkE6rflCtl5LloXeEVHQSVKk="
// // "HostName=OsmoseReversa2.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=1f/8ziUOkzF0HA81WpWm090g4qImrJ+Ab+irCbzwP+4=";
// // const iotHubConnectionString = "HostName=OsmoseReversa.azure-devices.net;DeviceId=raspiPLC;SharedAccessKey=JSLpa4odQD6/OL0eNo747yBFbbS4QpJvl3pUYcr9NEI=";
// // const eventHubConsumerGroup = "Vonhemier";
// const eventHubConsumerGroup = "buckman";

// // Utilização de uma pasta public para renderizar css e js personalizados
// const app = express();
// app.use(express.static(path.join(__dirname, "public")));
// app.use((req, res /* , next */ ) => {
//   res.redirect("/");
// });

// // Criando servidor HTTP e WebSocket
// const server = http.createServer(app);
// const wss = new WebSocket.Server({
//   server
// });

// wss.broadcast = data => {
//   wss.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       try {
//         console.log(data);
//         client.send(data);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   });
// };

// // Rodando servidor  red flag
// server.listen(process.env.PORT || port, () => {
//   console.log(
//     `Servidor rodando na porta ${server.address().port} no ip: ${server.address().address}`,
//   );
// });

// // Criando objeto da Azure event hub reader
// const eventHubReader = new EventHubReader(
//   iotHubConnectionString,
//   eventHubConsumerGroup
// );

// (async () => {
//   await eventHubReader.startReadMessage((message, date, deviceId) => {
//     try {
//       const payload = {
//         IotData: message,
//         MessageDate: date || Date.now().toISOString(),
//         DeviceId: deviceId
//       };

//       wss.broadcast(JSON.stringify(payload));
//     } catch (err) {
//       console.error("Error broadcasting: [%s] from [%s].", err, message);
//     }
//   });
// })().catch();

const express = require("express");
const WebSocket = require("ws");
const PORT = process.env.PORT || 3001;
const INDEX = "./index.html";

const EventHubReader = require("./event-hub-reader");

//String generated  in azure shell with code --> az iot hub show-connection-string --name {YourIoTHubName} --policy-name service --output table
const iotHubConnectionString =
  "HostName=HubOR.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=d5/5QXY1fciq7SvnKn+mkE6rflCtl5LloXeEVHQSVKk=";
const eventHubConsumerGroup = "buckman";

const server = express()
  .use((req, res) =>
    res.sendFile(INDEX, {
      root: __dirname
    })
  )
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new WebSocket.Server({
  server  
});

wss.on("connection", ws => {
  console.log("Client Connected");
  ws.on("close", () => console.log("Client desconnected"));
});

wss.onerror = function(event) {
  console.log("WebSocket error observed:", event);
};

wss.broadcast = data => {
  wss.clients.forEach(client => {
    client.send(data);
    console.log(data);
  });
};
const eventHubReader = new EventHubReader(
  iotHubConnectionString,
  eventHubConsumerGroup
);

(async () => {
  await eventHubReader.startReadMessage((message, date, deviceId) => {
    try {
      const payload = {
        IotData: message,
        MessageDate: date || Date.now().toISOString(),
        DeviceId: deviceId
      };

      wss.broadcast(JSON.stringify(payload));
    } catch (err) {
      console.error("Error broadcasting: [%s] from [%s].", err, message);
    }
  });
})().catch();

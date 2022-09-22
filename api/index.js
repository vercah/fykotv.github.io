const NodeRestServer = require('node-rest-server');
fs = require('fs');

messageList = {};
idCounter = 0;

fs.readFile('data.json', 'utf8' , (err, data) => {
    if (err) {
      return
    }
    messageList = JSON.parse(data);
    idCounter = Math.max(...Object.keys(messageList), -1) + 1;
  });

const routeConfig = {
	'/messages': {
		method: 'GET',
		status: 200,
		controller: () => messageList,
	},
    '/delete': {
        method: 'DELETE',
        status: 200,
        controller: (data) => {
            delete messageList[data.queryParams.id];
            fs.writeFile('data.json', JSON.stringify(messageList), () => {});
        }
    },
    '/add': {
        method: 'POST',
        status: 200,
        controller: (data) => {
            messageList[idCounter++] = data.queryParams.message;
            fs.writeFile('data.json', JSON.stringify(messageList), () => {});
        }
    }
};

NodeRestServer(routeConfig);
var net = require('net');
 
var clientsList = [];

function clean(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm,"");
}

function receiveData(data, sender) {
	var cleanedData = clean(data);
	if(cleanedData === "exit") {
		socket.end('Goodbye!\n');
	}
	else {
		/*for(var i = 0; i<clientsList.length; i++) {
			if (clientsList[i].socketAd !== socket) {
				clientsList[i].socketAd.write(sender.cname +": "+data);
			}
		}*/
		for(var i = 0; i<clientsList.length; i++) {
			if (clientsList[i].socketAd !== sender.socketAd) {
				clientsList[i].socketAd.write(sender.cname +": "+data);
			}
		}
	}
}
function removeClient(socket) {
	for(var i = 0; i<clientsList.length; i++) {
		if (clientsList[i].socketAd == socket){
		 console.log("Removing Client "+i+" "+clientsList[i].name);
		 clientsList.splice(i, 1);
		}
	}
}

function checkName(name){
	for(var i = 0; i<clientsList.length; i++) {
		if (clientsList[i].cname == clean(name)){
		 return 0;
		}
	}
	return 1;
}

function getClient(socket){
for(var i = 0; i<clientsList.length; i++) {
	if (clientsList[i].socketAd == socket) {
		return clientsList[i];
	}
}
}
 
function newClientSocket(socket) {
	//clientsList.push(socket);
	var client={socketAd: socket, cname: "", channel: [] };
	socket.write('Welcome to ChatWithMe server!\n');
	var expectingName=true;
	socket.write('Login name?\n');
	socket.on('data', function(data) {
		if(expectingName){
			if(checkName(data)==1){
			socket.write('Welcome '+data);
			client.cname=clean(data);
			expectingName =false;
			clientsList.push(client);
			}
			else
				socket.write('Enter other name please, its already taken\n') ;
		}
		else{
			var sender=getClient(socket);
			receiveData(data, sender);
		}
		
	})
	socket.on('end', function() {
		removeClient(socket);
	})
}
 
var server = net.createServer(newClientSocket);
server.listen(8888);
console.log("Server listening on port 8888");
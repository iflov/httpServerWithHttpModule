const http = require('http'); // (1)
const server = http.createServer();

const users = [ // (2)
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
]

const posts = [
    {
      id: 1,
      title: "간단한 HTTP API 개발 시작!",
      content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
      userId: 1,
    },
    {
      id: 2,
      title: "HTTP의 특성",
      content: "Request/Response와 Stateless!!",
      userId: 1,
    },
  ];

const httpRequestListener = function (request, response) {
  const { url, method } = request
	if (method === 'GET') {
		if (url === '/ping') {
			response.writeHead(200, {'Content-Type' : 'application/json'});
			response.end(JSON.stringify({message : 'pong'}));
		}
	} else if (method === 'POST') { // (3)
		if (url === '/users/signup') {
			let body = ''; // (4)
			request.on('data', (data) => {body += data;}) // (5)
			
			// stream을 전부 받아온 이후에 실행
			request.on('end', () => {  // (6)
				const user = JSON.parse(body); //(7) 

				users.push({ // (8)
					id : user.id,
					name : user.name,
					email: user.email,
					password : user.password
				})
			response.writeHead(200, {'Content-Type' : 'application/json'});
				response.end(JSON.stringify({"message" : users})); // (9)
			})
    }
    if(url === '/users/post'){
      let body = '';
      request.on('data', (data) => {
        body = body + data;
      })

      request.on('end' , () => {
        const user = JSON.parse(body);
        
        posts.push({
          id: user.id,
          title: user.title,
          content: user.content,
          userId : user.userId
        });
      
      response.writeHead(200, {'Content-Type' : 'application/json'});
				response.end(JSON.stringify({"post" : posts})); // (9)
      })
    }
  }
};

server.on("request", httpRequestListener);

server.listen(8000, '127.0.0.1', function() { 
    console.log('Listening to requests on port 8000');
});
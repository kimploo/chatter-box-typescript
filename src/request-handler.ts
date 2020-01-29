import http = require('http');

const defaultCorsHeaders = {
  'Content-Type': 'application/json', // "application/json"?
  // 응답 헤더에 응답하는 컨텐츠의 자료 타입을 헤더에 기록 합니다.
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
};

/** ***********************************************************
request handler 함수를 여기서 작성합니다.
reuqestHandler 함수는 이미 basic-server.js 파일에서 사용 했지만, 아직 작동하지 않습니다.
requestHandler 함수를 export 하여 basic-server.js 에서 사용 할 수 있게 하세요
************************************************************* */

const resultsArray = {
  results: [] as object[],
};

function requestHandler(request: http.IncomingMessage, response: http.ServerResponse): void {
  // node server 의 requestHandler는 항상 request, response를 인자로 받습니다.

  // 또한 http 요청은 항상 요청과 응답이 동반 되어야 합니다.
  //
  // 이것들은 요청에 대한 정보를 담고 있습니다. 예를들면, 요청 url과 method 등을 담고 있습니다.
  //
  // 기본적인 로그를 작성 하세요
  //
  // 간단한 로그를 작성 하는 것은, 서버를 디버깅 하는데 매우 수월하게 해줍니다.
  // 아래는 모든 리퀘스트의 메소드와 url을 로깅 해줍니다.
  console.log(`Serving request type ${request.method} for url ${request.url}`);

  // 응답을 위한 status 코드입니다.

  // 기본 CORS 설정이 되어있는 코드 입니다. 아래에 있습니다.
  // CORS에 대해서는 조금더 알아보세요.
  // 응답 헤더에 응답하는 컨텐츠의 자료 타입을 헤더에 기록 합니다.

  // .writeHead() 메소드는 응답 헤더에 해당 key, value 를 적어줍니다.
  // response.writeHead(statusCode, headers);

  // .writeHead() 메소드는 응답 헤더에 해당 key, value 를 적어줍니다.
  if (request.method === 'OPTIONS') {
    response.writeHead(204, defaultCorsHeaders);
    // why 204?
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
    response.end();
  } else if (request.method === 'GET') {
    if (request.url === '/classes/messages') {
      response.writeHead(200, defaultCorsHeaders);
      const data: string = JSON.stringify(resultsArray.results);
      response.end(data);
    } else {
      response.writeHead(404, defaultCorsHeaders);
      response.end();
    }
    response.end('Hello, World!');
  } else if (request.method === 'POST') {
    if (request.url === '/classes/messages') {
      let body = '';
      response.writeHead(201, defaultCorsHeaders);
      request
        .on('data', chunk => {
          body += chunk;
        })
        .on('end', () => {
          const data: object = JSON.parse(body);
          resultsArray.results.push(data);
          // ts(2345) Argument of type 'string' is not assignable to parameter of type 'never'. Without defining the array type, it by default will be never.
          // https://stackoverflow.com/questions/52423842/what-is-not-assignable-to-parameter-of-type-never-error-in-typescript
          response.end(JSON.stringify(data));
        });
    } else {
      response.writeHead(404, defaultCorsHeaders);
      response.end();
    }
  } else {
    response.writeHead(404, defaultCorsHeaders);
    response.end('server is listening but nothing happened :(');
  }

  // 노드 서버에 대한 모든 요청은 응답이 있어야 합니다. response.end 메소드는 요청에 대한 응답을 보내줍니다.
}

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

export = requestHandler;

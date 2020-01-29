/* eslint-disable func-names */
import request = require('supertest');
require('jest');

import app = require('../basic-server');

describe('server', function() {
  test('should respond to GET requests for /classes/messages with a 200 status code', async function(done) {
    const res = await request(app).get('/classes/messages');
    expect(res.status).toEqual(200);
    done();
  });
  test('should send back parsable stringified JSON', async function(done) {
    const res = await request(app).get('/classes/messages');
    const isParsable = function(string: string): boolean {
      try {
        JSON.parse(string);
        return true;
      } catch (e) {
        return false;
      }
    };
    expect(isParsable(res.text)).toEqual(true);
    done();
  });
  test('should send back an object', async function(done) {
    const res = await request(app).get('/classes/messages');
    const parsedBody = JSON.parse(res.text);
    expect(typeof parsedBody).toEqual('object');
    done();
  });
  test('should send an object containing a `results` array', async function(done) {
    const res = await request(app).get('/classes/messages');
    const parsedBody = JSON.parse(res.text);
    expect(typeof parsedBody).toEqual('object');
    expect(Array.isArray(parsedBody.results)).toEqual(true);
    done();
  });
  test('should accept POST requests to /classes/messages', async function(done) {
    const res = await request(app)
      .post('/classes/messages')
      .send({
        username: 'Jono',
        text: 'Do my bidding!'
      });
    expect(res.status).toEqual(201);
    done();
  });
  test('should response with messages that were previously posted', async function(done) {
    await request(app)
      .post('/classes/messages')
      .send({
        username: 'Jono',
        text: 'Do my bidding!'
      });
    const res = await request(app).get('/classes/messages');
    const messages = JSON.parse(res.text).results;
    expect(messages[0].username).toEqual('Jono');
    expect(messages[0].text).toEqual('Do my bidding!');
    done();
  });
  test('Should 404 when asked for a nonexistent endpoint', async function(done) {
    const res = await request(app).get('/codestates');
    expect(res.status).toEqual(404);
    done();
  });
});

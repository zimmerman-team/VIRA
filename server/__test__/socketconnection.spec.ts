// socketconnection.spec.ts

require('dotenv').config();
import { connect } from 'socket.io-client';
let socket: SocketIOClient.Socket;

/**
 * Run before each test
 */
beforeEach(done => {
  // Setup
  // Do not hardcode server port and address, square brackets are used for IPv6
  socket = connect(process.env.REACT_APP_BACKEND_URL, {
    reconnectionDelay: 0,
    forceNew: true,
    transports: ['websocket'],
  });
  socket.on('connect', () => {
    done();
  });
});

/**
 * Run after each test
 */
afterEach(done => {
  // Cleanup
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});

describe('Testing socket connection', () => {
  test('tests socket connection', done => {
    socket.emit('testConnection', {}, res => {
      expect(res).toEqual('success');
      done();
    });
  });
});

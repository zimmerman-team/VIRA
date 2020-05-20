// projects.spec.ts

require('dotenv').config();
import io from 'socket.io-client';
let socket: SocketIOClient.Socket;

/**
 * Run before each test
 */
beforeEach(done => {
  // Setup
  // Do not hardcode server port and address, square brackets are used for IPv6
  socket = io.connect(process.env.REACT_APP_BACKEND_URL, {
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

describe('Testing project categories API', () => {
  test('tests fetching all project categories from mongodb', done => {
    socket.emit('allProjectCategory', {}, (res: any) => {
      expect(res.length).toBeGreaterThan(0);
      done();
    });
  });
});

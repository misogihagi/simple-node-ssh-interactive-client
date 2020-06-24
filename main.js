const keypress = require('keypress');
keypress(process.stdin);
const stream = require('stream');
const writable = new stream.Writable({
  write: (chunk, encoding, next) => {
    next();
  }
});
const Client = require('ssh2').Client;
const readline = require('readline')
const conn = new Client();
conn.on('ready', function () {
  console.log('Client :: ready');
  conn.shell(function (err, stream) {
    if (err) throw err;
    stream.on('close', function () {
      process.stdout.write('Connection closed.')
      console.log('Stream :: close');
      conn.end();
    }).on('data', function (data) {
      process.stdin.pause()
      process.stdout.write(data)
      process.stdin.resume()
    }).stderr.on('data', function (data) {
      process.stderr.write(data);
    });
    process.stdin.on('keypress', function (ch, key) {
      stream.write(key.sequence)
      if (key && key.ctrl && key.name == 'c') {
        console.log('got "keypress"', key);
        process.stdin.pause();
        process.stdout.write('Connection closed.')
        conn.end();
      }
    });
  });
}).connect({
  host: '192.168.1.1',
  port: 22,
  username: 'admin',
  password: 'admin'
});
process.stdin.setRawMode(true);
process.stdin.resume();
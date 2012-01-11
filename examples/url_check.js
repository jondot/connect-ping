var connect = require('connect')
var ping = require('../index.js')


connect.createServer(
  connect.logger(),
  ping({
    ok_text: 'awesome',
    check_url: 'http://google.com',
    ok_regex: /bingo/,
    version: "2.0"
  })
).listen(4000);



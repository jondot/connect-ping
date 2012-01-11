var connect = require('connect')
var ping = require('../index.js')


connect.createServer(
  connect.logger(),
  ping({
    ok_text: 'awesome',
    check: function(){
      return false;
    }
  })
).listen(4000);


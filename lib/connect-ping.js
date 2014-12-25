request = require('request');



no_cache = {
  "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
  "Pragma" : "no-cache",
  "Expires" : "Tue, 8 Sep 1981 08:42:00 UTC"
}

function merge(to_a, from_b) {
  for (var i in from_b) {
    to_a[i] = from_b[i];
  }
  return to_a;
}

module.exports = function ping(options){
    options = options || {};
    options.version = options.version || "0";
    options.hostname = options.hostname || "";
    options.code_version = options.code_version || "";
    options.ok_text = options.ok_text || "ok";
    options.ok_code = options.ok_code || 200;
    options.error_text    = options.error_text || 'error';
    options.error_code    = options.error_code || 500;
    options.timeout_secs  = options.timeout_secs || 5;

    no_cache = merge({
      'Content-Type' : 'text/plain',
      'x-ping-hostname': options.hostname,
      'x-ping-code-version': options.code_version,
      'x-ping-version' : options.version
    }, no_cache)

    function ok(res){
      res.writeHead(options.ok_code, no_cache);
      res.end(options.ok_text);
    }

    function error(res, reason){
      res.writeHead(options.error_code, merge({'x-ping-error' : reason}, no_cache));
      res.end(options.error_text);
    }

    return function ping(req, res, next){
      if(options.check){
        try{
          return options.check(function(checkresult){
            checkresult ? ok(res) : error(res, "logic")
          });
        }
        catch(err){
          return error(res, "logic: " + err.description);
        }
      }

      else if(options.check_url && options.ok_regex){
        request(options.check_url, function (err, response, body) {
          if (!err && body && body.match(options.ok_regex)) {
            return ok(res);
          }
          else{
            return error(res, err || "regex");
          }
        });
      }
      else{
        return ok(res);
      }
    }
};



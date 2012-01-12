var ping = require("../index");
var connect = require('connect');
var request = require('./support/http');



function get_app(){
  get_app({});
}

function get_app(opts){
  var app = connect.createServer();
  app.use(ping(opts));
  return app;
}

function should_bust_cache(res){
  res.headers['content-type'].should.equal('text/html');
  res.headers['cache-control'].should.equal('no-cache, no-store, max-age=0, must-revalidate');
  res.headers['pragma'].should.equal('no-cache');
  res.headers['expires'].should.equal('Tue, 8 Sep 1981 08:42:00 UTC');
}

describe('Connect', function(){
  describe('ping', function(){

    it('should have sane ok defaults', function(done){
      var app = get_app();
      request(app)
        .get('/')
        .end(function(res){
          res.body.should.equal('ok');
          res.headers['content-type'].should.equal('text/html');
          res.headers['x-app-version'].should.equal('0');
          res.statusCode.should.equal(200);
          should_bust_cache(res);
          done();
        });
    });

    it('should have sane error defaults', function(done){
      var app = get_app({
        check: function(){return false;}
      });
      request(app)
        .get('/')
        .end(function(res){
          res.body.should.equal('error');
          res.headers['content-type'].should.equal('text/html');
          res.headers['x-app-version'].should.equal('0');
          res.statusCode.should.equal(500);
          should_bust_cache(res);
          done();
        });
    });
   
    it('should pick up application version', function(done){
      var app = get_app({ version: "1.0.0"});
      request(app)
        .get('/')
        .end(function(res){
          res.headers['x-app-version'].should.equal('1.0.0');
          should_bust_cache(res);
          done();
        });
    });

    it('should check code when available', function(done){
      var app = get_app({
        check: function(){return false;}
      });
      request(app)
        .get('/')
        .end(function(res){
          res.headers['x-ping-error'].should.equal('logic');
          done();
        });
    });

    it('should catch when check throws', function(done){
      var app = get_app({
        check: function(){ throw new RuntimeError();}
      });
      request(app)
        .get('/')
        .end(function(res){
          res.headers['x-ping-error'].should.equal('logic: undefined');
          done();
        });
    });

    it('should fetch url content and run regex on it when available', function(done){
      var app = get_app({
        check_url: "http://www.iana.org/domains/example/",
        ok_regex: /Example/,
        ok_text: 'groovy'
      });
      request(app)
        .get('/')
        .end(function(res){
          res.statusCode.should.equal(200);
          res.body.should.equal('groovy');
          done();
        });
    });
  
    it('should fetch failing url content and run regex on it when available', function(done){
      var app = get_app({
        check_url: "http://www.iana.org/domains/example/",
        ok_regex: /Hell no!/,
        error_text: 'crap'
      });
      request(app)
        .get('/')
        .end(function(res){
          res.statusCode.should.equal(500);
          res.body.should.equal('crap');
          done();
        });
    }); 

    it('should return ok when all is good', function(done){
      var app = get_app();
      request(app)
        .get('/')
        .end(function(res){
          res.body.should.equal('ok');
          should_bust_cache(res);
          done();
        });
    });

    it('should bust cache', function(done){
      var app = get_app();
      request(app)
        .get('/')
        .end(function(res){
          should_bust_cache(res);
          done();
        });
    });

  })
})

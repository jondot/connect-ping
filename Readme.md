# Connect-Ping
A Connect middleware that should indicate the health of your service.


## Usage
Here is a simple example (see `examples`)

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


## Options

When building/mounting your middlewares, you might want to use the
configuration:

* `version` is an accessor for your application version. A global
  version variable might be a good idea.
* `check_url` is a url that `ping` will fetch and run `ok_regex` on. If
  the match is ok, we're good. You must specify `check_url` and
`ok_regex` togather. `timeout_secs` is the amount of seconds we wait
until spitting out an error.
* `check` will accept a function to run. This is a good alternative to
  `check_url`: run a couple of sanity checks to indicate you're good.
* `ok_code`, `error_code`, `ok_text`, `error_text` are configuration for
  you to use, to configure against LB quirks. The default config should
work against ELBs (Amazon elastic LB).

## Headers

`ping` will output intelligent headers. First `x-ping-error` will try to
explain why ping failed.  

Next, `x-app-version` will expose the current deployed version of your
app. This is good in order to validate nothing crawled up to production,
as well as validation for post-production deployment.  

`ping` will bust any browser/client cache for you.


## Contributing

Fork, implement, add tests, pull request, get my everlasting thanks and a respectable place here :).


## Copyright

Copyright (c) 2011 [Dotan Nahum](http://gplus.to/dotan) [@jondot](http://twitter.com/jondot). See MIT-LICENSE for further details.




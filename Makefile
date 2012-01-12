TESTS = spec/*.js
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should --reporter $(REPORTER)\
		$(TESTS)
watchtest:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should --reporter $(REPORTER) -w\
		$(TESTS)


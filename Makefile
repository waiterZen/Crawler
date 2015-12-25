MOCHA ?= ./node_modules/.bin/mocha
NODE_TEST_CONFIG ?=./test/config

test:
	export NODE_CONFIG_DIR='$(NODE_TEST_CONFIG)'  && $(MOCHA)
.PHONY: test

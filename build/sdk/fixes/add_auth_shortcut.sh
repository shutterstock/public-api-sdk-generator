#!/usr/bin/env sh

lines=`wc -l < ./dist/src/index.js`
lines=$((lines-1))

sed -i "${lines}i\\  exports.setAccessToken = function(token) { exports.ApiClient.instance.authentications['customer_accessCode'].accessToken = token; };\\" dist/src/index.js

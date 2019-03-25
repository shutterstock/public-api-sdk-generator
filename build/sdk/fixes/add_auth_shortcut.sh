#!/usr/bin/env sh

lines=`wc -l < ./sdk/src/index.js`
lines=$((lines-1))

sed -i "${lines}i\\  exports.setAccessToken = function(token) { exports.ApiClient.instance.authentications['customer_accessCode'].accessToken = token; };\\" sdk/src/index.js

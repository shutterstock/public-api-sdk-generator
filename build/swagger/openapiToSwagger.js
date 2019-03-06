const { promisify } = require('util');
const { convert } = require('api-spec-converter');
const fs = require('fs');

const openapi = require('../../openapi');

const convertPromise = promisify(convert);

convertPromise({
  from: 'openapi_3',
  to: 'swagger_2',
  source: openapi,
}).then(({ spec }) => {
  fs.writeFileSync('swagger2.json', JSON.stringify(spec, null, 2))
});


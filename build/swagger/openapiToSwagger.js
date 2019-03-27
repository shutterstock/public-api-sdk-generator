const { promisify } = require('util');
const { convert } = require('api-spec-converter');
const fs = require('fs');
const _ = require('lodash');

const openapi = require('../../openapi');

const convertPromise = promisify(convert);

const languagesToInclude = ["javascript--nodejs"];
const endpointsToFilterOutRegex = /\/v2\/oauth\/.*/;
const schemasToFilter = ["OauthAccessTokenResponse", "AuthorizeResponse"];

_.mixin({
  filterEndpoints,
  filterSchemas,
  filterExamples,
});

async function filterEndpoints(specPromise, endpointsToFilterOutRegex) {
  const spec = await Promise.resolve(specPromise);
  if (endpointsToFilterOutRegex) {
    spec.paths = _.reduce(spec.paths, (acc, value, key, collection) => {
      if (!key.match(endpointsToFilterOutRegex)) {
        acc[key] = value;
      }
      return acc;
    }, {})
  }
  return spec;
}

async function filterSchemas(specPromise, schemasToFilter) {
  const spec = await Promise.resolve(specPromise);
  if (schemasToFilter) {
    spec.components.schemas = _.reduce(spec.components.schemas, (acc, value, key, collection) => {
      if (!schemasToFilter.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {})
  }
  return spec;
}

async function filterExamples(specPromise, languagesToInclude) {
  const spec = await Promise.resolve(specPromise);
  if (languagesToInclude) {
    return recursiveFilter(spec, languagesToInclude);
  } else {
    return spec;
  }
}

function recursiveFilter(specObject, languagesToInclude) {

  if (_.isArray(specObject)) {
    return specObject;
  }

  return(_.mapValues(specObject, (value, key, object) => {
    if (key === "x-code-samples") {
      return value.filter(lang => {
        return languagesToInclude.includes(lang.lang);
      });
    }
    if (!_.isObject(value)){
      return value;
    } else {
      return recursiveFilter(value, languagesToInclude);
    }
    
  }))
}

const filteredOpenapi = _.chain(openapi)
  .filterEndpoints(endpointsToFilterOutRegex)
  .filterSchemas(schemasToFilter)
  .filterExamples(languagesToInclude)
  .value();

filteredOpenapi.then(filteredOpenapiData => {
  convertPromise({
    from: 'openapi_3',
    to: 'swagger_2',
    source: filteredOpenapiData,
  })
  .then(({ spec }) => {
    fs.writeFileSync('swagger2.json', JSON.stringify(spec, null, 2))
  });
});


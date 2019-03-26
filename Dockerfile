FROM node:10 as swagger-build

RUN mkdir -p /opt/swagger-build/build/swagger

WORKDIR /opt/swagger-build

COPY build/swagger/openapiToSwagger.js ./build/swagger/openapiToSwagger.js
COPY package.json .
COPY openapi.json .

RUN yarn install

RUN node build/swagger/openapiToSwagger.js

######################################

FROM swaggerapi/swagger-codegen-cli as sdk-build

RUN mkdir -p /opt/node-sdk/dist

WORKDIR /opt/node-sdk

COPY --from=swagger-build /opt/swagger-build/swagger2.json .
COPY build/sdk/js/templates ./build/sdk/js/templates
COPY build/sdk/config.json .
COPY build/sdk/fixes/add_auth_shortcut.sh .

RUN java -jar /opt/swagger-codegen-cli/swagger-codegen-cli.jar generate -i ./swagger2.json -o ./dist -c ./config.json -l javascript -t ./build/sdk/js/templates

RUN ./add_auth_shortcut.sh

ENTRYPOINT ["/bin/sh"]

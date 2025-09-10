require('dotenv').config();

const { Client } = require('@elastic/elasticsearch');

const node = process.env.ES_NODE;

if (!node) {
  console.warn('Elasticsearch disabled: missing ES_NODE env. Set ES_NODE to enable search.');
  module.exports = null;
} else {
  const client = new Client({
    node,
    auth: process.env.ES_USERNAME && process.env.ES_PASSWORD ? {
      username: process.env.ES_USERNAME,
      password: process.env.ES_PASSWORD
    } : undefined,
    tls: process.env.ES_TLS_REJECT_UNAUTHORIZED === 'false' ? {
      rejectUnauthorized: false
    } : undefined
  });
  module.exports = client;
}



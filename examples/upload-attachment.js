const process = require('node:process');
const path = require('node:path');
const zd = require('../lib/client');
const exampleConfig = require('./exampleConfig');

const ATTACHMENT_PATH = path.resolve('./examples/busey.gif');
const FILENAME = 'busey.gif';

function getZendeskConfig() {
  return {
    username: process.env.ZENDESK_TEST_USERNAME || exampleConfig.auth.username,
    token: process.env.ZENDESK_TEST_TOKEN || exampleConfig.auth.token,
    remoteUri:
      process.env.ZENDESK_TEST_REMOTEURI || exampleConfig.auth.remoteUri,
  };
}

const client = zd.createClient(getZendeskConfig());

async function uploadAttachment(filePath, fileName) {
  try {
    const result = await client.attachments.upload(filePath, {
      filename: fileName,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(`Failed to upload attachment: ${error.message}`);
  }
}

uploadAttachment(ATTACHMENT_PATH, FILENAME);

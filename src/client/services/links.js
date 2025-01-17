// Links.js: Client for the zendesk services API.
const {Client} = require('../client');

class Links extends Client {
  constructor(options) {
    super(options);
    this.jsonAPINames = ['links'];
    this.sideLoadMap = [
      {field: 'ticket_id', name: 'ticket', dataset: 'tickets'},
    ];
  }

  // Listing Links
  async list() {
    this.getAll(['links']);
  }

  // Viewing Links
  async show(ticket_ids) {
    this.get(['links', '?ticket_id=' + ticket_ids.toString()]);
  }
}

exports.Links = Links;

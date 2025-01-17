// JobStatuses.js: Client for the zendesk API.
const {Client} = require('../client');
const {getJobStatuses} = require('../helpers');

/**
 * Represents the Job Statuses in Zendesk. A status record is created when somebody kicks off a job
 * such as updating multiple tickets.
 * @see {@link https://developer.zendesk.com/api-reference/ticketing/ticket-management/job_statuses/} for the API documentation.
 */
class JobStatuses extends Client {
  constructor(options) {
    super(options);
    this.jsonAPINames = ['jobstatuses'];
  }

  /**
   * Retrieves a list of job statuses.
   * @async
   * @returns {Promise<Array<Object>>} - A promise that resolves to a list of job statuses.
   * @throws {Error} If there's an error in the request.
   * @see {@link https://developer.zendesk.com/api-reference/ticketing/ticket-management/job_statuses/#list-job-statuses} for the API endpoint documentation.
   * @example
   * const jobStatusList = await client.jobstatuses.list();
   */
  async list() {
    return this.get('job_statuses');
  }

  /**
   * Retrieves the status of a background job.
   * @async
   * @param {string} jobStatusID - The ID of the Job status.
   * @returns {Promise<Object>} - A promise that resolves to the job status data.
   * @throws {Error} If the job status ID is not provided or if there's an error in the request.
   * @see {@link https://developer.zendesk.com/api-reference/ticketing/ticket-management/job_statuses/#show-job-status} for the API endpoint documentation.
   * @example
   * const jobStatus = await client.jobstatuses.show("dd9321f29967688b27bc9499ebb4ae8d");
   */
  async show(jobStatusID) {
    return this.get(['job_statuses', jobStatusID]);
  }

  /**
   * Retrieves the statuses of multiple background jobs.
   * @async
   * @param {Array<string>} jobStatusIDs - An array of job status IDs.
   * @returns {Promise<Array<Object>>} - A promise that resolves to a list of job statuses.
   * @throws {Error} If the job status IDs are not provided or if there's an error in the request.
   * @see {@link https://developer.zendesk.com/api-reference/ticketing/ticket-management/job_statuses/#show-many-job-statuses} for the API endpoint documentation.
   * @example
   * const jobStatuses = await client.jobstatuses.showMany(["dd9321f29967688b27bc9499ebb4ae8d", "82de0b044094f0c67893ac9fe64f1a99"]);
   */
  async showMany(jobStatusIDs) {
    if (!Array.isArray(jobStatusIDs) || jobStatusIDs.length === 0) {
      throw new Error('Expected jobStatusIDs to be a non-empty array.');
    }

    return this.get([
      'job_statuses',
      'show_many',
      {
        ids: jobStatusIDs.join(','),
      },
    ]);
  }

  /**
   * Monitors a specific job until it's completed, based on a provided interval and maximum number of attempts.
   * @async
   * @param {string} jobID - The ID of the job to watch.
   * @param {number} interval - The time (in milliseconds) to wait between each check.
   * @param {number} maxAttempts - The maximum number of attempts to check the job status.
   * @returns {Promise<void>} - A promise that resolves when the job is completed or the maximum attempts are reached.
   * @throws {Error} If there's an error in the request or if the maximum attempts are reached without the job completing.
   * @example
   * await client.jobstatuses.watch("dd9321f29967688b27bc9499ebb4ae8d", 1000, 5);
   */
  async watch(jobID, interval, maxAttempts) {
    getJobStatuses(this.options, jobID, interval, maxAttempts);
    try {
      const result = await getJobStatuses(
        this.options,
        jobID,
        interval,
        maxAttempts,
      );
      super.emit('debug::result', ('Job completed with result:', result));
    } catch (error) {
      super.emit('debug::result', ('Error watching job status:', error));
    }
  }
}

exports.JobStatuses = JobStatuses;

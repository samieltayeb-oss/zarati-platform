export interface FeedExecutionResult {
  recordsFetched: number;
  recordsValid: number;
  recordsInserted: number;
  recordsExisting: number;
  recordsRejected: number;
  recordsQuarantined: number;
  errorSummary?: string;
  sourceVersion?: string;
}

export abstract class ExternalFeedAdapter<T> {
  protected executionId: string;

  constructor(executionId: string) {
    this.executionId = executionId;
  }

  /**
   * Orchestrates the ingestion process.
   */
  async run(): Promise<FeedExecutionResult> {
    try {
      const rawData = await this.fetch();
      const version = this.deriveSourceVersion(rawData);
      const parsedRecords = await this.parse(rawData);
      
      let fetched = parsedRecords.length;
      let valid = 0;
      let inserted = 0;
      let existing = 0;
      let rejected = 0;
      let quarantined = 0;

      for (const record of parsedRecords) {
        try {
          const isValid = await this.validate(record);
          if (!isValid) {
            rejected++;
            continue;
          }
          valid++;

          const identity = this.deriveSourceIdentity(record);
          const stagedData = await this.stage(record, identity);
          
          if (stagedData.isDuplicate) {
            existing++;
          } else if (stagedData.isQuarantined) {
            quarantined++;
          } else {
            inserted++;
          }
        } catch (err) {
          rejected++;
          console.error(`Error processing record: ${err}`);
        }
      }

      return {
        recordsFetched: fetched,
        recordsValid: valid,
        recordsInserted: inserted,
        recordsExisting: existing,
        recordsRejected: rejected,
        recordsQuarantined: quarantined,
        sourceVersion: version,
      };
    } catch (error: any) {
      console.error(`Feed execution failed: ${error}`);
      throw error;
    }
  }

  protected abstract fetch(): Promise<unknown>;
  protected abstract deriveSourceVersion(rawData: any): string;
  protected abstract parse(rawData: any): Promise<T[]>;
  protected abstract validate(record: T): Promise<boolean>;
  protected abstract deriveSourceIdentity(record: T): string;
  protected abstract stage(record: T, identity: string): Promise<{ isDuplicate: boolean; isQuarantined: boolean }>;
}

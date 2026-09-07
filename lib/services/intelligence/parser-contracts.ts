import { RawObservationInput, IngestionContext, IngestionResult } from './interfaces';

/**
 * Contract for a parser that translates raw source data (e.g., CSV, JSON) 
 * into normalized RawObservationInput records for R4-A ingestion.
 */
export interface SourceDataParser {
  /**
   * The unique source identifier this parser handles (e.g., 'SRC_WFP_HDX')
   */
  readonly sourceCode: string;

  /**
   * Validates if the given payload matches the expected schema for this source.
   */
  validateSchema(payload: unknown): boolean;

  /**
   * Parses raw payload into structured ingestion inputs.
   * Throws an error if payload cannot be parsed.
   */
  parse(payload: unknown, context: IngestionContext): Promise<RawObservationInput[]>;
}

/**
 * Base contract for an ingestion job runner.
 */
export interface IngestionJob {
  /**
   * Execute the ingestion process for a specific dataset and payload.
   */
  execute(datasetId: string, payload: unknown, parser: SourceDataParser): Promise<IngestionResult>;
}

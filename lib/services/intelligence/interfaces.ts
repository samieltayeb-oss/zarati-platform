import { Database } from '@/types/database.types';

export type IngestionMethod = Database['public']['Enums']['ingestion_method_enum'];
export type TemporalClass = Database['public']['Enums']['temporal_class_enum'];
export type SourceProvenance = Database['public']['Enums']['source_provenance_enum'];
export type DerivationClass = Database['public']['Enums']['derivation_class_enum'];
export type VerificationState = Database['public']['Enums']['verification_state_enum'];
export type PublicationStatus = Database['public']['Enums']['publication_status_enum'];
export type PriceType = Database['public']['Enums']['price_type_enum'];

export interface IngestionContext {
  datasetId: string;
  sourceId: string;
  snapshotId: string;
  ingestedBy?: string;
}

export interface RawObservationInput {
  sourceRecordId?: string;
  sourceRecordRaw?: string;
  rawPriceText: string;
  rawCurrencyText: string;
  rawUnitText: string;
  priceType?: PriceType;
  observedAt: string; // ISO String
  sourceProvenance: SourceProvenance;
  ingestionMethod: IngestionMethod;
  temporalClass: TemporalClass;
  derivationClass: DerivationClass;
  commodityId: string;
  marketId: string;
}

export interface IngestionResult {
  success: boolean;
  recordsProcessed: number;
  recordsInserted: number;
  recordsQuarantined: number;
  errors: Array<{ recordId?: string; message: string }>;
}

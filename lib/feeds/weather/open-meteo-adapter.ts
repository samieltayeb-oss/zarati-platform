import { ExternalFeedAdapter, FeedExecutionResult } from '../ExternalFeedAdapter';
import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';

interface OpenMeteoRecord {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  latitude: number;
  longitude: number;
  temporalClass: string;
  isStale: boolean;
  staleAfterAt: string;
}

export class OpenMeteoAdapter extends ExternalFeedAdapter<OpenMeteoRecord> {
  private readonly latitude = 14.0323; // Default Gedaref/Sudan region for now
  private readonly longitude = 33.9859;

  protected async fetch(): Promise<unknown> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Open-Meteo data: ${response.statusText}`);
    }
    return await response.json();
  }

  protected deriveSourceVersion(rawData: any): string {
    return rawData.generationtime_ms ? rawData.generationtime_ms.toString() : crypto.randomUUID();
  }

  protected async parse(rawData: any): Promise<OpenMeteoRecord[]> {
    if (!rawData.current) return [];
    
    const current = rawData.current;
    
    const timeDate = new Date(current.time);
    const staleDate = new Date(timeDate);
    staleDate.setHours(staleDate.getHours() + 1); // Mark stale after 1 hour

    return [{
      time: current.time,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      windSpeed: current.wind_speed_10m,
      latitude: rawData.latitude,
      longitude: rawData.longitude,
      temporalClass: 'CURRENT_OBSERVED',
      isStale: false,
      staleAfterAt: staleDate.toISOString()
    }];
  }

  protected async validate(record: OpenMeteoRecord): Promise<boolean> {
    return !!(record.time && record.temperature !== undefined && record.latitude !== undefined && record.longitude !== undefined);
  }

  protected deriveSourceIdentity(record: OpenMeteoRecord): string {
    // Identity depends on provider, location, time, and class
    return `OPEN_METEO_${record.latitude}_${record.longitude}_${record.time}_${record.temporalClass}`;
  }

  protected async stage(record: OpenMeteoRecord, identity: string): Promise<{ isDuplicate: boolean; isQuarantined: boolean }> {
    const supabase = createAdminClient();

    const { data: existing } = await supabase.from('weather_observations')
      .select('id')
      .eq('provider', 'OPEN_METEO')
      .eq('source_record_key', identity)
      .single();

    if (existing) {
      return { isDuplicate: true, isQuarantined: false };
    }

    const { error } = await supabase.from('weather_observations').insert({
      provider: 'OPEN_METEO',
      provider_observation_time: record.time,
      latitude: record.latitude,
      longitude: record.longitude,
      temperature_celsius: record.temperature,
      precipitation_mm: record.precipitation,
      relative_humidity_percent: record.humidity,
      wind_speed_kmh: record.windSpeed,
      temporal_class: record.temporalClass,
      stale_after_at: record.staleAfterAt,
      source_record_key: identity,
      source_record_raw: record as any,
    });

    if (error) {
      console.error('Weather stage error:', error);
      return { isDuplicate: false, isQuarantined: true };
    }

    return { isDuplicate: false, isQuarantined: false };
  }
}

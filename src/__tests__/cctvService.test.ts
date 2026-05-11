/**
 * @file cctvService.test.ts
 * @description Unit tests for the CCTV Module service.
 * Verifies sector-based camera lookup, stream URL retrieval,
 * footage archive, and AI motion detection simulation.
 * Covers the CCTV Module requirements from the CSMS component diagram.
 */

import './__mocks__/firebaseMock';
import {
  getCctvFeedForSector,
  getPrimaryStreamUrl,
  getFootageArchive,
  runMotionDetection,
} from '../services/cctvService';

// ── getCctvFeedForSector ──────────────────────────────────────────────────────

describe('getCctvFeedForSector — sector camera lookup', () => {
  test('returns cameras for Gasabo district', async () => {
    const feeds = await getCctvFeedForSector('Gasabo');
    expect(feeds.length).toBeGreaterThan(0);
    feeds.forEach(cam => expect(cam.district).toBe('Gasabo'));
  });

  test('returns cameras for Nyarugenge district', async () => {
    const feeds = await getCctvFeedForSector('Nyarugenge');
    expect(feeds.length).toBeGreaterThan(0);
    feeds.forEach(cam => expect(cam.district).toBe('Nyarugenge'));
  });

  test('returns cameras for Kicukiro district', async () => {
    const feeds = await getCctvFeedForSector('Kicukiro');
    expect(feeds.length).toBeGreaterThan(0);
    feeds.forEach(cam => expect(cam.district).toBe('Kicukiro'));
  });

  test('each camera record has required fields', async () => {
    const feeds = await getCctvFeedForSector('Gasabo');
    feeds.forEach(cam => {
      expect(cam).toHaveProperty('unitId');
      expect(cam).toHaveProperty('location');
      expect(cam).toHaveProperty('streamUrl');
      expect(cam).toHaveProperty('online');
      expect(cam).toHaveProperty('retrievedAt');
      expect(cam).toHaveProperty('motionDetectionActive');
    });
  });

  test('retrievedAt is populated with ISO timestamp on retrieval', async () => {
    const feeds = await getCctvFeedForSector('Kicukiro');
    feeds.forEach(cam => {
      expect(cam.retrievedAt).toBeTruthy();
      expect(() => new Date(cam.retrievedAt)).not.toThrow();
    });
  });

  test('returns empty array for unknown district', async () => {
    const feeds = await getCctvFeedForSector('Unknown' as any);
    expect(feeds).toEqual([]);
  });
});

// ── getPrimaryStreamUrl ───────────────────────────────────────────────────────

describe('getPrimaryStreamUrl — primary RTSP stream', () => {
  test('returns an RTSP URL string for Gasabo (has online cameras)', async () => {
    const url = await getPrimaryStreamUrl('Gasabo');
    expect(url).not.toBeNull();
    expect(url).toMatch(/^rtsp:\/\//);
  });

  test('returns an RTSP URL string for Kicukiro (has online cameras)', async () => {
    const url = await getPrimaryStreamUrl('Kicukiro');
    expect(url).not.toBeNull();
    expect(url).toMatch(/^rtsp:\/\//);
  });

  test('returns null for unknown district with no cameras', async () => {
    const url = await getPrimaryStreamUrl('Unknown' as any);
    expect(url).toBeNull();
  });
});

// ── getFootageArchive ─────────────────────────────────────────────────────────

describe('getFootageArchive — footage archive retrieval', () => {
  test('returns archive clips for CAM-GSB-001', async () => {
    const clips = await getFootageArchive('CAM-GSB-001');
    expect(clips.length).toBeGreaterThan(0);
  });

  test('each clip has required archive fields', async () => {
    const clips = await getFootageArchive('CAM-NYR-001');
    clips.forEach(clip => {
      expect(clip).toHaveProperty('unitId');
      expect(clip).toHaveProperty('recordedAt');
      expect(clip).toHaveProperty('clipUrl');
      expect(clip).toHaveProperty('durationSeconds');
      expect(clip).toHaveProperty('motionDetected');
      expect(typeof clip.durationSeconds).toBe('number');
      expect(typeof clip.motionDetected).toBe('boolean');
    });
  });

  test('clip URLs follow RTSP archive pattern', async () => {
    const clips = await getFootageArchive('CAM-KIC-001');
    clips.forEach(clip => {
      expect(clip.clipUrl).toMatch(/^rtsp:\/\//);
      expect(clip.clipUrl).toContain('archive');
    });
  });

  test('returns empty array for unknown unit ID', async () => {
    const clips = await getFootageArchive('CAM-UNKNOWN-999');
    expect(clips).toEqual([]);
  });
});

// ── runMotionDetection ────────────────────────────────────────────────────────

describe('runMotionDetection — AI motion detection simulation', () => {
  test('returns an object with motionDetected boolean and confidence number', async () => {
    const result = await runMotionDetection('CAM-GSB-001');
    expect(typeof result.motionDetected).toBe('boolean');
    expect(typeof result.confidence).toBe('number');
  });

  test('confidence is between 0.7 and 1.0', async () => {
    const result = await runMotionDetection('CAM-KIC-001');
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
    expect(result.confidence).toBeLessThanOrEqual(1.0);
  });

  test('works for any unit ID string', async () => {
    const result = await runMotionDetection('CAM-NYR-002');
    expect(result).toHaveProperty('motionDetected');
    expect(result).toHaveProperty('confidence');
  });
});

import {District} from '../lib/firebase';

/**
 * Simulated CCTV footage record returned for a GPS sector.
 */
export interface CctvRecord {
  /** Unique camera unit identifier. */
  unitId: string;
  /** Human-readable camera location description. */
  location: string;
  /** Simulated RTSP stream URL for the sector. */
  streamUrl: string;
  /** District the camera covers. */
  district: District;
  /** Whether the camera is currently online. */
  online: boolean;
  /** Timestamp the footage was retrieved (ISO string). */
  retrievedAt: string;
  /** Whether AI motion detection is currently active on this unit. */
  motionDetectionActive: boolean;
}

/**
 * Simulated footage archive entry for a camera unit.
 */
export interface FootageArchiveEntry {
  /** Camera unit that captured the footage. */
  unitId: string;
  /** ISO timestamp when the clip was recorded. */
  recordedAt: string;
  /** Simulated archive clip URL. */
  clipUrl: string;
  /** Duration of the clip in seconds. */
  durationSeconds: number;
  /** Whether motion was detected in this clip. */
  motionDetected: boolean;
}

/**
 * CCTV sector map — maps each Kigali district to a set of
 * simulated camera units with placeholder RTSP stream URLs.
 * In production these are retrieved live from the RTSP gateway
 * managing 2,000+ physical cameras across Kigali.
 */
const SECTOR_CAMERA_MAP: Record<string, CctvRecord[]> = {
  Gasabo: [
    {
      unitId: 'CAM-GSB-001',
      location: 'Kimironko Market Junction',
      streamUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam001/live',
      district: 'Gasabo',
      online: true,
      retrievedAt: '',
      motionDetectionActive: true,
    },
    {
      unitId: 'CAM-GSB-002',
      location: 'Remera Bus Terminal',
      streamUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam002/live',
      district: 'Gasabo',
      online: true,
      retrievedAt: '',
      motionDetectionActive: false,
    },
  ],
  Nyarugenge: [
    {
      unitId: 'CAM-NYR-001',
      location: 'Nyabugogo Transport Hub',
      streamUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam001/live',
      district: 'Nyarugenge',
      online: true,
      retrievedAt: '',
      motionDetectionActive: true,
    },
    {
      unitId: 'CAM-NYR-002',
      location: 'City Centre — KN 3 Ave',
      streamUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam002/live',
      district: 'Nyarugenge',
      online: false,
      retrievedAt: '',
      motionDetectionActive: false,
    },
  ],
  Kicukiro: [
    {
      unitId: 'CAM-KIC-001',
      location: 'Gikondo Industrial Park Gate',
      streamUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam001/live',
      district: 'Kicukiro',
      online: true,
      retrievedAt: '',
      motionDetectionActive: true,
    },
    {
      unitId: 'CAM-KIC-002',
      location: 'Sonatubes Roundabout',
      streamUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam002/live',
      district: 'Kicukiro',
      online: true,
      retrievedAt: '',
      motionDetectionActive: false,
    },
  ],
};

/**
 * Simulated footage archive — 3 clips per camera unit.
 * In production this would query the RTSP gateway archive storage.
 */
const FOOTAGE_ARCHIVE: Record<string, FootageArchiveEntry[]> = {
  'CAM-GSB-001': [
    {unitId: 'CAM-GSB-001', recordedAt: '2026-04-10T08:15:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam001/archive/clip001', durationSeconds: 120, motionDetected: true},
    {unitId: 'CAM-GSB-001', recordedAt: '2026-04-10T14:30:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam001/archive/clip002', durationSeconds: 60, motionDetected: false},
    {unitId: 'CAM-GSB-001', recordedAt: '2026-04-11T09:00:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam001/archive/clip003', durationSeconds: 90, motionDetected: true},
  ],
  'CAM-GSB-002': [
    {unitId: 'CAM-GSB-002', recordedAt: '2026-04-10T07:45:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam002/archive/clip001', durationSeconds: 75, motionDetected: false},
    {unitId: 'CAM-GSB-002', recordedAt: '2026-04-10T16:00:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam002/archive/clip002', durationSeconds: 45, motionDetected: true},
    {unitId: 'CAM-GSB-002', recordedAt: '2026-04-11T11:20:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam002/archive/clip003', durationSeconds: 110, motionDetected: false},
  ],
  'CAM-NYR-001': [
    {unitId: 'CAM-NYR-001', recordedAt: '2026-04-10T06:30:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam001/archive/clip001', durationSeconds: 95, motionDetected: true},
    {unitId: 'CAM-NYR-001', recordedAt: '2026-04-10T13:15:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam001/archive/clip002', durationSeconds: 60, motionDetected: true},
    {unitId: 'CAM-NYR-001', recordedAt: '2026-04-11T08:45:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam001/archive/clip003', durationSeconds: 80, motionDetected: false},
  ],
  'CAM-NYR-002': [
    {unitId: 'CAM-NYR-002', recordedAt: '2026-04-09T10:00:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam002/archive/clip001', durationSeconds: 55, motionDetected: false},
    {unitId: 'CAM-NYR-002', recordedAt: '2026-04-09T18:30:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam002/archive/clip002', durationSeconds: 70, motionDetected: true},
    {unitId: 'CAM-NYR-002', recordedAt: '2026-04-10T12:00:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam002/archive/clip003', durationSeconds: 40, motionDetected: false},
  ],
  'CAM-KIC-001': [
    {unitId: 'CAM-KIC-001', recordedAt: '2026-04-10T07:00:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam001/archive/clip001', durationSeconds: 100, motionDetected: true},
    {unitId: 'CAM-KIC-001', recordedAt: '2026-04-10T15:45:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam001/archive/clip002', durationSeconds: 65, motionDetected: false},
    {unitId: 'CAM-KIC-001', recordedAt: '2026-04-11T10:30:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam001/archive/clip003', durationSeconds: 85, motionDetected: true},
  ],
  'CAM-KIC-002': [
    {unitId: 'CAM-KIC-002', recordedAt: '2026-04-10T09:30:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam002/archive/clip001', durationSeconds: 50, motionDetected: false},
    {unitId: 'CAM-KIC-002', recordedAt: '2026-04-10T17:00:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam002/archive/clip002', durationSeconds: 75, motionDetected: true},
    {unitId: 'CAM-KIC-002', recordedAt: '2026-04-11T13:00:00Z', clipUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam002/archive/clip003', durationSeconds: 90, motionDetected: false},
  ],
};

/**
 * Retrieve simulated CCTV footage records for a given GPS district/sector.
 * Mirrors the CCTV Module behaviour described in the CSMS architecture:
 * the system queries available cameras for the incident's GPS sector and
 * returns a stream URL for the nearest online unit.
 *
 * @param {District} district - The Kigali district to query cameras for.
 * @returns {Promise<CctvRecord[]>} List of CCTV records for the sector.
 */
export const getCctvFeedForSector = async (district: District): Promise<CctvRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const now = new Date().toISOString();
  const cameras = SECTOR_CAMERA_MAP[district] || [];

  console.log(
    `[CCTVModule] Querying sector "${district}" — ` +
    `${cameras.length} camera(s) found, ` +
    `${cameras.filter((c) => c.online).length} online.`,
  );

  return cameras.map((cam) => ({...cam, retrievedAt: now}));
};

/**
 * Retrieve the primary (first online) RTSP stream URL for a district sector.
 * Returns null if no online cameras exist for the sector.
 *
 * @param {District} district - The Kigali district to query.
 * @returns {Promise<string | null>} RTSP stream URL or null.
 */
export const getPrimaryStreamUrl = async (district: District): Promise<string | null> => {
  const feeds = await getCctvFeedForSector(district);
  const online = feeds.find((cam) => cam.online);

  if (online) {
    console.log(`[CCTVModule] Primary stream → ${online.unitId}: ${online.streamUrl}`);
    return online.streamUrl;
  }

  console.warn(`[CCTVModule] No online cameras found for sector "${district}".`);
  return null;
};

/**
 * Retrieve the simulated footage archive for a specific camera unit.
 * In production this queries the RTSP gateway archive storage.
 *
 * @param {string} unitId - The camera unit ID to retrieve archive clips for.
 * @returns {Promise<FootageArchiveEntry[]>} List of archived footage clips.
 */
export const getFootageArchive = async (unitId: string): Promise<FootageArchiveEntry[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const clips = FOOTAGE_ARCHIVE[unitId] || [];
  console.log(`[CCTVModule] Archive query → ${unitId}: ${clips.length} clip(s) found.`);
  return clips;
};

/**
 * Simulate AI motion detection analysis on a camera unit.
 * In production this would invoke the computer vision inference endpoint.
 * Returns whether motion was detected and a confidence score.
 *
 * @param {string} unitId - The camera unit ID to run detection on.
 * @returns {Promise<{ motionDetected: boolean; confidence: number }>}
 */
export const runMotionDetection = async (
  unitId: string,
): Promise<{ motionDetected: boolean; confidence: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const motionDetected = Math.random() > 0.4;
  const confidence = Math.round((0.7 + Math.random() * 0.29) * 100) / 100;
  console.log(
    `[CCTVModule] AI Motion Detection → ${unitId}: ` +
    `${motionDetected ? 'MOTION DETECTED' : 'Clear'} | Confidence: ${confidence}`,
  );
  return {motionDetected, confidence};
};

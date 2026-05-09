import { District } from '../lib/firebase';

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
    },
    {
      unitId: 'CAM-GSB-002',
      location: 'Remera Bus Terminal',
      streamUrl: 'rtsp://cctv.kigali.gov.rw/gasabo/cam002/live',
      district: 'Gasabo',
      online: true,
      retrievedAt: '',
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
    },
    {
      unitId: 'CAM-NYR-002',
      location: 'City Centre — KN 3 Ave',
      streamUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam002/live',
      district: 'Nyarugenge',
      online: false,
      retrievedAt: '',
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
    },
    {
      unitId: 'CAM-KIC-002',
      location: 'Sonatubes Roundabout',
      streamUrl: 'rtsp://cctv.kigali.gov.rw/kicukiro/cam002/live',
      district: 'Kicukiro',
      online: true,
      retrievedAt: '',
    },
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
  await new Promise(resolve => setTimeout(resolve, 400));

  const now = new Date().toISOString();
  const cameras = SECTOR_CAMERA_MAP[district] || [];

  console.log(
    `[CCTVModule] Querying sector "${district}" — ` +
    `${cameras.length} camera(s) found, ` +
    `${cameras.filter(c => c.online).length} online.`
  );

  return cameras.map(cam => ({ ...cam, retrievedAt: now }));
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
  const online = feeds.find(cam => cam.online);

  if (online) {
    console.log(`[CCTVModule] Primary stream → ${online.unitId}: ${online.streamUrl}`);
    return online.streamUrl;
  }

  console.warn(`[CCTVModule] No online cameras found for sector "${district}".`);
  return null;
};

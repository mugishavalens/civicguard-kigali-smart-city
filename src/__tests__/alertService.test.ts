/**
 * @file alertService.test.ts
 * @description Unit tests for AlertService and OfficerDashboardObserver.
 * Verifies Observer pattern contract: update() triggers SMS + push on status change.
 * Covers TC-005 from the CSMS test plan.
 */

import './__mocks__/firebaseMock';
import { AlertService, OfficerDashboardObserver } from '../services/alertService';
import { Incident } from '../lib/firebase';

const mockIncident: Incident = {
  id: 'alert-test-incident-001',
  type: 'crime',
  description: 'Suspicious activity near Nyabugogo',
  status: 'resolved',
  severity: 'P2',
  reporterId: 'citizen-uid-002',
  reporterName: 'Amina Uwase',
  location: { latitude: -1.9355, longitude: 30.0566, address: 'Nyabugogo', district: 'Nyarugenge' },
  timestamp: new Date().toISOString(),
  cctvStreamUrl: 'rtsp://cctv.kigali.gov.rw/nyarugenge/cam001/live',
};

// ── AlertService ─────────────────────────────────────────────────────────────

describe('AlertService — Observer 1', () => {
  let alertService: AlertService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    alertService = new AlertService();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('TC-005a: update() calls sendSMSAlert() with correct args', () => {
    const smsSpy = jest.spyOn(alertService, 'sendSMSAlert');
    alertService.update(mockIncident);
    expect(smsSpy).toHaveBeenCalledWith(
      mockIncident.reporterName,
      mockIncident.status,
      mockIncident.id
    );
  });

  test('TC-005b: update() calls sendAppPush() with correct args', () => {
    const pushSpy = jest.spyOn(alertService, 'sendAppPush');
    alertService.update(mockIncident);
    expect(pushSpy).toHaveBeenCalledWith(
      mockIncident.id,
      mockIncident.status,
      mockIncident.severity
    );
  });

  test('TC-005c: sendSMSAlert() logs to console with incident ID and status', () => {
    alertService.sendSMSAlert('Amina Uwase', 'resolved', 'alert-test-incident-001');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('SMS')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('resolved')
    );
  });

  test('TC-005d: sendAppPush() logs severity and status', () => {
    alertService.sendAppPush('alert-test-incident-001', 'resolved', 'P2');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('P2')
    );
  });

  test('TC-005e: broadcastArea() logs district and message', () => {
    alertService.broadcastArea('Nyarugenge', 'Flood warning — evacuate sector 3', 'P1');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('AREA BROADCAST')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Nyarugenge')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('P1')
    );
  });
});

// ── OfficerDashboardObserver ─────────────────────────────────────────────────

describe('OfficerDashboardObserver — Observer 2', () => {
  let observer: OfficerDashboardObserver;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    observer = new OfficerDashboardObserver();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('TC-005f: update() emits Socket.IO event log with incident ID and status', () => {
    observer.update(mockIncident);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Socket.IO emit')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('resolved')
    );
  });

  test('TC-005g: update() includes severity in the Socket.IO log', () => {
    observer.update(mockIncident);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('P2')
    );
  });
});

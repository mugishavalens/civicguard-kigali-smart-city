import {Incident} from '../lib/firebase';

/**
 * Observer interface — all observers must implement update().
 */
export interface Observer {
  /** Called by the Subject whenever an incident state changes.
   * @param {Incident} incident - The updated incident document.
   */
  update(incident: Incident): void;
}

/**
 * AlertService — Observer 1.
 * Simulates SMS dispatch and app-push notifications to the citizen
 * whenever an incident status transition is detected.
 * Implements the Observer interface defined in the CSMS design.
 */
export class AlertService implements Observer {
  /**
   * Receive a state-change notification from IncidentManager.
   * @param {Incident} incident - The updated incident document.
   */
  update(incident: Incident): void {
    this.sendSMSAlert(incident.reporterName, incident.status, incident.id);
    this.sendAppPush(incident.id, incident.status, incident.severity);
  }

  /**
   * Simulate sending an SMS alert to the citizen reporter.
   * In production this would integrate with the Rwanda SAMU/RNP SMS gateway.
   * @param {string} recipientName - Name of the citizen reporter.
   * @param {string} status - New incident status.
   * @param {string} incidentId - Unique incident identifier.
   */
  sendSMSAlert(recipientName: string, status: string, incidentId: string): void {
    console.log(
      `[AlertService] SMS → Citizen "${recipientName}": ` +
      `Your incident INC-${incidentId.slice(0, 8)} status has changed to "${status}". ` +
      '— Kigali CivicGuard System',
    );
  }

  /**
   * Simulate sending an in-app push notification to the citizen.
   * @param {string} incidentId - Unique incident identifier.
   * @param {string} status - New incident status.
   * @param {string} severity - Severity level (P1/P2/P3).
   */
  sendAppPush(incidentId: string, status: string, severity: string): void {
    console.log(
      `[AlertService] APP PUSH → INC-${incidentId.slice(0, 8)} | ` +
      `Severity: ${severity} | New status: "${status}"`,
    );
  }

  /**
   * Broadcast an area-wide alert to all citizens in a given district.
   * In production this triggers mass SMS and push notifications via
   * the Rwanda SAMU/RNP multi-agency gateway for the affected sector.
   * @param {string} district - The Kigali district to broadcast to.
   * @param {string} message - The alert message to broadcast.
   * @param {string} severity - Severity level of the area alert (P1/P2/P3).
   */
  broadcastArea(district: string, message: string, severity: string): void {
    console.log(
      `[AlertService] AREA BROADCAST → District: "${district}" | ` +
      `Severity: ${severity} | Message: "${message}" | ` +
      '— Kigali Multi-Agency Alert Service',
    );
  }
}

/**
 * OfficerDashboardObserver — Observer 2.
 * Emits a Socket.IO event to all connected officer dashboard clients
 * whenever an incident state changes.
 * In the prototype the event is logged to console; in production this
 * targets the Node.js/Express Socket.IO gateway via socket.io-client
 * connecting to process.env.VITE_API_URL.
 */
export class OfficerDashboardObserver implements Observer {
  /**
   * Receive a state-change notification and broadcast to officer clients.
   * @param {Incident} incident - The updated incident document.
   */
  update(incident: Incident): void {
    console.log(
      '[OfficerDashboard] Socket.IO emit → event:"incident:updated" | ' +
      `INC-${incident.id.slice(0, 8)} | Status: "${incident.status}" | Severity: ${incident.severity}`,
    );
    // Production: import { io } from 'socket.io-client';
    // const socket = io(import.meta.env.VITE_API_URL);
    // socket.emit('incident:updated', incident);
  }
}

/**
 * IncidentManager — Subject / Publisher.
 * Maintains a registry of observers and notifies them on every
 * incident status transition (Submitted → In Review → Resolved).
 * Implements the Observer (Publish–Subscribe) design pattern.
 */
export class IncidentManager {
  private observers: Observer[] = [];

  constructor() {
    this.observers = [new AlertService(), new OfficerDashboardObserver()];
  }

  /**
   * Register a new observer.
   * @param {Observer} observer - Must implement update(incident).
   */
  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  /**
   * Remove a previously registered observer.
   * @param {Observer} observer - The observer to remove.
   */
  unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  /**
   * Notify all registered observers of an incident state change.
   * @param {Incident} incident - The updated incident document.
   */
  notify(incident: Incident): void {
    this.observers.forEach((obs) => obs.update(incident));
  }

  /**
   * Assign a safety officer to an incident and notify all observers.
   * In production this updates the assignedOfficerId field in Firestore
   * and triggers dispatch alerts to the assigned officer.
   * @param {string} incidentId - Firestore document ID of the incident.
   * @param {string} officerId - UID of the safety officer being assigned.
   * @param {string} officerName - Display name of the assigned officer.
   */
  assignOfficer(incidentId: string, officerId: string, officerName: string): void {
    console.log(
      `[IncidentManager] Officer assigned → INC-${incidentId.slice(0, 8)} | ` +
      `Officer: "${officerName}" (${officerId})`,
    );
    const partialIncident = {
      id: incidentId,
      status: 'in-progress',
      assignedOfficerId: officerId,
      assignedOfficerName: officerName,
    } as unknown as Incident;
    this.notify(partialIncident);
  }

  /**
   * Fetch all incidents from the observer registry log (in-memory).
   * In production this delegates to the Firestore query layer.
   * Mirrors the fetchAll() method defined in the CSMS class diagram.
   * @returns {Incident[]} Snapshot of all incidents currently tracked.
   */
  fetchAll(): Incident[] {
    console.log('[IncidentManager] fetchAll() called — delegating to Firestore subscribeToIncidents()');
    return [];
  }
}

/** Singleton instance used across the application. */
export const incidentManager = new IncidentManager();

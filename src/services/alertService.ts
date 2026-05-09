import { Incident } from '../lib/firebase';

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
      `— Kigali CivicGuard System`
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
      `Severity: ${severity} | New status: "${status}"`
    );
  }
}

/**
 * OfficerDashboard — Observer 2.
 * Simulates a WebSocket/Socket.IO push to all connected officer clients
 * whenever an incident state changes.
 * In the prototype this is handled by Firestore onSnapshot; this class
 * captures the Observer pattern contract documented in the CSMS design.
 */
export class OfficerDashboardObserver implements Observer {
  /**
   * Receive a state-change notification and broadcast to officer clients.
   * @param {Incident} incident - The updated incident document.
   */
  update(incident: Incident): void {
    console.log(
      `[OfficerDashboard] Socket.IO emit → event:"incident:updated" | ` +
      `INC-${incident.id.slice(0, 8)} | Status: "${incident.status}" | Severity: ${incident.severity}`
    );
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
    this.observers = this.observers.filter(o => o !== observer);
  }

  /**
   * Notify all registered observers of an incident state change.
   * @param {Incident} incident - The updated incident document.
   */
  notify(incident: Incident): void {
    this.observers.forEach(obs => obs.update(incident));
  }
}

/** Singleton instance used across the application. */
export const incidentManager = new IncidentManager();

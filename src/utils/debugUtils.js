// src/utils/debugUtils.js

/**
 * Comprehensive debugging utility for PhoneRepairForm component
 * Usage: Add ?debug=true to URL or run localStorage.setItem('svarog-debug', 'true') in console
 */

class ComponentDebugger {
  constructor(componentName) {
    this.componentName = componentName;
    this.isEnabled = this.checkDebugEnabled();
    this.eventLog = [];
    this.stateLog = [];
    this.performanceMarks = new Map();

    if (this.isEnabled) {
      this.setupGlobalDebugTools();
      console.log(`🐛 Debug mode enabled for ${componentName}`);
    }
  }

  checkDebugEnabled() {
    if (typeof window === 'undefined') return false;

    return (
      window.localStorage?.getItem('svarog-debug') === 'true' ||
      window.location?.search?.includes('debug=true') ||
      window.location?.search?.includes('debug=phone-repair')
    );
  }

  setupGlobalDebugTools() {
    // Add global debug helper to window
    if (typeof window !== 'undefined') {
      window.SvarogDebug = window.SvarogDebug || {};
      window.SvarogDebug[this.componentName] = {
        getEventLog: () => this.eventLog,
        getStateLog: () => this.stateLog,
        clearLogs: () => this.clearLogs(),
        exportLogs: () => this.exportLogs(),
        toggleDebug: () => this.toggleDebug(),
        getPerformanceData: () => this.getPerformanceData(),
      };
    }
  }

  log(level, message, data = null) {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      component: this.componentName,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : null,
    };

    this.eventLog.push(logEntry);

    const emoji = this.getLevelEmoji(level);
    const prefix = `${emoji} [${this.componentName}]`;

    switch (level) {
      case 'error':
        console.error(`${prefix} ${message}`, data);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`, data);
        break;
      case 'info':
        console.info(`${prefix} ${message}`, data);
        break;
      default:
        console.log(`${prefix} ${message}`, data);
    }

    // Keep only last 1000 entries to prevent memory issues
    if (this.eventLog.length > 1000) {
      this.eventLog = this.eventLog.slice(-1000);
    }
  }

  logState(stateName, newState, previousState = null) {
    if (!this.isEnabled) return;

    const timestamp = new Date().toISOString();
    const stateEntry = {
      timestamp,
      stateName,
      newState: JSON.parse(JSON.stringify(newState)),
      previousState: previousState
        ? JSON.parse(JSON.stringify(previousState))
        : null,
      changes: this.getStateChanges(previousState, newState),
    };

    this.stateLog.push(stateEntry);
    this.log('info', `State changed: ${stateName}`, stateEntry);

    // Keep only last 500 state entries
    if (this.stateLog.length > 500) {
      this.stateLog = this.stateLog.slice(-500);
    }
  }

  startPerformanceMark(operation) {
    if (!this.isEnabled) return null;

    const markId = `${this.componentName}-${operation}-${Date.now()}`;
    this.performanceMarks.set(markId, {
      operation,
      startTime: performance.now(),
      startTimestamp: new Date().toISOString(),
    });

    this.log('debug', `Performance: Started ${operation}`, { markId });
    return markId;
  }

  endPerformanceMark(markId) {
    if (!this.isEnabled || !markId) return null;

    const mark = this.performanceMarks.get(markId);
    if (!mark) {
      this.log('warn', 'Performance mark not found', { markId });
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - mark.startTime;

    const result = {
      ...mark,
      endTime,
      endTimestamp: new Date().toISOString(),
      duration,
    };

    this.log(
      'info',
      `Performance: ${mark.operation} completed in ${duration.toFixed(2)}ms`,
      result
    );
    this.performanceMarks.delete(markId);

    return result;
  }

  logEvent(eventType, eventData) {
    if (!this.isEnabled) return;

    this.log('info', `Event: ${eventType}`, {
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
    });
  }

  logApiCall(method, params, response = null, error = null) {
    if (!this.isEnabled) return;

    const logData = {
      method,
      params,
      response,
      error: error ? error.message : null,
      timestamp: new Date().toISOString(),
    };

    if (error) {
      this.log('error', `API Error: ${method}`, logData);
    } else {
      this.log('info', `API Call: ${method}`, logData);
    }
  }

  getLevelEmoji(level) {
    const emojis = {
      error: '❌',
      warn: '⚠️',
      info: 'ℹ️',
      debug: '🔍',
      event: '📅',
      state: '🔄',
      api: '🌐',
    };
    return emojis[level] || '📝';
  }

  getStateChanges(oldState, newState) {
    if (!oldState || !newState) return null;

    const changes = {};
    const allKeys = new Set([
      ...Object.keys(oldState),
      ...Object.keys(newState),
    ]);

    for (const key of allKeys) {
      if (oldState[key] !== newState[key]) {
        changes[key] = {
          from: oldState[key],
          to: newState[key],
        };
      }
    }

    return Object.keys(changes).length > 0 ? changes : null;
  }

  clearLogs() {
    this.eventLog = [];
    this.stateLog = [];
    this.log('info', 'Debug logs cleared');
  }

  exportLogs() {
    const exportData = {
      component: this.componentName,
      exportTimestamp: new Date().toISOString(),
      eventLog: this.eventLog,
      stateLog: this.stateLog,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.componentName}-debug-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    this.log('info', 'Debug logs exported');
  }

  toggleDebug() {
    if (typeof window === 'undefined') return;

    const currentValue = window.localStorage.getItem('svarog-debug');
    const newValue = currentValue === 'true' ? 'false' : 'true';
    window.localStorage.setItem('svarog-debug', newValue);

    console.log(
      `Debug mode ${newValue === 'true' ? 'enabled' : 'disabled'}. Reload page to apply.`
    );
  }

  getPerformanceData() {
    const activeMarks = Array.from(this.performanceMarks.values());
    return {
      activeMarks,
      totalMarks: this.performanceMarks.size,
    };
  }

  // Wrapper methods for easy use
  debug(message, data) {
    this.log('debug', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  error(message, data) {
    this.log('error', message, data);
  }

  event(eventType, data) {
    this.logEvent(eventType, data);
  }

  state(stateName, newState, previousState) {
    this.logState(stateName, newState, previousState);
  }

  api(method, params, response, error) {
    this.logApiCall(method, params, response, error);
  }

  performance(operation) {
    const markId = this.startPerformanceMark(operation);
    return () => this.endPerformanceMark(markId);
  }
}

// Create a singleton factory for component debuggers
const debuggers = new Map();

export function createDebugger(componentName) {
  if (!debuggers.has(componentName)) {
    debuggers.set(componentName, new ComponentDebugger(componentName));
  }
  return debuggers.get(componentName);
}

// Helper function to setup debugging for PhoneRepairForm specifically
export function setupPhoneRepairFormDebug() {
  const debug = createDebugger('PhoneRepairForm');

  // Add console helpers
  if (typeof window !== 'undefined') {
    window.debugPhoneRepairForm = {
      enable: () => {
        window.localStorage.setItem('svarog-debug', 'true');
        console.log('🐛 Debug enabled. Reload the page to see debug output.');
      },
      disable: () => {
        window.localStorage.setItem('svarog-debug', 'false');
        console.log('🐛 Debug disabled. Reload the page to hide debug output.');
      },
      export: () => debug.exportLogs(),
      clear: () => debug.clearLogs(),
      status: () => {
        console.log('🐛 Debug Status:', {
          enabled: debug.isEnabled,
          eventLogEntries: debug.eventLog.length,
          stateLogEntries: debug.stateLog.length,
        });
      },
    };

    console.log('🐛 PhoneRepairForm debug tools available:');
    console.log('  debugPhoneRepairForm.enable() - Enable debug mode');
    console.log('  debugPhoneRepairForm.disable() - Disable debug mode');
    console.log('  debugPhoneRepairForm.export() - Export debug logs');
    console.log('  debugPhoneRepairForm.clear() - Clear debug logs');
    console.log('  debugPhoneRepairForm.status() - Show debug status');
  }

  return debug;
}

export default ComponentDebugger;

const { withAndroidManifest } = require('@expo/config-plugins');

// Notifee doesn't ship an Expo config plugin. This plugin:
// 1. Adds the FOREGROUND_SERVICE_HEALTH permission (required on Android 14+)
// 2. Overrides notifee's ForegroundService type from "shortService" (3-min limit)
//    to "health" so the timer can run for a full workout session.
module.exports = function withNotifee(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // Add tools namespace so we can use tools:replace
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // Add FOREGROUND_SERVICE_HEALTH permission
    if (!manifest['uses-permission']) manifest['uses-permission'] = [];
    const hasHealthPerm = manifest['uses-permission'].some(
      (p) => p.$['android:name'] === 'android.permission.FOREGROUND_SERVICE_HEALTH'
    );
    if (!hasHealthPerm) {
      manifest['uses-permission'].push({
        $: { 'android:name': 'android.permission.FOREGROUND_SERVICE_HEALTH' },
      });
    }

    // Override notifee's ForegroundService type from shortService → health
    const app = manifest.application[0];
    if (!app.service) app.service = [];
    const idx = app.service.findIndex(
      (s) => s.$['android:name'] === 'app.notifee.core.ForegroundService'
    );
    const entry = {
      $: {
        'android:name': 'app.notifee.core.ForegroundService',
        'android:exported': 'false',
        'android:foregroundServiceType': 'health',
        'tools:replace': 'android:foregroundServiceType',
      },
    };
    if (idx >= 0) app.service[idx] = entry;
    else app.service.push(entry);

    return config;
  });
};

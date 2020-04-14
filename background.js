const link = 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9hlbrVO_2QFVqVPhlZmz7tO';
let enabled;

const firstRun = () => {
  browser.storage.local.get(('enabled'), result => {
    enabled = result.enabled;
    // First run after installation: set enabled to true
    if (typeof(enabled) === "undefined") {
      chrome.storage.local.set({'enabled': true});
    }
    setBadge(enabled);
  })
}
firstRun();

const checkTime = () => {
  let date = new Date();
  let hours = date.getHours();

  // Will check between 8pm and 11pm.
  if ((hours < 23) && enabled) {
  // if ((hours > 20) && (hours < 23) && enabled) {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Tabs/create
    const creating = browser.tabs.create({
      url: link
    });
    creating.then(onCreated, onError);
  }
}

const onCreated = (tab) => {
  console.log(`Created new tab: ${tab.id}`)
}

const onError = (error) => {
  console.log(`Error: ${error}`);
}

const setBadge = enabled => {
  let status = enabled ? 'Disable' : 'Enable';
  let title = `${status} Svelte Playlist`;

  chrome.browserAction.setBadgeText({text: enabled ? '' : 'Off'});
  chrome.browserAction.setTitle({title: title});

  chrome.storage.local.set({'enabled': enabled});
  // browser.storage.local.get('enabled').then(console.log("enabled or not", enabled), onError); 
}

// Enable / disable the extension's checks
const toggleEnabled = () => {
  setBadge(!enabled);
  enabled = !enabled;
}

chrome.browserAction.onClicked.addListener(function(tab) {
  toggleEnabled(!enabled);
});
// chrome.browserAction.onClicked.addListener(function(tab) {
//   browser.storage.local.get(('enabled'), function(result) {
//       setEnabled(!result.enabled);
//   });
// });

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/alarms/create
//
// Set up an alarm for regular checks.
// delayInMinutes: The time the alarm will fire first, given as minutes from the time the alarm is set
// periodInMinutes: If this is specified, the alarm will fire again every periodInMinutes after its initial firing
// Will check 1 minute after the extension is loaded, and then at intervals of 120 minutes.
// browser.alarms.create('checkTime', {delayInMinutes: 1, periodInMinutes: 120});
// Test purpose: 0.1 minutes after installation and every 0.3 minutes
browser.alarms.create('checkTime', {delayInMinutes: 0.1, periodInMinutes: 0.3});

browser.alarms.onAlarm.addListener(checkTime);

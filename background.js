const link = 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9hlbrVO_2QFVqVPhlZmz7tO';

const checkTime = () => {
  let date = new Date();
  let hours = date.getHours();
  // Will check between 8pm and 11pm.
  if ((hours > 20) && (hours < 23)) {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Tabs/create
    const creating = browser.tabs.create({
      url: link
    });
    creating.then(onCreated, onError);
  }
}

// On start up, check the time to see what theme to show.
// checkTime();

// Set up an alarm to check this regularly.
// delayInMinutes: The time the alarm will fire first, given as minutes from the time the alarm is set
// periodInMinutes: If this is specified, the alarm will fire again every periodInMinutes after its initial firing
// Will check 1 minute after the extension is loaded, and then at intervals of 120 minutes.
browser.alarms.onAlarm.addListener(checkTime);

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/alarms/create
browser.alarms.create('checkTime', {delayInMinutes: 1, periodInMinutes: 120});

const onCreated = (tab) => {
  console.log(`Created new tab: ${tab.id}`)
}

const onError = (error) => {
  console.log(`Error: ${error}`);
}


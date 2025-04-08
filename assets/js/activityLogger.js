"use strict";
// export {};
// window.location = "obsidian://new?vault=Paul's%20Vault&file=Sandbox/Newer&contents=Hello%20World%20from%20JavaScript%20Prompt&append";
// let vaultName = "Paul's Vault";
// let fileName = "Sandbox/Newer";
// 
// let obsidianURI = `obsidian://new?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(fileName)}&append&silent&content=${encodeURIComponent(contentToAppend)}`;
// console.log(`obsidianURI: ${obsidianURI}`); // Log the URI to the console for debugging
// 
const nDelayMinutesElement = document.getElementById('nDelayMinutes');
const lastActivityElement = document.getElementById('lastActivity');
const replacementActivity = document.getElementById('replacementActivity');
const nextActivityElement = document.getElementById('nextActivity');
// !! We must use a button or some other user interaction to get access to the file system.
document.getElementById('selectFileButton')?.addEventListener('click', async () => {
    const activityLogFile = await getActivityLogFile();
    // const file = await activityLogFile.getFile();
    const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    await appendToFile(activityLogFile, `\n# ${formattedDate}`);
    await appendToFile(activityLogFile, "| Time | What I am Doing | What Should I be Doing | What Will I do Next? |");
    await appendToFile(activityLogFile, "| ----------- | ----------- | ----------- | ----------- |");
    for (var i = 0; i < 1000; i++) {
        // Ask user what they are doing.
        const lastActivityText = promptLastActivity();
        const replacementActivityText = promptReplacementActivity();
        const nextActivityText = promptNextActivity();
        appendToFile(activityLogFile, `| ${nowTimeString()} | ${lastActivityText} | ${replacementActivityText} | ${nextActivityText} |`);
        var nDelayMinutes = nDelayMinutesElement.valueAsNumber;
        if (nDelayMinutes >= 0) {
            // If the user has not given a delay, then nDaleyMinutes will be NaN, so this case will not be used.
            console.log(`Delaying ${nDelayMinutes} minutes`);
            await sleepMinutes(nDelayMinutes);
        }
        else {
            console.log('No delay given. Only delaying 5 seconds');
            await sleepSeconds(5);
        }
        notifyMe(`Time to record your activity check-in! (${nowTimeString()})`);
    }
    await appendToFile(activityLogFile, ` `);
});
function nowTimeString() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'pm' : 'am'}`;
}
async function appendToFile(fileHandle, contentToAppend) {
    const file = await fileHandle.getFile();
    var contents = await file.text();
    contents += "\n" + contentToAppend;
    if (typeof fileHandle !== "undefined") {
        if ((await fileHandle.queryPermission()) === 'granted') {
            const writable = await fileHandle.createWritable();
            await writable.write(contents);
            await writable.close();
        }
        else {
            console.log("Permission denied");
        }
    }
}
async function getActivityLogFile() {
    var activityFile = await window.showOpenFilePicker({
        id: 'obsidianLogFile', // The browser remembers different directories for different IDs. 
        startIn: 'documents',
        multiple: false
    });
    return activityFile[0];
}
function promptLastActivity() {
    // Prompt the user for their current activity. Return a boolean that indicates whether they responded.
    const text = promptXActivity("What are you doing?", lastActivityElement);
    if (text == "") {
        throw new Error("No activity given.");
    }
    return text;
}
function promptReplacementActivity() {
    return promptXActivity("What (if anything) is something else you should be doing?", replacementActivity);
}
function promptNextActivity() {
    return promptXActivity("What will you do next??", nextActivityElement);
}
function promptXActivity(promptStr, htmlElement) {
    // Prompt the user for their current activity. Return a boolean that indicates whether they responded.
    let text = prompt(promptStr);
    if (text == null) {
        throw new Error("No text given.");
    }
    else {
        if (htmlElement !== null) {
            htmlElement.innerText = text;
        }
        return text;
    }
}
function notifyMe(notificationMessage) {
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
        return;
    }
    else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification(notificationMessage);
        // …
    }
    else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification(notificationMessage);
                // …
            }
        });
    }
}
function sleepMilliseconds(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function sleepSeconds(seconds) {
    return sleepMilliseconds(1000 * seconds);
}
function sleepMinutes(minutes) {
    return sleepMilliseconds(1000 * 60 * minutes);
}

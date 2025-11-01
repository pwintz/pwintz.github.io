// Import necessary React libraries and components
import React from 'react';  // Core React library
import { createRoot } from 'react-dom/client';  // Used to render React components to the DOM
import ReactModal from 'react-modal';  // A modal dialog component


// TypeScript interface defining the state of our component.
class AppState {
  name: string; // A human readable name for the state
  isFileSelected: boolean;
  showModal: boolean;  // Tracks whether modal is visible or hidden
  promptText: string;
  // The onExitCallback property defines actions that occur as the app is leaving the current state.
  onExitCallback: (text: string) => void;

  static INITIAL = new AppState("Initial", false, false, "", (_text: string) => {});

  constructor(
    name: string,
    isFileSelected: boolean,
    showModal: boolean,
    promptText: string,
    onExitCallback: (text: string) => void
  ) {
    this.name = name;
    this.isFileSelected = isFileSelected;
    this.showModal = showModal;
    this.promptText = promptText;
    this.onExitCallback = onExitCallback;
  }

  toString() {
    return `AppState{isFileSelected=${this.isFileSelected}, showModal=${this.showModal}, promptText=${this.promptText}}`;
  }
}

export {};

abstract class Appender {
  private _cumulativeAppendedContent: string;

  constructor() {
    this._cumulativeAppendedContent = "";
  }
  
  protected abstract pushAppend(contentToAppend: string | string[]): void;
  
  append(contentToAppend: string | string[]): void {
    // Convert contentToAppend to a string if it's an array, with each entry as a line.
    if (contentToAppend instanceof Array) {
      contentToAppend = contentToAppend.join("\n");
    }

    this._cumulativeAppendedContent += "\n" + contentToAppend;
    this.pushAppend(contentToAppend);
  }
  
  public get cumulativeAppendedContent(): string {
    return this._cumulativeAppendedContent;
  }
}

class ObsidianAdvancedURIAppender extends Appender {
  vaultName: string;
  fileName: string;
  
  constructor(vaultName: string, fileName: string) {
    super()
    this.vaultName = vaultName;
    this.fileName = fileName;
  }

  buildAppendAdvancedURI(contentToAppend: string): string {
    return [
      `obsidian://adv-uri`,
      `?vault=${encodeURIComponent(this.vaultName)}`,
      `&filepath=${encodeURIComponent(this.fileName)}`,
      // Don't show the Obsidian window.
      `&openmode=silent`,
      // Set the data we want to append.
      `&data=${encodeURIComponent(contentToAppend)}`,
      // Put the data at the end of the file. No line break is added by Advanced URI.
      `&mode=append`
    ].join('');
  }

  protected pushAppend(contentToAppend: string): void {
    const obsidianURI = this.buildAppendAdvancedURI(contentToAppend);
    console.log(`obsidianURI: ${obsidianURI}`); // Log the URI to the console for debugging
    window.location.href = obsidianURI;
    // const handle = window.open(obsidianURI, "_self");
    // alert(`handle: ${handle}`)
    // window.focus()
    // Give the browser a moment to process the URI before focusing on the window.
    // sleepMilliseconds(1000, () => {
    //   console.log("Focusing on window after 1 second delay.");
    //   return window.focus();
    // }); 
  }
}

class ObsidianURIAppender extends Appender {
  vaultName: string;
  fileName: string;
  
  constructor(vaultName: string, fileName: string) {
    super()
    this.vaultName = vaultName;
    this.fileName = fileName;
  }
  
  buildAppendURI(contentToAppend: string): string {
    return [
      `obsidian://new`,
      `?vault=${encodeURIComponent(this.vaultName)}`,
      `&file=${encodeURIComponent(this.fileName)}`,
      // Don't show the Obsidian window.
      `&silent`,
      // Set the data we want to append.
      `&content=${encodeURIComponent(contentToAppend)}`,
      // Put the data at the end of the file. No line break is added by Advanced URI.
      `&append`
    ].join('');
  }

  protected pushAppend(contentToAppend: string): void {
    const obsidianURI = this.buildAppendURI(contentToAppend);
    console.log(`obsidianURI: ${obsidianURI}`); // Log the URI to the console for debugging
    window.location.href = obsidianURI;
    // const handle = window.open(obsidianURI, "_blank", "popup");
    // alert(`handle: ${handle}`)
    // Give the browser a moment to process the URI before focusing on the window.
    sleepMilliseconds(1000, window.focus); 
  }
}


class FileSystemAPIAppender extends Appender {
  // The design of this class is motivated by the need for a file picker to be opened via a user action in the UI, such as a button click. 
  // Thus, if there are is a request for file access before the file is selected, we should store that requests and 

  // private fileHandle: FileSystemFileHandle | undefined;
  // getFilePromise: () => Promise<File>;
  fileHandlePromise: Promise<FileSystemFileHandle>;
  private onFileSelectedCallback: ((fileSystemHandle: FileSystemFileHandle) => void);

  constructor() {
    super()

    // The following callback should never be called, but we need to assign something to onFileSelectedCallback so that the type can be not undefined.
    this.onFileSelectedCallback = () => {
      throw new Error("onFileSelectedCallback was called, but fileHandlePromise has not been set yet.");
    }
    
    this.fileHandlePromise = new Promise((resolve, reject) => {
      this.onFileSelectedCallback = (fileHandle: FileSystemFileHandle) => {
        if (fileHandle === undefined) {
          reject(new Error("No file was selected."));
        }
        console.log(`File selected: ${fileHandle.name}`);
        resolve(fileHandle);
      }
    });
    this.promptFileSelection = this.promptFileSelection.bind(this);
  }

  promptFileSelection() {
    if(typeof(window.showOpenFilePicker) === "undefined"){
      // The File System API is not supported.
      alert("The File System API is not supported.")
      throw new Error("The File System API is not supported. Cannot use FileSystemAPIAppender.");
    }

    window.showOpenFilePicker({
      id: 'obsidianLogFile', // The browser remembers different directories for different IDs. 
      startIn: 'documents',
      multiple: false
    }).then((fileList) => {
        console.log(`File selected in file picker: ${fileList[0].name}`);
        return this.onFileSelectedCallback(fileList[0]);
    });
  }

  protected async pushAppend(contentToAppend: string): Promise<void> {
    await this.fileHandlePromise.then(
      async (fileHandle) => {
        console.log(`Appending to file: ${fileHandle.name}.`);
        // if (fileHandle === undefined) {
        //   throw new Error('No file selected.');
        // }
        const file: File = await fileHandle.getFile();
        var text: string = await file.text()
        text += "\n" + contentToAppend;
        if ((await fileHandle.queryPermission()) === 'granted') {
            const writable = await fileHandle.createWritable();
            await writable.write(text);
            await writable.close();
        } else {
          console.log("Permission denied");
        }
    });
  }
}

// Get an appender that matches what the browser supports.
const appender: Appender = (() => {
    if(typeof(window.showOpenFilePicker) !== "undefined"){
      return new FileSystemAPIAppender();
    } else {
      // TODO: Check if the Obsidian Advanced URI plugin is installed.
      return new ObsidianAdvancedURIAppender("Paul's Vault", "Activity Log");
      // return new ObsidianURIAppender("Paul's Vault", "Activity Log");
    }
  } 
)();

// class DelayedReminderState {
//   permissionGranted: boolean;
// }

class DelayedReminder {

}

interface DelayedReminderViewProps {
  onDelayEndCallback: () => void;
}

class DelayedReminderView extends React.Component<DelayedReminderViewProps, {}> {
  statusMsg: string;
  notificationPermissionPromise: Promise<NotificationPermission>;
  nextReminderTime: Date | undefined;
  nMinutesDelayRef: React.RefObject<HTMLInputElement | null>;
  onDelayEndCallback: () => void;
  clearNotificationFnc: (() => void);
  interruptSleepFnc: (() => void);
  permissionStatus: NotificationPermission | undefined;

  constructor(props: {onDelayEndCallback: () => void}) { 
    super(props);
    this.statusMsg = "[Default Notification Status].";
    this.nMinutesDelayRef = React.createRef();
    this.onDelayEndCallback = props.onDelayEndCallback;

    this.nMinutesDelayRef = React.createRef();
    this.setReminder = this.setReminder.bind(this);
    this.updateReminder = this.updateReminder.bind(this);
    this.cancelReminders = this.cancelReminders.bind(this);
    this.requestNotificationPermission = this.requestNotificationPermission.bind(this);
    
    this.interruptSleepFnc = () => {};
    this.clearNotificationFnc = () => {};

    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      this.statusMsg = "This browser does not support desktop notification";
    } 

    this.notificationPermissionPromise = this.requestNotificationPermission();
  }

  private requestNotificationPermission(): Promise<NotificationPermission> {
    this.notificationPermissionPromise = Notification.requestPermission();
    this.notificationPermissionPromise.then((permission) => {
      if (permission === "granted") {
        this.statusMsg = "Notification permission granted.";
      } else if (permission === "denied") {
        this.statusMsg = "Notification permission denied.";
      } else {
        this.statusMsg = "Notification permission default.";
      }
      this.permissionStatus = permission;
      console.log(`Notification permission during construction of DelayedReminderView: ${permission}`);
    });
    return this.notificationPermissionPromise;
  }

  render(): React.ReactNode {
    var requestNotificationPermissionButton: React.ReactNode | null = null;
    if (this.permissionStatus === "default") {
      requestNotificationPermissionButton = (
        <button onClick={this.requestNotificationPermission}>
          Enable Notifications
        </button>
      );
    } 

    return (
      <div>        

        <p>
          Delay: <input ref={this.nMinutesDelayRef} type="number" defaultValue="0" style={{ width: '3em' }} /> minutes
          {/* Skip Pause Button */}
          <button 
            onClick={
              () => {
                console.log('Skip delay button clicked');
                this.skipDelay();
              }
            }
            disabled={this.nextReminderTime === undefined}
            style={{
              opacity: this.nextReminderTime === undefined ? 1 : 0.5,
              cursor: this.nextReminderTime === undefined ? 'pointer' : 'not-allowed'
            }}
          >Skip Delay</button>
          Next reminder: {niceFormatTime(this.nextReminderTime)}
          <button
            onClick={
              this.nextReminderTime === undefined? this.updateReminder : this.cancelReminders
            }
          >
            {this.nextReminderTime === undefined? "Restart reminders" : "Cancel"}
          </button>
        </p>
        <p>Notification Status: {this.statusMsg} {requestNotificationPermissionButton}</p>
      </div>
    );
  }

  updateReminder(): void {
    var nDelaySeconds: number | undefined = undefined;
    if (this.nMinutesDelayRef.current == null) {
      throw new Error('nMinutesDelayRef element was not found.')
    }
    const nDelayMinutes = this.nMinutesDelayRef.current.valueAsNumber
    if (nDelayMinutes > 0) {
      console.log(`Delaying ${nDelayMinutes} minutes`);
      nDelaySeconds = 60 * nDelayMinutes;
    } else {
      console.log('No delay given. Only delaying 5 seconds, for testing.');
      nDelaySeconds = 5
    }
    this.setReminder(nDelaySeconds);
  }

  private setReminder(nDelaySeconds: number): void {
    // Set a reminder for the next activity check-in.
    this.nextReminderTime = new Date(Date.now() + nDelaySeconds * 1000);
    console.log(`Next reminder: ${this.nextReminderTime}`);

    const onPauseEndCallback = () => { 
      this.onDelayEndCallback();
      // Clear the notification, if it exists, so that we don't get multiple notifications.
      this.clearNotificationFnc();
      this.clearNotificationFnc = this.notifyMe(`Time to record your activity check-in! (${nowTimeString()})`);

      // Create a reminder to check-in. 
      const recurrentReminder = () => {
        this.clearNotificationFnc();
        this.clearNotificationFnc = this.notifyMe(`Remember to check-in! (${nowTimeString()})`);
        this.interruptSleepFnc = sleepSeconds(nDelaySeconds, recurrentReminder);
      };
      sleepSeconds(nDelaySeconds, recurrentReminder)
    }

    this.interruptSleepFnc = sleepSeconds(nDelaySeconds, onPauseEndCallback);
    this.setState({});
  }

  onDelayEnd(): void {
    // Called when the delay ends.
    console.log("Delay ended.");
    this.onDelayEndCallback();
    this.clearNotificationFnc();
    this.clearNotificationFnc = this.notifyMe(`Time to record your activity check-in! (${nowTimeString()})`);
  }

  skipDelay(): void {
    console.log("Skipping pause.");
    this.interruptSleepFnc() 
    this.interruptSleepFnc = () => {};
    this.onDelayEnd();
  }

  cancelReminders(): void {
    console.log("Canceling reminders.");
    this.nextReminderTime = undefined;
    this.interruptSleepFnc() 
    this.interruptSleepFnc = () => {};
    this.setState({})
  }

  notifyMe(notificationMessage: string): () => void {
    // Returns a callback for dismissing the notification.
    const onclickCallback = () => {
      window.focus();
    };
    var notification: Notification | null = null;

    // if (!("Notification" in window)) {
    //   // Check if the browser supports notifications
    //   alert("This browser does not support desktop notification");
    //   return () => {};
    // } else 
    window.postMessage("hello");
    this.notificationPermissionPromise.then((permission) => {
      if (permission === "granted") {
      }
      
    });
    if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      notification = new Notification(notificationMessage, );
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        console.log(`Notification permission: ${permission}`);
        if (permission === "granted") {
          notification = new Notification(notificationMessage);
        }
      });
    }
    if (notification) {
      notification.onclick = onclickCallback;
      return () => {
        notification?.close();
        notification = null;
      }
    } else {
      return () => {};
    }
  }
}

// Define a React component class that manages a modal dialog
// React.Component<Props, State> is a generic class where we specify:
// - Props: {} (empty object because this component takes no properties)
// - State: AppState (the interface we defined above)
class ExampleApp extends React.Component<{}, AppState> {
  stateSequenceIndex: number;
  stateSequence: Array<AppState>;
  lastActivityText: string
  betterActivityText: string
  nextActivityText: string
  activityLogFileHandle: FileSystemFileHandle | undefined;
  activityInputRef: React.RefObject<HTMLInputElement | null>;
  delayedReminderViewRef: React.RefObject<DelayedReminderView | null>;

  constructor(props: {}) {
    super(props);
    
    this.activityInputRef = React.createRef();
    this.delayedReminderViewRef = React.createRef();
    // console.log(`this.inputElement: ${this.inputElement}`)
    
    // Bind event handler methods to this instance
    // This ensures 'this' refers to the component instance when these methods are called
    this.nextState = this.nextState.bind(this);
    this.submitActivityLogEntry = this.submitActivityLogEntry.bind(this);
    // this.cancel = this.cancel.bind(this);
    // this.appendToFile = this.appendToFile.bind(this);


    this.lastActivityText = "";
    this.betterActivityText = "";
    this.nextActivityText = "";

    this.stateSequenceIndex = 0;  // Initialize index to track the current state in the sequence
    this.stateSequence = [
      // { // Initial state: file not selected, modal not shown
      //   isFileSelected: false,
      //   showModal: false,
      //   promptText: "", 
      //   onExitCallback: (text: string) => { this.lastActivityText = text; }
      // },
      {
        name: "First prompt",
        isFileSelected: true,
        showModal: true,
        promptText: "What were you doing?", 
        onExitCallback: (text: string) => { 
          this.lastActivityText = text; 
        }
      },
      {
        name: "Second prompt",
        isFileSelected: true,
        showModal: true,
        promptText: "What should you be doing?", 
        onExitCallback: (text: string) => { 
          this.betterActivityText = text; 
        }
      },
      {
        name: "Third prompt",
        isFileSelected: true,
        showModal: true,
        promptText: "What will you do now?", 
        onExitCallback: (text: string) => { 
          this.nextActivityText = text; 
          this.submitActivityLogEntry();
        }
      },
      { // Pause before next entry.
        name: "Pause",
        isFileSelected: true,
        showModal: false,
        promptText: "", 
        onExitCallback: (_text: string) => { 
          this.lastActivityText = ""; 
          this.betterActivityText = "";
          this.nextActivityText = "";
        }
      },
    ]

    appender.append([
      '', 
      `# ${nowDateString()}`,
      "| Time | What I was Doing | What Should I be Doing | What Will I do Next? |",
      "| ----------- | ----------- | ----------- | ----------- |"
    ])
    console.log(`Appended header for date to file. Setting state to first state in sequence.`)

    // If using FileSystemAPIAppender, we need to wait for the file to be selected before moving to next state. 
    // Otherwise, we can move immediately.
    if (appender instanceof FileSystemAPIAppender) {
      this.state = AppState.INITIAL;
      appender.fileHandlePromise.then((fileHandle) => {
        if (fileHandle === undefined) {
          alert('No file selected.');
          throw new Error('No file selected.');
        } else {
          // Set the state to the first element in the sequence.
          this.stateSequenceIndex = 0;
          this.setState(this.stateSequence[0]);
        }
      });
    } else {
      this.stateSequenceIndex = 0;
      this.state = this.stateSequence[0];
    }
  }

  // Each time the state updates, give focus to the text box, if the modal prompt is open.
  componentDidUpdate(prevProps: {}, prevState: AppState) { 
    console.log(`componentDidUpdate: this.state: ${(this.state.name)}, prevState: ${prevState.name}`);
      if (this.state.showModal) {
        
        if (this.activityInputRef.current === null) {
          // throw new Error("this.activityInputRef.current was null")
          console.error("this.activityInputRef.current was null");
        } else {
          this.activityInputRef.current.focus()
        }
      }
  }

  componentDidMount() {
    if (this.state.showModal && this.activityInputRef.current) {
      this.activityInputRef.current.focus();
    }
  }
  
  // remindToCheckIn(nDelaySeconds: number): void { 
  //   this.interruptSleepFnc = sleepSeconds(nDelaySeconds, () => {
  //     this.clearNotificationFnc();
  //     this.clearNotificationFnc = notifyMe(`Time to record your activity check-in! (${nowTimeString()})`);
  //   });
  // }

  submitActivityLogEntry(): void {
    const logLine = `| ${nowTimeString()} | ${this.lastActivityText} | ${this.betterActivityText} | ${this.nextActivityText} |`;
    appender.append(logLine);
    // this.appendToFile(logLine);
    this.delayedReminderViewRef.current?.updateReminder();
  }

  nextState(): void {
    var text = "";
    if (this.activityInputRef.current !== null) {
      text = this.activityInputRef.current.value;
      this.activityInputRef.current.value = "";
    }

    this.state.onExitCallback(text || "");
    this.stateSequenceIndex = (this.stateSequenceIndex + 1) % this.stateSequence.length;
    this.setState(this.stateSequence[this.stateSequenceIndex]);
    console.log(`this.stateSequenceIndex: ${this.stateSequenceIndex}  `)

    // Update notification.
    this.delayedReminderViewRef.current?.updateReminder();
  }

  // cancel(): void {
  //   this.stateSequenceIndex = 0;
  //   this.setState(this.stateSequence[0]);
  //   this.state.onExitCallback("")
  // }

  // The render method defines what the component displays
  // It's called automatically when state or props change
  render(): React.ReactNode {
    return (
      <div>
        This page is designed to help you keep track of your activities and remind you of what you should be doing. 
        It allows you to log your current activity, set a delay for the next activity, and provide suggestions for what to do next.

        To get started, please select a Markdown file where you want to record your activities. 
        Content will be appended to the end of the file.

        {/* Requirements: You must install the Advanced URI plugin in Obsidian.  */}

        {this.state.isFileSelected ? null : (
          <p>
            <button 
              id="selectFileButton" 
              onClick={appender instanceof FileSystemAPIAppender ? appender.promptFileSelection : () => {}}
              disabled={this.state.isFileSelected}
              style={{
                // opacity: this.state.isFileSelected? 0.5 : 1,
                display: this.state.isFileSelected? 'none' : 'block'
              }}
            >Select File</button>
          </p>
        )}

        <DelayedReminderView 
          ref={this.delayedReminderViewRef} 
          onDelayEndCallback={() => {
            this.nextState()
          }}
        />

        {appender instanceof ObsidianAdvancedURIAppender ? (
          <p> 
            <b>Vault Name:</b>&nbsp;<input type="text" defaultValue={(appender as ObsidianAdvancedURIAppender).vaultName} style={{ width: '20em' }} /><br></br>
            <b>File path in vault:</b>&nbsp;<input type="text" defaultValue={(appender as ObsidianAdvancedURIAppender).fileName} style={{ width: '100%' }} />
          </p>
        ) : null}

        Appended content:
        <pre>
          {appender.cumulativeAppendedContent}
        </pre>

        {/* Obsidian URI Preview:
        <pre>
          {appender.buildAppendURI("")}
        </pre>
        Obsidian Advanced URI preview:
        <pre>
          {appender.buildAppendAdvancedURI("")}
        </pre> */}

        {/* <p><b>{this.stateSequence[0].promptText}</b>&nbsp;
        {this.lastActivityText}</p>
        <p><b>{this.stateSequence[1].promptText}</b>&nbsp; 
        {this.betterActivityText}</p>
        <p><b>{this.stateSequence[2].promptText}</b>&nbsp; 
        {this.nextActivityText}</p> */}

        {/* ReactModal component with configuration props */}
        <ReactModal 
          isOpen={this.state.showModal}  // Controls modal visibility
          contentLabel="Minimal Modal Example"  // Accessibility label
          style={{
            // Set the style for the background overlay.
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000, // Ensure the modal is above other content
            },
            // Set the style for the modal popup box.
            content: {
              position: 'absolute',
              // maxWidth: '80%',
              maxWidth: '400px',
              // width: '400px',
              height: '200px',
              textAlign: 'center',
              margin: '10% auto',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'auto',
              borderRadius: '5px',
              outline: 'none',
              padding: '20px'
            }
          }}
        >
          {this.state.promptText}
          <input 
            type="text" 
            placeholder="Activity" 
            ref={this.activityInputRef} 
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                this.nextState();
              }
            }}
          />
          {/* Button inside modal that closes it */}
          {/* <button onClick={this.cancel}>Cancel</button> */}
          <button onClick={this.nextState}>Enter</button>
        </ReactModal>
      </div>
    );
  }
}

// === Setup code to render the component ===


// Tell ReactModal which element contains our app
// This helps with accessibility features
ReactModal.setAppElement("#root")

// Find the DOM element where we'll mount our React app
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create a React root for rendering
const root = createRoot(rootElement);

// Render our ExampleApp component into the root element
root.render(<ExampleApp />);


// ----- Some utility functions -----

function nowTimeString(): string {
  const now = new Date();
  return niceFormatTime(now);
}

function nowDateString(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function niceFormatTime(date: Date | undefined): string {
  if (date === undefined) {
    return "--:--";
  }
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'pm' : 'am'}`;
}

function sleepMilliseconds(ms: number, callback?: () => void): () => void {
  // Create a promise that resolves after a specified number of milliseconds. 
  // The optional callback function is called when the promise resolves.
  // return new Promise((resolve) => setTimeout(callback || resolve, ms));
  var timeout = setTimeout(callback || (() => {}), ms);
  return () => clearTimeout(timeout);
  // return new Promise((resolve) => setTimeout(callback || resolve, ms));
}
function sleepSeconds(seconds: number, callback?: () => void): () => void {
  return sleepMilliseconds(1000 * seconds, callback);
}
function sleepMinutes(minutes: number, callback?: () => void): () => void {
  return sleepMilliseconds(1000 * 60 * minutes, callback);
}
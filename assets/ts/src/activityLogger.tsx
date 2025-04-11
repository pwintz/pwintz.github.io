// Import necessary React libraries and components
import React from 'react';  // Core React library
import { createRoot } from 'react-dom/client';  // Used to render React components to the DOM
import ReactModal from 'react-modal';  // A modal dialog component


// TypeScript interface defining the state of our component.
class AppState {
  isFileSelected: boolean;
  showModal: boolean;  // Tracks whether modal is visible or hidden
  promptText: string;
  textAssignmentCallback: (text: string) => void;

  static INITIAL = new AppState(false, false, "", (_text: string) => {});

  constructor(
    isFileSelected: boolean,
    showModal: boolean,
    promptText: string,
    textAssignmentCallback: (text: string) => void) {
      this.isFileSelected = isFileSelected;
      this.showModal = showModal;
      this.promptText = promptText;
      this.textAssignmentCallback = textAssignmentCallback;
  }
  toString() {
    return `AppState{isFileSelected=${this.isFileSelected}, showModal=${this.showModal}, promptText=${this.promptText}}`;
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
  // inputElement: HTMLInputElement;
  activityInputRef: React.RefObject<HTMLInputElement | null>;
  nMinutesDelayRef: React.RefObject<HTMLInputElement | null>;
  cancelPauseFnc: (() => void);
  clearNotificationFnc: (() => void);

  constructor(props: {}) {
    super(props);
    
    // TODO: This does not seem like the "right" way to get the input element.
    // this.inputElement = document.getElementById("activityInput") as HTMLInputElement;

    this.activityInputRef = React.createRef();
    this.nMinutesDelayRef = React.createRef();
    // console.log(`this.inputElement: ${this.inputElement}`)

    // Bind event handler methods to this instance
    // This ensures 'this' refers to the component instance when these methods are called
    this.selectFile = this.selectFile.bind(this);
    this.nextState = this.nextState.bind(this);
    this.cancel = this.cancel.bind(this);
    this.skipPause = this.skipPause.bind(this);
    this.appendToFile = this.appendToFile.bind(this);

    this.cancelPauseFnc = () => {};
    this.clearNotificationFnc = () => {};

    this.lastActivityText = "";
    this.betterActivityText = "";
    this.nextActivityText = "";

    this.stateSequenceIndex = 0;  // Initialize index to track the current state in the sequence
    this.stateSequence = [
      // { // Initial state: file not selected, modal not shown
      //   isFileSelected: false,
      //   showModal: false,
      //   promptText: "", 
      //   textAssignmentCallback: (text: string) => { this.lastActivityText = text; }
      // },
      {
        isFileSelected: true,
        showModal: true,
        promptText: "What were you doing?", 
        textAssignmentCallback: (text: string) => { this.lastActivityText = text; }
      },
      {
        isFileSelected: true,
        showModal: true,
        promptText: "What should you be doing?", 
        textAssignmentCallback: (text: string) => { this.betterActivityText = text; }
      },
      {
        isFileSelected: true,
        showModal: true,
        promptText: "What will you do now?", 
        textAssignmentCallback: (text: string) => { 
          this.nextActivityText = text; 
          this.appendToFile(`| ${nowTimeString()} | ${this.lastActivityText} | ${this.betterActivityText} | ${this.nextActivityText} |`);

          if (this.nMinutesDelayRef.current == null) {
            throw new Error('nMinutesDelayRef element was not found.')
          }
          var nDelayMinutes = this.nMinutesDelayRef.current.valueAsNumber;

          const onPauseEndCallback = () => { 
            this.nextState()
            // Clear the notification, if it exists, so that we don't get multiple notifications.
            this.clearNotificationFnc();
            this.clearNotificationFnc = notifyMe(`Time to record your activity check-in! (${nowTimeString()})`);
          }
          if (nDelayMinutes > 0) {
            // If the user has not given a delay, then nDaleyMinutes will be NaN, so this case will not be used.
            console.log(`Delaying ${nDelayMinutes} minutes`);
            this.cancelPauseFnc = sleepMinutes(nDelayMinutes, onPauseEndCallback);
          } else {
            console.log('No delay given. Only delaying 5 seconds');
            this.cancelPauseFnc = sleepSeconds(5, onPauseEndCallback);
          }
          
        }
      },
      { // Pause before next entry.
        isFileSelected: true,
        showModal: false,
        promptText: "", 
        textAssignmentCallback: (_text: string) => { 
          this.lastActivityText = ""; 
          this.betterActivityText = "";
          this.nextActivityText = "";
        }
      },
    ]

    // Initialize the component's state
    // this.state = this.stateSequence[0]; // TODO: Change back to INITIAL.
    this.state = AppState.INITIAL;
  }
  
  async selectFile() {
    console.log(`Select file clicked`);
    const fileList = await window.showOpenFilePicker({
        id: 'obsidianLogFile', // The browser remembers different directories for different IDs. 
        startIn: 'documents',
        multiple: false
    });
    this.activityLogFileHandle = fileList[0];

    await this.appendToFile([
      '', 
      `# ${nowDateString()}`,
      "| Time | What I was Doing | What Should I be Doing | What Will I do Next? |",
      "| ----------- | ----------- | ----------- | ----------- |"
    ]);

    // Set the state to the first element in the sequence.
    this.stateSequenceIndex = 0;
    this.setState(this.stateSequence[0]);
  }

  nextState(): void {
    
    this.clearNotificationFnc();
    this.clearNotificationFnc = () => {};

    var text = "";
    if (this.activityInputRef.current !== null) {
      text = this.activityInputRef.current.value;
      this.activityInputRef.current.value = "";
      this.activityInputRef.current.focus();
    }

    this.state.textAssignmentCallback(text || "");
    this.stateSequenceIndex = (this.stateSequenceIndex + 1) % this.stateSequence.length;
    this.setState(this.stateSequence[this.stateSequenceIndex]);
    console.log(`this.stateSequenceIndex: ${this.stateSequenceIndex}  `)
  }

  cancel(): void {
    this.stateSequenceIndex = 0;
    this.setState(this.stateSequence[0]);
    this.state.textAssignmentCallback("")
  }

  skipPause(): void {
    // this.sleepPromise.
    if (this.cancelPauseFnc === undefined) {
      console.log("No cancelPauseFnc to resolve");
      return;
    }
    console.log("Canceling pause.");
    this.cancelPauseFnc() 
    this.cancelPauseFnc = () => {};
    this.nextState();
  }

  async appendToFile(contentToAppend: string | string[]): Promise<void> {
    if (this.activityLogFileHandle === undefined) {
      throw new Error('No file selected.')
    }
    const file = await this.activityLogFileHandle.getFile();

    // Convert contentToAppend to a string if it's an array, with each entry as a line.
    if (contentToAppend instanceof Array) {
      contentToAppend = contentToAppend.join("\n");
    }
  
    var contents = await file.text();
    contents += "\n" + contentToAppend;
  
    if(typeof this.activityLogFileHandle !== "undefined") {
      if ((await this.activityLogFileHandle.queryPermission()) === 'granted') {
          const writable = await this.activityLogFileHandle.createWritable();
          await writable.write(contents);
          await writable.close();
      } else {
        console.log("Permission denied");
      }
    }
  }

  // The render method defines what the component displays
  // It's called automatically when state or props change
  render(): React.ReactNode {
    return (
      <div>
        This page is designed to help you keep track of your activities and remind you of what you should be doing. 
        It allows you to log your current activity, set a delay for the next activity, and provide suggestions for what to do next.

        To get started, please select a Markdown file where you want to record your activities. 
        Content will be appended to the end of the file.

        <p>
          <button 
          id="selectFileButton" 
            onClick={this.selectFile}
            disabled={this.state.isFileSelected}
            style={{
              // opacity: this.state.isFileSelected? 0.5 : 1,
              display: this.state.isFileSelected? 'none' : 'block'
            }}
        >Select File</button>
        </p>
        <p>
          Delay: <input ref={this.nMinutesDelayRef} type="number" defaultValue="15" style={{ width: '3em' }} /> minutes
          {/* Button that skips the pause when clicked */}
        <button 
          onClick={this.skipPause}
          disabled={!this.state.isFileSelected || this.state.showModal}
          style={{
            opacity: this.state.isFileSelected ? 1 : 0.5,
            cursor: this.state.isFileSelected ? 'pointer' : 'not-allowed'
          }}
        >Skip Delay</button>
        </p>

        <p><b>{this.stateSequence[0].promptText}</b>&nbsp;
        {this.lastActivityText}</p>
        <p><b>{this.stateSequence[1].promptText}</b>&nbsp; 
        {this.betterActivityText}</p>
        <p><b>{this.stateSequence[2].promptText}</b>&nbsp; 
        {this.betterActivityText}{this.nextActivityText}</p>

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
              width: '400px',
              height: '200px',
              textAlign: 'center',
              margin: '10% auto',
              // top: '40px',
              // left: '40px',
              // right: '40px',
              // bottom: '40px',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'auto',
              borderRadius: '4px',
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
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

// Export the component so it can be imported elsewhere
// export default ExampleApp;


// ----- Some utility functions -----
function notifyMe(notificationMessage: string): () => void {
  // Returns a callback for dismissing the notification.
  const onclickCallback = () => {
    window.focus();
  };
  var notification: Notification | null = null;

  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
    return () => {};
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    notification = new Notification(notificationMessage, );
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
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

function nowTimeString(): string {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'pm' : 'am'}`;
}

function nowDateString(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
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
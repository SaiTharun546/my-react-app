<style>
  #chat {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  #messageInputContainer {
    position: relative;
    display: flex;
    align-items: stretch;
    width: 80%; /* Adjust the width as needed */
    margin: 0 auto;
  }

  #stopresponse {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 30px; /* Adjust the width as needed */
    background-color: #007acc; /* Adjust the color as needed */
    color: white;
    border: none;
    cursor: pointer;
    z-index: 1; /* Ensure it's above other elements */
  }

  #messageInput {
    flex: 1;
    width: calc(100% - 30px); /* Adjust the width as needed */
    height: 50px;
    background-color: var(--vscode-inlineChatInput-background);
    color: var(--vscode-inlineChatInput-foreground);
    border: var(--vscode-button-border);
    padding-right: 30px; /* Make space for the stop button */
    z-index: 0; /* Ensure it's below the "Stop" button */
  }

  #sendButton {
    background: var(--vscode-button-background);
    height: 50px;
    width: 50px;
    border: var(--vscode-button-border);
    cursor: pointer;
    z-index: 1; /* Ensure it's above other elements */
  }

  #sendButton svg {
    width: 30px;
  }
</style>

<div id="chat">
  <div id="messageInputContainer">
    <textarea id="messageInput" type="text" placeholder="Enter your message..."></textarea>
    <button id="stopresponse" onclick="stopResponse()">Stop</button>
    <button onclick="sendMessage()" id="sendButton">
      <svg style="enable-background:new 0 0 30.2 30.1;" version="1.1" viewBox="0 0 30.2 30.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <style type="text/css">
          .st0{fill:none;stroke:#FFFFFF;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
          .st1{fill:none;stroke:#FFFFFF;stroke-width:1.1713;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
        </style>
        <path class="st0" d="M2.1,14.6C8.9,12,28.5,4,28.5,4l-3.9,22.6c-0.2,1.1-1.5,1.5-2.3,0.8l-6.1-5.1l-4.3,4l0.7-6.7l13-12.3l-16,10  l1,5.7l-3.3-5.3l-5-1.6C1.5,15.8,1.4,14.8,2.1,14.6z"/>
      </svg>
    </button>
  </div>
</div>

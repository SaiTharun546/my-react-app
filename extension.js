<div id="chat">
      <div id="welcomeMessage" class="chat-message">
        <h1 id="Aide">AiDEAssist</h1>
        <h4>
          Hello<span class="wave-emoji">👋</span> <%= name %>, Welcome to
          AiDEAssist
        </h4>
        <p>Ask me anything about code !</p>
        <div class="cards-container">
          <div class="card" onclick="runAnalysis('Analyze Code')">
            Analyze Code
          </div>
          <div class="card" onclick="runAnalysis('Code Documentation')">
            Code Documentation
          </div>
          <div class="card" onclick="runAnalysis('Refactor Code')">
            Refactor Code
          </div>
          <div class="card" onclick="runAnalysis('UnitTest Case Generation')">
            UnitTest Case Generation
          </div>
        </div>
      </div>
    </div>
    <div class="chat-action">
      <textarea
        id="messageInput"
        type="text"
        placeholder="Enter your message..."
      ></textarea>
      <div class="iconscontainer">
        <button class="stopfunc" onclick="stopResponse()">
          <?xml version="1.0" ?><svg class="stopicon" enable-background="new 0 0 32 32" height="32px" id="svg2" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg"><g id="background"><rect fill="none" height="32" width="32"/></g><g id="stop_x5F_badge"><path d="M14,23c0-4.973,4.027-9,9-9l0,0c4.971,0,8.998,4.027,9,9l0,0c-0.002,4.971-4.029,8.998-9,9l0,0   C18.027,31.998,14,27.971,14,23L14,23z M16.116,23c0.008,3.799,3.083,6.874,6.884,6.883l0,0c3.799-0.009,6.874-3.084,6.883-6.883   l0,0c-0.009-3.801-3.084-6.876-6.883-6.884l0,0C19.199,16.124,16.124,19.199,16.116,23L16.116,23z"/><rect height="6" width="6" x="20" y="20"/></g></svg>
        </button> 
        <button onclick="sendMessage()" id="sendButton">
          <svg
            style="enable-background: new 0 0 30.2 30.1"
            version="1.1"
            viewBox="0 0 30.2 30.1"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <style type="text/css">
              .st0 {
                fill: none;
                stroke: #ffffff;
                stroke-width: 1.25;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-miterlimit: 10;
              }
  
              .st1 {
                fill: none;
                stroke: #ffffff;
                stroke-width: 1.1713;
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-miterlimit: 10;
              }
            </style>
            <path
              class="st0"
              d="M2.1,14.6C8.9,12,28.5,4,28.5,4l-3.9,22.6c-0.2,1.1-1.5,1.5-2.3,0.8l-6.1-5.1l-4.3,4l0.7-6.7l13-12.3l-16,10  l1,5.7l-3.3-5.3l-5-1.6C1.5,15.8,1.4,14.8,2.1,14.6z"
            />
          </svg>
        </button>
      </div>
    </div>
#stopresponse {
        height: 40px;
        width: 45px;
        border: var(--vscode-button-border);
        cursor: pointer;
        border-radius: 50px;
      }
      .stopfunc {
        position: fixed;
        bottom: 0;
        margin-left: 79%;
        margin-bottom: 13px;
        background:none;
        color: white;
      }
      .stopfunc{
        background: none;
        height: 40px;
        width: 60px;
        border: var(--vscode-button-border);
        cursor: pointer;
        border-radius: 50px;
        opacity: 0.5;
      }
      .stopfunc .stopicon {
        fill: white;
        width: 40px;
        height: 40px;;

      }
      .stopfunc:hover {
        color: white; 
        opacity: 1;/* Change color on hover */
      }
      
      .stopfunc:hover .stopicon {
        fill: white; /* Change SVG color on hover */
      }
      
      .stopfunc:hover::before {
        content: "Stop Response"; /* Display text on hover */
        display: block;
        position: absolute;
        background-color: var(--vscode-inlineChatInput-background);
        color: white;
        padding: 5px;
        border-radius: 5px;
        margin-top: -50px;
        margin-left: 10px;
        z-index: 1;
      }
      .stopfunc:disabled {
        opacity: 0.5; /* Set a lower opacity for a disabled look */
        cursor: not-allowed; /* Change cursor for a disabled button */
      }
      .chat-action {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1;
      }

      .chat-action textarea {
        width: calc(100% - 50px);
        height: 50px;
        background-color: var(--vscode-inlineChatInput-background);
        color: var(--vscode-inlineChatInput-foreground);
        resize: vertical;
        min-height: 50px;
      }

      #sendButton {
        background: none;
        height: 40px;
        width: 45px;
        border: var(--vscode-button-border);
        cursor: pointer;
        border-radius: 50px;
      }

      #sendButton svg {
        width: 30px;
      }

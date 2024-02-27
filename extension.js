<html>
  <head>
    <meta charset="UTF-8" />
    <title>Webview</title>
    <style>
      #messageInput {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 80%;
        /* Adjust the width as needed */
      }

      #chat {
        padding: 5px;
        margin-bottom: 10px;
        line-height: 1.6;
        letter-spacing: normal;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 14px;
        font-family: "Segoe UI", "Helvetica Neue", "Helvetica", Arial,
          sans-serif;
        overflow-wrap: break-word;
        padding-bottom: 70px;
      }

      .message {
        margin-bottom: 10px;
      }

      #sendButton {
        position: fixed;
        bottom: 0;
        left: 80%;
      }

      .loading {
        font-style: italic;
        color: #888;
      }

      .container {
        width: 100%;
      }

      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }

      pre {
        position: relative;
        overflow: auto;

        margin: 5px 0;
        padding: 1.75rem 0 1.75rem 1rem;
        border-radius: 10px;
        background-color: var(--vscode-input-background);
      }

      code {
        color: var(--vscode-editor-foreground);
        background-color: transparent;
      }

      pre button {
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 0.15rem;
        background-color: #828282;
        font-size: 12px;
        border: ridge 1px #7b7b7c;
        border-radius: 5px;
        text-shadow: #c4c4c4 0 0 2px;
      }

      pre button:hover {
        cursor: pointer;
        background-color: #bcbabb;
      }

      h1 {
        font-size: 1.3rem;
      }

      .chat-action {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 100%;
      }

      .chat-action textarea {
        width: 100%;
        height: 50px;
        background-color: var(--vscode-inlineChatInput-background);
        color: var(--vscode-inlineChatInput-foreground);
        resize: vertical;
        min-height: 50px;
      }

      #sendButton {
        background: var(--vscode-button-background);
        height: 50px;
        width: 50px;
        border: var(--vscode-button-border);
        margin-left: 50px;
        cursor: pointer;
      }

      #sendButton svg {
        width: 30px;
      }
      .copy-button {
        display: none; /* Hide the button by default */
        background-color: rgb(181, 170, 177); /* Background color */
        color: black; /* Text color */
        border: none; /* Remove border */
        border-radius: 5px;
        padding: 3px 5px; /* Add padding */
        cursor: pointer; /* Change cursor on hover */
        position: absolute; /* Position the button absolutely */
        top: 10; /* Align the button to the top of the section */
        right: 0;
        opacity: 0.4;
      }
      .copy-button.visible {
        display: inline-block; /* Show the button on hover */
      }
      .copy-button:hover {
        background-color: rgb(181, 170, 177);
        opacity: 0.7;
      }
      #welcomeMessage {
        color: #ffffff; /* Set your desired text color */
        padding: 3px;
        border-radius: 3px;
        text-align: center;
        justify-content: center;
        margin-top: 100px;
        font-family: "Poppins", sans-serif;
        font-weight: 100;
        position: fixed;
      }
      .card {
        width: 160px;
        height: 50px;
        border: 1px solid #ccc;
        margin: 10px;
        border-radius: 10px;
        border-color: grey;
        cursor: pointer;
        padding: 2rem;
        display: flex;
        justify-content: center;
        font-family: "Poppins", sans-serif;
        align-items: center;
      }
      #Aide {
        font-size: 50px;
        border-color: white;
        font-family: "Lato", sans-serif;
        font-family: "Roboto Slab", serif;
        border-color: solid 2px yellow;
      }
      .cards-container {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
      }
    </style>
  </head>

  <body>
    <div id="chat">
      <div id="welcomeMessage" class="chat-message">
        <h1 id="Aide">AiDEAssist</h1>
        <h2>
          Hello<span class="wave-emoji">👋</span> "<%= name %>", Welcome to
          AiDEAssist
        </h2>
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
    <script>
      let conversation = [];
      let conversationHistory = [];
      const vscode = acquireVsCodeApi();
      let isResponsePending = false;
      let isDragging = false;
      let initialX;
      let initialY;
      document.addEventListener("paste", function (e) {
        if (e.target.tagName.toLowerCase() === "textarea") {
          setTimeout(function () {
            autoExpand(e.target);
          }, 0);
        }
      });
      document
        .getElementById("messageInput")
        .addEventListener("mousedown", function (e) {
          isDragging = true;
          initialX = e.clientX;
          initialY = e.clientY;

          document.addEventListener("mousemove", handleDrag);
          document.addEventListener("mouseup", () => {
            isDragging = false;
            document.removeEventListener("mousemove", handleDrag);
          });
        });

      function handleDrag(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;
        const textarea = document.getElementById("messageInput");
        initialX = e.clientX;
        initialY = e.clientY;
      }

      function autoExpand(textarea) {
        textarea.style.height = "50px";
        const currentScrollHeight = textarea.scrollHeight;

        // Set the textarea height to 0 to get the scrollHeight accurately

        // Set the height to the scrollHeight or a maximum value
        textarea.style.height = Math.min(currentScrollHeight, 200) + "px";
      }
      function runAnalysis(cardName) {
        // Send a message to the extension to trigger the analysis for the selected card
        vscode.postMessage({
          command: "runAnalysis",
          cardName: cardName,
        });
      }
      function saveConversationToContext1(conversation) {
        vscode.postMessage({ command: "saveConversation", conversation });
      }
      function storeConvo(conv) {
        vscode.postMessage({ command: "storeConv", text: conv });
      }
      function loadConversation() {
        vscode.postMessage({ command: "loadConversation", conversation });
      }
      function showLoader() {
        const chat = document.getElementById("chat");
        const loadingMessage = document.createElement("p");
        loadingMessage.classList.add("loading");
        loadingMessage.innerHTML = "<strong>AiDE:</strong> Loading...";
        chat.appendChild(loadingMessage);
      }
      async function copyCode(block, button) {
        const copyButtonLabel = "Copy Code";
        let code = block.querySelector("code");
        let text = code.innerText;

        await navigator.clipboard.writeText(text);
        button.innerText = "Code Copied";
        setTimeout(() => {
          button.innerText = copyButtonLabel;
        }, 700);
      }
      function copyCodeInit() {
        const copyButtonLabel = "Copy Code";
        let blocks = document.querySelectorAll("pre");

        blocks.forEach((block) => {
          if (navigator.clipboard && !block.classList.contains("code_block")) {
            let button = document.createElement("button");

            button.innerText = copyButtonLabel;
            block.appendChild(button);
            block.classList.add("code_block");

            button.addEventListener("click", async () => {
              await copyCode(block, button);
            });
          }
        });
      }
      function copyMessageInit() {
        const copyButtonLabel = "Copy";

        let messages = document.querySelectorAll("section");

        messages.forEach((message, index) => {
          if (
            navigator.clipboard &&
            !message.classList.contains("message_copied")
          ) {
            let button = document.createElement("button");
            button.innerHTML = `<svg height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 210.107 210.107" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#1D1D1B;" d="M168.506,0H80.235C67.413,0,56.981,10.432,56.981,23.254v2.854h-15.38 c-12.822,0-23.254,10.432-23.254,23.254v137.492c0,12.822,10.432,23.254,23.254,23.254h88.271 c12.822,0,23.253-10.432,23.253-23.254V184h15.38c12.822,0,23.254-10.432,23.254-23.254V23.254C191.76,10.432,181.328,0,168.506,0z M138.126,186.854c0,4.551-3.703,8.254-8.253,8.254H41.601c-4.551,0-8.254-3.703-8.254-8.254V49.361 c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.253,3.703,8.253,8.254V186.854z M176.76,160.746 c0,4.551-3.703,8.254-8.254,8.254h-15.38V49.361c0-12.822-10.432-23.254-23.253-23.254H71.981v-2.854 c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.254,3.703,8.254,8.254V160.746z"></path> </g> </g></svg>
                    `;

            message.insertBefore(button, message.firstChild);
            message.classList.add("message_copied");

            button.classList.add("copy-button");
            button.addEventListener("click", async () => {
              await copyMessageContent(message, button);
            });

            const pClass = "bot-response-" + index;
            message.classList.add(pClass);

            message.addEventListener("mouseover", () => {
              button.classList.add("visible");
            });

            message.addEventListener("mouseout", () => {
              button.classList.remove("visible");
            });
          }
        });
      }

      async function copyMessageContent(message, button) {
        const copyButtonLabel = "Copy";
        let text = message.innerText;

        await navigator.clipboard.writeText(text);
        button.innerHTML = `<svg height="15px" width="15px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0)"> <path d="M42 20V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6H30" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 20L26 28L41 7" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g> <defs> <clipPath id="clip0"> <rect width="48" height="48" fill="white"></rect> </clipPath> </defs> </g></svg>`;

        setTimeout(() => {
          button.innerHTML = `<svg height="15px" width="15px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 210.107 210.107" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#1D1D1B;" d="M168.506,0H80.235C67.413,0,56.981,10.432,56.981,23.254v2.854h-15.38 c-12.822,0-23.254,10.432-23.254,23.254v137.492c0,12.822,10.432,23.254,23.254,23.254h88.271 c12.822,0,23.253-10.432,23.253-23.254V184h15.38c12.822,0,23.254-10.432,23.254-23.254V23.254C191.76,10.432,181.328,0,168.506,0z M138.126,186.854c0,4.551-3.703,8.254-8.253,8.254H41.601c-4.551,0-8.254-3.703-8.254-8.254V49.361 c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.253,3.703,8.253,8.254V186.854z M176.76,160.746 c0,4.551-3.703,8.254-8.254,8.254h-15.38V49.361c0-12.822-10.432-23.254-23.253-23.254H71.981v-2.854 c0-4.551,3.703-8.254,8.254-8.254h88.271c4.551,0,8.254,3.703,8.254,8.254V160.746z"></path> </g> </g></svg>`;
        }, 700);
      }
      function getConv() {
        let msg = "";
        if (conversation.length > 0) {
          conversation.forEach(function (conv) {
            msg = msg + conv.actor + " : " + conv.message + "\\n";
          });
        }
        return msg;
      }
      function replaceNewlinesWithBr(inputText) {
        var regex = /(<pre>[\s\S]*?<\/pre>)|(\r\n|\r|\n)/g;
        var result = inputText.replace(regex, function (match, pre) {
          if (pre) {
            return pre;
          } else {
            return "<br />";
          }
        });

        return result;
      }
      function sendMessage() {
        let display = document.getElementById("welcomeMessage");
        if(display){
            display.remove();
        }
        const input = document.getElementById("messageInput");
        const message = input.value;

        if (input.value.trim() !== "") {
          input.value = "";
          const sendConv = [];
          const userMessage = document.createElement("p");
          userMessage.innerHTML = formatMessage(
            "<%= name %>",
            replaceNewlinesWithBr(message)
          );
          document.getElementById("chat").appendChild(userMessage);
          showLoader();
          conversation.push({ actor: `<%= name %>`, message: message });
          const conv = getConv();
          sendConv.push({ actor: `<%= name %>`, message: message });
          vscode.postMessage({
            command: "sendMessage",
            text: conv,
            convo: sendConv,
          });
        }
        autoExpand(input);
      }

      function formatMessage(name, message) {
        return `<strong>${name}:</strong> ${message}`;
      }

      document
        .getElementById("messageInput")
        .addEventListener("keypress", function (event) {
          if (event.key === "Enter") {
            if (!event.shiftKey) {
              event.preventDefault(); // Prevents the default behavior of the Enter key
              sendMessage();
            } else {
              // Insert a newline character if Shift+Enter is pressed
              this.value += "\n";
              autoExpand(event.target);
            }
          }
        });
      window.addEventListener("message", (event) => {
        const message = event.data;
        const chat = document.getElementById("chat");
        if (message.command === "clearChat") {
          conversation = [];
          chat.innerHTML = "";
          showLoader();
        }

        if (message.command === "loadConversation") {
          console.log("Received loadConversation command:", message);
          chat.innerHTML = "";
          const arrLen = message.conversation.length - 1;
          const arr = message.conversation[arrLen];
          if (!arr[arr.length - 1].message.includes("History cleared")) {
            conversation.push(arr[arr.length - 1]);
          }
          message.conversation.forEach((entry) => {
            entry.forEach((entries) => {
              const messageElement = document.createElement("div");
              messageElement.innerHTML = formatMessage(
                entries.actor,
                entries.message
              );
              chat.appendChild(messageElement);
            });
          });
        }

        if (message.command === "updateChat") {
          console.log("Received updateChat command:", message);
          clearLoadingMessage(chat);
          const responseMessage = document.createElement("section");
          const pClass = "bot-response-" + conversation.length;
          const updConv = [];
          if (
            message.botResponse == "" ||
            message.botResponse == "History Cleared"
          ) {
            responseMessage.innerHTML =
              '<p class="' + pClass + '">History cleared!!' + "</p>";
          } else {
            responseMessage.innerHTML =
              '<p class="' +
              pClass +
              '"><strong>AiDE: </strong> ' +
              message.botResponse +
              "</p>";
            chat.appendChild(responseMessage);
            console.log("Bot Response:", message.botResponse);
            conversation.push({
              actor: "AiDE",
              message: message.originalResponse,
            });
            updConv.push({ actor: "AiDE", message: message.originalResponse });
          }
          copyCodeInit();
          copyMessageInit();
          document.querySelector("." + pClass).scrollIntoView({
            behavior: "smooth",
          });
          saveConversationToContext1(updConv);
        }
        function clearLoadingMessage(chat) {
          const loadingMessage = chat.querySelector("p.loading");

          if (loadingMessage) {
            loadingMessage.remove();
          }
        }
      });
    </script>
  </body>
</html>

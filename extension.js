const vscode = require('vscode');
const axios = require('axios');
const axiosConfig = require('./config');
const utils = require('./utils');
const he = require('he');
const os = require('os');
const systemUsername = os.userInfo().username;
const outputChannel = vscode.window.createOutputChannel('AiDEAssist');
let chatHistory = [];
let editPanel = null;
const initialChatContent = getChatContent(chatHistory);
function getChatContent(history) {
  let htmlContent = '<div id="chat">';
  for (const message of history) {
    htmlContent += `<p><strong>${systemUsername}:</strong> ${message.userMessage}</p>`;
    htmlContent += `<p>${message.botResponse}</p>`;
  }
  htmlContent += '</div>';
  return htmlContent;
}
function showChatView() {
  const chatContent = getChatContent(chatHistory);
  if (editPanel) {
    // Send the updated chat content to the editPanel
    editPanel.webview.postMessage({ command: 'updateChat', chatContent: chatContent });
  }
}
async function activate(context) {
  const selectedOption = vscode.workspace.getConfiguration().get('aide-assist.Models.allModels');
  if (selectedOption) {
    let token = '';
    let pretoken = '';

    switch (selectedOption) {
      case 'Pythia':
        const pythiaToken = vscode.workspace.getConfiguration('aide-assist.Models').get('pythia', '');
        if (!pythiaToken) {
          token = await vscode.window.showInputBox({
            prompt: 'Enter token for Pythia'
          });
          if (token) {
            await vscode.workspace.getConfiguration('aide-assist.Models').update('pythia', token, vscode.ConfigurationTarget.Global);
          }
          axiosConfig.authorization = token;
        }
        else {
          axiosConfig.authorization = pythiaToken;
          pretoken = pythiaToken;
        }
        break;
      case 'Flan-T5':
        const flanToken = vscode.workspace.getConfiguration('aide-assist.Models').get('flan-T5', '');
        if (!flanToken) {
          token = await vscode.window.showInputBox({
            prompt: 'Enter token for Flan-T5'
          });
          if (token) {
            await vscode.workspace.getConfiguration('aide-assist.Models').update('flan-T5', token, vscode.ConfigurationTarget.Global);
          }
          axiosConfig.authorization = token;
        }
        else {
          axiosConfig.authorization = flanToken;
          pretoken = flanToken;
        }
        break;
      case 'CHATGPT':
        const chatToken = vscode.workspace.getConfiguration('aide-assist.Models').get('chatgpt', '');
        if (!chatToken) {
          token = await vscode.window.showInputBox({
            prompt: 'Enter token for CHATGPT'
          });
          if (token) {
            await vscode.workspace.getConfiguration('aide-assist.Models').update('chatgpt', token, vscode.ConfigurationTarget.Global);
          }
          axiosConfig.authorization = token;
        }
        else {
          axiosConfig.authorization = chatToken;
          pretoken = chatToken;
        }
        break;
      default:
        break;
    }
    if (token) {
      console.log(`Token for ${selectedOption}: ${token}`);
      utils.infoMessage(`Token for ${selectedOption} set.`);
    }
    else if (pretoken) {
      utils.infoMessage('Token is saved before.');
    }
    else {
      utils.errorMessage('Failed to enter token');
    }
  } else {
    utils.errorMessage('Failed to get selected option.');
  }
  // Inside the extension code


  function showEditView(originalMessage) {
    const editPanel = vscode.window.createWebviewPanel(
      'editWebview',
      'Edit Message',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    editPanel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Edit Message</title>
        </head>
        <body>
            <textarea id="editTextarea">${originalMessage}</textarea>
            <button id="saveButton">Save</button>
            <script>
                const vscode = acquireVsCodeApi();
                document.getElementById('saveButton').addEventListener('click', () => {
                    const editedMessage = document.getElementById('editTextarea').value;
                    vscode.postMessage({ command: 'saveEditedMessage', editedMessage, originalMessage: '${originalMessage}' });
                    vscode.postMessage({ command: 'getLatestInfo', editedMessage, originalMessage: '${originalMessage}' })
                });
            </script>
        </body>
        </html>
    `;

    editPanel.webview.onDidReceiveMessage(message => {
      if (message.command === 'saveEditedMessage') {
        const originalMessage = message.originalMessage;
        const editedMessage = message.editedMessage;

        getBotResponse(editedMessage)
          .then(botResponse => {
            updateChatHistory(originalMessage, editedMessage, botResponse);
            console.log('Original Message:', originalMessage);
            console.log('Edited Message:', editedMessage);
            console.log('LLM Response:', botResponse);
            editPanel.dispose();
            showChatView();
          })
          .catch(error => {
            console.error('Error getting LLM response:', error);
            // Handle error as needed
          });
      }
      else if (message.command === 'getLatestInfo') {
        const originalMessage = message.originalMessage;
        const editedMessage = message.editedMessage;

        getBotResponse(editedMessage)
          .then(botResponse => {
            updateChatHistory(originalMessage, editedMessage, botResponse);
            console.log('Original Message:', originalMessage);
            console.log('Edited Message:', editedMessage);
            console.log('LLM Response:', botResponse);
            editPanel.dispose();
            showChatView();
          })
          .catch(error => {
            console.error('Error getting LLM response:', error);
            // Handle error as needed
          });
      }
    });
  }
  function updateChatHistory(originalMessage, editedMessage, botResponse) {
    const index = chatHistory.findIndex(msg => msg.userMessage === originalMessage);

    if (index !== -1) {
      chatHistory[index].userMessage = editedMessage;
      chatHistory[index].botResponse = botResponse;
    }
  }
  // Declare the showChatView function
  // function showChatView() {
  //   // Initialize or update the chat view based on chatHistory
  //   const chatContent = getChatContent(chatHistory);
  //   thisProvider.mywebView.webview.html = chatContent;
  // }
  function getChatContent(history) {
    let htmlContent = '<div id="chat">';
    for (const message of history) {
      htmlContent += `<p><strong>${systemUsername}:</strong> ${message.userMessage}</p>`;
      htmlContent += `<p>${message.botResponse}</p>`;
    }
    htmlContent += '</div>';
    return htmlContent;
  }
  // web view for sidebar panel
  const thisProvider = {
    mywebView: null,
    editPanel: null,
    originalMessageForEdit: '',
    resolveWebviewView: function (thisWebview, thisWebviewContext, thisToken) {
      thisWebview.webview.options = { enableScripts: true }
      thisWebview.webview.html = getWebviewContent();
      thisWebview.webview.onDidReceiveMessage(
        async (message) => {
          console.log('Received message from WebView:', message);
          console.log("155", message);
          if (message.command === 'saveEditedMessage') {
            console.log('Edited Message from Webview:', message.message);
            // Add further logic as needed
          }
          switch (message.command) {
            case 'sendMessage':
              console.log('Handling sendMessage command...');
              // Send the user's message to the custom LLM API
              const botResponse = await getBotResponse(message.text);
              console.log('Bot Response from LLM API:', botResponse);
              const filteredContent = this.doCodeFence(botResponse);
              const resText = this.replaceNewlinesWithBr(filteredContent);
              // Update the chat with the bot's response
              thisWebview.webview.postMessage({
                command: 'updateChat',
                userMessage: message.text,
                botResponse: resText
              });
              showChatView();
              break;
            case 'getLatestInfo':
              console.log("229", message);

              console.log('Handling sendMessage command...');
              // Send the user's message to the custom LLM API
              const botResponse2 = await getBotResponse(message.text);
              console.log('Bot Response from LLM API:', botResponse);
              const filteredContent2 = this.doCodeFence(botResponse);
              const resText2 = this.replaceNewlinesWithBr(filteredContent2);
              // Update the chat with the bot's response
              thisWebview.webview.postMessage({
                command: 'updateChat',
                userMessage: message.text,
                botResponse: resText2
              });
              showChatView();
              break;
            case 'updateWebview':
              // Handle the message, e.g., show a textarea with the original message
              console.log(message)
              showEditView(message.originalMessage);
              showChatView();
              break;
            case 'storeOriginalMessage':
              // Save the original message in the extension's state
              vscode.setState({ originalMessage: message.originalMessage });
              showChatView();
              break;
            case 'showInputBox':
              console.log("185", message)
              showEditView(message.originalMessage);

              break;
            case 'log':
              console.log(message.message);
          }
        },
        undefined,
        context.subscriptions
      );
      this.mywebView = thisWebview;
    },
    // Add this function inside your thisProvider object
    showChatView: function () {
      // Initialize or update the chat view based on chatHistory
      const chatContent = getChatContent(chatHistory);
      thisProvider.mywebView.webview.postMessage({
        command: 'updateChat',
        chatContent: chatContent,
      });
    },

    doCodeFence: function (text) {
      // Replace ```language code block ```
      text = this.encodeallHtml(text);
      text = text.replace(/```(\w+)\s*([\s\S]*?)```/g, function (match, m1, m2, offset, input_string) {
        return `<pre class="${m1}"><code>${m2}</code></pre>`;
      });

      // Replace ``` code block ```
      text = text.replace(/```([\s\S]*?)```/g, function (match, m1, offset, input_string) {
        return `<pre><code>${m1}</code></pre>`;
      });

      return text;
    },
    replaceNewlinesWithBr: function (inputText) {
      // Use a regular expression to match \n\r outside of <pre> tags
      var regex = /(<pre>[\s\S]*?<\/pre>)|(\r\n|\r|\n)/g;

      // Replace matched \r\n, \r, or \n with <br> tags, excluding content inside <pre> tags
      var result = inputText.replace(regex, function (match, pre) {
        if (pre) {
          // If the match is inside <pre> tags, return it unchanged
          return pre;
        } else {
          // Otherwise, replace the newline character with <br>
          return '<br />';
        }
      });

      return result;
    },
    encodeallHtml: function (inputText) {
      // Use a regular expression to match \n\r outside of <pre> tags
      const encodedText = inputText.replace(/[^`]+/g, function (match) {
        // Encode characters in the match except for <pre> content
        return he.encode(match);
      });

      return encodedText;
    },
    updateContent: async function (content) {
      await this.focusOnSidebar();
      const filteredContent = this.doCodeFence(content);
      const resText = this.replaceNewlinesWithBr(filteredContent);
      this.mywebView.webview.postMessage({
        command: 'updateChat',
        userMessage: "User message",
        botResponse: resText
      });
    },
    focusOnSidebar: async function () {
      await vscode.commands.executeCommand('aide-assist-view.focus');
      this.mywebView.webview.postMessage({
        command: 'clearChat'
      });
    }
  };
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("aide-assist-view", thisProvider)
  );

  //analyze
  context.subscriptions.push(
    vscode.commands.registerCommand('aideassist.analyzeCode', async () => {

      const { code, document, languageId, editor } = utils.editorFun();
      outputChannel.appendLine('Analyzing code...');
      await thisProvider.focusOnSidebar();

      vscode.window.withProgress(
        // utils.progress('Generating documentation...'),
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Analysing Code...',
          cancellable: false
        },
        async (progress) => {
          try {
            const prompt = utils.promptIns().analyzeIns + `${code} in ${languageId}`;
            const response = await utils.getAIResponse(prompt);
            await thisProvider.updateContent(response);
          }
          catch (error) {
            outputChannel.appendLine(error)
            utils.errorMessage('An error occurred during code analysis.');
          }
        }
      )
    })
  );
  // Register the new command for code documentation
  context.subscriptions.push(
    vscode.commands.registerCommand('aideassist.documentCode', async () => {

      const { code, document, languageId, editor } = utils.editorFun();
      outputChannel.appendLine('Generating documentation...');
      await thisProvider.focusOnSidebar();

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Generating documentation...',
          cancellable: false
        },
        async (progress) => {
          try {
            const prompt = utils.promptIns().documentIns + `${code} in ${languageId}`;
            const response = await utils.getAIResponse(prompt);
            await thisProvider.updateContent(response);
          } catch (error) {
            outputChannel.appendLine(error);
            utils.errorMessage('An error occurred during documentation generation.');
          }
        }
      );
    })
  );
  //generation
  context.subscriptions.push(
    vscode.commands.registerCommand('aideassist.generateCode', async () => {
      const { code, document, languageId, editor } = utils.editorFun();
      outputChannel.appendLine('Generating code...');
      await thisProvider.focusOnSidebar();

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Generating code...',
          cancellable: false
        },
        async (progress) => {
          try {
            const prompt = utils.promptIns().generateIns + `${code} in ${languageId}`;
            const response = await utils.getAIResponse(prompt);
            await thisProvider.updateContent(response);
          }
          catch (error) {
            outputChannel.appendLine(error);
            utils.errorMessage('An error occurred during code generation.');
          }
        }
      );
    })
  );
  //fix
  context.subscriptions.push(
    vscode.commands.registerCommand('aideassist.fixCode', async () => {
      const { code, document, languageId, editor } = utils.editorFun();
      outputChannel.appendLine('Fixing code...');
      await thisProvider.focusOnSidebar();

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Fixing code...',
          cancellable: false
        },
        async (progress) => {
          try {
            const prompt = utils.promptIns().fixIns + `${code} in ${languageId}`;
            const response = await utils.getAIResponse(prompt);
            await thisProvider.updateContent(response);
          } catch (error) {
            outputChannel.appendLine(error);
            utils.errorMessage('An error occurred during code fixing.');
          }
        }
      );
    })
  );
  //refactor
  context.subscriptions.push(
    vscode.commands.registerCommand('aideassist.refactorCode', async () => {
      const { code, document, languageId, editor } = utils.editorFun();
      outputChannel.appendLine('Refactoring code...');
      await thisProvider.focusOnSidebar();

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Refactoring code...',
          cancellable: false
        },
        async (progress) => {
          try {
            const prompt = utils.promptIns().refactorIns + `${code} in ${languageId}`;
            const response = await utils.getAIResponse(prompt);
            await thisProvider.updateContent(response);
          } catch (error) {
            outputChannel.appendLine(error);
            utils.errorMessage('An error occurred during code refactoring.');
          }
        }
      );
    })
  );
  //unit test case
  context.subscriptions.push(
    vscode.commands.registerCommand('aideassist.generateUnitTestCase', async () => {
      const { code, document, languageId, editor } = utils.editorFun();
      // const frameworks = {
      //   "javascript": "jest",
      //   "c#": "NUnit"
      // };
      // const framework = frameworks[languageId] || "";
      const framework = await vscode.window.showQuickPick([
        {
          label: 'Jest',
          value: 'jest',
        },
        {
          label: 'NUnit',
          value: 'Nunit',
        },
        {
          label: 'JUnit',
          value: 'Junit',
        },
        {
          label: 'Pytest',
          value: 'Pytest',
        },
        {
          label: 'Unittest',
          value: 'Unittest',
        },
      ], {
        placeHolder: 'Select framework'
      });
      if (!framework) {
        // If no framework selected, just return without showing any error
        return;
      }
      outputChannel.appendLine('Generating unit test cases...');
      await thisProvider.focusOnSidebar();

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Generating unit test cases...',
          cancellable: false
        },
        async (progress) => {
          try {
            const prompt = utils.promptIns().unitTestCasesIns + `with ${framework.value} framework\n ${code}`;
            const response = await utils.getAIResponse(prompt);
            await thisProvider.updateContent(response);
          } catch (error) {
            outputChannel.appendLine(error);
            utils.errorMessage('An error occurred during Test Case generation.');
          }
        }
      );
    })
  );
  //code conversion
  context.subscriptions.push(
    vscode.commands.registerCommand('aideassist.codeConversion', async () => {
      const { code, document, languageId, editor } = utils.editorFun();
      outputChannel.appendLine("converting code");
      await thisProvider.focusOnSidebar();


      //we can optionally try getting the source language from the extension of the fle(i,e. languageId)
      const sourceLanguage = await vscode.window.showInputBox({
        placeHolder: 'Enter source language code (e.g., javascript)',
        prompt: 'Source Language',
        value: languageId
      });

      const targetLanguage = await vscode.window.showInputBox({
        placeHolder: 'Enter target language code (e.g., python)',
        prompt: 'Target Language'
      });

      if (sourceLanguage && targetLanguage) {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Converting code',
            cancellable: false
          },
          async (progress) => {
            try {
              const prompt = utils.promptIns().codeConversionIns + `from ${sourceLanguage} to ${targetLanguage} : ${code}`;
              const response = await utils.getAIResponse(prompt);
              await thisProvider.updateContent(response);
            } catch (error) {
              outputChannel.appendLine(error);
              utils.errorMessage('An error occurred during code conversion');
            }
          }
        );
      }
    })
  );
  console.log('Chatbot extension activated');
}
let editedMessage = null;
function sendMessageToChat(message) {
  console.log('Sending edited message to chat:', message);
  editedMessage = message;
  getBotResponse(userMessage)
  thisProvider.mywebView.webview.postMessage({ command: 'updateWebview' });
}

// Add this at the beginning of your file or where appropriate

async function getBotResponse(userMessage) {
  try {
    const response = await axios({
      method: "post",
      url: axiosConfig.url,
      data: {
        "prompt": userMessage,
        "temperature": axiosConfig.data.parameters.temperature
      },
      headers: { "Authorization": `Bearer ${axiosConfig.authorization}` },

    });
    console.log("response is", response.data.output);
    return response.data.output;
  } catch (error) {
    console.error('Error communicating with LLM:', error);
    throw error;
  }
}
function getWebviewContent(editedMessage) {
  const chatContent = editedMessage
    ? `<p><strong>${systemUsername}:</strong> ${editedMessage}</p>`
    : '<p>Welcome to the chat!</p>';
  return `
    <html>
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha256-QjNBTF/fZ5XdD3S0VqPus9ydUHw8HsLJ/zeEGwGj18o=" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,200&display=swap" rel="stylesheet">
    <meta charset="UTF-8">
    <title>Webview</title>
    <style>
      #messageInput {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 80%; /* Adjust the width as needed */
      }
      #chat {
        padding: 5px;
        margin-bottom: 10px;
        line-height: 1.6;
        letter-spacing: normal;
      }
      #welcomeMessage {        
        color: #ffffff; /* Set your desired text color */
        padding: 3px;
        border-radius: 3px;
        text-align: center;
        justify-content:center;
        margin-top:300px;
        font-family: 'Poppins', sans-serif;
        font-weight: 100;
      }
      h1{
        font-weight: 100;
      }
      body {
        margin: 0;
        padding: 0;
        font-size: 14px;
        font-family: "Segoe UI","Helvetica Neue","Helvetica",Arial,sans-serif;
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

      /* make space  */
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
      position:fixed; 
      bottom:0;
      left: 0;
      z-index: 1;
    }
    .chat-action textarea {
      width: calc(100% - 50px);
      height: 50px;
      background-color: var(--vscode-inlineChatInput-background);
      color: var(--vscode-inlineChatInput-foreground);
    }
    #sendButton {
      background: var(--vscode-button-background);
      height: 50px;
      width: 50px;
      border: var(--vscode-button-border);
      cursor: pointer;
    }
    #sendButton svg {
      width: 30px;
    }
    .wave-emoji {
      display: inline-block;
      font-size: 24px; /* Set your desired font size */
      color: #3498db; /* Set your desired color */
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Set your desired shadow */
      animation: waveAnimation 3s linear infinite;
  }
   #stopresponse{
      margin-top:100px;
      margin-bottom:100px;
   }
   #editbutton{
    margin-top:100px;
      margin-bottom:100px;
   }
  @keyframes waveAnimation {
      0%, 100% {
          transform: scale(1);
      }
      50% {
          transform: scale(1.2);
      }
  }
</style>
  </head>
      <body>
        <div id="chat">
        ${chatContent}
            <div id="welcomeMessage" class="chat-message">
            <h1>Hello<span class="wave-emoji">👋</span> ${systemUsername},Welcome to AiDEAssist</h1>
          </div>
            <div class="chat-action">
              <button id="stopresponse" onclick="stopResponse()">Stop</button>             
              <textarea id="messageInput" type="text" placeholder="Enter your message..."></textarea>
              <button onclick="sendMessage()" id=sendButton><svg style="enable-background:new 0 0 30.2 30.1;" version="1.1" viewBox="0 0 30.2 30.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css">
              .st0{fill:none;stroke:#FFFFFF;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
              .st1{fill:none;stroke:#FFFFFF;stroke-width:1.1713;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
              </style><path class="st0" d="M2.1,14.6C8.9,12,28.5,4,28.5,4l-3.9,22.6c-0.2,1.1-1.5,1.5-2.3,0.8l-6.1-5.1l-4.3,4l0.7-6.7l13-12.3l-16,10  l1,5.7l-3.3-5.3l-5-1.6C1.5,15.8,1.4,14.8,2.1,14.6z"/></svg></button>
            </div>
          <div>
    </div>
        <script>
        let conversation = [];
        const vscode = acquireVsCodeApi();
        let cancelTokenSource = null;
          // Function to send a message to the extension
          function showLoader() {
            const chat = document.getElementById('chat');
            const loadingMessage = document.createElement('p');
            loadingMessage.classList.add('loading');
            loadingMessage.innerHTML = '<strong>AiDE:</strong> Loading...';
            chat.appendChild(loadingMessage);
          }
          function removeLoadingMessage() {
            const loadingMessage = document.querySelector('.loading');
            if (loadingMessage) {
              loadingMessage.remove();
            }
          }
          function stopResponse() {
            vscode.postMessage({ command: 'log', message: 'hi' });
          }    
          async function copyCode(block, button) {
            const copyButtonLabel = "Copy Code";
            let code = block.querySelector("code");
            let text = code.innerText;
            
            await navigator.clipboard.writeText(text);
          
            // visual feedback that task is completed
            button.innerText = "Code Copied";
          
            setTimeout(() => {
              button.innerText = copyButtonLabel;
            }, 700);
          }
          function copyCodeInit() {
            const copyButtonLabel = "Copy Code";

              // use a class selector if available
              let blocks = document.querySelectorAll("pre");
              
              blocks.forEach((block) => {
                // only add button if browser supports Clipboard API
                if (navigator.clipboard && !block.classList.contains('code_block')) {
                  let button = document.createElement("button");
              
                  button.innerText = copyButtonLabel;
                  block.appendChild(button);
                  block.classList.add('code_block');
              
                  button.addEventListener("click", async () => {
                    await copyCode(block, button);
                  });
                }
              });   
          }
          function getConv() {
            let msg = "";
            if(conversation.length > 0) {
              conversation.forEach(function(conv){
                msg = msg + conv.actor + " : " + conv.message + "\\n";
              })
            }
            return msg;
          }
          function sendMessage() {
            document.getElementById('welcomeMessage').style.display = 'none';
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (message !== '') {
                input.value = "";
                removeLoadingMessage();
                const userMessage = document.createElement('p');
                userMessage.innerHTML = '<strong>${systemUsername}:</strong> ' + message;

                const editButton = createEditButton(message);
                userMessage.appendChild(editButton);
                editButton.setAttribute('data-original-message', message);
                document.getElementById('chat').appendChild(userMessage);
                showLoader();
                const chatToken = vscode.workspace.getConfiguration('aide-assist.Models').get('chatgpt', '');
                axiosConfig.authorization = chatToken;
                cancelTokenSource = axios.CancelToken.source();
                conversation.push({ "actor": "User", "message": message });
                const conv = getConv();
                vscode.postMessage({ command: 'sendMessage', text: conv });
            }
        }

        function createEditButton(message) {
            const editButton = document.createElement('button');
            editButton.innerHTML = 'Edit';
            editButton.style.cursor = 'pointer';
            document.getElementById("messageInput").value = message;
            editButton.setAttribute('data-original-message', message);
            editButton.classList.add('edit-user-message');
            editButton.addEventListener('click', function () {
                const originalMessage = this.getAttribute('data-original-message');
                vscode.postMessage({ command: 'showInputBox', originalMessage });
                document.getElementById("messageInput").value = '';
            });

            return editButton;
        }
          // Handle messages from the extension
          document.getElementById("messageInput").addEventListener("keydown", function(event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault(); // Prevents the default behavior of the Enter key
                sendMessage();
            }
          });
          window.addEventListener('message', (event) => {
            const message = event.data; // Received message from the extension
            const chat = document.getElementById('chat');
            if (message.command === 'clearChat') {
              conversation = [];
              chat.innerHTML = '';
              showLoader();
            }
            if (message.command === 'updateChat') {
              console.log('Received updateChat command:', message);
              clearLoadingMessage(chat);
              const responseMessage = document.createElement('p');
              const pClass = "bot-response-" + conversation.length;
              responseMessage.innerHTML = '<p class="'+ pClass +'">AiDE: ' + message.botResponse + '</p>';
              chat.appendChild(responseMessage);
              // Log the bot response to the console
              console.log('Bot Response:', message.botResponse);
              conversation.push({ "actor": "System", "message": message.botResponse });
              copyCodeInit();
              document.querySelector('.' + pClass).scrollIntoView({
                  behavior: 'smooth'
              });
            } else if (message.command === 'updateOriginalMessage') {
              // Update the message in the chat with the edited message
              const userMessages = document.querySelectorAll('.edit-user-message');
              userMessages.forEach(userMessage => {
                const originalMessage = userMessage.getAttribute('data-original-message');
                if (originalMessage === message.originalMessage) {
                  // Update the content of the user message with the edited message
                  userMessage.innerHTML = '<strong>${systemUsername}:</strong> ' + message.editedMessage;
            
                  // Update the data attribute to reflect the edited message
                  userMessage.setAttribute('data-original-message', message.editedMessage);
                }
              });
            }
            function clearLoadingMessage(chat) {
              const loadingMessage = chat.querySelector('p.loading');
              if (loadingMessage) {
                loadingMessage.remove();
              }
            }
          });
        </script>
      </body>
    </html>
  `;
}
module.exports = {
  activate
}

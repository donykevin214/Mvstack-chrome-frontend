import { printLine } from './modules/print';
import axios from "axios";

printLine("11Using the 'printLine' function from the Print Module");
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    localStorage.setItem('JWT_token', msg.token.JWT_token)
    localStorage.setItem('refresh_Token', msg.token.refresh_Token)
});
window.addEventListener("load", () => {
    // injectOverlay();
    // showModal();
    // updateFontSize();
    addSelectionListener();
    dismissOverlayListener();
    addMenuListeners();
  });
  
  
  const showModal = () => {
      const modal = document.createElement("dialog");
      modal.setAttribute(
        "style",`
        height: fix-content;
        width: 80%;
        border: none;
        border-radius:20px;
        background-color: #f7f7f7d6;
        position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
      `
      );
      modal.innerHTML = `
      <div id="overlay"; style="height:100%">
        <div id='ai-overlay-selected'>
        <div class="overlay-content-wrapper">
          <div id='ai-response-content' style="color:black;"></div>
          <div id="overlay-vertical-line"></div>
        </div>
      </div>
      </div>
      <div style="position:absolute; top:4px; right:8px;">
        <button style="font-size: 16px; border: none; background: none; color: black;">x</button>
      </div>
      `;
      document.body.appendChild(modal);
      const dialog = document.querySelector("dialog");
      // var style = document.createElement('style');
      // style.innerHTML = `
      //   #ai-response-content {
      //     color: black;
      //   }
      // `;
      // document.head.appendChild(style);
      dialog.showModal();
      // const iframe = document.getElementById("popup-content");
      // iframe.src = chrome.extension.getURL("index.html");
      // iframe.frameBorder = 0;
      dialog.querySelector("button").addEventListener("click", () => {
        dialog.close();
      });
    }
    //background.js
    // chrome.browserAction.onClicked.addListener(function (tab) {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // chrome.tabs.sendMessage(tabs[0].id, { type: "popup-modal" });
    // });

  function injectOverlay(){
    const overlay = document.createElement("div");
    overlay.setAttribute("id", "overlay");
    
    const injectedHtml = `
      <div id='ai-overlay-selected'>
        <div class="overlay-content-wrapper">
          <div id='ai-response-content'></div>
          <div id="overlay-vertical-line"></div>
          <div id="overlay-menu-options-expanded">
            <button id="menu-summary-button">Summary</button>
            <button id="menu-bullet-button">Bullet points</button>
            <button id="overlay-other-btn-expanded">Other</button>
          </div>
        </div>
      </div>`;
    
    overlay.innerHTML = injectedHtml;
    document.body.appendChild(overlay);
  }
  
  
  
  
  
  function updateFontSize() {
    const selected = document.getElementById("ai-response-content");
    const minHeight = 200; // minimum height before font size starts scaling
    const maxHeight = 800; // maximum height where font size is capped
    const fontSizeMin = 16; // minimum font size
    const fontSizeMax = 32; // maximum font size
    const height = selected.offsetHeight;
    let fontSize = fontSizeMax;
    if (height < minHeight) {
      fontSize = fontSizeMin;
    } else if (height <= maxHeight) {
      fontSize = ((height - minHeight) / (maxHeight - minHeight)) * (fontSizeMax - fontSizeMin) + fontSizeMin;
    }
    selected.style.fontSize = `${fontSize}px`;
    window.addEventListener('resize', updateFontSize);
  }
  
  
  function addSelectionListener() {
    document.addEventListener('mouseup',function(e) {
      // prevent selection in overlay
      // if (e.target.closest("#overlay")) {
      //   return;
      // }
  
      
      const selection =  getSelectionText();
      if(selection != null && selection.length > 2){
        showWaitingSign();
        processSelection('summary',selection);
      }
      
    },{once: false});
  }
  
  function showWaitingSign(){
    const waitingSign = document.createElement("div");
    waitingSign.setAttribute("id", "waitingSign");
    waitingSign.textContent = "Processing...";
    waitingSign.style.position = "fixed";
    waitingSign.style.bottom = "20px";
    waitingSign.style.right = "20px";
    document.body.appendChild(waitingSign);
  }
  
  function removeWaitingSign(){
    const waitingSign = document.getElementById("waitingSign");
    waitingSign && waitingSign.remove();
  }
  
  let summaryResponse = "";
  let bulletResponse = "";
  function processSelection(command, selection) {
      sendToAi(command,selection, (response) => {
        removeWaitingSign();
        showModal();
        updateFontSize();
        const overlay = document.getElementById("overlay");
        const selected = document.getElementById("ai-response-content");
        if(command === 'summary'){
          summaryResponse = parseAiResponse(command, response.result);
          console.log(summaryResponse);
          selected.innerHTML = summaryResponse;
        }else if (command === 'list'){
          bulletResponse = parseAiResponse(command, response.result);
          selected.innerHTML = bulletResponse;
        }
        overlay.style.display = "flex";
      });
  }
  
  // save the selected text on text variable
  let selection = '';
  function getSelectionText() {
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    // custom selection condition for input tags
    if (
      activeElTagName == "textarea" ||
      (activeElTagName == "input" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
        typeof activeEl.selectionStart == "number")
    ) {
      selection =  activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
      // normal selection for normal text
    } else if (window.getSelection) {
      selection =  window.getSelection().toString();
    }
  
    return selection? selection : null;
  }
  
  
  
  function dismissOverlayListener(){
    // remove overlay on clicking outside the overlay
    const overlay = document.getElementById("overlay");
    overlay.onclick = function (e) {
      if (e.target.id === "overlay") {
        overlay.style.display = "none";
        summaryResponse = "";
        bulletResponse = "";
      }
    };
  }
  
  
  
  async function sendToAi(command,selection, callback){
    const JWT_token = localStorage.getItem('JWT_token');
    const refresh_Token = localStorage.getItem('refresh_Token');
 
    const data = {
        command: command,
        selection: selection,
        refresh_Token
    };
    const config = {
        headers: { 
            'Authorization': 'Bearer ' + JWT_token,
            'Content-Type': 'application/json'
         }
    };
    const res = await axios.post('http://localhost:8000/api/openAI/summarize', data, config);
    callback(res.data);
  }
  
  
  function parseAiResponse(command,responseText){
    let html = '';
    if(command === "list"){
      const items = responseText.split('\n').filter(Boolean).map(item => {
        return `<li>${item.replace(/^\d+\.\s+/, '')}</li>`;
      }).join('');
      
      html = `<ol>${items}</ol>`;
    }else if(command === "summary"){
      html = responseText;
    }
    return html;
  }
  
  function addMenuListeners(){
    const selected = document.getElementById("ai-response-content");
    const summaryButton = document.getElementById("menu-summary-button");
    const bulletButton = document.getElementById("menu-bullet-button");
  
    summaryButton.addEventListener("click", () => {
      selected.innerHTML = summaryResponse;
    });
  
    bulletButton.addEventListener("click", () => {
      if(bulletResponse){
        selected.innerHTML = bulletResponse
      }else{
        processSelection("list", selection);
      }
    });
  
  }

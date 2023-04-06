// import { printLine } from './modules/print';
import axios from "axios";
let selection;
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  localStorage.setItem('JWT_token', msg.token.JWT_token)
  localStorage.setItem('refresh_Token', msg.token.refresh_Token)
  localStorage.setItem('disable', msg.disable)
});
const summaryBtn = chrome.runtime.getURL("summary.png");
const closeBtn = chrome.runtime.getURL("close.png");
const bulletBtn = chrome.runtime.getURL("bullet.png");

window.addEventListener("load", () => {
    showModal();
    updateFontSize();
    addSelectionListener();
    addMenuListeners();
});

const showModal = () => {
  const modal = document.createElement("dialog");
  modal.setAttribute(
    "style",`
    height: fix-content;
    width: 60%;
    border-radius:20px;
    border: 5px solid #FFFFFF;
    background: radial-gradient(15.66% 32.32% at 98.81% 0.43%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */, linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.7) 7.55%, rgba(255, 255, 255, 0.42) 100%);
    box-shadow: -30px 64px 64px rgba(37, 64, 83, 0.05);
    backdrop-filter: blur(7px);
    padding: 20px;
    position: fixed; box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
  `
  );
  modal.innerHTML = `
    <div id="overlay"; style="height:100%">
      <div id='ai-overlay-selected'>
      <h1 id='title-summary-bullet'>Summary</h1>
      <div class="overlay-content-wrapper">
        <div id='ai-response-content' style="color:black;"></div>
        <div id="overlay-vertical-line"></div>
        <div id="search_text" hidden></div>
      </div>
    </div>
    </div>
    <div style="position:absolute; top:10px; right:8px;">
      <div style="display: flex; justify-content: center; justify-items: center; gap: 10px;">
        <img src=${summaryBtn} id="menu-summary-button" style="cursor: pointer;">  
        </img>
        <img src=${bulletBtn} id="menu-bullet-button" style="cursor: pointer;">
        </img>
        <img src=${closeBtn} id="close-modal-btn-content" style="cursor: pointer;">
        </img>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const dialog = document.querySelector("dialog");
  document.addEventListener(
    "click",
    function(event) {
      if (
        event.target.matches("#close-modal-btn-content")
      ) {
        selection = null;
        summaryResponse = null;
        bulletResponse = null;
        dialog.close();
      }
      // else if(event.target.matches("#menu-summary-button"))
      // {
      //   document.getElementById("title-summary-bullet").innerHTML = 'Summary';
      //   document.getElementById("ai-response-content").innerHTML = summaryResponse;
      // }
      // else if(event.target.matches("#menu-bullet-button")){
      //   document.getElementById("title-summary-bullet").innerHTML = 'Bullet Points';
      //   if(bulletResponse){
      //     document.getElementById("ai-response-content").innerHTML = bulletResponse
      //   }else{
      //     let command = "list";
      //     if(selection === null ){
      //       selection = document.querySelector('#search_text').textContent;
      //     }
      //     showWaitingSign();
      //     processSelection("list", selection);
      //     sendToAi(command,selection, (response) => {
      //       removeWaitingSign();
      //       updateFontSize();
      //       // dismissOverlayListener();
      //       const overlay = document.getElementById("overlay");
      //       const selected = document.getElementById("ai-response-content");
      //       bulletResponse = parseAiResponse(command, response.result);
      //       selected.innerHTML = bulletResponse;
      //       overlay.style.display = "flex";
      //     });
      //   }
      // }
      if(!event.target.closest("#overlay") && !event.target.matches("#menu-bullet-button") && !event.target.matches("#menu-summary-button")){
        selection = null;
        summaryResponse = null;
        bulletResponse = null;
        dialog.close();
      }
    },
    false
  )
}
 const openModal = () => {
  const dialog = document.querySelector("dialog");
  if(!document.querySelector("dialog")['open']){
    dialog.showModal();
  }
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
    const token = localStorage.getItem('JWT_token');
    const disable = localStorage.getItem('disable');
    if(disable === 'true') {
      return;
    }
    if(!token || token === 'undefined'){
        return;
    }
    if (e.target.closest("#overlay")) {
        return;
    }
    
    selection =  getSelectionText();
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
      openModal();
      document.getElementById('search_text').innerHTML = selection;
      // updateFontSize();
      // dismissOverlayListener();
      // addMenuListeners();
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
    document.getElementById("title-summary-bullet").innerHTML = 'Summary';
    selected.innerHTML = summaryResponse;
  });

  bulletButton.addEventListener("click", () => {
    document.getElementById("title-summary-bullet").innerHTML = 'Bullet Points';
    if(bulletResponse){
      selected.innerHTML = bulletResponse
    }else{
      if(selection === null ){
        selection = document.querySelector('#search_text').textContent;
      }
      processSelection("list", selection);
    }
  });
}

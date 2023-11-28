/*
    Claire Lodermeier
    The purpose of this file is to provide the client side script for a simple chat server. 
    It interacts with the dom to receive chat inputs, sends them to the server, makes requests to
    the server to get existing chats, and displays them on the html. 
*/

// dom elements
const msgBox = document.getElementById('inMsg');
const aliasBox = document.getElementById('alias');
const chats = document.getElementById('chats');

var button = document.getElementById('send');

// when th user sends a chat
button.onclick = () => {
  var alias = aliasBox.value;
  var msg = formatMsg(msgBox.value);

  // send message to the server
  sendToServer(alias, msg);

  // clear text box
  msgBox.value = '';

};

// make get requests to the server every 1 second
setInterval(getChats, 1000);

function formatMsg(msgStr) {
  /* The purpose of ths function is to format the message string to be used in the url. 
  It encodes question marks so that they are not recognized as delimitors.
  */
  var newMsgStr = '';
  for (var i = 0; i < msgStr.length; i++) {
    if (msgStr[i] == '?') {
      newMsgStr += '%3F';
    }
    else {
      newMsgStr += msgStr[i];
    }
  }
  return newMsgStr;

}

function sendToServer(alias, msg) {
  /*
 The purpose of this function is to send messages to the server. 
 Param: alias (string for the alias name), msg (string for message body)
 */

  var xhr = new XMLHttpRequest();

  if (!xhr) {
    alert('error');
    return false;
  }

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
      }
    }
  }

  let url = '/chats/post/' + alias + '/' + msg + '/';
  xhr.open('POST', url);
  xhr.send();

}

function getChats() {
  /*
  The purpose of this function is to get the chats from the server. It takes the response text
  and passes it to a function to display the chats in the html.
  */

  let url = '/chats';
  fetch(url)
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      displayChats(text);
    })
    .catch((error) => {
      console.log(error);
    });

}

async function displayChats(chatStr) {
  /*
  The purpose of this function is to display all the chats in the html. It iterates through the 
  chats, and modifies the table in the html which contains alias and message fields. 
  Param: chatStr(a string of chats, in the format alias|chat||alias2|chat2||...) 
  */

  // clear the html table
  clearChats();

  // create an array of chat strings in the format alias|message
  var chatList = chatStr.split('||');

  // iterate through the chats
  for (var i = 0; i < chatList.length - 1; i++) {

    // add new cells to html table
    let chat = chatList[i];
    let row = chats.insertRow();
    let speakerCell = row.insertCell();
    let msgCell = row.insertCell();

    // create a list for the current chat in the format [alias, message]
    var currentChat = chat.split('|');

    // create text nodes for alias and message
    let aliasNode = document.createTextNode(currentChat[0] + ': ');
    let msgNode = document.createTextNode(currentChat[1]);

    // set class attributes so css formatting can be applied
    speakerCell.setAttribute('class', 'speaker');
    msgCell.setAttribute('class', 'msg');

    // add the text nodes to the table
    speakerCell.appendChild(aliasNode);
    msgCell.appendChild(msgNode);

  }

}

function clearChats() {
  /*
  The purpose of this function is to clear the html table containing chats.
  */
  while (chats.rows.length > 0) {
    chats.deleteRow(0);
  }
}



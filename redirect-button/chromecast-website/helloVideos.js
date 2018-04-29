/**
 * Cast initialization timer delay
 **/
var CAST_API_INITIALIZATION_DELAY = 1000;
/**
 * Session idle time out in milliseconds
 **/
var SESSION_IDLE_TIMEOUT = 300000;

// Cast icon thumbnail active
var CAST_ICON_THUMB_ACTIVE = 'images/cast_icon_active.png';
// Cast icon thumbnail idle
var CAST_ICON_THUMB_IDLE = 'images/cast_icon_idle.png';
// Cast icon thumbnail warning
var CAST_ICON_THUMB_WARNING = 'images/cast_icon_warning.png';

/**
 * global variables
 */
var currentMediaSession = null;
var session = null;

/**
 *  Displays Cast button
 */
function displayButton() {
  document.getElementById("Cast-button").style.display = "inline-block";
}

/**
 *  Hides Cast button
 */
function hideButton() {
  document.getElementById("Cast-button").style.display = "none";
}

/**
 *  Opens new Tab an puts it in focus
 */
function newTab() {
  var win = window.open('index.html', '_blank');
  if (win) {
    //Browser has allowed it to be opened
    win.focus();
    window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi();
  }
};
  } else {
    //Browser has blocked it
    alert('Please allow popups for this website');
  }
}

function castNewTab() {
  //newTab();
  launchApp();
}

/**
 * Call initialization
 */
window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi();
  }
};

/**
 * initialization
 */
function initializeCastApi() {
  //for test
  displayButton();
  // default app ID to the default media receiver app
  // optional: you may change it to your own app ID/receiver
  var applicationIDs = [
      chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
    ];


  // auto join policy can be one of the following three
  // 1) no auto join
  // 2) same appID, same URL, same tab
  // 3) same appID and same origin URL
  var autoJoinPolicyArray = [
      chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
      chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED,
      chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    ];

  // request session
  var sessionRequest = new chrome.cast.SessionRequest(applicationIDs[0]);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    sessionListener,
    receiverListener,
    autoJoinPolicyArray[1],
    chrome.cast.DefaultActionPolicy.CAST_THIS_TAB);

  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

/**
 * initialization success callback
 */
function onInitSuccess() {
  appendMessage('init success');
}

/**
 * generic error callback
 * @param {Object} e A chrome.cast.Error object.
 */
function onError(e) {
  console.log('Error' + e);
  appendMessage('Error' + e);
}

/**
 * generic success callback
 * @param {string} message from callback
 */
function onSuccess(message) {
  console.log(message);
}

/**
 * callback on success for stopping app
 */
function onStopAppSuccess() {
  console.log('Session stopped');
  appendMessage('Session stopped');
  document.getElementById('casticon').src = CAST_ICON_THUMB_IDLE;
}

/**
 * session listener during initialization
 * @param {Object} e session object
 * @this sessionListener
 */
function sessionListener(e) {
  console.log('New session ID: ' + e.sessionId);
  appendMessage('New session ID:' + e.sessionId);
  session = e;
  document.getElementById('casticon').src = CAST_ICON_THUMB_ACTIVE;
  if (session.media.length != 0) {
    appendMessage(
        'Found ' + session.media.length + ' existing media sessions.');
    onMediaDiscovered('sessionListener', session.media[0]);
  }
  session.addMediaListener(
    onMediaDiscovered.bind(this, 'addMediaListener'));
  document.getElementById("Cast-button").onclick = function () { stopApp(); };
  session.addUpdateListener(sessionUpdateListener.bind(this));
}

/**
 * session update listener
 * @param {boolean} isAlive status from callback
 * @this sessionUpdateListener
 */
function sessionUpdateListener(isAlive) {
  if (!isAlive) {
    session = null;
    document.getElementById('casticon').src = CAST_ICON_THUMB_IDLE;
    document.getElementById("Cast-button").onclick = function () { castNewTab(); };
  }
}

/**
 * receiver listener during initialization
 * @param {string} e status string from callback
 */
function receiverListener(e) {
  if (e === 'available') {
    displayButton();
    console.log('receiver found');
    appendMessage('receiver found');
  }
  else {
    //for test
    //hideButton();
    console.log('receiver list empty');
    appendMessage('receiver list empty');
  }
}

/**
 * launch app and request session
 */
function launchApp() {
  console.log('launching app...');
  appendMessage('launching app...');
  chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

/**
 * callback on success for requestSession call
 * @param {Object} e A non-null new session.
 * @this onRequestSesionSuccess
 */
function onRequestSessionSuccess(e) {
  console.log('session success: ' + e.sessionId);
  appendMessage('session success: ' + e.sessionId);
  session = e;
  document.getElementById('casticon').src = CAST_ICON_THUMB_ACTIVE;
  document.getElementById("Cast-button").onclick = function () { stopApp(); };
  session.addUpdateListener(sessionUpdateListener.bind(this));
  //loadMedia('');
}

/**
 * callback on launch error
 */
function onLaunchError() {
  console.log('launch error');
  appendMessage('launch error');
}

/**
 * stop app/session
 */
function stopApp() {
  session.stop(onStopAppSuccess, onError);
}

/**
 * load media
 * @param {string} mediaURL media URL string
 * @this loadMedia
 */
function loadMedia(mediaURL) {
  if (!session) {
    console.log('no session');
    appendMessage('no session');
    return;
  }

  if (mediaURL) {
    var mediaInfo = new chrome.cast.media.MediaInfo(mediaURL);
    document.getElementById('thumb').src = MEDIA_SOURCE_ROOT +
        currentMediaThumb;
  }
  else {
    console.log('loading...' + currentMediaURL);
    appendMessage('loading...' + currentMediaURL);
    var mediaInfo = new chrome.cast.media.MediaInfo(currentMediaURL);
  }

  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.autoplay = true;

  session.loadMedia(request,
    onMediaSuccess,
    onMediaError);

}

/**
 * callback on media loading success
 * @param {Object} e A non-null media object
 */
function onMediaSuccess(e) {
  console.log('Successfully loaded image.');
  appendMessage('Successfully loaded image.');
  document.getElementById('casticon').src = CAST_ICON_THUMB_ACTIVE;
}

/**
 * callback on media loading error
 * @param {Object} e A non-null media object
 */
function onMediaError(e) {
  console.log('media error');
  appendMessage('media error');
  document.getElementById('casticon').src = CAST_ICON_THUMB_WARNING;
}

/**
 * append message to debug message window
 * @param {string} message A message string
 */
function appendMessage(message) {
  var dw = document.getElementById('debugmessage');
  dw.innerHTML += '\n' + JSON.stringify(message);
}

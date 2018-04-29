window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi();
  }
};

initializeCastApi = function() {
  cast.framework.CastContext.getInstance().setOptions({
    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
    defaultActionPolicy: chrome.cast.DefaultActionPolicy.CAST_THIS_TAB
  });
};

function caster() {
  if(cast.framework.CastContext.getInstance().getSessionState().localeCompare('SESSION_STARTED') !== 0) {
    alert("Please select to stream tab.");
  }
}
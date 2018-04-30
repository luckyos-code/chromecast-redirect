/**
 *  Call Initilization
 */
window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi();
  }
};

/**
 *  Initilization
 */
initializeCastApi = function() {
  cast.framework.CastContext.getInstance().setOptions({
    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.PAGE_SCOPED,
    defaultActionPolicy: chrome.cast.DefaultActionPolicy.CAST_THIS_TAB,
    resumeSavedSession: false
  });
};
(function dbexSyncInit() {
  var USER_COOKIE_NAME = '_dbexu';
  var _variationsInfo = {}; // eslint-disable-line

  var readyList = [];
  var readyFired = false;
  var readyEventHandlersInstalled = false;

  function ready() {
    if (!readyFired) {
      readyFired = true;
      for (var i = 0; i < readyList.length; i++) {
        readyList[i].fn.call(window, readyList[i].ctx);
      }
      readyList = [];
    }
  }

  function readyStateChange() {
    if (document.readyState === "complete") {
      ready();
    }
  }

  function domIsReady(callback, context) {
    if (readyFired) {
      callback(context);
      return;
    } else {
      readyList.push({
        fn: callback,
        ctx: context
      });
    }
    if (document.readyState === "complete") {
      ready();
    } else if (!readyEventHandlersInstalled) {
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", ready, false);
        window.addEventListener("load", ready, false);
      } else {
        document.attachEvent("onreadystatechange", readyStateChange);
        window.attachEvent("onload", ready);
      }
      readyEventHandlersInstalled = true;
    }
  }

  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length >= 2) {
      return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
  }

  function loadVariationsInfoFromCookies() {
    var j;
    var cookieValue;
    var experimentParts;
    var parts;
    var experimentId;

    cookieValue = getCookie(USER_COOKIE_NAME);
    if (cookieValue) {
      experimentParts = cookieValue.split('|');
      for (j = 0; j < experimentParts.length; j += 1) {
        parts = experimentParts[j].split(':');
        experimentId = parts[0];
        _variationsInfo[experimentId] = Number(parts[1]);
      }
    }
  }

  function chooseVariation(variations) {
    var i;
    var cumulativeWeights = 0;
    var randomSpin = Math.random();

    for (i = 0; i < variations.length; i += 1) {
      cumulativeWeights += variations[i];
      if (randomSpin < cumulativeWeights) {
        return i;
      }
    }

    return -1;
  }

  function getChosenVariation(experimentId) {
    return (_variationsInfo[experimentId] !== undefined) ? _variationsInfo[experimentId] : -1;
  }

  function showContent() {
    document.documentElement.className =
      document.documentElement.className.replace(RegExp(' ?' + 'dbex-content-hide'), '');
  }

  function hideContent() {
    document.documentElement.className += ' ' + 'dbex-content-hide';
    setTimeout(showContent, window.DBEX_HIDE_CONTENT_TIMEOUT || 1000);
  }

  window.DrivebackOnLoad = window.DrivebackOnLoad || [];

  window.dbexSync = function dbexSync(experimentIds, weights, handlers) {
    var experimentId;
    if (typeof experimentIds === 'string') { // array of experiments
      experimentId = experimentIds;
    } else {
      experimentId = experimentIds[0];
    }
    var variation = getChosenVariation(experimentId);
    if (variation < 0) {
      variation = chooseVariation(weights);
    }
    if (variation >= 0) {
      if (handlers[variation] && typeof handlers[variation] === 'function') {
        try {
          domIsReady(handlers[variation]);
        } catch (e) {
          console.error(e);
        }
      }
      window.DrivebackOnLoad.push(function trackSession() {
        window.Driveback.trackExperiment(experimentIds, variation);
      });
    }
  };

  loadVariationsInfoFromCookies();
  hideContent();

  if (window.DBEX_HIDE_CONTENT_STRATEGY !== 'async') {
    domIsReady(function() {
      setTimeout(showContent, 5);
    });
  }
}());

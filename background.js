chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript({file:'browseraction.js'});
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      	console.log("loadscripts: " + request.loadscripts);
        if (request.loadscripts){
            chrome.tabs.executeScript({file: "jquery.js"}, function(response){
                chrome.tabs.executeScript({file: "math.js"}, function(response){
                  chrome.tabs.executeScript({file: "functions.js"}, function(response){
                    chrome.tabs.executeScript({code: "bool_loaded = true;"}, function(response){
                      chrome.tabs.executeScript({file:'browseraction.js'});              
                  });
                });
              });
            });          	    	
        }
});
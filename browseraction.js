// http://stackoverflow.com/questions/858181/how-to-check-a-not-defined-variable-in-javascript
if ((typeof bool_loaded == 'undefined') || (bool_loaded == false)){
	console.log('bool not loaded');
	chrome.runtime.sendMessage({loadscripts: true});
}else{
	console.log('bool loaded');	
	smartify();
}


// debug globals
var debugCustomer = false;
var debugAttachment = true;
var debugContact = false;
var debugTaskLog = false;
var debugTask = false;
var debugMenu = false;
var debugRelation = false;
var debugAttachment = false;
var dbgModule = {customer:1, contact:2, task:3, tasklog:4, relation:5, attachment:6, menu:7, common:8, login:9}
var dbg = 0;
var msgType = {ok:1, nok:2};
var tabEnum = {taskLog:1, relation:2, attachment:3, customer:4, contact:5, linkedCustomer:6, login:7}
var activeTaskTab = tabEnum.taskLog;

var taskLog = {taskId:0, contactId:0, taskLogTypeId:0}

function setDebugModule(moduleNum){
	dbg = getValue('cmbDebug');
}
/*Send HTTP request to a resource, execute the handling function, impl, with the given id and returned data
 * Parameters:
 * id - the name of the target element
 * resource - the web resource that handles the request
 * params - the queryString for the controller mapped to the resource
 * impl - the function that handles the returned data with the id
 */
function getData(id, resource, params, impl){
    var url = "http://127.0.0.1:8082/maverick/"+resource+params;
    fetch(url)
    .then(function(response) {
        return response.json();
        }
    )
    .then(function(body){
        impl(id, body);
        }
    )
    .catch(err=>console.log(`err: ${err}` + `err: ${err.stack}` + ` url:${url}`));
}


function getDataEx(id, resource, params, impl, defaultOption, funcValue, funcText, eventHandler){
    var url = "http://127.0.0.1:8082/maverick/"+resource+params;
    fetch(url)
    .then(function(response) {
    		if(resource.endsWith('html'))
    			return response.text();
    		else
    			return response.json();
        }
    )
    .then(function(body){
        impl(id, body, defaultOption, funcValue, funcText, eventHandler);
        }
    )
    .catch(err=>console.log(`err: ${err}` + `err: ${err.stack}` + ` url:${url}`));
}


function setData(method, formData, resource){
	return fetch('http://127.0.0.1:8082/maverick/' + resource, {
        method: method,
        body: formData
    })
      .then(r =>  r.json().then(data => ({status: r.status, body: data})))
	.then(function(obj){return obj.body;})
}


function getHTML(url) {
	  // Return a new promise.
	  return new Promise(function(resolve, reject) {
	    // Do the usual XHR stuff
	    var req = new XMLHttpRequest();
	    req.open('GET', url);

	    req.onload = function() {
	      if (req.status == 200) {
	        // Resolve the promise with the response text
	        resolve(req.response);
	      }
	      else {
	        reject(Error(req.statusText));
	      }
	    };

	    // Handle network errors
	    req.onerror = function() {
	      reject(Error("Network Error"));
	    };

	    // Make the request
	    req.send();
	  });
	}

/**
 * 
 * @param id
 * @param data
 * @param defaultOption
 * @param funcValue
 * @param funcText
 * @param eventHandler
 * @returns
 */
function fillSelect(id, data, defaultOption, funcValue, funcText, eventHandler){
    let selectElement = document.getElementById(id);
    for (let i = selectElement.length - 1; i >= 0; i--) {
        selectElement.remove(i);
    }

    if(dbg == dbgModule.common)
    	console.log(data);
    
    if(defaultOption != undefined){
	    let opt = document.createElement("OPTION");
	    opt.value = 0;
	    opt.text = defaultOption;
	    selectElement.appendChild(opt)
    }
    
    data.array.forEach(function (item) {
    	let opt = document.createElement("OPTION");
    	funcValue(opt,item);
    	funcText(opt,item);
    	if(eventHandler != undefined)
    		eventHandler(opt,item);
        selectElement.appendChild(opt);                        
    }); 	
}

function fillTab(id, data, defaultOption, funcValue, funcText, eventHandler){
	getById(id).innerHTML = data;
}

/**
 * Search (case insensitive) for the given text in the given select.
 * Display on the Option elements that contains this search
 * @param selectId
 * @param inputTextId
 * @param event
 * @returns
 */
function searchText(selectId, inputTextId, event){
	var selectElem = document.getElementById(selectId);
	var inputTextElem = document.getElementById(inputTextId);
	
	if(inputTextElem.value == ''){
		for (var i = selectElem.length - 1; i >= 0; i--)
			selectElem.options[i].style.display='';
	}
	
    for (var i = selectElem.length - 1; i >= 0; i--) {
    	let elemText = selectElem.options[i].text.toLowerCase();
    	let elemInputText = inputTextElem.value.toLowerCase()
    	if(!elemText.includes(elemInputText))
    		selectElem.options[i].style.display='none';
    }
}

// ***** helpers ***** //

function setValue(elementId, value){
	document.getElementById(elementId).value = value;
}

function getValue(elementId){
	return document.getElementById(elementId).value;
}

function getById(id){
	return document.getElementById(id);
}

function setMsg(type, text){
	let msgBoard = getById('messageInfo'); 
	switch(type){
	case msgType.ok:
		msgBoard.style.color = 'White';
		msgBoard.style.backgroundColor = '#424f5a';
		break;
	case msgType.nok:
		msgBoard.style.color = 'White';
		msgBoard.style.backgroundColor = 'Red';
		break;
		default:
			console.log('invalid msgType');
	}
	msgBoard.innerHTML = text;
}

// ***** debug ***** //

function debugFormData(formData){
	for (var pair of formData.entries()) {
		console.log(pair[0]+ ', ' + pair[1]); 
	}
}
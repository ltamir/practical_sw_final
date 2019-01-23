// globals

var dbgModule = {customer:1, contact:2, task:3, tasklog:4, relation:5, attachment:6, menu:7, common:8, login:9}
var dbg = 0;
var msgType = {ok:1, nok:2};
var tabEnum = {taskLog:1, relation:2, attachment:3, customer:4, timeline:5, linkedCustomer:6, login:7, connection:8}
var activeTaskTab = tabEnum.taskLog;
var effortUnit = {
		1:{src:"images/effortUnit_hours.png", unit:'h', title:'hours'},
			2:{src:"images/effortUnit_days.png", unit:'d', title:'days'},
			3:{src:"images/effortUnit_months.png", unit:'m', title:'months'}
}
var taskTypeImg = {
		1:{src:"images/tasklist/project.png", title:"Project"},
		2:{src:"images/tasklist/requirements.png", title:"Requirement"},
		3:{src:"images/tasklist/design.png", title:"Design"},
		4:{src:"images/tasklist/develop.png", title:"Development"},
		5:{src:"images/tasklist/qa.png", title:"QA"},
		6:{src:"images/tasklist/delivery.png", title:"Delivery"},
		7:{src:"images/tasklist/support.png", title:"Support"}
	}
var taskStatusImg = {
		1:{src:"images/status/new.png", title:"New"},
		2:{src:"images/status/running.png", title:"Running"},
		3:{src:"images/status/delivered.png", title:"Delivered"},
		4:{src:"images/status/closed.png", title:"Closed"},
		5:{src:"images/status/onhold.png", title:"On Hold"}
	}

var taskLogObj = {
		taskLogId:{value:0, domField:'taskLogId', dom:null},
		sysdate:{value:0, domField:'sysDate', dom:null},
		taskId:{value:0, domField:'taskId', dom:null},
		contactId:{value:0, domField:'cmbTaskLogContact', dom:null},
		description:{value:'', domField:'txtTaskLogDescription', dom:null},
		taskLogTypeId:{value:0, domField:'cmbTaskLogType', dom:null}
		}
var taskObj={
		taskId:{value:0, domField:'taskId', dom:null}, 
		taskTypeId:{value:0, domField:'cmbDetailTaskType', dom:null}, 
		contactId:{value:0, domField:'cmbDetailContact', dom:null}, 
		title:{value:'', domField:'txtDetailTaskTitle', dom:null}, 
		effort:{value:1, domField:'txtDetailTaskEffort', dom:null}, 
		effortUnit:{value:1, domField:'effortUnit', dom:null}, 
		dueDate:{value:'', domField:'txtDetailDueDate', dom:null}, 
		statusId:{value:0, domField:'cmbDetailStatus', dom:null} 
		}
var loggedContact;
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
		if(response.redirected)
			window.location.replace(response.url);
        return response.json();
        }
    )
    .then(function(body){
        impl(id, body);
        }
    )
    
}

function setData(method, formData, resource){
	return fetch('http://127.0.0.1:8082/maverick/' + resource, {
        method: method,
        body: formData
    })
      .then(r =>  r.json().then(data => ({status: r.status, body: data})))
	.then(function(obj){return obj.body;})
}

function getDataEx(id, resource, params, impl, defaultOption, funcValue, funcText, eventHandler){
    var url = "http://127.0.0.1:8082/maverick/"+resource+params;
    fetch(url)
    .then(function(response) {
    		if(response.redirected)
    			window.location.replace(response.url);
    		if(resource.endsWith('html')){
    			return response.text();
    		}
    		else
    			return response.json();
        }
    )
    .then(function(body){
    	if(body.status == 'nack'){
    		console.log(body.err);
    		setMsg(msgType.nok, body.msg);
    		return;
    	}
    	if(impl != null)
    		impl(id, body, defaultOption, funcValue, funcText, eventHandler);
        }
    )
    .then(function(body){return body;})
    //.catch(err=>console.log(`err: ${err}` + `err: ${err.stack}` + ` url:${url}`));
}

function getHTML(url) {
	  // Return a new promise.
	  return new Promise(function(resolve, reject) {
	    // Do the usual XHR stuff
	    var req = new XMLHttpRequest();
	    req.open('GET', url);

	    req.onload = function() {
	      if (req.status == 200) {
	    		if(req.responseURL.endsWith('login.html'))
	    			window.location.replace(req.responseURL);
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
		opt.style.background = 'SlateGray';
		opt.style.color = 'White';
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
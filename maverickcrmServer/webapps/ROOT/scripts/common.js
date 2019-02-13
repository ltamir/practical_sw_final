// globals

var Module = {customer:1, contact:2, task:3, tasklog:4, relation:5, attachment:6, menu:7, common:8, login:9, address:10}
var dbg = 0;
var msgType = {ok:1, nok:2};
var tabEnum = {taskLog:1, relation:2, attachment:3, customer:4, timeline:5, linkedCustomer:6, login:7, connection:8, permission:9}
var activeTaskTab = tabEnum.taskLog;
var activeCrmTab;

function subscriber(module, listener){
	this.module = module;
	this.listener = listener
}
var eventBroker = {
		subscribers:{}
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
    	if(response.status != 200){
    		setMsg(msgType.nok, 'Error ' + response.status + ': ' + response.statusText);
    	}
		if(response.redirected)
			window.location.replace(response.url);
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
    		impl(id, body);
        }
    )
    
}

function setData(method, formData, resource){
	return fetch('http://127.0.0.1:8082/maverick/' + resource, {
        method: method,
        body: formData
    })
    .then(function(response) {
		if(response.redirected)
			window.location.replace(response.url);
		if(resource.endsWith('html')){
			return response.text();
		}
		else
			return response.json();
    })
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
//    .then(function(body){return body;})
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

    if(dbg == Module.common)
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

function fillDivList(divId, data, defaultOption, funcValue, funcText, eventHandler){
	let divList = getById(divId);
	
	for(let i = divList.childNodes.length-1; i > -1; i--)
		divList.removeChild(divList.childNodes[i]);
	
	data.array.forEach(function (item) {
		let divRow = document.createElement('DIV');
		divList.appendChild(divRow);	
		funcValue(divRow, item); 
		let txtPart;
		if(funcText != null){
			txtPart = document.createElement("SPAN");
			funcText(txtPart, item);
			setTextDirection(txtPart, txtPart.innerHTML);
			if(txtPart.style.direction == 'rtl'){
				divRow.style.direction = 'rtl'; 
			}
		
			divRow.appendChild(txtPart);			
		}

		if(eventHandler != null)
			eventHandler(txtPart, item);
	});
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
		for(let i = selectElem.childNodes.length-1; i > -1; i--)
			selectElem.childNodes[i].style.display='';
	}

	
    for (var i = selectElem.childNodes.length - 1; i >= 0; i--) {
    	let elemText = selectElem.childNodes[i].innerHTML.toLowerCase();
    	let elemInputText = inputTextElem.value.toLowerCase()
    	if(!elemText.includes(elemInputText))
    		selectElem.childNodes[i].style.display='none';
    	else
    		selectElem.childNodes[i].style.display='';
    	
    }
}

// ***** helpers ***** //

function setValue(elementId, value){
	document.getElementById(elementId).value = value;
}

function getValue(elementId){
	return document.getElementById(elementId).value;
}

function getState(elementId){
	return document.getElementById(elementId).getAttribute('data-state');
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

function getDate(isoDate){
	let dateObject = {day:0, month:0, year:0};
	let dateArr = isoDate.split("-");
	dateObject.day = dateArr[2];
	dateObject.month = dateArr[1];
	dateObject.year = dateArr[0];
	let formattedDate = (dateObject.day.length == 1)?"0":"";
	formattedDate += dateObject.day + "/";	
	formattedDate += (dateObject.month.length == 1)?"0":"";
	formattedDate += dateObject.month + "/";
	formattedDate += dateObject.year;			
	return formattedDate;
}
function getISODate(dateObject){	//ISO 8601
	let date = dateObject.year + "-";
	date += (dateObject.month<10)?"0":"";
	date += dateObject.month + "-";
	date += (dateObject.day<10)?"0":"";
	date += dateObject.day;			
	return date;
}

function setTextDirectionModel(Model){
//	Object.keys(Model).forEach(item=>setTextDirection(Model[item].dom, Model[item].getValue()));
	Object.keys(Model).forEach(function(item){
		if(Model[item].domField != null)
			setTextDirection(Model[item].dom, Model[item].getValue());
		});
}
function setTextDirection(dom, value){
	const heb_start = 1488;
	const heb_end = 1514;
	const non_letters = 65;
	
	for(let pos = 0; pos < 4; pos++){
		if(value.charCodeAt(pos) > non_letters && value.charCodeAt(pos) >= heb_start && value.charCodeAt(pos) <= heb_end){
			dom.style.direction = 'rtl';
			return;			
		}
	}
	dom.style.direction = 'ltr';
}

function initModel(model){
	Object.keys(model).forEach(item=>{
		if(model[item].domField != null)
			model[item].dom = getById(model[item].domField);
	});
}

function setDomPermission(model){
	if(taskModel.taskId.getValue() > 0){
		if(taskModel.permissionType.getValue() == 2){
			Object.keys(model).forEach(item=>{
				if(model[item].dom == null)
					console.log(item);
				else
					model[item].dom.disabled=true
			});
		}else{
			Object.keys(model).forEach(item=>model[item].dom.disabled=false);
		}		
	}	
}
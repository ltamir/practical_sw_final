function submitOnEnter(event, func){
	if((event.which || event.keyCode) == 13)
		func();
}

function setSearchPredicate(searchElement){
	let predicateName;
	if(searchElement.nodeName == "SELECT")
		predicateName = searchElement.options[searchElement.selectedIndex].text;
	else
		predicateName = searchElement.value;
	setMsg(msgType.ok, 'Search by ' + searchElement.title + ' :'+ predicateName);
}
/**
 * Constructs the Task search in the main menu
 * @returns
 */
function prepareSearchTask(){
	let searchString = '?actionId=2';
	searchString += '&customerId=' + searchModel.customer.getValue();
	searchString += '&duedate=' + searchModel.dueDate.getValue();
	searchString += '&projectId=' + searchModel.project.getValue();
	searchString += '&tasktypeId=' + searchModel.taskType.getValue();
	searchString += '&showclosed=' + searchModel.status.getValue();
	searchString += '&title=' + searchModel.title.getValue();
	//?actionId=2&customerId=0&tasktypeId=1&projectId=0&title=&duedate=&showclosed=1
	return searchString;
}

function sortTaskList(fieldId){
	getData('taskList', 'task', '?actionId=25&sort=' + fieldId, fillTaskList);
}

function genericGet(model){
	if(model == null) model = searchModel;
	let searchString = '?actionId=2';
	for(const field in model){
		if(model[field].apiField != null)
			searchString += '&' + model[field].apiField + '=' + model[field].getValue();
	}
	return searchString;
}
function searchTask(searchString, customerId, dueDate, txtSearchTitle, projectId, cmbSearchTaskType, showClosed){

	if(searchString == null){
		searchString = '?actionId=2';
		searchString += '&customerId=' + customerId;
		searchString += '&duedate=' + dueDate;
		searchString += '&projectId=' + projectId;
		searchString += '&tasktypeId=' + cmbSearchTaskType;
		searchString += '&showclosed=' + showClosed;
		searchString += '&title=' + txtSearchTitle;
	}
	if(dbg==Module.menu)
		addLog(searchString);
	
	getData('taskList', 'task', searchString, fillTaskList);
}

/**
 * Constructs the HTTP call to retrieve tasks by project in the Relation tab 
 * @returns
 */
function searchRelationTask(){

	let searchTaskParams = '?actionId=2';
	searchTaskParams += '&customerId=0';
	searchTaskParams += '&duedate=';
	searchTaskParams += '&projectId=' + getValue('cmbTabRelationProject');
	searchTaskParams += '&tasktypeId=0';
	searchTaskParams += '&showclosed=0';
	searchTaskParams += '&title=' + getValue('txtTabRelatoinSearchTitle');
	
	if(dbg==Module.menu)
		addLog(searchTaskParams);
	
//	getData('cmbRelationTaskList', 'task', searchTaskParams, fillTaskRelationSearchResult);
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	getDataEx('divRelationSearchTaskList', 'task', searchTaskParams, fillDivList, null, 
    		(divRow,item)=>{
    			let taskTypeImg = createImage(taskTypeList[item.taskType.taskTypeId]);
    			divRow.appendChild(taskTypeImg);			
				divRow.addEventListener("click", function(){
    				toggler.toggle(divRow);
    				setValue('taskRelationSelectedTaskId', item.taskId);
    			});	
				divRow.addEventListener("mouseover", function(){this.style.cursor='pointer';});
			}, 
    		(txtPart,item)=>{
    			if(dbg==Module.tasklog)
    				addLog(item);				
    			txtPart.innerHTML = item.title;
			},
    		null);
}

/**
 * Constructs the HTTP call to retrieve tasks by project in the search project combo 
 * @returns
 */
function searchProjectTask(id){

	let searchTaskParams = '?actionId=2';
	searchTaskParams += '&customerId=0';
	searchTaskParams += '&duedate=';
	searchTaskParams += '&projectId=0'
	searchTaskParams += '&tasktypeId=1';
	searchTaskParams += '&showclosed=0';
	searchTaskParams += '&title=';
	
	getDataEx(id, 'task', searchTaskParams, fillSelect, 'Projects',
			(opt, item)=>opt.value = item.taskId,
			(opt, item)=>opt.text = item.title,
			(opt, item)=>opt.title = item.title
		);
	
}

/**
 * Resets the Task search in the main menu.
 * @returns
 */
function resetTaskSearch(){
	searchModel.customer.setValue(0);
	searchModel.dueDate.setValue(null);
	searchModel.project.setValue(0);
	searchModel.taskType.setValue(0);
	searchModel.title.setValue('');
	searchModel.status.setValue(1);
	setMsg(msgType.ok, 'Ready');
}

function toggleAsBotton(img){
	if(img.style.borderStyle=='inset' || img.style.borderStyle == null){
		img.style.borderStyle='outset';
	}else{
		img.style.borderStyle='inset';
	}
}

function initMenuData(){
	menuData.taskType = new MenuItem(getById('imgTaskType'), getById('divMenuTaskType'), taskModel.taskType, taskTypeList,

			(val)=>{
				if(val != 1 && taskModel.taskType.prevTaskType == 1)
					alert('Changing from Project will delete permissions and Linked customers of this task');
			}, getById('divMenuTaskTypeParent'));	
	menuData.taskStatus = new MenuItem(getById('imgTaskStatus'), getById('divMenuTaskStatus'), taskModel.status, taskStatusList, (val)=>{taskModel.status.changed = true;},  getById('divMenuTaskStatusParent'));
	menuData.taskEffortUnit = new MenuItem(getById('imgEffortUnit'), getById('divMenuEffortUnit'), taskModel.effortUnit, effortUnitList, dummyAction, getById('divMenuEffortUnitParent'));	
	menuData.newTaskType = new MenuItem(getById('addTask'), getById('divMenuNewTaskType'), newTaskModel.taskType, taskTypeList, newTask, getById('divMenuNewTaskTypeParent'));
	menuData.searchTaskType = new MenuItem(getById('imgSearchTaskType'), getById('divSearchTaskType'), searchModel.taskType, taskTypeList, dummyAction, getById('divSearchTaskTypeParent'));
	menuData.searchTaskStatus = new MenuItem(getById('imgSearchTaskStatus'), getById('divSearchTaskStatus'), searchModel.status, searchStatusList, dummyAction, getById('divSearchTaskStatusParent'));
}

function showMenu(menuItem){
	for(let item of menuItem.menuList){
		if(item.value == -1 || menuItem.model.getValue() == item.value) continue;
		let imgItem = document.createElement('IMG');
		setImage(imgItem, item);
		imgItem.addEventListener('click', function(){menuItem.model.setValue(item.value, true); menuHandler(menuItem)})
		menuItem.menuDiv.appendChild(imgItem);
		let br = document.createElement('BR');
		menuItem.menuDiv.appendChild(br);
	}
}
function hideMenu(menuItem){
	while(menuItem.menuDiv.childNodes.length > 0)
		menuItem.menuDiv.removeChild(menuItem.menuDiv.lastChild);
}

// handle image as two-state button
function dummyAction(val){}
function menuHandler(menuItem, menuAction, doCheck){
	if(menuAction != null) menuItem.menuid.setAttribute('data-state', !menuAction);
	if(doCheck && !checkPermission()) return;
	if(menuItem.menuid.getAttribute('data-state') == '0'){
		menuItem.menuid.setAttribute('data-state', 1);
		menuItem.menuid.style.borderStyle='inset';
		showMenu(menuItem);
		menuItem.parent.tabIndex = 1;
		menuItem.parent.focus();
	}else{
		menuItem.menuid.setAttribute('data-state', 0);
		menuItem.menuid.style.borderStyle='outset';
		hideMenu(menuItem);
		menuItem.parent.tabIndex = -1;
	}
}


function dropOnParent(ev){
	ev.preventDefault();
	let childId = ev.dataTransfer.getData("text");
	setMsg(msgType.ok, "got " + childId);
}
function allowDrop(ev) {
	ev.preventDefault();
}

function execSync(funcA, funcB){
	getDataEx('', 'authenticate', '?actionId=16', function(id, body, defaultOption, funcValue, funcText, eventHandler){
		if(body == null)
			window.location.replace('login.html');
		loggedContact = body.login.contact;
		let showDevMod = body.devmod;
		if(showDevMod == null || showDevMod == 'false'){
			getById('cmbDebug').style.display='none';
			getById('showDatabase').style.display='none';
		}
		getById('lblLoggedInContact').innerHTML = body.login.contact.firstName + ' ' + body.login.contact.lastName;
		}, null, null, null, null);
	
	funcA('cmbDetailContact', 'login', '?actionId=2', fillSelect, 'Contacts', 
			(opt,item)=>opt.value = item.contact.contactId, 
			(opt,item)=>{
				opt.text = item.contact.firstName + ' ' + item.contact.lastName;
				opt.setAttribute('loginId', item.loginId);
			}, 
			(opt, item)=>{if(loggedContact != null && opt.value == loggedContact.contactId)opt.selected=true;})

	funcB('cmbSearchTaskType', 'tasktype', '?actionId=2', fillSelect, 'All Types', 
			(opt,item)=>opt.value = item.taskTypeId, 
			(opt,item)=>opt.text = item.taskTypeName, 
			(opt,item)=> {if(item.taskTypeId == 1)opt.selected = true});
	searchModel.taskType.setValue(1);
	searchModel.status.setValue(1);
}

//var datePicker;


function init(){

	initModels();
	searchModel.dueDate.dom = new DatePicker('tblSearchDueDate', null);
	taskModel.dueDate.dom = new DatePicker('tblTaskDueDate', checkPermission);
	taskModel.effort.dom = new EffortPicker('tblTaskEffort', null);	
	
	initMenuData();
	getDataEx('cmbSearchCustomer', 'customer', '?actionId=2', fillSelect, 'Customers', 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName, 
			null);

	getDataEx('cmbDetailTaskType', 'tasktype', '?actionId=2', fillSelect, 'Task Type:', 
			(opt,item)=>opt.value = item.taskTypeId, 
			(opt,item)=>opt.text = item.taskTypeName, 
			null);

	execSync(getDataEx, getDataEx);
	
    getDataEx('cmbDetailStatus', 'status', '?actionId=2', fillSelect, null, 
    		(opt,item)=>opt.value = item.statusId, 
    		(opt,item)=>opt.text = item.statusName, 
    		null);    

	searchProjectTask('cmbSearchProject');
	searchTask(null, 0, '', '', 0, 1, 0);
//    setTab(tabEnum.connection);
    setTab(tabEnum.timeline);
    setTab(tabEnum.taskLog);
    
    showAllContacts();
    showCustomerConnection();

    taskModel.dueDate.setValue(getJsonDate(new Date().toISOString().split("T")[0]));
}

function initModels(){
	initModel(taskModel);
	initModel(searchModel);
}

// ***** customer & contacts lists ***** //
function logout(){
	getDataEx('', 'authenticate', '?actionId=15', null, null, null, null, null);
}

function showAllContacts(){
	let contactCardPopup = getById('divContactCard');
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	getDataEx('cmbConnectedContact', 'contact', '?actionId=2', fillDivList, null,
			(divRow,item)=>{
				divRow.setAttribute('data-id', item.contactId);
				divRow.addEventListener("click", ()=>{
					toggler.toggle(divRow);
					if(activeCrmTab != tabEnum.connection){
						contactCardPopup.innerHTML =  item.officePhone + ' ' + item.mobilePhone + '<br>' + item.email;
						return;
					}
					getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contactId, viewContact);
				})				
			}, 
			(txtPart,item)=>txtPart.innerHTML = item.firstName + " " + item.lastName,
			null
		)
}

// ***** database & log ***** //
function executeJs(){
	let code = getValue('txtJS');
	try{
		let func = new Function(code);
		func();
	}catch (err){
		addLog(`err: ${err}` + `err: ${err.stack}`);
	}

    getStringHashCode(code, appendJSCode);
}


function getStringHashCode(stringToHash, func){
	getDataEx('', 'business', '?actionId=22&tohash=' + stringToHash, 
			function(id, data, defaultOption, funcValue, funcText, eventHandler){
				func(data.hashcode, stringToHash);
			}, null, null, null, null);
}

function appendJSCode(hashcode, code){
	let selectElement = getById('jsHistory');
    
    let opt = null;
    for (let i = selectElement.length - 1; i >= 0; i--) {
        if(selectElement.options[i].value == hashcode){
        	opt = selectElement.options[i];
        	selectElement.remove(i);
        	break;
        }
    }
    if(opt== null){
    	opt = document.createElement("OPTION");
    	opt.text = code;
    	opt.value = hashcode;
    }

	selectElement.appendChild(opt);	
}

function copyJS(){
	let js = getById('jsHistory'); 
	setValue('txtJS', js.options[js.selectedIndex].text);
}

function copySQL(){
	let js = getById('sqlHistory'); 
	setValue('txtSQL', js.options[js.selectedIndex].text);
}

function toggleDatabase(btn){
	let sqlDIV = getById('divDataFrame');
	
	if(btn.getAttribute('data-state') == 0){
		sqlDIV.style.display='inline';
		toggleAsBotton(btn);
		btn.setAttribute('data-state', 1);
		getById('divCRM').style.display='none';
		getById('tabCRM').style.display='none';
		
	}else{
		sqlDIV.style.display='none';
		toggleAsBotton(btn);
		btn.setAttribute('data-state', 0);
		getById('divCRM').style.display='block';
		getById('tabCRM').style.display='block';
	}
}
function executeSQL(){
	if(dbg==Module.common)
		addLog('executeSQL(): ' + escape(getValue('txtSQL')));
	getDataEx('', 'database', '?sql=' + escape(getValue('txtSQL')), fillDataBase, null, null, null, null);
	
}

function fillDataBase(id, data, defaultOption, funcValue, funcText, eventHandler){
	let resultHeader = getById('resultHeader');
	let resultBody = getById('resultBody');
	
    for (var i = resultHeader.rows.length - 1; i >= 0; i--) {
    	resultHeader.deleteRow(i);
    }
    
    for (var i = resultBody.rows.length - 1; i >= 0; i--) {
    	resultBody.deleteRow(i);
    }
    if(data.status == 'ack')
    	setMsg(msgType.ok, 'SQL execution completed');
    
    let opt = document.createElement("OPTION");
	opt.text = getValue('txtSQL');
	getById('sqlHistory').appendChild(opt);
	
    if(data.array == null)
    	return;
    
	let headerCols = data.array[0].row;
	let row = document.createElement('TR');
	resultHeader.appendChild(row);
	headerCols.forEach(function (colName) {
		let col = document.createElement('TH');
		col.innerHTML = colName;
		row.appendChild(col);
	})
	
	for(let pos = 1; pos < data.array.length; pos++){
		row = document.createElement('TR');
		resultBody.appendChild(row);
		let dataCols = data.array[pos].row;
			dataCols.forEach(function (colName) {
			let col = document.createElement('TD');
			col.innerHTML = colName;
			row.appendChild(col);
		})
	}
	
}
function submitOnEnter(event){
	if((event.which || event.keyCode) == 13)
		searchTask(prepareSearchTask());
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
	
	getData('cmbRelationTaskList', 'task', searchTaskParams, fillTaskRelationSearchResult);
	
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
	
	getDataEx(id, 'task', searchTaskParams, fillSelect, 'All Projects',
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
	toggleSearchTaskStatus(getById('searchOpenTask'))
	setMsg(msgType.ok, 'Ready');
}


function toggleSearchTaskStatus(statusImg){
	for(const [key, value] of searchTaskStatusToggle){
		if(value == statusImg)
			value.style.borderStyle = 'inset';
		else
			value.style.borderStyle = 'outset'			
	}
	searchModel.status.setValue(statusImg.getAttribute('data-state'));
}

function buttonToggler(img, check){
	if(check != null && !checkPermission) return;
	if(img.style.borderStyle=='inset' || img.style.borderStyle == null){
		img.style.borderStyle='outset';
	}else{
		img.style.borderStyle='inset';
	}	
}
function toggleAsBotton(img){
	if(img.style.borderStyle=='inset' || img.style.borderStyle == null){
		img.style.borderStyle='outset';
	}else{
		img.style.borderStyle='inset';
	}
}

function flagToggle(lbl, field, ev){
	if(ev.keyCode == 27 || ev.keyCode == 13){
		toggleSearchDate(lbl, field);
	}
}

function toggleSearchDate(lbl, field){
	if(field.disabled && !checkPermission()) return;
	if(field.getAttribute('data-isActive') == '0'){
		field.style.display='inline';
		lbl.style.display='none';
		field.setAttribute('data-isActive', '1');
		field.focus();
	}else{
		let formattedDate = 'Set due date';
		field.style.display='none';
		if(field.value != '')
			lbl.innerHTML = getDate(field.value);
		else
			lbl.innerHTML = 'Set due date';
		lbl.style.display='inline';
		field.setAttribute('data-isActive', '0');
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
	menuData.newTaskType = new MenuItem(getById('addTask'), getById('divMenuNewTaskType'), newTaskModel.taskType, taskTypeList, newTask,  getById('divMenuNewTaskTypeParent'));
	menuData.searchTaskType = new MenuItem(getById('imgSearchTaskType'), getById('divSearchTaskType'), searchModel.taskType, taskTypeList, dummyAction, getById('divSearchTaskTypeParent'));
}

function showMenu(menuItem){
	for(let item of menuItem.menuList){
		if(item.value == -1 || menuItem.model.getValue() == item.value) continue;
		let imgItem = document.createElement('IMG');
		imgItem.src = item.src;
		imgItem.title = item.title;
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
function menuHandler(menuItem, menuAction, check){
	if(menuAction != null) menuItem.menuid.setAttribute('data-state', !menuAction);
	if(check != null && !checkPermission()) return;
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
}
function init(){

	initModels();
	initMenuData();
	getDataEx('cmbSearchCustomer', 'customer', '?actionId=2', fillSelect, 'All Customers', 
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
    setTab(tabEnum.connection);
    setTab(tabEnum.taskLog);
    
    taskModel.dueDate.setValue(new Date().toISOString().split("T")[0]);
}

function initModels(){
	initModel(taskModel);
	initModel(searchModel);


	searchModel.status.setValue(1);
	searchTaskStatusToggle.set('open', getById('searchOpenTask'));
	searchTaskStatusToggle.set('closed', getById('searchClosedTask'));
	searchTaskStatusToggle.set('all', getById('searchAllTasks'));
}

function logout(){
	getDataEx('', 'authenticate', '?actionId=15', null, null, null, null, null);
}

function toggleDatabase(btn){
	let sqlDIV = getById('divDataFrame');
	
	if(btn.getAttribute('data-state') == 0){
		sqlDIV.style.display='inline';
		toggleAsBotton(btn);
		btn.setAttribute('data-state', 1);
		getById('divCRM').style.display='none';
		
	}else{
		sqlDIV.style.display='none';
		toggleAsBotton(btn);
		btn.setAttribute('data-state', 0);
		getById('divCRM').style.display='block';
	}
}
function executeSQL(){
	if(dbg==Module.common)
	console.log('executeSQL(): ' + escape(getValue('txtSQL')));
	getDataEx('', 'database', '?sql=' + escape(getValue('txtSQL')), fillDataBase, null, null, null, null)
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
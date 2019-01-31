

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
	
	getDataEx(id, 'task', searchTaskParams, fillSelect, 'projects:',
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
	searchModel.status.setValue(0);
	searchModel.title.setValue('');
		
//	getById('txtSearchDueDate').valueAsDate=null;
	setMsg(msgType.ok, 'Ready');
}


function toggleSearchTaskStatus(statusImg){
	if(statusImg.getAttribute('data-state') == '0')
		setSearchTaskStatusClosed(statusImg);
	else
		setSearchTaskStatusOpen(statusImg);
}

function setSearchTaskStatusClosed(statusImg){
	statusImg.src='images/task_done.png';
	statusImg.setAttribute('data-state', 1);
	toggleAsBotton(statusImg);
	statusImg.title = 'Closed tasks';
}

function setSearchTaskStatusOpen(statusImg){
	statusImg.src='images/task_open.png';
	statusImg.setAttribute('data-state', 0);
	toggleAsBotton(statusImg);
	statusImg.title = 'Open tasks';
}

function connectionFilterOn(element){
	if(taskModel.taskId.getValue() == 0){
		setMsg(msgType.nok, 'No task selected. cancelling thre filter');
		return;
	}
		
	element.value='1';
	element.style.borderStyle='inset';
	element.title = 'Customers of selected task';

	getDataEx('cmbConnectedCustomer', 'customer', '?actionId=14&taskId='+taskModel.taskId.getValue(), fillSelect, null, 
	(opt,item)=>opt.value = item.customerId, 
	(opt,item)=>opt.text = item.customerName,
	(opt, item)=>opt.addEventListener("click", ()=>{
		if(getById('imgFilterContact').getAttribute("data-state") == 1)
			showAssociatedContacts();
		getDataEx('divAddressList', 'address', '?actionId=13&customerId='+item.customerId, fillDivList, null, 
				(opt,item)=>{
					opt.setAttribute('data-addressId', item.addressId);
					opt.innerHTML = item.street + ' ' + item.houseNum + ' ' + item.city;
					}, 
					null,
				(opt, item)=>opt.addEventListener("click", ()=>{
					getData('', 'address', '?actionId=3&addressId='+item.addressId, viewAddress)}));
		})
	);
	setMsg(msgType.ok, 'Filtering on task');
}

function connectionFilterOff(element){	
	element.style.borderStyle='outset';
	element.title = 'All customers';

	activateTabConnection();
	setMsg(msgType.ok, 'Filter removed');
}

function toggleAsBotton(img){
	if(img.style.borderStyle=='inset'){
		img.style.borderStyle='outset';
	}else{
		img.style.borderStyle='inset';
	}
}

function flagToggle(lbl, field, ev){
	if(ev.keyCode == 27)
		toggleSearchDate(lbl, field);
}

function toggleSearchDate(lbl, field){
	if(field.getAttribute('data-isActive') == '0'){
		field.style.display='inline';
		lbl.style.display='none';
		field.setAttribute('data-isActive', '1');
		field.focus();
	}else{
		let formattedDate = 'Due date';
		field.style.display='none';
		let dateval = field.value;
		if(dateval.split("-")[2] != undefined){
			formattedDate = dateval.split("-")[2];
			formattedDate += '/' + dateval.split("-")[1];
			formattedDate += '/' + dateval.split("-")[0];	
		}
		lbl.innerHTML = formattedDate;
		lbl.style.display='inline';
		field.setAttribute('data-isActive', '0');
	}
}

function initMenuData(){
	menuData.taskType = new MenuItem(getById('imgTaskType'), getById('divMenuTaskType'), taskModel.taskType, taskTypeList, dummyAction);	
	menuData.taskStatus = new MenuItem(getById('imgTaskStatus'), getById('divMenuTaskStatus'), taskModel.status, taskStatusList, dummyAction);
	menuData.taskEffortUnit = new MenuItem(getById('imgEffortUnit'), getById('divMenuEffortUnit'), taskModel.effortUnit, effortUnitList, dummyAction);	
	menuData.newTaskType = new MenuItem(getById('addTask'), getById('divMenuNewTaskType'), taskModel.taskType, taskTypeList, newTask);
}
// handle image as two-state button
function dummyAction(val){}
function menuHandler(menuItem){
	
	if(menuItem.menuid.getAttribute('data-state') == '0'){
		menuItem.menuid.setAttribute('data-state', 1);
		menuItem.menuid.style.borderStyle='inset';
		menuItem.menuDiv.style.display = 'inline';
	}else{
		menuItem.menuid.setAttribute('data-state', 0);
		menuItem.menuid.style.borderStyle='outset';
		menuItem.menuDiv.style.display = 'none';
	}
}

function menuSetter(MenuItem, val){
	MenuItem.menuid.src = MenuItem.menuList[val].src;
	MenuItem.menuid.title = MenuItem.menuList[val].title;
	MenuItem.model.setValue(val);
	MenuItem.action(val);
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
		}, 'Customers:', null, null, null);
	funcA('cmbDetailContact', 'contact', '?actionId=4', fillSelect, 'Contacts:', 
    		(opt,item)=>opt.value = item.contactId, 
    		(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
    		(opt,item)=>{if(loggedContact != null && opt.value == loggedContact.contactId)opt.selected=true;});
	funcB('cmbSearchTaskType', 'taskType', '?actionId=2', fillSelect, 'Task Type:', 
			(opt,item)=>opt.value = item.taskTypeId, 
			(opt,item)=>opt.text = item.taskTypeName, 
			(opt,item)=> {if(item.taskTypeId == 1)opt.selected = true});
}
function init(){

	initModels();
	initMenuData();
	getDataEx('cmbSearchCustomer', 'customer', '?actionId=2', fillSelect, 'Customers:', 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName, 
			null);

	getDataEx('cmbDetailTaskType', 'taskType', '?actionId=2', fillSelect, 'Task Type:', 
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
    
//    searchModel.dueDate.setValue(new Date().toISOString().split("T")[0]);
    taskModel.dueDate.setValue(new Date().toISOString().split("T")[0]);
    getById('lblDetailDueDate').innerHTML = getDate(taskModel.dueDate.getValue());
//    getById('txtDetailDueDate').valueAsDate = new Date(); 
}

function initModels(){
	Object.keys(taskModel).forEach(function(item){
		taskModel[item].dom = getById(taskModel[item].domField);
	});
	Object.keys(searchModel).forEach(function(item){
		searchModel[item].dom = getById(searchModel[item].domField);
	});	
}

function logout(){
	getDataEx('', 'authenticate', '?actionId=15', null, null, null, null, null);
}

function toggleDatabase(){
	let sqlDIV = getById('divDataFrame');
	let sqlState = getById('showDatabase');
	
	if(sqlState.getAttribute('data-state') == 0){
		sqlDIV.style.display='inline';
		sqlState.setAttribute('data-state', 1);
		getById('divCRM').style.display='none';
		
	}else{
		sqlDIV.style.display='none';
		sqlState.setAttribute('data-state', 0);
		getById('divCRM').style.display='inline';
	}
}
function executeSQL(){
	if(dbg==dbgModule.common)
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
    if(data == null)
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


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

function flagToggle(lbl, field, ev){
	if(ev.keyCode == 27)
		toggleSearchDate(lbl, field);
}

function toggleSearchDate(lbl, field){
	if(field.getAttribute('data-isActive') == '0'){
		field.style.display='inline';
		lbl.style.display='none';
		field.setAttribute('data-isActive', '1');
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


var menuData = {
		taskType:{menuid:null, menuDiv:null, on:null, off:null, set:null},
		taskStatus:{menuid:null, menuDiv:null, on:null, off:null, set:null},
		taskEffortUnit:{menuid:null, menuDiv:null, on:null, off:null, set:null},
		newTask:{menuid:null, menuDiv:null, on:null, off:null, set:null}
}

function initMenuData(){
	menuData.taskType.menuid = getById('imgTaskType');
	menuData.taskType.menuDiv = getById('divMenuTaskType');
	menuData.taskType.model = taskModel.taskType;
	menuData.taskType.on = menuHandler;
	menuData.taskType.off = menuHandler;
	
	menuData.taskStatus.menuid = getById('imgTaskStatus');
	menuData.taskStatus.menuDiv = getById('divMenuTaskStatus');
	menuData.taskStatus.model = taskModel.status;
	menuData.taskStatus.on = menuHandler;
	menuData.taskStatus.off = menuHandler;
	
	menuData.taskEffortUnit.menuid = getById('imgEffortUnit');
	menuData.taskEffortUnit.menuDiv = getById('divMenuEffortUnit');
	menuData.taskEffortUnit.model = taskModel.effortUnit;
	menuData.taskEffortUnit.on = menuHandler;
	menuData.taskEffortUnit.off = menuHandler;	
	
	menuData.newTask.menuid = getById('addTask');
	menuData.newTask.menuDiv = getById('divMenuNewTaskType');
	menuData.newTask.model = taskModel.taskType;
	menuData.newTask.on = menuHandler;
	menuData.newTask.off = menuHandler;
}
// handle image as two-state button
function menuHandler(menu){
	
	if(menu.menuid.getAttribute('data-state') == '0'){
		menu.menuid.setAttribute('data-state', 1);
		menu.menuid.style.borderStyle='inset';
		menu.menuDiv.style.display = 'inline';
	}else{
		menu.menuid.setAttribute('data-state', 0);
		menu.menuid.style.borderStyle='outset';
		menu.menuDiv.style.display = 'none';
	}
}

function menuSetter(menu, menuList, val){
	menu.menuid.src = menuList[val].src;
	menu.menuid.title = menuList[val].title;
	menu.model.setValue(val);
}

function setNewTaskType(taskTypeId, menu){
	newTask(taskTypeId);
	menu.menuid.src = taskTypeList[taskTypeId].src;
	menu.menuid.title = taskTypeList[taskTypeId].title;	
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
    
    setValue('txtSearchDueDate', '');
    
    getById('txtDetailDueDate').valueAsDate = new Date(); 
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
	getDataEx('', 'database', '?sql=' + getValue('txtSQL'), fillDataBase, null, null, null, null)
//	.catch(err=>console.log(`err: ${err}` + `err: ${err.stack}` + ` url:${url}`));
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
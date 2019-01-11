

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

	searchTask(getValue('cmbSearchCustomer'),
			getValue('txtSearchDueDate'),
			getValue('cmbSearchProject'),
			 getValue('cmbSearchTaskType'),
			 getValue('searchTaskStatus'));

}

function searchTask(customerId, dueDate, projectId, cmbSearchTaskType, showClosed){
	let searchTaskParams = '?actionId=2';
	searchTaskParams += '&customerId=' + customerId;
	searchTaskParams += '&duedate=' + dueDate;
	searchTaskParams += '&projectId=' + projectId;
	searchTaskParams += '&tasktypeId=' + cmbSearchTaskType;
	searchTaskParams += '&showclosed=' + showClosed;
	
	getData('taskListBody', 'task', searchTaskParams, fillTaskList);
}
/**
 * Constructs the HTTP call to retrieve tasks by project in the Relation tab 
 * @returns
 */
function searchRelationTask(){
	var searchTaskParams = '?actionId=2';
	searchTaskParams += '&customerId=' + getById('cmbTabRelationProject').value
	
	getData('cmbRelationTaskList', 'task', searchTaskParams, fillTaskRelationSearchResult);
	
}

/**
 * Resets the Task search in the main menu.
 * The checkbox 'Open Tasks' is set to checked
 * @returns
 */
function resetTaskSearch(){
	getById('cmbSearchCustomer').value=0;
	getById('cmbSearchTaskType').value=0;
	getById('cmbSearchProject').value=0;
	getById('txtSearchDueDate').valueAsDate=null;
	setSearchTaskStatusOpen();
	setMsg(msgType.ok, 'Ready')
}


function toggleAsBotton(img){
	if(img.style.borderStyle=='inset')
		img.style.borderStyle='outset';
	else
		img.style.borderStyle='inset';
}

function toggleSearchTaskStatus(id){
	let statusImg = getById('searchTaskStatus');
	if(statusImg.value == '0')
		setSearchTaskStatusClosed();
	else
		setSearchTaskStatusOpen();
}

function setSearchTaskStatusClosed(){
	let statusImg = getById('searchTaskStatus');
	statusImg.src='images/task_done.png';
	statusImg.value='1';
	statusImg.style.borderStyle='inset';
	statusImg.title = 'Closed tasks';
}

function setSearchTaskStatusOpen(){
	let statusImg = getById('searchTaskStatus');
	statusImg.src='images/task_open.png';
	statusImg.value='0';
	statusImg.style.borderStyle='outset';
	statusImg.title = 'Open tasks';
}

function init(){
	toggleSearchTaskStatus();
	getDataEx('cmbSearchCustomer', 'customer', '?actionId=2', fillSelect, 'Select a Customer', 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName, 
			null);
	getDataEx('cmbSearchTaskType', 'taskType', '?actionId=2', fillSelect, 'Select a TaskType', 
			(opt,item)=>opt.value = item.taskTypeId, 
			(opt,item)=>opt.text = item.taskTypeName, 
			null);
	getDataEx('cmbDetailTaskType', 'taskType', '?actionId=2', fillSelect, 'Select a TaskType', 
			(opt,item)=>opt.value = item.taskTypeId, 
			(opt,item)=>opt.text = item.taskTypeName, 
			null);

    getDataEx('cmbDetailContact', 'contact', '?actionId=4', fillSelect, 'Select Contact', 
    		(opt,item)=>opt.value = item.contactId, 
    		(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
    		null);
    
    getDataEx('cmbDetailStatus', 'status', '?actionId=2', fillSelect, 'Select Status', 
    		(opt,item)=>opt.value = item.statusId, 
    		(opt,item)=>opt.text = item.statusName, 
    		null);    

    getData('cmbSearchProject', 'customertask', '?actionId=2', fillCustomerTask)

    searchTask(0, '', 0, 0, 0);
    
    setTab(tabEnum.connection)
    activateTabTaskLog()
    
    setValue('txtSearchDueDate', '');
    
    getById('txtDetailDueDate').valueAsDate = new Date(); 
}




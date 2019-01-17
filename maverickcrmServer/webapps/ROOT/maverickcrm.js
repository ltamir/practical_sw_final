

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
			getValue('txtSearchTitle'),
			getValue('cmbSearchProject'),
			 getValue('cmbSearchTaskType'),
			 getValue('searchTaskStatus'));

}

function searchTask(customerId, dueDate, txtSearchTitle, projectId, cmbSearchTaskType, showClosed){
	let searchTaskParams = '?actionId=2';
	searchTaskParams += '&customerId=' + customerId;
	searchTaskParams += '&duedate=' + dueDate;
	searchTaskParams += '&projectId=' + projectId;
	searchTaskParams += '&tasktypeId=' + cmbSearchTaskType;
	searchTaskParams += '&showclosed=' + showClosed;
	searchTaskParams += '&title=' + txtSearchTitle;
	
	getData('taskListBody', 'task', searchTaskParams, fillTaskList);
}

/**
 * Constructs the HTTP call to retrieve tasks by project in the Relation tab 
 * @returns
 */
function searchRelationTask(){
//	searchTask(0,'',getValue('cmbTabRelationProject'),0,0,'');
	let searchTaskParams = '?actionId=2';
	searchTaskParams += '&customerId=0';
	searchTaskParams += '&duedate=';
	searchTaskParams += '&projectId=' + getValue('cmbTabRelationProject');
	searchTaskParams += '&tasktypeId=0';
	searchTaskParams += '&showclosed=0';
	searchTaskParams += '&title=';
	
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
	setValue('txtSearchTitle', '');
	setSearchTaskStatusOpen();
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

function toggleHandler(id, implA, implB){
	if(id.value == undefined)
		id.value='0';
	if(id.value == '0')
		implA(id);
	else
		implB(id);
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

function connectionFilterOn(element){
	if(getValue('taskId') == 0){
		setMsg(msgType.nok, 'No task selected. cancelling thre filter');
		return;
	}
		
	element.value='1';
	element.style.borderStyle='inset';
	element.title = 'Customers of selected task';

	getDataEx('cmbConnectedCustomer', 'customer', '?actionId=14&taskId='+getValue('taskId'), fillSelect, null, 
	(opt,item)=>opt.value = item.customerId, 
	(opt,item)=>opt.text = item.customerName,
	(opt, item)=>opt.addEventListener("click", ()=>{
		getDataEx('cmbConnectedContact', 'assocoation', '?actionId=12&customerId='+item.customerId, fillSelect, null, 
				(opt,item)=>opt.value = item.contact.contactId, 
				(opt,item)=>{
				let phone = (item.contact.officePhone == '')?((item.contact.mobilePhone == '')?'1':item.contact.mobilePhone):item.contact.officePhone;
				opt.text = item.contact.firstName + " " + item.contact.lastName + " : " + new String((phone == null)?"  -  ":phone);
				},
				(opt, item)=>{
					opt.addEventListener("click", ()=>{
						getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contact.contactId, fillContactCard);
						cmbConnectedAddress.value=item.address.addressId
						cmbContactType.value=item.contactType.contactTypeId;
						ConnectionAssocoationId.value=item.assocoationId;
						})
					}
				)
		getDataEx('cmbConnectedAddress', 'address', '?actionId=13&customerId='+item.customerId, fillSelect, null, 
				(opt,item)=>opt.value = item.addressId, 
				(opt,item)=>opt.text = item.street + ' ' + item.houseNum + ' ' + item.city, 
				(opt, item)=>opt.addEventListener("click", ()=>{getData('', 'address', '?actionId=3&addressId='+item.addressId, fillAddressCard)}));
		})
	);
	setMsg(msgType.ok, 'Filtering on task');
}

function connectionFilterOff(element){
	let statusImg = getById('searchTaskStatus');
	element.value='0';
	element.style.borderStyle='outset';
	element.title = 'All customers';

	activateTabConnection();
	setMsg(msgType.ok, 'Task filter removed');
}

function showEffortUnits(){
	getById('divEffortUnit').style.display='inline';
}

function setEffortUnit(selectedImg, unit){
	setValue('effortUnit', unit);
	getById('imgEffortUnit').src = selectedImg.src;
	getById('imgEffortUnit').title = selectedImg.title;
	getById('divEffortUnit').style.display = 'none';
}

function dropOnParent(ev){
	ev.preventDefault();
	let childId = ev.dataTransfer.getData("text");
	setMsg(msgType.ok, "got " + childId);
}
function allowDrop(ev) {
	ev.preventDefault();
  }
  
function init(){
	toggleSearchTaskStatus();
	getDataEx('cmbSearchCustomer', 'customer', '?actionId=2', fillSelect, 'Customers:', 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName, 
			null);
	getDataEx('cmbSearchTaskType', 'taskType', '?actionId=2', fillSelect, 'Task Type:', 
			(opt,item)=>opt.value = item.taskTypeId, 
			(opt,item)=>opt.text = item.taskTypeName, 
			null);
	getDataEx('cmbDetailTaskType', 'taskType', '?actionId=2', fillSelect, 'Task Type:', 
			(opt,item)=>opt.value = item.taskTypeId, 
			(opt,item)=>opt.text = item.taskTypeName, 
			null);

    getDataEx('cmbDetailContact', 'contact', '?actionId=4', fillSelect, 'Contacts:', 
    		(opt,item)=>opt.value = item.contactId, 
    		(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
    		null);
    
    getDataEx('cmbDetailStatus', 'status', '?actionId=2', fillSelect, 'Status:', 
    		(opt,item)=>opt.value = item.statusId, 
    		(opt,item)=>opt.text = item.statusName, 
    		null);    
	getDataEx('cmbSearchProject', 'customertask', '?actionId=2', fillSelect, 'projects:',
		(opt, item)=>opt.value = item.task.taskId,
		(opt, item)=>opt.text = item.customer.customerName,
		(opt, item)=>opt.title = item.task.title
	)

    searchTask(0, '','', 0, 0, 0);
    
    setTab(tabEnum.connection)
    activateTabTaskLog()
    
    setValue('txtSearchDueDate', '');
    
    getById('txtDetailDueDate').valueAsDate = new Date(); 
}




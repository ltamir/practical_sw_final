// ***** new model ***** //

function newAttachment(){
	setValue('txtAttachmentNotes', '');
	setValue('cmbAttachmentType', 0);
	setValue('cmbAttachmenContact', 0);
	setValue('attachmentFile', '');
	setValue('attachmentId', '0');
}

function newCustomer(){	
	setValue('txtCustomerName', '');
	setValue('txtCustomerNotes', '');
	setValue('detailCustomerId', '0');
}

function newContact(){
	setValue('txtFirstName', '');
	setValue('txtLastName', '');
	setValue('txtOfficePhone', '');
	setValue('txtMobilePhone', '');
	setValue('txtEmail', '');
	setValue('txtNotes', '');
	setValue('ConnectionContactId', '0');	
}

function newTask(){
	setValue('taskId', '0');
	setValue('cmbDetailTaskType', 0);
	setValue('cmbDetailContact', 0);
	setValue('txtDetailTaskTitle', '');
	setValue('txtDetailTaskEffort', '0');
	setValue('cmbDetailEffortUnit', 1);
	setValue('txtDetailDueDate', '');
	setValue('cmbDetailStatus', 1);
	
	setTab(tabEnum.taskLog);  
}
 
function newRelation(){
    element = getById('cmbParentTaskList');
    for (let i = element.length - 1; i >= 0; i--) {
    	element.remove(i);
	}  
    element = getById('cmbChildTaskList');
    for (let i = element.length - 1; i >= 0; i--) {
    	element.remove(i);
	}  
    element = getById('cmbRelationTaskList');
    for (let i = element.length - 1; i >= 0; i--) {
    	element.remove(i);
	}  
    getById('lblDetailTaskRelationTitle').innerHTML = 'No selected Task for hierarchy';
}

function newTaskLog(){
	setValue('taskLogId', '0');
	setValue('cmbTaskLogContact', 0);
	setValue('cmbTaskLogType', 0);
	setValue('txtTaskLogDescription', '');
}

// ***** edit model ***** //

function fillTaskDetails(id, data){
	setValue('cmbDetailTaskType', data.taskType.taskTypeId);
	setValue('cmbDetailContact', data.contact.contactId);
	setValue('txtDetailTaskTitle', data.title);
	setValue('txtDetailTaskEffort', data.effort);
	setValue('cmbDetailEffortUnit', data.effortUnit);

	let date = data.dueDate.year + "-";
	date += (data.dueDate.month<10)?"0":"";
	date += data.dueDate.month + "-";
	date += (data.dueDate.day<10)?"0":"";
	date += data.dueDate.day;
	setValue('txtDetailDueDate', date);
	
	setValue('cmbDetailStatus', data.status.statusId);
	setValue('taskId', data.taskId);        	
	
	switch(activeTaskTab){
	case tabEnum.taskLog:
		activateTabTaskLog();
		break;
	case tabEnum.relation:
		activateTabRelation();
		break;
	case tabEnum.attachment:
		activateTabAttachment();
		break;
	case tabEnum.linkedCustomer:
		activateTabLinkedCustomer();
		break;		
		default:
			console.log('invalid tab number' + activeTaskTab);
	}
	if(data.taskType.taskTypeId==1){
		getById('TabLinkedCustomer').style.display='inline';
	}else{
		getById('TabLinkedCustomer').style.display='none';		
	}
}


function fillTaskLogDetails(id, data){
	setValue('txtTaskLogDescription', data.description);
	setValue('cmbTaskLogContact', data.contact.contactId);
	setValue('cmbTaskLogType', data.taskLogType.taskLogTypeId);  
	setValue('taskLogId', data.taskLogId);
	setValue('taskLogTaskId', data.task.taskId);
	setValue('sysDate', data.sysdate);
}

function fillContactDetails(id, data){
	setValue('txtContactFirstName', data.firstName);

	setValue('txtContactLastName', data.lastName);
	setValue('txtContactOfficePhone', data.officePhone);
	setValue('txtContactCellPhone', data.cellPhone);
	setValue('txtContactEmail', data.email);
	setValue('txtContactNotes', data.notes);
	setValue('detailContactId', data.contactId);

	getDataEx('cmbConnectedCustomers', 'customercontact', '?actionId=8&contactId='+data.contactId, fillSelect, null,
			(opt,item)=>opt.value = item.customerContactId, 
			(opt,item)=>opt.text = item.customer.customerName + ' ' + item.contactType.contactTypeName, 
			null);
	getDataEx('cmbAvailableCustomers', 'customer', '?actionId=11&contactId='+data.contactId, fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName, 
			null);	
}
        
function fillCustomerDetails(id, data){
	setValue('txtCustomerName', data.customerName);
	setValue('txtCustomerNotes', data.customerNotes);
	setValue('detailCustomerId', data.customerId);
}

function fillAttachmentDetails(id, data){
	setValue('cmbAttachmentType', data.attachmentType.attachmentTypeId);
	setValue('cmbAttachmenContact', data.taskLog.contact.contactId);
	setValue('txtAttachmentNotes', data.taskLog.description);
	setValue('attachmentTaskLogId', data.taskLog.taskLogId);
	setValue('attachmentId', data.attachmentId);
}

//***** save model ***** //

function saveTask(){
	let method;
	let formData = new FormData();
	if(getValue('cmbDetailTaskType') == 0){
		setMsg(msgType.nok, 'Please select a task type');
		return;
	}
	if(getValue('cmbDetailContact') == 0){
		setMsg(msgType.nok, 'Please select a contact');
		return;
	}
	if(getValue('txtDetailTaskTitle') == ''){
		setMsg(msgType.nok, 'Please enter a task title');
		return;
	}	
	if(getValue('txtDetailTaskEffort') == ''){
		setMsg(msgType.nok, 'Please fill Effort');
		return;
	}
	if(getValue('txtDetailDueDate') == ''){
		setMsg(msgType.nok, 'Please select a due date');
		return;
	}
	if(getValue('cmbDetailTaskType') == 0){
		setMsg(msgType.nok, 'Please select a task type');
		return;
	}
	formData.append('taskTypeId', getValue('cmbDetailTaskType'));
	formData.append('contactId', getValue('cmbDetailContact'));
	formData.append('title', getValue('txtDetailTaskTitle'));
	formData.append('effort', getValue('txtDetailTaskEffort'));
	formData.append('effortUnit',getValue('cmbDetailEffortUnit'));
	formData.append('dueDate', getValue('txtDetailDueDate'));
	formData.append('statusId', getValue('cmbDetailStatus'));
	
	let taskId = getValue('taskId');
	if(taskId == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append('taskId', taskId);
	}
	
	if(dbg == dbgModule.tasklog)
		debugFormData(formData);
	
	setData(method, formData, 'task')
		.then(function(newId){
			if(taskId == 0){
				saveTaskLog(getValue('cmbDetailContact'), 4, 'Task created', newId.taskId); 
			}
			getById('taskId').value = newId.taskId; 
			if(getValue('cmbDetailTaskType') ==1)
				getById('TabLinkedCustomer').style.display='inline';
			})
		.then(function(){prepareSearchTask()})
		.then(function(){setTab(prepareSearchTask)})
		.then(function(){setMsg(msgType.ok, 'Task saved')});
}

function validateTaskLog(){
	if( getValue('taskId') == '0' || getValue('taskId') == ''){
		setMsg(msgType.nok, 'Please select a task from the list');
		return;
	}	
	if( getValue('txtTaskLogDescription') == ''){
		setMsg(msgType.nok, 'Description cannot be empty');
		return;
	}
	if( getValue('cmbTaskLogType') == 0){
		setMsg(msgType.nok, 'Please select a log type');
		return;
	}
	if( getValue('cmbTaskLogContact') == 0){
		setMsg(msgType.nok, 'Please select a contact');
		return;
	}	
	saveTaskLog(getValue('cmbTaskLogContact'),
			 getValue('cmbTaskLogType'),
			 getValue('txtTaskLogDescription'),
			 getValue('taskId'));
} 
function saveTaskLog(contactId, taskLogTypeId, description, taskId){
	let formData = new FormData();
	let method;
		
	formData.append('contactId', contactId);
	formData.append('taskLogTypeId',taskLogTypeId);
	formData.append('description', description);
	formData.append('taskId', taskId);
	
	let taskLogId = getValue('taskLogId');
	if(taskLogId == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append('taskLogId', taskLogId);
	}
	
	if(dbg==dbgModule.tasklog)
		debugFormData(formData);

	setData(method, formData, 'tasklog')
		.then(function(){getData('taskLogBody', 'tasklog', '?actionId=2&taskId='+getById('taskId').value, fillTaskLogList)})
		.then(function(){setMsg(msgType.ok, 'Log saved')});
}
        
function saveAsParent(){
	let method;
	let formData = new FormData();
	
	if(getValue('cmbChildTaskList') == '' && getValue('cmbRelationTaskList') == ''){
		setMsg(msgType.nok, 'Please select a task to set as parent');
		return;
	}
	let parentTaskList = getById('cmbParentTaskList');
    for (let i = parentTaskList.length - 1; i >= 0; i--) {
    	if(parentTaskList.options[i].value == getValue('taskRelationSelectedTaskId')){
    		setMsg(msgType.nok, 'This task is already set as a parent');
    		return;
    	}
	}

	if(getValue('cmbTaskRelationType') == 0){
		setMsg(msgType.nok, 'Please select a relation type');
		return;
	}
	
	formData.append('childTaskId', getValue('taskId'));
	formData.append('parentTaskId', getValue('taskRelationSelectedTaskId'));
	formData.append('taskRelationTypeId', getValue('cmbTaskRelationType'));
	
	if(dbg==dbgModule.relation)
		debugFormData(formData);
	
	let taskRelationId = getValue('taskRelationId');
	if(taskRelationId == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append('taskRelationId', taskRelationId)
	}		
	setData(method, formData, 'taskrelation')
	.then(function(){getData('cmbParentTaskList', 'taskrelation', '?actionId=5&taskId='+getValue('taskId'), fillTaskRelationListParent)})
	.then(function(){getData('cmbChildTaskList', 'taskrelation', '?actionId=7&taskId='+getValue('taskId'), fillTaskRelationListChild)})
	.then(function(){setMsg(msgType.ok, 'Parent relation saved')});
}

function saveAsChild(){
	let method;
	let formData = new FormData();

	if(getValue('cmbParentTaskList') == '' && getValue('cmbRelationTaskList') == ''){
		setMsg(msgType.nok, 'Please select a task to set as child');
		return;
	}

	let parentTaskList = getById('cmbChildTaskList');
    for (let i = parentTaskList.length - 1; i >= 0; i--) {
    	if(parentTaskList.options[i].value == getValue('taskRelationSelectedTaskId')){
    		setMsg(msgType.nok, 'This task is already set as a child');
    		return;
    	}
	}
	if(getValue('cmbTaskRelationType') == 0){
		setMsg(msgType.nok, 'Please select a relation type');
		return;
	}	
	
	formData.append('parentTaskId', getValue('taskId')); 
	formData.append('childTaskId', getValue('taskRelationSelectedTaskId'));
	formData.append('taskRelationTypeId',  getValue('cmbTaskRelationType'));
	
	if(dbg==dbgModule.relation)
		debugFormData(formData);
	
	let taskRelationId = getValue('taskRelationId');
	if(taskRelationId == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append('taskRelationId', taskRelationId)
	}
	
	setData(method, formData, 'taskrelation')
	.then(function(){getData('cmbChildTaskList', 'taskrelation', '?actionId=7&taskId='+getValue('taskId'), fillTaskRelationListChild)})
	.then(function(){getData('cmbParentTaskList', 'taskrelation', '?actionId=5&taskId='+getValue('taskId'), fillTaskRelationListParent)})
	.then(function(){setMsg(msgType.ok, 'Child relation saved')});
}

function removeTaskRelation(){
	let method='DELETE';
	let formData = new FormData();
	
	if(getValue('taskRelationId') == 0){
		setMsg(msgType.nok, 'Please select a task to remove');
		return;
	}
	
	formData.append('taskRelationId', getValue('taskRelationId'));
	
	setData(method, formData, 'taskrelation')
	.then(function(){getData('cmbParentTaskList', 'taskrelation', '?actionId=5&taskId='+getValue('taskId'), fillTaskRelationListParent)})
	.then(function(){getData('cmbChildTaskList', 'taskrelation', '?actionId=7&taskId='+getValue('taskId'), fillTaskRelationListChild)})
	.then(function(){setMsg(msgType.ok, 'Relation Removed')});
	
}

function saveCustomer(){
	let method;
	let formData = new FormData();
	
	if(getValue('txtCustomerName') == ''){
		setMsg(msgType.nok, 'Please fill customer name');
		return;
	}
	formData.append('customerName', getValue('txtCustomerName'));
	formData.append('customerNotes', getValue('txtCustomerNotes'));  		
	if(getValue('detailCustomerId') == 0){
		method = 'POST';
	}
	else{
		method = 'PUT';
    	formData.append('customerId', getValue('detailCustomerId'));
	}

	if(dbg==dbgModule.customer)
		debugFormData(formData);

	setData(method, formData, 'customer')
		.then(function(data){if(dbg==dbgModule.customer){console.logdata}})
		.then(function(){getData('cmbCustomerList', 'customer', '?actionId=2', fillCustomerList);})
			.then(function(){setMsg(msgType.ok, 'Customer saved')});

}

      	
function saveContact(){
	let formData = new FormData();
	let element;
	let method;
	if(getValue('txtFirstName') == ''){
		setMsg(msgType.nok, 'Contact missing First Name');
		return;
	}
	if(getValue('txtLastName') == ''){
		setMsg(msgType.nok, 'Contact missing Last Name');
		return;
	}	
	formData.append('firstName', getValue('txtFirstName'))
	formData.append('lastName', getValue('txtLastName'))
	formData.append('officePhone', getValue('txtOfficePhone'))
	formData.append('mobilePhone', getValue('txtMobilePhone'))
	formData.append('email', getValue('txtEmail'))
	formData.append('notes', getValue('txtNotes'))
	
	let contactId = getValue('ConnectionContactId');
	if(contactId == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append('contactId', contactId);
	}

	if(dbg==dbgModule.contact)
		debugFormData(formData);

	setData(method, formData, 'contact')
		.then(()=>{
			if(cmbConnectedCustomer.value != ''){
				getDataEx('cmbConnectedContact', 'customercontact', '?actionId=12&customerId='+cmbConnectedCustomer.value, fillSelect, null, 
				(opt,item)=>opt.value = item.contact.contactId, 
				(opt,item)=>{
				let phone = (item.contact.officePhone == '')?((item.contact.cellPhone == '')?'':item.contact.cellPhone):item.contact.officePhone;
				opt.text = item.contact.firstName + " " + item.contact.lastName + " : " + new String((phone == null)?"  -  ":phone);
				},
				(opt, item)=>{
					opt.addEventListener("click", ()=>{
						getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contact.contactId, fillContactCard);
						cmbConnectedAddress.value=item.address.addressId
						})
					}
				)	
			}
			getDataEx('cmbAllContact', 'contact', '?actionId=2', fillSelect, null,
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>{
			let phone = (item.officePhone == '')?((item.mobilePhone == '')?'':item.mobilePhone):item.officePhone;
			opt.text = item.firstName + " " + item.lastName + " : " + new String((phone == null)?"  -  ":phone);
			},
			(opt, item)=>{
				opt.addEventListener("click", ()=>{
					getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contactId, fillContactCard);
					})
				}
			)			
		}

		);
	setMsg(msgType.ok, 'Contact saved');
}

//TODO vdddd
function saveCustomerContact(action){
	let formData = new FormData();
	let method;
	
	if(action == 1){	//add
		
		if(getValue('cmbConnectedCustomer') == 0 || getValue('cmbConnectedCustomer') == ''){
			setMsg(msgType.nok, 'Please select a customer');
			return;
		}
		if(getValue('ConnectionContactId') == 0 || getValue('ConnectionContactId') == ''){
			setMsg(msgType.nok, 'Please select a contact');
			return;
		}		
		if(getValue('cmbContactType') == 0){
			setMsg(msgType.nok, 'Please select a Contact type');
			return;
		}
		if(getValue('cmbConnectedAddress') == 0 || getValue('cmbConnectedAddress') == ''){
			setMsg(msgType.nok, 'Please select an address');
			return;
		}		
		formData.append('customerId',  getValue('cmbConnectedCustomer'));
		formData.append('contactId', getValue('ConnectionContactId'))
		formData.append('contactTypeId', getValue('cmbContactType'))
		formData.append('addressId', getValue('cmbConnectedAddress'))
	}else{				//delete
		if(getValue('cmbConnectedCustomer') == 0 || getValue('cmbConnectedCustomer') == ''){
			setMsg(msgType.nok, 'Please select a customer to remove from the contact');
			return;
		}
		if(getValue('ConnectionContactId') == 0 || getValue('ConnectionContactId') == ''){
			setMsg(msgType.nok, 'Please select a contact to remove the connection');
			return;
		}	
		if(getValue('ConnectionCustomerContactId') == 0 || getValue('ConnectionCustomerContactId') == ''){
			setMsg(msgType.nok, 'Please select a Customer to remove the connection');
			return;
		}		
		
		formData.append('customerContactId', getValue('ConnectionCustomerContactId'))
	}
	if(dbg == dbgModule.contact)
		debugFormData(formData);
	
	if(action == '1'){
		method = 'POST';
	}else{
		method = 'DELETE';
	}	
	
	setData(method, formData, 'customercontact')
	.then(getDataEx('cmbConnectedContact', 'customercontact', '?actionId=12&customerId='+cmbConnectedCustomer.value, fillSelect, null, 
			(opt,item)=>opt.value = item.contact.contactId, 
			(opt,item)=>{
			let phone = (item.contact.officePhone == '')?((item.contact.cellPhone == '')?'':item.contact.cellPhone):item.contact.officePhone;
			opt.text = item.contact.firstName + " " + item.contact.lastName + " : " + new String((phone == null)?"  -  ":phone);
			},
			(opt, item)=>{
				opt.addEventListener("click", ()=>{
					getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contact.contactId, fillContactCard);
					cmbConnectedAddress.value=item.address.addressId
					})
				}
			)
		)
		.then(function(){setMsg(msgType.ok, 'Connection change saved')});

}   

function newAddress(){
	setValue('txtAddressStreet', '');
	setValue('txtAddressHouseNum', '');
	setValue('txtAddressCity', '');
	setValue('txtAddressCountry', '');
	setValue('addressId', 0);
}

function saveAddress(){
	let formData;
	let method;
	if(getValue('txtAddressStreet') == ''){
		setMsg(msgType.nok, 'Please fill the street name');
		return;
	}
	if(getValue('txtAddressHouseNum') == ''){
		setMsg(msgType.nok, 'Please fill the building number');
		return;
	}
	if(getValue('txtAddressCity') == ''){
		setMsg(msgType.nok, 'Please fill the city name');
		return;
	}
	if(getValue('cmbConnectedCustomer') == ''){
		setMsg(msgType.nok, 'Please select a Customer');
		return;
	}	
	
	formData = new FormData();
	formData.append('street', getValue('txtAddressStreet'));
	formData.append('houseNum', getValue('txtAddressHouseNum'));
	formData.append('city', getValue('txtAddressCity'));
	formData.append('country', getValue('txtAddressCountry'));
	formData.append('customerId', getValue('cmbConnectedCustomer'));
	
	let addressId = getValue('addressId');
	if(addressId == '0'){
		method = 'POST';
	}else{
		method = 'PUT';
		formData.append('addressId', addressId);
	}

	if(dbg == dbgModule.contact)
	debugFormData(formData);
	
	setData(method, formData, 'address');
	setMsg(msgType.ok, 'Address saved');
}

function saveAttachment(){
	
	let oFormData = new FormData();
	let method;
	let attachmentType = getById('cmbAttachmentType');
	let attachmentId = getValue('attachmentId');

	if(getValue('taskId') == '0'){
		setMsg(msgType.nok, 'Please select a task before inserting an attachment');
		return;
	}
	if(attachmentType.value == 0){
		setMsg(msgType.nok, 'Please select attachment type');
		return;
	}
	if(getValue('cmbAttachmenContact') == 0){
		setMsg(msgType.nok, 'Please select a contact');
		return;
	}
	if(attachmentId == '0' && getValue('attachmentFile') == 0){
		setMsg(msgType.nok, 'Please select a file');
		return;
	}
	
	oFormData.append('contactId', getValue('cmbAttachmenContact'));
	let notes = (getValue('txtAttachmentNotes') == '')?attachmentType.options[attachmentType.selectedIndex].text:getValue('txtAttachmentNotes');
	oFormData.append('attachmentNotes', notes);
	oFormData.append('attachmentTypeId', getValue('cmbAttachmentType'));

	if(attachmentId == 0){
		method = 'POST';
		oFormData.append('taskId', getValue('taskId'));
		oFormData.append('attachmentFile', getById('attachmentFile').files[0]);
	}
	else{
		method = 'PUT';
		oFormData.append('attachmentId', getValue('attachmentId'));
		oFormData.append('taskLogId', getValue('attachmentTaskLogId'));
	}
	
	if(dbg==dbgModule.attachment)
		debugFormData(oFormData);
	
	setData(method, oFormData, 'attachment')
	.then(function(data){setValue('attachmentId', data.attachmentId)})
	.then(function(){getData('cmbAttachmentList', 'attachment', '?actionId=2&taskId='+getValue('taskId'), fillAttachmentList)})
	.then(function(){setMsg(msgType.ok, 'Attachment saved')})
	.then(function(){setValue('txtAttachmentNotes', notes)})
	.catch(function(err){setMsg(msgType.nok, 'Attachment save failed. please check the log'); console.log(err)});
}

function addLinkedCustomer(){
	let formData = new FormData();
	let method = 'POST';	
    let selectElement = getById('cmbLinkedCustomer');

    if(getValue('cmbNoneLinkedCustomer') == ''){
		setMsg(msgType.nok, 'Please select a customer');
		return;
    }
    
    formData.append('customerId', getValue('cmbNoneLinkedCustomer'));
    formData.append('taskId', getValue('taskId'));
    
    setData(method, formData, 'customertask')
    	.then(function(){getDataEx('cmbLinkedCustomer', 'customertask', '?actionId=9&taskId='+getValue('taskId'), fillSelect, null, 
			(opt,item)=>opt.value = item.customerTaskId, 
			(opt,item)=>opt.text = item.customer.customerName, null);})
			.then(function(){setMsg(msgType.ok, 'customer added to project');});
 
    for (let i = getById('cmbNoneLinkedCustomer').length - 1; i >= 0; i--) {
    	if(getById('cmbNoneLinkedCustomer').options[i].value == getValue('cmbNoneLinkedCustomer')){
    		getById('cmbNoneLinkedCustomer').remove(i);
    	}
    }
}

function removeLinkedCustomer(){
	let formData = new FormData();
	let method = 'DELETE';	
    if(getValue('cmbLinkedCustomer') == ''){
		setMsg(msgType.nok, 'Please select a customer');
		return;
    }	
	
    formData.append('customerTaskId', getValue('cmbLinkedCustomer'));
    
	if(dbg==dbgModule.task)
		debugFormData(formData);
	
    setData(method, formData, 'customertask')
    .then(function(newId){console.log(newId)})
	.then(function(){getDataEx('cmbLinkedCustomer', 'customertask', '?actionId=9&taskId='+getValue('taskId'), fillSelect, null, 
		(opt,item)=>opt.value = item.customerTaskId, 
		(opt,item)=>opt.text = item.customer.customerName, null);})
		.then(function(){getDataEx('cmbNoneLinkedCustomer', 'customer', '?actionId=10&taskId='+getValue('taskId'), fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName);	})
		.then(function(){setMsg(msgType.ok, 'Customer removed');});
}

function saveLogin(){
	let formData = new FormData();
	let method;	
	
	formData.append('username', getValue('txtUserName'));
	formData.append('password', getValue('txtPassword'));
	formData.append('contactId', getValue('loginContactId'));
	let loginId = getValue('loginId');
	if(loginId == 0){
		method = 'POST';
	}else{
		method = 'PUT';
		formData.append('loginId', getValue('loginId'));
	}
	
	if(dbg==dbgModule.login)
		debugFormData(formData);
	
	setData(method, formData, 'customertask')
		.then(activateTabLogin())
		.catch(function(err){setMsg(msgType.nok, 'save Login failed. please check the log'); console.log(err)});
}
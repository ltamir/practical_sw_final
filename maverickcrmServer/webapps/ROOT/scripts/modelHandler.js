// ***** new model ***** //

function newAttachment(){
	attachmentModel.attachmentId.setValue(0);
	attachmentModel.type.setValue(0);
	attachmentModel.file.setValue('');
	attachmentModel.contact.setValue(0);
	attachmentModel.notes.setValue('');
	
	setMsg(msgType.ok, 'Ready');
}

function newCustomer(){	
	customerModel.customerId.serValue(0);
	customerModel.customerName.serValue('');
	customerModel.customerNotes.serValue('');

	setMsg(msgType.ok, 'Ready');
}

function newContact(){
	contact.firstName.setValue('');
	contact.lastName.setValue('');
	contact.officePhone.setValue('');
	contact.mobilePhone.setValue('');
	contact.email.setValue('');
	contact.notes.setValue('');
	contact.contactId.setValue(0);

	setMsg(msgType.ok, 'Ready');
}

function newLogin(){
	login.loginId.setValue(0);
	login.userName.setValue('');
	login.password.setValue('');
	login.contact.setValue('');
	setValue('cmbAvailableLogins', 0);
}


function newTask(taskType){
	if(taskType == null)
		taskType = 0;
	taskModel.taskId.setValue(0);
	taskModel.taskType.setValue(taskType);
	menuSetter(menuData.taskType, taskTypeList, taskModel.taskType.getValue());
	taskModel.contact.setValue(loggedContact.contactId);
	taskModel.title.setValue('');
	taskModel.effort.setValue(1);
	taskModel.effortUnit.setValue(1);
	menuSetter(menuData.taskEffortUnit, effortUnitList, 1);
	taskModel.dueDate.setValue('');
	taskModel.status.setValue(1);
	menuSetter(menuData.taskStatus, taskStatusList, 1);
	
	if(getById('addChildTask').getAttribute('data-state') == 1){
		setChildTask(getById('addChildTask'));
	}
	
	setTab(tabEnum.taskLog); 
	setMsg(msgType.ok, 'Ready');
}

 
function newRelation(){
    element = getById('divParentTaskList');
    for (let i = element.length - 1; i >= 0; i--) {
    	element.remove(i);
	}  
    element = getById('divChildTaskList');
    for (let i = element.length - 1; i >= 0; i--) {
    	element.remove(i);
	}  
    element = getById('cmbRelationTaskList');
    for (let i = element.length - 1; i >= 0; i--) {
    	element.remove(i);
	}
	
}

function newTaskLog(){
	taskLogModel.taskLogId.setValue(0);
	taskLogModel.contact.setValue(loggedContact.contactId);
	taskLogModel.taskLogType.setValue(0);
	taskLogModel.description.setValue('');
	setMsg(msgType.ok, 'Ready');
}

// ***** view model ***** //

function viewContact(id, item){
	let contact = item.contact;
	let card = getById(id);
	contactModel.firstName.setValue(contact.firstName);
	contactModel.lastName.setValue(contact.lastName);
	contactModel.officePhone.setValue(contact.officePhone);
	contactModel.mobilePhone.setValue(contact.mobilePhone);
	contactModel.email.setValue(contact.email);
	contactModel.notes.setValue(contact.notes);
	contactModel.contactId.setValue(contact.contactId);
}

function viewAddress(id, item){
	let address = item.address;
	let card = getById(id);
	addressModel.street.setValue(address.street);
	addressModel.houseNum.setValue(address.houseNum);
	addressModel.city.setValue(address.city);
	addressModel.country.setValue(address.country);
	addressModel.addressId.setValue(address.addressId);
}

//TODO fix child task state - cancellation, view other task, implementation
function setChildTask(setter){
	if(setter.getAttribute('data-state') == 0){
		setter.setAttribute('data-parentTask', 0);
		setMsg(msgType.ok, 'new Task will not be set as child');
		return;
	}

	if(taskModel.taskId.getValue() == 0){
		setMsg(msgType.nok, 'Please select a task');
		toggleAsBotton(getById('addChildTask'));
		return;
	}
	let parentTaskId = taskModel.taskId.getValue();
	newTask(taskModel.taskTypeId.getValue());
	setter.setAttribute('data-parentTask', parentTaskId);
	setMsg(msgType.ok, 'new Task will be set as child');
}

function viewTask(id, data){
	let task = data.task;
	menuSetter(menuData.taskType, taskTypeList, task.taskType.taskTypeId);
	
	taskModel.contact.setValue(task.contact.contactId);
	taskModel.title.setValue(task.title);
	menuSetter(menuData.taskEffortUnit, effortUnitList, task.effortUnit);

	taskModel.effort.setValue(task.effort);
	
	let addChildTaskState = getById('addChildTask');
	if(addChildTaskState.getAttribute('data-state') == 1){
		toggleState(addChildTaskState);
		setChildTask(addChildTaskState);
	}
	
	taskModel.dueDate.dom.value = taskModel.dueDate.getISODate(task.dueDate);
	getById('lblDetailDueDate').innerHTML = taskModel.dueDate.getDate(taskModel.dueDate.dom.value);
	menuSetter(menuData.taskStatus, taskStatusList, task.status.statusId);
	taskModel.taskId.setValue(task.taskId); 
	
	setTab(activeTaskTab);
	
	if(task.taskType.taskTypeId==1){
		getById('TabLinkedCustomer').style.display='inline';
	}else{
		getById('TabLinkedCustomer').style.display='none';		
	}
	getDataEx('', 'business', '?taskId=' + task.taskId, 
			function(id, data, defaultOption, funcValue, funcText, eventHandler){
				getById('totalTaskEffort').innerHTML = data.total;
				let effortState = getById('imgEffortStatus');
				let taskEffort = effortUnitList[taskModel.effortUnit.dom.value].getHours(taskModel.effort.dom.value);

				if(taskEffort < data.totalHours){
					effortState.src='images/state_alert.png';
					effortState.title = 'effort is smaller than total effort';
				}else{
					effortState.src='images/state_success.png';
					effortState.title = 'effort is correct';			
				}
			}, null, null, null, null);
	
	menuData.newTask.menuid.src='images/add_task.png';
	setMsg(msgType.ok, 'Ready');
}


function viewTaskLog(id, data){
	let taskLog = data.taskLog;
	taskLogModel.description.setValue(taskLog.description);
	taskLogModel.contact.setValue(taskLog.contact.contactId);
	taskLogModel.taskLogType.setValue(taskLog.taskLogType.taskLogTypeId);
	taskLogModel.sysdate.setValue(taskLog.sysdate);
	taskLogModel.taskLogId.setValue(taskLog.taskLogId);
}
        
function viewCustomer(id, data){
	let customer = data.customer;
	customerModel.customerId.setValue(customer.customerId);
	customerModel.customerName.setValue(customer.customerName);
	customerModel.customerNotes.setValue(customer.customerNotes);
}

function viewAttachment(id, data){
	let attachment = data.attachment;
	attachmentModel.attachmentId.setValue(attachment.attachmentId);
	attachmentModel.type.setValue(attachment.attachmentType.attachmentTypeId);
	attachmentModel.contact.setValue(attachment.taskLog.contact.contactId);
	attachmentModel.notes.setValue(attachment.taskLog.description);
	attachmentModel.taskLogId.setValue(attachment.taskLog.taskLogId);

}

function viewLogin(id, data){
	let login = data.login;
	loginModel.username.setValue(login.username);
	loginModel.password.setValue(login.password);
	loginModel.loginId.setValue(login.loginId);
	loginModel.contact.setValue(login.contact.contactId);
}

//***** save model ***** //

//formData.append(taskRelationTypeId.taskRelationId.api, taskRelationTypeId.taskRelationId.getValue());
function validate(modelKey, value, errorMessage){
	if(modelKey.getValue() == value){
		if(errorMessage != null)
			setMsg(msgType.nok, errorMessage);
		return false;
	}
	return true;
}

function saveTask(){
	let method;
	let formData = new FormData();
	
	if(taskModel.title.getValue().length > 120){
		setMsg(msgType.nok, 'Title is limited to 120. Please add the remaining as log');
		return;
	}
	
	if(!validate(taskModel.taskType, 0, 'Please select a task type')) return;
	if(!validate(taskModel.contact, 0, 'Please select a contact')) return;
	if(!validate(taskModel.title, 0, 'Please enter a task title')) return;
	if(!validate(taskModel.effort, '', 'Please enter an effort')) return;
	if(!validate(taskModel.dueDate, '', 'Please select a due date')) return;

	formData.append(taskModel.taskType.api, taskModel.taskType.getValue());
	formData.append(taskModel.contact.api, taskModel.contact.getValue());
	formData.append(taskModel.title.api, taskModel.title.getValue());
	formData.append(taskModel.effort.api, taskModel.effort.getValue());
	formData.append(taskModel.effortUnit.api, taskModel.effortUnit.getValue());
	formData.append(taskModel.dueDate.api, taskModel.dueDate.getValue());
	formData.append(taskModel.status.api, taskModel.status.getValue());
	
	if(taskModel.taskId.getValue() == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append('taskId', taskModel.taskId.getValue());
	}
	
	if(dbg == dbgModule.task)
		debugFormData(formData);
	
	setData(method, formData, 'task')
		.then(function(newId){
			if(newId.status == 'nack'){
				setMsg(msgType.nok, newId.msg);
				return;
			}
			if(taskId == 0){
				saveTaskLog(getValue('cmbDetailContact'), 4, 'Task created', newId.taskId); 
			}
			getById('taskId').value = newId.taskId; 
			if(taskModel.taskType.getValue() ==1)
				getById('TabLinkedCustomer').style.display='inline';
			})
		.then(()=>{
			let addChildTask = getById('addChildTask');
			if(method == 'POST' && addChildTask.getAttribute('data-parentTask') != 0){
			saveRelation(addChildTask.getAttribute('data-parentTask'), taskModel.taskId.getValue(), 1);
			addChildTask.setAttribute('data-parentTask', 0);
			toggleState(addChildTask);
		}})
		.then(function(){searchTask(prepareSearchTask())})
		.then(function(){setMsg(msgType.ok, 'Task saved')});
}


function validateTaskLog(){
	if(!validate(taskLogModel.taskId, 0, 'Please select a task from the list')) return;
	if(!validate(taskLogModel.description, '', 'Description cannot be empty')) return;
	if(!validate(taskLogModel.taskLogType, 0, 'Please select a log type')) return;
	if(!validate(taskLogModel.contact, 0, 'Please select a contact')) return;
	
	saveTaskLog(taskLogModel.contact.getValue(),
			taskLogModel.taskLogType.getValue(),
			taskLogModel.description.getValue(),
			taskLogModel.taskId.getValue());
} 

function saveTaskLog(contactId, taskLogTypeId, description, taskId){
	let formData = new FormData();
	let method;
		
	formData.append(taskLogModel.contact.api, contactId);
	formData.append(taskLogModel.taskLogType.api ,taskLogTypeId);
	formData.append(taskLogModel.description.api, description);
	formData.append(taskLogModel.taskId.api, taskId);
	
	if(taskLogModel.taskLogId.getValue() == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append('taskLogId', taskLogModel.taskLogId.getValue());
	}
	
	if(dbg==dbgModule.tasklog)
		debugFormData(formData);

	setData(method, formData, 'tasklog')
		.then(function(){getData('taskLogBody', 'tasklog', '?actionId=2&taskId='+taskLogModel.taskId.getValue(), fillTaskLogList)})
		.then(newTaskLog())
		.then(function(){setMsg(msgType.ok, 'Log saved')});
}


function prepareSaveRelation(asParent){
	let relationTaskList;
	let relName = (asParent == 1)?'parent':'child';
	
	if(!validate(taskModel.taskId, 0, 'Please select a task')) return;
	if(!validate(taskRelationModel.selectedTask, 0, 'Please select a task to set as ' + relName)) return;
	if(!validate(taskRelationModel.selectedTask, '', 'Please select a task to set as ' + relName)) return;
	
	let selectedTaskId = getValue('taskRelationSelectedTaskId');
	if(asParent == 1)
		relationTaskList = getById('divParentTaskList');
	else
		relationTaskList = getById('divChildTaskList');
    for (let i = relationTaskList.childNodes.length - 1; i >= 0; i--) {
    	if(relationTaskList.childNodes[i].hasAttribute("data-taskId") && relationTaskList.childNodes[i].getAttribute("data-taskId") == selectedTaskId){
			setMsg(msgType.nok, 'This task is already set as a ' + relName);
    		return;
    	}
	}	
	
    if(!validate(taskRelationModel.taskRelationType, 0, 'Please select a relation type')) return;

	if(asParent == 1)
		saveRelation(taskRelationModel.selectedTask.getValue(), taskModel.taskId.getValue(), taskRelationModel.taskRelationType.getValue());
	else
		saveRelation(taskModel.taskId.getValue(), taskRelationModel.selectedTask.getValue(), taskRelationModel.taskRelationType.getValue());
}


function saveRelation(parent, child, relationType){
	let method;
	let formData = new FormData();
	let taskRelationId;

	formData.append('childTaskId', child);
	formData.append('parentTaskId', parent);
	formData.append('taskRelationTypeId', relationType);
	
	if(dbg==dbgModule.relation)
		debugFormData(formData);

	if(taskRelationModel.taskRelationId.getValue() == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append('taskRelationId', taskRelationModel.taskRelationId.getValue())
	}		
	setData(method, formData, 'taskrelation')
	.then(function(){
		if(activeTaskTab != tabEnum.relation)
			return;
		getDataEx('divParentTaskList', 'taskrelation', '?actionId=5&taskId='+taskModel.taskId.getValue(), fillTaskRelationList, 1, null, null, null);
		getDataEx('divChildTaskList', 'taskrelation', '?actionId=7&taskId='+taskModel.taskId.getValue(), fillTaskRelationList, 2, null, null, null);
		})
	.then(function(){setMsg(msgType.ok, 'Relation saved')});
}


function saveRelationType(relationTypeId){
	let taskRelationId = getById('divRelationTypeList').getAttribute('data-taskrelationId');
	let formData = new FormData();
	
	formData.append(taskRelationTypeId.taskRelationId.api, taskRelationTypeId.taskRelationId.getValue());
	formData.append(taskRelationTypeId.taskRelationType.api, taskRelationTypeId.taskRelationType.getValue());
	setData('PUT', formData, 'taskrelation')
	.then(function(resp){
		if(resp.status == 'nack'){
			setMsg(msgType.nok, resp.msg);
			console.log('error ' + resp.err);
			return;
		}else{
			setMsg(msgType.ok, 'Relation type updated');
			getById('divRelationTypeList').style.display='none'; 
			getById('divRelationTypeList').removeAttribute('data-taskrelationId');
			getById('divTaskTab').appendChild(getById('divRelationTypeList'));
			getDataEx('divParentTaskList', 'taskrelation', '?actionId=5&taskId='+getValue('taskId'), fillTaskRelationList, 1, null, null, null);
			getDataEx('divChildTaskList', 'taskrelation', '?actionId=7&taskId='+getValue('taskId'), fillTaskRelationList, 2, null, null, null);			
		}		
	});
}

function removeTaskRelation(){
	let method='DELETE';
	let formData = new FormData();
	
	if(!validate(taskRelationTypeId.taskRelationId, '', 'Please select a task to remove from the relation')) return;
	
	formData.append(taskRelationTypeId.taskRelationId.api, taskRelationTypeId.taskRelationId.getValue());
	
	setData(method, formData, 'taskrelation')
	
	.then(function(){getDataEx('divParentTaskList', 'taskrelation', '?actionId=5&taskId='+getValue('taskId'), fillTaskRelationList, 1, null, null, null)})
	.then(function(){getDataEx('divChildTaskList', 'taskrelation', '?actionId=7&taskId='+getValue('taskId'), fillTaskRelationList, 2, null, null, null)})
	.then(getById('divTaskTab').removeAttribute('data-selected'))
	.then(function(){setMsg(msgType.ok, 'Relation Removed')});
	
}

function saveCustomer(){
	let method;
	let formData = new FormData();
	
	if(!validate(customerModel.customerName, '', 'Please fill customer name')) return;

	formData.append(customerModel.customerName.api, customerModel.customerName.getValue());
	formData.append(customerModel.customerNotes.api, customerModel.customerNotes.getValue());
	 		
	if(customerModel.customerId.getValue() == 0){
		method = 'POST';
	}
	else{
		method = 'PUT';
    	formData.append(customerModel.customerId.api, customerModel.customerId.getValue());
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
	
	if(!validate(contactModel.firstName, '', 'Contact missing First Name')) return;
	if(!validate(contactModel.lastName, '', 'Contact missing Last Name')) return;

	formData.append(contactModel.firstName.api, contactModel.firstName.getValue());
	formData.append(contactModel.lastName.api, contactModel.lastName.getValue());
	formData.append(contactModel.officePhone.api, contactModel.officePhone.getValue());
	formData.append(contactModel.mobilePhone.api, contactModel.mobilePhone.getValue());
	formData.append(contactModel.email.api, contactModel.email.getValue());
	formData.append(contactModel.notes.api, contactModel.notes.getValue());
	
	if(contactModel.contactId.getValue() == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append(contactModel.contactId.api, contactModel.contactId.getValue());
	}

	if(dbg==dbgModule.contact)
		debugFormData(formData);

	setData(method, formData, 'contact')
	.then(function(resp){
		if(resp.status == 'nack'){
			setMsg(msgType.nok,  resp.msg);
			console.log('error ' + resp.err);
			return;
		}else{
			if(getById('imgFilterContact').getAttribute("data-state") == 1)
				showAssociatedContacts();
			else
				showAllContacts();
			
			setMsg(msgType.ok, 'Contact saved')
			}
		});
}


function saveAssociation(action){
	let formData = new FormData();
	let method;
	
	if(action == 1){	//add
		if(!validate(associationModel.customer, 0, 'Please select a customer')) return;
		if(!validate(associationModel.customer, '', 'Please select a customer')) return;
		if(!validate(associationModel.contact, 0, 'Please select a contact')) return;
		if(!validate(associationModel.contact, '', 'Please select a contact')) return;
		if(!validate(associationModel.contactType, 0, 'Please select a Contact type')) return;		
		if(!validate(associationModel.address, 0, 'Please select an address')) return;

		if(associationModel.associationId.getValue() > 0)
			method = 'PUT';
		else
			method = 'POST';
		formData.append(associationModel.customer.api,  associationModel.customer.getValue());
		formData.append(associationModel.contact.api, associationModel.contact.getValue())
		formData.append(associationModel.contactType.api, associationModel.contactType.getValue())
		formData.append(associationModel.address.api, associationModel.address.getValue())
		formData.append(associationModel.associationId.api, associationModel.associationId.getValue())
	}else{				//delete
		if(!validate(associationModel.customer, 0, 'Please select a customer to remove from the contact')) return;
		if(!validate(associationModel.customer, '', 'Please select a customer to remove from the contact')) return;
		if(!validate(associationModel.contact, 0, 'Please select a contact to remove the connection')) return;
		if(!validate(associationModel.contact, '', 'Please select a contact to remove the connection')) return;
		if(!validate(associationModel.associationId, 0, 'Contact is not connected')) return;
		if(!validate(associationModel.associationId, '', 'Contact is not connected')) return;	
		
		formData.append(associationModel.associationId.api, associationModel.associationId.getValue())
		method = 'DELETE';
	}
	if(dbg == dbgModule.contact)
		debugFormData(formData);	
	
	setData(method, formData, 'association')
	.then(function(resp){
		if(resp.status == 'nack'){
			setMsg(msgType.nok,  resp.msg);
			console.log('error ' + resp.err);
			return;
		}else{
			if(getById('imgFilterContact').getAttribute("data-state") == 1)
				showAssociatedContacts();
			else
				showAllContacts();			
			setMsg(msgType.ok, 'Connection change saved')
			}
		});
}   

function newAddress(){
	setValue('txtAddressStreet', '');
	setValue('txtAddressHouseNum', '');
	setValue('txtAddressCity', '');
	setValue('txtAddressCountry', '');
	setValue('addressId', 0);
	setMsg(msgType.ok, 'Ready');
}

function saveAddress(){
	let formData;
	let method;
	if(!validate(addressModel.street, '', 'Please fill the street name')) return;
	if(!validate(addressModel.houseNum, '', 'Please fill the building number')) return;
	if(!validate(addressModel.city, '', 'Please fill the city name')) return;
	if(!validate(associationModel.customer, '', 'Please select a Customer')) return;

	formData = new FormData();
	formData.append(addressModel.street.api, addressModel.street.getValue());
	formData.append(addressModel.houseNum.api, addressModel.houseNum.getValue());
	formData.append(addressModel.city.api, addressModel.city.getValue());
	formData.append(addressModel.country.api, addressModel.country.getValue());
	formData.append(associationModel.customer.api, associationModel.customer.getValue());
	
	if(addressModel.addressId.getValue() == '0'){
		method = 'POST';
	}else{
		method = 'PUT';
		formData.append(addressModel.addressId.api, addressModel.addressId.getValue());
	}

	if(dbg == dbgModule.address)
	debugFormData(formData);
	
	setData(method, formData, 'address')
	.then(function(resp){
		if(resp.status == 'nack'){
			setMsg(msgType.nok,  resp.msg);
			console.log('error ' + resp.err);
			return;
		}else{
			setMsg(msgType.ok, 'Address saved');
			
			let event = new MouseEvent('click', {
			    view: window,
			    bubbles: true,
			    cancelable: true
			});
			var cb = getById('cmbConnectedCustomer').options[getById('cmbConnectedCustomer').selectedIndex]; 
			var cancelled = !cb.dispatchEvent(event);
		}
	});
	
}

function saveAttachment(){
	
	let oFormData = new FormData();
	let method;
	let attachmentType = getById('cmbAttachmentType');
	let attachmentId = getValue('attachmentId');

	if(!validate(taskModel.taskId, 0, 'Please select a task before inserting an attachment')) return;
	if(!validate(attachmentModel.type, 0, 'Please select attachment type')) return;
	if(!validate(attachmentModel.contact, 0, 'Please select a contact')) return;

	if(!validate(attachmentModel.attachmentId, 0, null) && 
			!validate(attachmentModel.contact, 0, 'Please select a file'))
//	if(attachmentId == '0' && getValue('attachmentFile') == 0){
//		setMsg(msgType.nok, 'Please select a file');
//		return;
//	}
	
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
    	.then(activateTabLinkedCustomer())
			.then(function(){setMsg(msgType.ok, 'customer added to project');});
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
    .then(activateTabLinkedCustomer())
		.then(function(){setMsg(msgType.ok, 'Customer removed');});
}

function saveLogin(){
	let formData = new FormData();
	let method;	

	if(!validate(loginModel.contact, '', 'Please select a contact')) return;
	if(!validate(loginModel.contact, 0, 'Please select a contact')) return;
	if(!validate(loginModel.username, '', 'Please type a username')) return;
	if(!validate(loginModel.password, '', 'Please type a password')) return;
	
    if(getValue('txtUserName').length < 4){
		setMsg(msgType.nok, 'username must contain at least 4 letters');
		return;
    }    
    	
    if(getValue('txtPassword').length < 4){
		setMsg(msgType.nok, 'password must contain at least 5 letters');
		return;
    }       
	formData.append('username', getValue('txtUserName'));
	formData.append('password', getValue('txtPassword'));
	formData.append('contactId', getValue('cmbLoginContactList'));
	
	let loginId = getValue('loginId');
	if(loginId == 0){
		method = 'POST';
	}else{
		method = 'PUT';
		formData.append('loginId', getValue('loginId'));
	}
	
	if(dbg==dbgModule.login){
		debugFormData(formData);
		console.log('method ' + method);
	}
	
	setData(method, formData, 'login')
		.then(function(resp){
			if(resp.status == 'nack'){
				setMsg(msgType.nok, resp.msg);
				console.log('error ' + resp.err);
				return;
			}else{
				fillLoginList();
				setValue('loginId', resp.loginId);
				setValue('cmbAvailableLogins', resp.loginId);
			}		
		})
		.catch(function(err){setMsg(msgType.nok, 'an unknown error has occured. please check the log'); console.log(err)});
	
}
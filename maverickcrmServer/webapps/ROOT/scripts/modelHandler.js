// ***** new model ***** //

function newAttachment(){
	attachmentModel.attachmentId.setValue(0);
	attachmentModel.type.setValue(0);
	attachmentModel.file.setValue('');
	attachmentModel.contact.setValue(loggedContact.contactId);
	attachmentModel.notes.setValue('');
	
	setMsg(msgType.ok, 'Ready');
}

function newCustomer(){	
	customerModel.customerId.setValue(0);
	customerModel.customerName.setValue('');
	customerModel.customerNotes.setValue('');

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

function newAddress(){
	setValue('txtAddressStreet', '');
	setValue('txtAddressHouseNum', '');
	setValue('txtAddressCity', '');
	setValue('txtAddressCountry', '');
	setValue('addressId', 0);
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
	menuSetter(menuData.taskType, taskModel.taskType.getValue());
	taskModel.contact.setValue(loggedContact.contactId);
	taskModel.title.setValue('');
	taskModel.effort.setValue(1);
	taskModel.effortUnit.setValue(1);
	menuSetter(menuData.taskEffortUnit, 1);	
	taskModel.dueDate.setValue(new Date().toISOString().split("T")[0]);
	getById('lblDetailDueDate').innerHTML = getDate(taskModel.dueDate.getValue());
	taskModel.status.setValue(1);
	menuSetter(menuData.taskStatus, 1);
	
	if(getById('addChildTask').getAttribute('data-state') == 1){
		setChildTask(getById('addChildTask'));
	}
	
	setTab(tabEnum.taskLog); 
	setMsg(msgType.ok, 'Ready');
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

function setChildTask(setter){
	if(setter.getAttribute('data-parentTask') > 0){
		setter.setAttribute('data-parentTask', 0);
		setter.setAttribute('data-state', 0);
		setMsg(msgType.ok, 'new Task will not be set as child');
		toggleAsBotton(setter)
		return;
	}

	if(taskModel.taskId.getValue() == 0){
		setMsg(msgType.nok, 'Please select a task');
		toggleAsBotton(setter);
		return;
	}
	let parentTaskId = taskModel.taskId.getValue();
	newTask(taskModel.taskType.getValue());
	setter.setAttribute('data-parentTask', parentTaskId);
	setMsg(msgType.ok, 'new Task will be set as child');
}

function viewTask(id, data){
	let task = data.task;
	taskModel.taskId.setValue(task.taskId);
	taskModel.contact.setValue(task.contact.contactId);
	taskModel.title.setValue(task.title);
	taskModel.effort.setValue(task.effort);
	taskModel.dueDate.setValue(getISODate(task.dueDate));
	
	let addChildTaskState = getById('addChildTask');
	if(addChildTaskState.getAttribute('data-state') == 1){
		toggleState(addChildTaskState);
		setChildTask(addChildTaskState);
	}
	
	menuSetter(menuData.taskType, task.taskType.taskTypeId);
	menuSetter(menuData.taskEffortUnit, task.effortUnit);
	menuSetter(menuData.taskStatus, task.status.statusId);
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
	
	menuData.newTaskType.menuid.src='images/newitem.png';
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


function viewTaskRelationDetails(id, data){
	let taskRelation = data.taskRelation;
	taskRelationModel.taskRelationType.setValue(taskRelation.taskRelationType.taskRelationTypeId);
	taskRelationModel.taskRelationId.setValue(taskRelation.taskRelationId);
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

	Object.keys(taskModel).forEach(function(item){
		if(taskModel[item].api != null)
			formData.append(taskModel[item].api, taskModel[item].getValue())
	});
	
	if(taskModel.taskId.getValue() == 0){
		method = 'POST';
	}else{
		method = 'PUT';
    	formData.append('taskId', taskModel.taskId.getValue());
	}
	
	if(dbg == Module.task)
		debugFormData(formData);
	
	setData(method, formData, 'task')
		.then(function(resp){
			if(resp.status == 'nack'){
				setMsg(msgType.nok, resp.msg);
				console.log(resp.err);
				return;
			}else{
				setMsg(msgType.ok, 'Task saved');
			}
			if(taskModel.taskId.getValue() != resp.taskId){	// if this is a new task
				taskModel.taskId.setValue(resp.taskId);
				taskLogModel.contact.setValue(taskModel.contact.getValue());
				taskLogModel.taskLogType.setValue(4);
				taskLogModel.description.setValue('Task created');
				
				saveTaskLog(); 
			}
			
			if(taskModel.taskType.getValue() ==1)
				getById('TabLinkedCustomer').style.display='inline';
			})
		.then(()=>{
			let addChildTask = getById('addChildTask');
			if(method == 'POST' && addChildTask.getAttribute('data-parentTask') != 0){
				taskRelationModel.taskRelationId.setValue(0);
				saveRelation(addChildTask.getAttribute('data-parentTask'), taskModel.taskId.getValue(), 1);
				addChildTask.setAttribute('data-parentTask', 0);
				toggleAsBotton(addChildTask);
			}
		})
		.then(function(){searchTask(prepareSearchTask())});

}

function genericSave(validation, model, modelIdField, dbgModule, method, resource, postFunc){
	let formData;
	
	if(method == null){
		if(modelIdField.getValue() == '0' || modelIdField.getValue() == '')
			method = 'POST';
		else
			method = 'PUT';		
	}
	
	if(model.version != null && model.version == 2){	//validation per API
		for(const key in model){
			if(key != 'version' && model[key].validation[method] != null){
				for(const val in model[key].validation[method].chkValues)
					if(!validate(model[key],  model[key].validation[method].chkValues[val],  model[key].validation[method].err)) return false;
			}
		}		
	}else{
		for(const key in model){
			if(model[key].notValid.length > 0){
				for(const val in model[key].notValid)
					if(!validate(model[key], model[key].notValid[val], model[key].err)) return false;
			}	
		}
	}
	if(!validation(model)) return;
	
	formData = new FormData();
	Object.keys(model).forEach(function(key){
		if(key != 'version' && model[key].api != null)
			formData.append(model[key].api, model[key].getValue())
	});	
	
	if(dbg == dbgModule)
		debugFormData(formData);
	
	setData(method, formData, resource)
	.then(function(resp){
		if(resp.status == 'nack'){
			setMsg(msgType.nok,  resp.msg);
			console.log('error ' + resp.err);
			return;
		}else{
			postFunc(resp);
		}
	});	
}

function saveTaskLog(){
	
	genericSave(()=>{return true;}, taskLogModel, taskLogModel.taskLogId, Module.tasklog, null, 'tasklog',
		(resp)=>{
			setMsg(msgType.ok, 'Log saved');
			if(activeTaskTab == tabEnum.taskLog){
				viewTaskLogList();
				newTaskLog();				
			}
		});
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
	
	if(dbg==Module.relation)
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
	let tmpRelationModel = Object.assign({}, taskRelationModel);
	
	Object.keys(tmpRelationModel).forEach(function(item){
		tmpRelationModel[item].dom = null;
		});	
	tmpRelationModel.taskRelationId.setValue(getById('divRelationTypeList').getAttribute('data-taskrelationId'));
	tmpRelationModel.taskRelationType.setValue(relationTypeId);
	
	genericSave(()=>{return true;}, tmpRelationModel, tmpRelationModel.taskRelationId, Module.relation, 'PUT', 'taskrelation',
		(resp)=>{
			setMsg(msgType.ok, 'Relation type updated');
			getById('divRelationTypeList').style.display='none'; 
			getById('divRelationTypeList').removeAttribute('data-taskrelationId');
			getById('divTaskTab').appendChild(getById('divRelationTypeList'));
			getDataEx('divParentTaskList', 'taskrelation', '?actionId=5&taskId='+getValue('taskId'), fillTaskRelationList, 1, null, null, null);
			getDataEx('divChildTaskList', 'taskrelation', '?actionId=7&taskId='+getValue('taskId'), fillTaskRelationList, 2, null, null, null);	
		});
}

function validateRemoveTaskRelation(){
	if(!validate(taskRelationModel.taskRelationId, '', 'Please select a task to remove from the relation')) return false;
	return true;
}

function removeTaskRelation(){
	genericSave(validateRemoveTaskRelation, taskRelationModel, taskLogModel.taskRelationId, Module.relation, 'DELETE', 'taskrelation',
		(resp)=>{
			getDataEx('divParentTaskList', 'taskrelation', '?actionId=5&taskId='+taskModel.taskId.getValue(), fillTaskRelationList, 1, null, null, null);
			getDataEx('divChildTaskList', 'taskrelation', '?actionId=7&taskId='+taskModel.taskId.getValue(), fillTaskRelationList, 2, null, null, null);
			getById('divTaskTab').removeAttribute('data-selected');
			setMsg(msgType.ok, 'Relation Removed');
		});
}


function saveCustomer(){
	
	genericSave(()=>{return true;}, customerModel, customerModel.customerId, Module.customer, null, 'customer',
			(resp)=>{
				viewCustomerList();
				setMsg(msgType.ok, 'Customer saved')				
			});
}

function saveContact(){
	genericSave(()=>{return true;}, contactModel, contactModel.contactId, Module.contact, null, 'contact',
		(resp)=>{
			if(getById('imgFilterContact').getAttribute("data-state") == 1)
				showAssociatedContacts();
			else
				showAllContacts();
			setMsg(msgType.ok, 'Contact saved');				
		});
}


function saveAssociation(action){
	if(action == 1){	// POST  or  PUT
		genericSave(()=>{return true;}, associationModel, associationModel.associationId, Module.contact, null, 'association',
			(resp)=>{
				if(getById('imgFilterContact').getAttribute("data-state") == 1)
					showAssociatedContacts();
				else
					showAllContacts();			
				setMsg(msgType.ok, 'Connection change saved')		
		});		
	}else{	// DELETE
		genericSave(()=>{return true;}, associationModel, associationModel.associationId, Module.contact, 'DELETE', 'association',
			(resp)=>{
				if(getById('imgFilterContact').getAttribute("data-state") == 1)
					showAssociatedContacts();
				else
					showAllContacts();
				newContact();
				associationModel.associationId.setValue(item.associationId);
				setMsg(msgType.ok, 'Connection change saved')		
		});	
	}
	
}

function saveAddress(){
	genericSave(()=>{return true;}, addressModel, addressModel.addressId, Module.address, null, 'address',
		(resp)=>{
		setMsg(msgType.ok, 'Address saved');
		
		let event = new MouseEvent('click', {
		    view: window,
		    bubbles: true,
		    cancelable: true
		});
		var cb = getById('cmbConnectedCustomer').options[getById('cmbConnectedCustomer').selectedIndex]; 
		var cancelled = !cb.dispatchEvent(event);		
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
			!validate(attachmentModel.contact, 0, 'Please select a file')) return;

	
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
	
	if(dbg==Module.attachment)
		debugFormData(oFormData);
	
	setData(method, oFormData, 'attachment')
	.then(function(data){
		setValue('attachmentId', data.attachmentId);
		viewAttachmentList();
		setMsg(msgType.ok, 'Attachment saved');
		})
	.then(function(){setValue('txtAttachmentNotes', notes)})
	.catch(function(err){setMsg(msgType.nok, 'Attachment save failed. please check the log'); console.log(err)});
}

function addLinkedCustomer(){
	
	genericSave(()=>{return true;}, customerTaskModel, customerTaskModel.customerTaskId, Module.linkedCustomer, null, 'customertask',
		(resp)=>{
			activateTabLinkedCustomer();
			setMsg(msgType.ok, 'customer added to project');
	});
}

function removeLinkedCustomer(){
	
//	genericSave(()=>{return true;}, customerTaskModel, customerTaskModel.customerTaskId, Module.linkedCustomer, null, 'customertask',
//			(resp)=>{
//				activateTabLinkedCustomer();
//				setMsg(msgType.ok, 'customer added to project');
//		});
	
	let formData = new FormData();
	let method = 'DELETE';	
	
    if(getValue('cmbLinkedCustomer') == ''){
		setMsg(msgType.nok, 'Please select a customer');
		return;
    }	
	
    formData.append('customerTaskId', getValue('cmbLinkedCustomer'));
    
	if(dbg==Module.task)
		debugFormData(formData);
	
    setData(method, formData, 'customertask')
    .then(activateTabLinkedCustomer())
		.then(function(){setMsg(msgType.ok, 'Customer removed');});
}

function validateLogin(){
    if(getValue('txtUserName').length < 4){
		setMsg(msgType.nok, 'username must contain at least 4 letters');
		return false;
    }    
    	
    if(getValue('txtPassword').length < 4){
		setMsg(msgType.nok, 'password must contain at least 5 letters');
		return false;
    } 	
	return true;
}

function saveLogin(){
	
	genericSave(validateLogin, loginModel, loginModel.loginId, Module.login, null, 'login',
		(resp)=>{
			fillLoginList();
			setValue('loginId', resp.loginId);
			setValue('cmbAvailableLogins', resp.loginId);
		});
}
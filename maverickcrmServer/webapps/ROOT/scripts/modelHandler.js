// ***** new model ***** //

function newAttachment(){
	if(!checkPermission()) return;
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
	contactModel.firstName.setValue('');
	contactModel.lastName.setValue('');
	contactModel.officePhone.setValue('');
	contactModel.mobilePhone.setValue('');
	contactModel.email.setValue('');
	contactModel.notes.setValue('');
	contactModel.contactId.setValue(0);

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
	taskModel.taskType.setValue(taskType);
	taskModel.contact.setValue(loggedContact.contactId);
	taskModel.title.setValue('');
	taskModel.effort.setValue(1);
	taskModel.effortUnit.setValue(1);
	taskModel.effortUnit.setValue(1);	
	taskModel.dueDate.setValue(new Date().toISOString().split("T")[0]);
	getById('lblDetailDueDate').innerHTML = getDate(taskModel.dueDate.getValue());
	taskModel.status.setValue(1);
	taskModel.status.setValue(1);
	
	if(getById('addChildTask').getAttribute('data-state') == 1){
		setChildTask(getById('addChildTask'));
	}
	
	setTab(tabEnum.taskLog); 
	setMsg(msgType.ok, 'Ready');
}

function newTaskLog(){
	if(taskModel.taskId == 0){
		setMsg(msgType.nok, 'Please select a task');
		return	
	}
	if(!checkPermission()) return;

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
	setTextDirectionModel(contactModel);
}


function viewAddress(id, item){
	let address = item.address;
	let card = getById(id);
	addressModel.street.setValue(address.street);
	addressModel.houseNum.setValue(address.houseNum);
	addressModel.city.setValue(address.city);
	addressModel.country.setValue(address.country);
	addressModel.addressId.setValue(address.addressId);
	setTextDirectionModel(addressModel);
}

function setChildTask(setter){
	if(!checkPermission()) return;
	if(setter.getAttribute('data-parentTask') > 0){
		setter.setAttribute('data-parentTask', 0);
		setter.setAttribute('data-state', 0);
		setMsg(msgType.ok, 'new Task will not be set as child');
		toggleAsBotton(setter)
		return;
	}

	if(taskModel.taskId.getValue() == 0){
		setMsg(msgType.nok, 'Please select a task');
		return;
	}
	toggleAsBotton(setter);
	let parentTaskId = taskModel.taskId.getValue();
	newTask(taskModel.taskType.getValue());
	setter.setAttribute('data-parentTask', parentTaskId);
	setMsg(msgType.ok, 'new Task will be set as child');
}

function viewTask(id, data){
	taskModel.permissionType.setValue(data.taskPermission.permissionType.permissionTypeId);
	let task = data.task;
	taskModel.taskId.setValue(task.taskId);
	taskModel.status.setValue(task.status.statusId);
	taskModel.taskType.setValue(task.taskType.taskTypeId);
	taskModel.contact.setValue(task.contact.contactId);
	taskModel.title.setValue(task.title);
	taskModel.effort.setValue(task.effort);
	taskModel.effortUnit.setValue(task.effortUnit);
	taskModel.dueDate.setValue(getISODate(task.dueDate));
	
	let addChildTaskState = getById('addChildTask');
	if(addChildTaskState.getAttribute('data-state') == 1){
		toggleState(addChildTaskState);
		setChildTask(addChildTaskState);
	}
	taskModel.status.oldValue = task.status.statusId;
	taskModel.taskType.prevTaskType = task.taskType.taskTypeId;
	setTab(activeTaskTab);
	
	if(task.taskType.taskTypeId==1){
		getById('TabLinkedCustomer').style.display='inline';
		getById('TabPermission').style.display='inline';
	}else{
		getById('TabLinkedCustomer').style.display='none';
		getById('TabPermission').style.display='none';
	}
	
	viewTotalEffort();
	
//	menuData.newTaskType.menuid.src='images/newitem.png';
	setTextDirectionModel(taskModel);
	setDomPermission(taskModel);
	setMsg(msgType.ok, 'Ready');
}

function viewTotalEffort(){
	getDataEx('', 'business', '?taskId=' + taskModel.taskId.getValue(), 
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
}

function viewTaskLog(id, data){
	let taskLog = data.taskLog;
	taskLogModel.description.setValue(taskLog.description);
	taskLogModel.contact.setValue(taskLog.contact.contactId);
	taskLogModel.taskLogType.setValue(taskLog.taskLogType.taskLogTypeId);
	taskLogModel.sysdate.setValue(taskLog.sysdate);
	taskLogModel.taskLogId.setValue(taskLog.taskLogId);
	getById('lblDueDate').innerHTML = taskLog.sysdate;
	setTextDirectionModel(taskLogModel);
}


function viewTaskRelationDetails(id, data){
	let taskRelation = data.taskRelation;
	taskRelationModel.taskRelationType.setValue(taskRelation.taskRelationType.taskRelationTypeId);
	taskRelationModel.taskRelationId.setValue(taskRelation.taskRelationId);
	setTextDirectionModel(taskRelationModel);
}
  
function viewCustomer(id, data){
	let customer = data.customer;
	customerModel.customerId.setValue(customer.customerId);
	customerModel.customerName.setValue(customer.customerName);
	customerModel.customerNotes.setValue(customer.customerNotes);
	setTextDirectionModel(customerModel);
}

function viewAttachment(id, data){
	let attachment = data.attachment;
	attachmentModel.attachmentId.setValue(attachment.attachmentId);
	attachmentModel.type.setValue(attachment.attachmentType.attachmentTypeId);
	attachmentModel.contact.setValue(attachment.taskLog.contact.contactId);
	attachmentModel.notes.setValue(attachment.taskLog.description);
	attachmentModel.taskLogId.setValue(attachment.taskLog.taskLogId);
	setTextDirectionModel(attachmentModel);

}

function viewLogin(id, data){
	let login = data.login;
	loginModel.username.setValue(login.username);
	loginModel.password.setValue(login.password);
	loginModel.loginId.setValue(login.loginId);
	loginModel.contact.setValue(login.contact.contactId);
	setTextDirectionModel(loginModel);
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

function checkPermission(){
	if(taskModel.permissionType.getValue() == 2){
		setMsg(msgType.nok, 'You have view permission on task');
		return false;
	}
	return true;
}

function genericSave(validation, model, modelIdField, dbgModule, method, resource, postFunc, permFunc){
	let formData;
	
	if(permFunc != null && !(permFunc())) return;
	
	if(method == null){
		if(modelIdField.getValue() == '0' || modelIdField.getValue() == '')
			method = 'POST';
		else
			method = 'PUT';		
	}
	
	for(const key in model){
		if(model[key][method].inApi){
			for(const val in model[key][method].checkValues)
				if(!validate(model[key],  model[key][method].checkValues[val],  model[key][method].err)) return false;
		}
	}
	
	formData = new FormData();
	for(const key in model){
		if(model[key][method].inApi){
			formData.append(model[key].apiField, model[key].getValue())
		}
	}

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

function saveTask(){
	if(!checkPermission()) return;
	if(taskModel.title.getValue().length > 120){
		setMsg(msgType.nok, 'Title is limited to 120. Please add the remaining as log');
		return;
	}
	let pass = {length:-1, getValue:function(){return this.length}};	
	getData(pass, 'taskrelation', "?actionId=5&taskId="+taskModel.taskId.getValue(), (id, data)=>{
		pass.length = data.array.length;
		
		let addChildTask = getById('addChildTask'); //if this is a non project new task and was not set as child task
		if(addChildTask.getAttribute('data-parentTask') == 0 && taskModel.taskType.getValue() != 1)
			if(!validate(pass, 0, 'Please add a parent task in Relations',getData, validate)) return;
		
		genericSave(()=>{return true;}, taskModel, taskModel.taskId, Module.task, null, 'task',
				(resp)=>{
					setMsg(msgType.ok, 'Task saved');
					if(activeTaskTab == tabEnum.taskLog){
						viewTaskLogList();
						newTaskLog();				
					}
					postTaskSave(resp);
				});
	});
	
}

function postTaskSave(resp){
	if(taskModel.taskId.getValue() != resp.taskId){	// if this is a new task
		if(taskModel.taskType.getValue() == 1){	// if this is a project contact's login shall edit permission on it
			taskPermissionModel.taskPermissionId.setValue(0);
			taskPermissionModel.taskId.setValue(resp.taskId);
			taskPermissionModel.loginId.setValue(taskModel.contact.dom.options[taskModel.contact.dom.selectedIndex].getAttribute('loginId'));
			taskPermissionModel.permissiontypeId.setValue(1);
			addPermission();	
		}
		
		let addChildTask = getById('addChildTask');
		if(addChildTask.getAttribute('data-parentTask') != 0){
			taskRelationModel.taskRelationId.setValue(0);
			saveRelation(addChildTask.getAttribute('data-parentTask'), resp.taskId, 1);
			addChildTask.setAttribute('data-parentTask', 0);
			toggleAsBotton(addChildTask);
		}
		
		taskModel.taskId.setValue(resp.taskId);
		taskLogModel.contact.setValue(taskModel.contact.getValue());
		taskLogModel.taskLogType.setValue(4);
		taskLogModel.description.setValue('Task created');
		
		saveTaskLog(); 
	}else if(taskModel.status.changed){ // existing task and status has changed
		if(taskModel.status.oldValue != taskModel.status.getValue()){
			taskModel.taskId.setValue(resp.taskId);
			taskLogModel.contact.setValue(taskModel.contact.getValue());
			taskLogModel.taskLogType.setValue(4);
			let desc = 'Status changed from ' + taskModel.status.dom[taskModel.status.oldValue-1].text + ' to ' + taskModel.status.dom[taskModel.status.getValue()-1].text
			taskLogModel.description.setValue(desc);
			taskModel.status.oldValue = taskModel.status.getValue();
			
			saveTaskLog(); 
		}
		
		//if tasktype changed from project to other
		if(taskModel.taskType.prevTaskType == 1 && taskModel.taskType.getValue() != 1){
			getData(null, 'customertask', "?actionId=9&taskId="+taskModel.taskId.getValue(), (id, data)=>{
		    data.array.forEach(function (customertask) {
				let customerTaskForm = new FormData();
				let customertaskMethod = 'DELETE';
				customerTaskForm.append('customerTaskId', customertask.customerTaskId);
				setData(customertaskMethod, customerTaskForm, 'customertask')
				.then(function(resp){
					if(resp.status == 'nack'){
						setMsg(msgType.nok,  resp.msg);
						console.log('error ' + resp.err);
						return;
					}
				});	
		    }); 			
			});
			getData(null, 'taskpermission', '?actionId=18&taskId='+taskModel.taskId.getValue(), (id, data)=>{
		    data.array.forEach(function (taskpermission) {
				let taskpermissionForm = new FormData();
				let taskpermissionMethod = 'DELETE';
				taskpermissionForm.append('taskpermissionId', taskpermission.taskPermissionId);
				setData(taskpermissionMethod, taskpermissionForm, 'taskpermission')
				.then(function(resp){
					if(resp.status == 'nack'){
						setMsg(msgType.nok,  resp.msg);
						console.log('error ' + resp.err);
						return;
					}
				});	
			});
			});
		}
	}
	
	if(taskModel.taskType.getValue() ==1){
		getById('TabLinkedCustomer').style.display='inline';
		getById('TabPermission').style.display='inline';
	}else{
		getById('TabLinkedCustomer').style.display='none';
		getById('TabPermission').style.display='none';
	}
	
	taskModel.taskType.prevTaskType = taskModel.taskType.getValue();
	searchTask(prepareSearchTask());
	viewTotalEffort();
}


function saveTaskLog(){
	if(taskModel.taskId == 0){
		setMsg(msgType.nok, 'Please select a task');
		return;
	}

	genericSave(()=>{return true;}, taskLogModel, taskLogModel.taskLogId, Module.tasklog, null, 'tasklog',
		(resp)=>{
			setMsg(msgType.ok, 'Log saved');
			if(activeTaskTab == tabEnum.taskLog){
				viewTaskLogList();
				newTaskLog();				
			}
		}, checkPermission);
}
function deleteTaskLog(){
	if(taskModel.taskId == 0){
		setMsg(msgType.nok, 'Please select a task');
		return;
	}
	if(taskModel.permissionType.getValue() == 2){
		setMsg(msgType.nok, 'You have view permission on task');
		return;
	}	
	genericSave(()=>{return true;}, taskLogModel, taskLogModel.taskLogId, Module.tasklog, 'DELETE', 'tasklog',
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
	
	if(!checkPermission()) return;
	
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

	if(!checkPermission()) return;
	
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

	if(!checkPermission()) return;
	
	taskRelationTypeModel.taskRelationId.setValue(getById('divRelationTypeList').getAttribute('data-taskrelationId'));
	taskRelationTypeModel.taskRelationType.setValue(relationTypeId);
	
	genericSave(()=>{return true;}, taskRelationTypeModel, taskRelationTypeModel.taskRelationId, Module.relation, 'PUT', 'taskrelation',
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
		}, checkPermission);
}


function saveCustomer(){
	
	genericSave(()=>{return true;}, customerModel, customerModel.customerId, Module.customer, null, 'customer',
			(resp)=>{
				//todo put customerlist
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
				associationModel.associationId.setValue(resp.associationId);
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
	
	if(!checkPermission()) return;
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
	}, checkPermission);
}

function removeLinkedCustomer(){
	
//	genericSave(()=>{return true;}, customerTaskModel, customerTaskModel.customerTaskId, Module.linkedCustomer, null, 'customertask',
//			(resp)=>{
//				activateTabLinkedCustomer();
//				setMsg(msgType.ok, 'customer added to project');
//		});
	
	let formData = new FormData();
	let method = 'DELETE';	
	if(!checkPermission())return;
	
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
			viewLoginList();
			setValue('loginId', resp.loginId);
			setValue('cmbAvailableLogins', resp.loginId);
		});
}

function addPermission(){
	genericSave(()=>{return true;}, taskPermissionModel, taskPermissionModel.taskPermissionId, Module.login, 'POST', 'taskpermission',
			(resp)=>{
				if(activeTaskTab == tabEnum.permission)
					viewTaskPermissionList();
				setMsg(msgType.ok, 'Permissions updated');
			}, checkPermission);
}

function removePermission(){
	genericSave(()=>{return true;}, taskPermissionModel, taskPermissionModel.loginId, Module.login, 'DELETE', 'taskpermission',
			(resp)=>{
				viewTaskPermissionList();
				setMsg(msgType.ok, 'Permissions removed');
			}, checkPermission);
}
function setTab(tab){
	//{taskLog:1, relation:2, attachment:3, customer:4, contact:5}
	
	switch(tab){
	case tabEnum.taskLog:
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTabSelected';
		getById('TabRelation').className='cssTab';
		getById('divTabRelation').style.display='none';
		getById('divTabAttachment').style.display='none';
		getById('divTabLog').style.display='inline';
		getById('TabLinkedCustomer').className='cssTab';
		getById('divLinkedCustomer').style.display='none';	
		activateTabTaskLog();
		activeTaskTab = tab;
		break;
	case tabEnum.relation:
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTabSelected';
		getById('divTabLog').style.display='none';
		getById('divTabAttachment').style.display='none';
		getById('TabLinkedCustomer').className='cssTab';
		getById('divLinkedCustomer').style.display='none';			
		activateTabRelation();
		getById('divTabRelation').style.display='inline';  
		activeTaskTab = tab;
		break;
	case tabEnum.attachment:
		getById('TabAttachment').className='cssTabSelected';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';		
		getById('divTabLog').style.display='none';
		getById('divTabRelation').style.display='none';
		getById('TabLinkedCustomer').className='cssTab';
		getById('divLinkedCustomer').style.display='none';	
		activateTabAttachment();
		getById('divTabAttachment').style.display='inline';
		activeTaskTab = tab;
		break;
	case tabEnum.linkedCustomer:
		getById('TabLinkedCustomer').className='cssTabSelected';
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';		
		getById('divTabLog').style.display='none';
		getById('divTabRelation').style.display='none';
		getById('divTabAttachment').style.display='none';
		activateTabLinkedCustomer();
		getById('divLinkedCustomer').style.display='inline';
		activeTaskTab = tab;
		break;		
	case tabEnum.customer:
		getById('tabContact').className = "cssTab";
		getById('tabCustomer').className = "cssTabSelected";
		getById('divContact').style.display='none';
		getById('divCustomer').style.display='inline';		
		break;
	case tabEnum.contact:
		getById('tabContact').className = "cssTabSelected";
		getById('tabCustomer').className = "cssTab";		
		getById('divCustomer').style.display='none';
		getById('divContact').style.display='inline';	
		activateTabContact();
	case tabEnum.login:
		getById('tabLogin').className = "cssTabSelected";
		getById('divLogin').style.display='inline';
		getById('tabContact').className = "cssTab";
		getById('tabCustomer').className = "cssTab";		
		getById('divCustomer').style.display='none';
		getById('divContact').style.display='none';	
		activateTabContact();		
		break;
	}

}
	
function activateTabTaskLog(){
	if(getValue('taskId') == '0')
		return;	
	
	getData('taskLogBody', 'tasklog', '?actionId=2&taskId='+getValue('taskId'), fillTaskLogList);
}

function activateTabAttachment(){
	if(getValue('taskId') > 0)
		getData('cmbAttachmentList', 'attachment', '?actionId=2&taskId='+getValue('taskId'), fillAttachmentList);
	
	getDataEx('cmbAttachmentType', 'attachmenttype', '?actionId=2', fillSelect, 'Select Attachment type',
			(opt,item)=>opt.value = item.attachmentTypeId, 
			(opt,item)=>opt.text = item.attachmentTypeName);
	getDataEx('cmbAttachmenContact', 'contact', '?actionId=2', fillSelect, 'Select contact',
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>opt.text = item.firstName + ' ' + item.lastName);	
	setValue('txtAttachmentNotes', '');
}
	
function activateTabRelation(){
	
	getDataEx('cmbTaskRelationType', 'taskrelationtype', '?actionId=2', fillSelect, 'Select relation type', 
			(opt,item)=>opt.value = item.taskRelationTypeId, 
			(opt,item)=>opt.text = item.taskRelationTypeName);		
	if(getValue('taskId') > 0){
		getData('cmbParentTaskList', 'taskrelation', '?actionId=5&taskId='+getById('taskId').value, fillTaskRelationListParent)
		getData('cmbChildTaskList', 'taskrelation', '?actionId=7&taskId='+getById('taskId').value, fillTaskRelationListChild)
	}
	getData('cmbTabRelationProject', 'customertask', '?actionId=2', fillCustomerTask)
}
	
function activateTabContact(){
	getDataEx('cmbAvailableCustomers', 'customer', '?actionId=2', fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName);
	getDataEx('cmbContactType', 'contacttype', '?actionId=2', fillSelect, 'Select Contact type', 
			(opt,item)=>opt.value = item.contactTypeId, 
			(opt,item)=>opt.text = item.contactTypeName);  	
}

function activateTabLinkedCustomer(){
	getDataEx('cmbLinkedCustomer', 'customertask', '?actionId=9&taskId='+getValue('taskId'), fillSelect, null, 
			(opt,item)=>opt.value = item.customerTaskId, 
			(opt,item)=>opt.text = item.customer.customerName);
	getDataEx('cmbNoneLinkedCustomer', 'customer', '?actionId=10&taskId='+getValue('taskId'), fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName);	
}
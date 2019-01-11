function setTab(tab){
	//{taskLog:1, relation:2, attachment:3, customer:4, contact:5}
	
	switch(tab){
	case tabEnum.taskLog:
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTabSelected';
		getById('TabRelation').className='cssTab';
		getById('TabLinkedCustomer').className='cssTab';	
		activateTabTaskLog();
		activeTaskTab = tab;
		break;
	case tabEnum.relation:
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTabSelected';
		getById('TabLinkedCustomer').className='cssTab';			
		activateTabRelation();  
		activeTaskTab = tab;
		break;
	case tabEnum.attachment:
		getById('TabAttachment').className='cssTabSelected';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';		
		getById('TabLinkedCustomer').className='cssTab';
		activateTabAttachment();
		activeTaskTab = tab;
		break;
	case tabEnum.linkedCustomer:
		getById('TabLinkedCustomer').className='cssTabSelected';
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';		
		activateTabLinkedCustomer();
		activeTaskTab = tab;
		break;		
	case tabEnum.customer:
		getById('tabCustomer').className = "cssTabSelected";
		getById('tabContact').className = "cssTab";
		getById('tabLogin').className = "cssTab";
		getById('tabConnection').className = "cssTab";
		activateTabCustomer();
		break;
	case tabEnum.contact:
		getById('tabContact').className = "cssTabSelected";
		getById('tabCustomer').className = "cssTab";		
		getById('tabLogin').className = "cssTab";
		getById('tabConnection').className = "cssTab";
		activateTabContact();
		break;
	case tabEnum.login:
		getById('tabLogin').className = "cssTabSelected";
		getById('tabContact').className = "cssTab";
		getById('tabCustomer').className = "cssTab";	
		getById('tabConnection').className = "cssTab";
		activateTabLogin();
		break;
	case tabEnum.connection:
		getById('tabConnection').className = "cssTabSelected";
		getById('tabLogin').className = "cssTab";
		getById('tabContact').className = "cssTab";
		getById('tabCustomer').className = "cssTab";
		activateTabConnection();
		break;		
	}

}
	
function activateTabTaskLog(){
	getHTML('tabTaskLog.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>getDataEx('cmbTaskLogType', 'tasklogtype', '?actionId=2', fillSelect, 'Select Log type', 
    		(opt,item)=>opt.value = item.taskLogTypeId, 
    		(opt,item)=>opt.text = item.taskLogTypeName, 
    		null))
    .then(()=>getDataEx('cmbTaskLogContact', 'contact', '?actionId=2', fillSelect, 'Select Contact', 
    		(opt,item)=>opt.value = item.contactId, 
    		(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
    		null))
	.then(()=>{
		if(getValue('taskId') > 0)
			getData('taskLogBody', 'tasklog', '?actionId=2&taskId='+getValue('taskId'), fillTaskLogList)
	})
	
}


function activateTabRelation(){
	getHTML('tabRelation.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>getDataEx('cmbTaskRelationType', 'taskrelationtype', '?actionId=2', fillSelect, 'Select relation type', 
			(opt,item)=>opt.value = item.taskRelationTypeId, 
			(opt,item)=>opt.text = item.taskRelationTypeName, 
			null))
	.then(()=>{
		if(getValue('taskId') > 0)
			getData('cmbParentTaskList', 'taskrelation', '?actionId=5&taskId='+getById('taskId').value, fillTaskRelationListParent)})
	.then(()=>{
		if(getValue('taskId') > 0)
			getData('cmbChildTaskList', 'taskrelation', '?actionId=7&taskId='+getById('taskId').value, fillTaskRelationListChild)
	})
	.then(()=>getData('cmbTabRelationProject', 'customertask', '?actionId=2', fillCustomerTask))
	
}

function activateTabAttachment(){
	getHTML('tabAttachment.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>getData('cmbAttachmentList', 'attachment', '?actionId=2&taskId='+getValue('taskId'), fillAttachmentList))
	.then(()=>getDataEx('cmbAttachmentType', 'attachmenttype', '?actionId=2', fillSelect, 'Select Attachment type',
			(opt,item)=>opt.value = item.attachmentTypeId, 
			(opt,item)=>opt.text = item.attachmentTypeName, 
			null))
	.then(()=>getDataEx('cmbAttachmenContact', 'contact', '?actionId=2', fillSelect, 'Select contact',
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
			null))
	.then(()=>setValue('txtAttachmentNotes', ''))
//	if(getValue('taskId') > 0)

}
	
function activateTabLinkedCustomer(){
	getHTML('tabLinkedCustomer.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>getDataEx('cmbLinkedCustomer', 'customertask', '?actionId=9&taskId='+getValue('taskId'), fillSelect, 
			null, 
			(opt,item)=>opt.value = item.customerTaskId, 
			(opt,item)=>opt.text = item.customer.customerName, 
			null))
	.then(()=>getDataEx('cmbNoneLinkedCustomer', 'customer', '?actionId=10&taskId='+getValue('taskId'), fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName, 
			null))	
}

function activateTabConnection(){
	getHTML('tabConnection.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>getDataEx('cmbConnectedCustomer', 'customer', '?actionId=2', fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName,
			(opt, item)=>opt.addEventListener("click", ()=>{
				getDataEx('cmbConnectedContact', 'customercontact', '?actionId=12&customerId='+item.customerId, fillSelect, null, 
						(opt,item)=>opt.value = item.contact.contactId, 
						(opt,item)=>{
						let phone = (item.contact.officePhone == '')?((item.contact.cellPhone == '')?'':item.contact.cellPhone):item.contact.officePhone;
						opt.text = item.contact.firstName + " " + item.contact.lastName + " : " + phone;
						},
						(opt, item)=>opt.addEventListener("click", ()=>{
							getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contact.contactId, fillContactCard)
							})
						)
				})
			));
	 
//divConnectedContactDetails
//	        opt.addEventListener("click", function(){getData('', 'contact', '?actionId=3&contactId='+item.contactId, fillContactDetails);});	
}

function activateTabCustomer(){
	getHTML('tabCustomer.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>getData('cmbCustomerList', 'customer', '?actionId=2', fillCustomerList));
}

function activateTabContact(){
	
	getHTML('tabContact.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>getDataEx('cmbAvailableCustomers', 'customer', '?actionId=2', fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName, 
			null))
	.then(()=>getDataEx('cmbContactType', 'contacttype', '?actionId=2', fillSelect, 'Select Contact type', 
			(opt,item)=>opt.value = item.contactTypeId, 
			(opt,item)=>opt.text = item.contactTypeName, 
			null)) 	
	.then(()=>getData('cmbContactList', 'contact', '?actionId=2', fillContactList))
		.catch(err=>console.log(`activateTabContact err: ${err}` + `err: ${err.stack}` + ` url:${url}`))

}


function activateTabLogin(){
	getHTML('tabLogin.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>getDataEx('cmbLoginContactList', 'contact', '?actionId=2', fillSelect, 'Select Contact', 
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
				null))
		.then(()=>	getDataEx('cmbAvailableLogins', 'login', '?actionId=2', fillSelect, 'Select Login', 
		(opt,item)=>opt.value = item.loginId, 
		(opt,item)=>opt.text = item.username,
		(opt, item)=>opt.addEventListener("click", ()=>{getData('', 'login', '?actionId=3&loginId='+item.loginId, fillLoginDetails)})
		))
			.catch(err=>console.log(`err: ${err}` + `err: ${err.stack}`));
}
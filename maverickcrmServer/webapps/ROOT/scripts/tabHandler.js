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
		getById('tabTimeline').className = "cssTab";
		getById('tabLogin').className = "cssTab";
		getById('tabConnection').className = "cssTab";
		activateTabCustomer();
		break;
	case tabEnum.timeline:
		getById('tabTimeline').className = "cssTabSelected";
		getById('tabCustomer').className = "cssTab";		
		getById('tabLogin').className = "cssTab";
		getById('tabConnection').className = "cssTab";
		activateTabTimeline();
		break;
	case tabEnum.login:
		getById('tabLogin').className = "cssTabSelected";
		getById('tabTimeline').className = "cssTab";
		getById('tabCustomer').className = "cssTab";	
		getById('tabConnection').className = "cssTab";
		activateTabLogin();
		break;
	case tabEnum.connection:
		getById('tabConnection').className = "cssTabSelected";
		getById('tabLogin').className = "cssTab";
		getById('tabTimeline').className = "cssTab";
		getById('tabCustomer').className = "cssTab";
		activateTabConnection();
		break;
	default:
		console.log('error received: ' + tab);
	}
}
	
function activateTabTaskLog(){
	getHTML('tabTaskLog.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>getDataEx('cmbTaskLogType', 'tasklogtype', '?actionId=2', fillSelect, 'Log type:', 
    		(opt,item)=>opt.value = item.taskLogTypeId, 
    		(opt,item)=>opt.text = item.taskLogTypeName, 
    		null))
    .then(()=>{
    	getDataEx('cmbTaskLogContact', 'contact', '?actionId=2', fillSelect, 'Contacts', 
    		(opt,item)=>opt.value = item.contactId, 
    		(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
    		(opt,item)=>{if(opt.value == loggedContact.contactId)opt.selected=true;});

    })
	.then(()=>{
		if(getValue('taskId') > 0)
			getData('taskLogBody', 'tasklog', '?actionId=2&taskId='+getValue('taskId'), fillTaskLogList)
	}).then(()=>{	
		Object.keys(taskLogModel).forEach(function(item){
		taskLogModel[item].dom = getById(taskLogModel[item].domField);
	});	})

}


function activateTabRelation(){
	getHTML('tabRelation.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>getDataEx('cmbTaskRelationType', 'taskrelationtype', '?actionId=2', fillSelect, 'Relation type', 
			(opt,item)=>opt.value = item.taskRelationTypeId, 
			(opt,item)=>opt.text = item.taskRelationTypeName, 
			null))
	.then(()=>{
		if(getValue('taskId') > 0)
			getDataEx('divParentTaskList', 'taskrelation', '?actionId=5&taskId='+getValue('taskId'), fillTaskRelationList, 1, null, null, null)
			})
	.then(()=>{
		if(getValue('taskId') > 0)
			getDataEx('divChildTaskList', 'taskrelation', '?actionId=7&taskId='+getValue('taskId'), fillTaskRelationList, 2, null, null, null)
	})
	.then(()=>searchProjectTask('cmbTabRelationProject'));
	getById('divTaskTab').removeAttribute('data-selected');
	
}

function activateTabAttachment(){
	getHTML('tabAttachment.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>getData('cmbAttachmentList', 'attachment', '?actionId=2&taskId='+getValue('taskId'), fillAttachmentList))
	.then(()=>getDataEx('cmbAttachmentType', 'attachmenttype', '?actionId=2', fillSelect, 'Attachment type',
			(opt,item)=>opt.value = item.attachmentTypeId, 
			(opt,item)=>opt.text = item.attachmentTypeName, 
			null))
	.then(()=>getDataEx('cmbAttachmenContact', 'contact', '?actionId=2', fillSelect, 'Contacts',
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
			null))
	.then(()=>setValue('txtAttachmentNotes', '')).
	then(()=>{
				Object.keys(notes).forEach(function(item){
					notes[item].dom = getById(notes[item].domField);
				});		
	})
//	if(getValue('taskId') > 0)

}
	
function activateTabLinkedCustomer(){
	getHTML('tabLinkedCustomer.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>getDataEx('cmbLinkedCustomer', 'customertask', '?actionId=9&taskId='+getValue('taskId'), fillSelect, 
			null, 
			(opt,item)=>opt.value = item.customerTaskId, 
			(opt,item)=>opt.text = item.customer.customerName, 
			(opt,item)=>opt.addEventListener("dblclick", ()=>removeLinkedCustomer())))
	.then(()=>getDataEx('cmbNoneLinkedCustomer', 'customer', '?actionId=10&taskId='+getValue('taskId'), fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName, 
			(opt,item)=>opt.addEventListener("dblclick", ()=>addLinkedCustomer())))	
}

function activateTabConnection(){
	getHTML('tabConnection.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>getDataEx('cmbConnectedCustomer', 'customer', '?actionId=2', fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName,
			(opt, item)=>opt.addEventListener("click", ()=>{
				if(getById('imgFilterContact').getAttribute("data-state") == 1)
					showAssociatedContacts();
				newAddress();
				getDataEx('divAddressList', 'address', '?actionId=13&customerId='+item.customerId, fillDivList, null, 
						(opt,item)=>{
							opt.setAttribute('data-addressId', item.addressId);
							opt.innerHTML = item.street + ' ' + item.houseNum + ' ' + item.city;
							}, 
							null,
						(opt, item)=>opt.addEventListener("click", ()=>{
							getData('', 'address', '?actionId=3&addressId='+item.addressId, fillAddressCard)}));				

				})
			))
	.then(()=>getDataEx('cmbContactType', 'contacttype', '?actionId=2', fillSelect, 'Contact type:', 
			(opt,item)=>opt.value = item.contactTypeId, 
			(opt,item)=>opt.text = item.contactTypeName, 
			null))
			.then(()=>showAllContacts())
			.then(()=>{
				Object.keys(contactModel).forEach(function(item){
					contactModel[item].dom = getById(contactModel[item].domField);
				});	
				Object.keys(customerModel).forEach(function(item){
					customerModel[item].dom = getById(customerModel[item].domField);
				});
			});
	
}

function toggleShowContacts(obj){
	toggleAsBotton(obj);
	if(obj.getAttribute("data-state") == 0){
		showAssociatedContacts();
		obj.innerHTML = 'Associated contacts';
		obj.setAttribute("data-state", 1);
		obj.title="Click to show all contacts"
	}else{
		obj.setAttribute("data-state", 0);
		obj.innerHTML = 'All contacts';
		obj.title="Click to filter by selected customer"
		showAllContacts();
	}
}

function showAssociatedContacts(){
	if(getValue('cmbConnectedCustomer') == '')
		return;
	getDataEx('cmbConnectedContact', 'association', '?actionId=12&customerId='+getValue('cmbConnectedCustomer'), fillSelect, null, 
		(opt,item)=>opt.value = item.contact.contactId, 
		(opt,item)=>{
		let phone = (item.contact.officePhone == '')?((item.contact.mobilePhone == '')?'1':item.contact.mobilePhone):item.contact.officePhone;
		opt.text = item.contact.firstName + " " + item.contact.lastName + " : " + new String((phone == null)?"  -  ":phone);
		},
		(opt, item)=>{
			opt.addEventListener("click", ()=>{
				getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contact.contactId, fillContactCard);
				let addressList = getById('divAddressList');
				for(let i = addressList.childNodes.length-1; i > -1; i--){
					let addressNode = addressList.childNodes[i];
					if(addressNode.hasAttribute('data-addressId') && addressNode.getAttribute('data-addressId') == item.address.addressId){
						addressNode.scrollIntoView();
						addressNode.childNodes[1].style.fontWeight = 'bold';
					}else
						addressNode.childNodes[1].style.fontWeight = 'normal';
				}
						
				cmbContactType.value=item.contactType.contactTypeId;
				ConnectionAssociationId.value=item.associationId;
			})
		}
	)
}

function showAllContacts(){
	getDataEx('cmbConnectedContact', 'contact', '?actionId=2', fillSelect, null,
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>{
			opt.text = item.firstName + " " + item.lastName;
			},
			(opt, item)=>{
				opt.addEventListener("click", ()=>{
					getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contactId, fillContactCard);
					})
				}
			)
}

function activateTabCustomer(){
	getHTML('tabCustomer.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>getData('cmbCustomerList', 'customer', '?actionId=2', fillCustomerList));
}

function activateTabTimeline(){
	
	getHTML('tabTimeline.html').then(function(response){fillTab('divCRM', response)});

}


function activateTabLogin(){
	getHTML('tabLogin.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>getDataEx('cmbLoginContactList', 'contact', '?actionId=2', fillSelect, 'Select Contact', 
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
				null))
		.then(()=>fillLoginList())
		.then(()=>{
			Object.keys(loginModel).forEach(function(item){
				loginModel[item].dom = getById(loginModel[item].domField);
			});			
		})
			.catch(err=>console.log(`err: ${err}` + `err: ${err.stack}`));
}
function fillLoginList(){
	getDataEx('cmbAvailableLogins', 'login', '?actionId=2', fillSelect, 'Select Login', 
		(opt,item)=>opt.value = item.loginId, 
		(opt,item)=>opt.text = item.username,
		(opt, item)=>opt.addEventListener("click", ()=>{getData('', 'login', '?actionId=3&loginId='+item.loginId, fillLoginDetails)})
	)
}
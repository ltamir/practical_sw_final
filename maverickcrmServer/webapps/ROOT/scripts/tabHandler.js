function setTab(tab){
	//{taskLog:1, relation:2, attachment:3, customer:4, contact:5}
	
	switch(tab){
	case tabEnum.taskLog:
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTabSelected';
		getById('TabRelation').className='cssTab';
		getById('TabLinkedCustomer').className='cssTab';
		getById('TabPermission').className='cssTab';
		activateTabTaskLog();
		activeTaskTab = tab;
		break;
	case tabEnum.relation:
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTabSelected';
		getById('TabLinkedCustomer').className='cssTab';
		getById('TabPermission').className='cssTab';
		activateTabRelation();  
		activeTaskTab = tab;
		break;
	case tabEnum.attachment:
		getById('TabAttachment').className='cssTabSelected';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';		
		getById('TabLinkedCustomer').className='cssTab';
		getById('TabPermission').className='cssTab';
		activateTabAttachment();
		activeTaskTab = tab;
		break;
	case tabEnum.linkedCustomer:
		getById('TabLinkedCustomer').className='cssTabSelected';
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';	
		getById('TabPermission').className='cssTab';
		activateTabLinkedCustomer();
		activeTaskTab = tab;
		break;
	case tabEnum.permission:
		getById('TabLinkedCustomer').className='cssTab';
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';	
		getById('TabPermission').className='cssTabSelected';
		activateTabPermission();
		activeTaskTab = tab;
		break;		
	case tabEnum.customer:
		getById('tabCustomer').className = "cssTabSelected";
		getById('tabTimeline').className = "cssTab";
		getById('tabLogin').className = "cssTab";
		getById('tabConnection').className = "cssTab";
		activeCrmTab = tab;
		activateTabCustomer();
		break;
	case tabEnum.timeline:
		getById('tabTimeline').className = "cssTabSelected";
		getById('tabCustomer').className = "cssTab";		
		getById('tabLogin').className = "cssTab";
		getById('tabConnection').className = "cssTab";
		activeCrmTab = tab;
		activateTabTimeline();
		break;
	case tabEnum.login:
		getById('tabLogin').className = "cssTabSelected";
		getById('tabTimeline').className = "cssTab";
		getById('tabCustomer').className = "cssTab";	
		getById('tabConnection').className = "cssTab";
		activeCrmTab = tab;
		activateTabLogin();
		break;
	case tabEnum.connection:
		getById('tabConnection').className = "cssTabSelected";
		getById('tabLogin').className = "cssTab";
		getById('tabTimeline').className = "cssTab";
		getById('tabCustomer').className = "cssTab";
		activeCrmTab = tab;
		activateTabConnection();
		break;
	default:
		console.log('error received: ' + tab);
	}
}
	
function activateTabTaskLog(){

	getHTML('tabTaskLog.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>{
		getDataEx('cmbTaskLogType', 'tasklogtype', '?actionId=2', fillSelect, 'Log type:', 
    		(opt,item)=>opt.value = item.taskLogTypeId, 
    		(opt,item)=>opt.text = item.taskLogTypeName, 
    		null);
		getDataEx('cmbTaskLogContact', 'contact', '?actionId=2', fillSelect, 'Contacts', 
	    		(opt,item)=>opt.value = item.contactId, 
	    		(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
	    		(opt,item)=>{if(opt.value == loggedContact.contactId)opt.selected=true;});
		viewTaskLogList();
	})
	.then(()=>{
		initModel(taskLogModel);
		setDomPermission(taskLogModel);
	});

	getById('divTaskTab').style.width = '35em';
}

function viewTaskLogList(){
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	if(getValue('taskId') > 0)
    	getDataEx('divTaskLogList', 'tasklog', '?actionId=2&taskId='+getValue('taskId'), fillDivList, null, 
    		(divRow,item)=>{
    			divRow.setAttribute('data-taskLogId', item.taskLogId);
				let taskLogImg = document.createElement("IMG");
				taskLogImg.src= taskLogTypeList[item.taskLogType.taskLogTypeId].src;
				taskLogImg.title = taskLogTypeList[item.taskLogType.taskLogTypeId].title;
				let prefixPart = document.createElement('SPAN');
				let thisDate = new Date(item.sysdate);
				prefixPart.innerHTML = thisDate.toLocaleDateString() + " " + item.contact.firstName + " " + item.contact.lastName + ": ";
				prefixPart.style.color = 'inherit';
				divRow.appendChild(prefixPart);
				divRow.appendChild(taskLogImg);
				divRow.addEventListener("click", function(){
    				toggler.toggle(divRow);
    				getData('', 'tasklog', '?actionId=3&taskLogId='+item.taskLogId, viewTaskLog);
    			});	
			}, 
    		(txtPart,item)=>{
    			if(dbg==Module.tasklog)
    		    	console.log(item);
    			txtPart.innerHTML = item.description;
    			}, 
    		(txtPart,item)=>{
				txtPart.style.color = 'inherit';
				txtPart.style.backgroundColor  = 'inherit';
				
    		});	
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
	.then(()=>searchProjectTask('cmbTabRelationProject'))
	.then(()=>{
		initModel(taskRelationModel);
		setDomPermission(taskRelationModel);
	});
	getById('divTaskTab').removeAttribute('data-selected');
	getById('divTaskTab').style.width = '35em';
	
}

function activateTabAttachment(){
	getHTML('tabAttachment.html').then(function(response){
		fillTab('divTaskTab', response);
		viewAttachmentList();
		})
	.then(()=>getDataEx('cmbAttachmentType', 'attachmenttype', '?actionId=2', fillSelect, 'Attachment type',
			(opt,item)=>opt.value = item.attachmentTypeId, 
			(opt,item)=>opt.text = item.attachmentTypeName, 
			null))
	.then(()=>getDataEx('cmbAttachmenContact', 'contact', '?actionId=2', fillSelect, 'Contacts',
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
			(opt,item)=>{if(opt.value == loggedContact.contactId)opt.selected=true;}))
	.then(()=>setValue('txtAttachmentNotes', '')).
	then(()=>{
		initModel(attachmentModel);
		setDomPermission(attachmentModel);
	});
	getById('divTaskTab').style.width = '35em';
}

function viewAttachmentList(){
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	getDataEx('divAttachmentList', 'attachment', '?actionId=2&taskId='+getValue('taskId'), fillDivList, null,
		(divRow,item)=>{
			divRow.setAttribute('data-taskLogId', item.attachmentId);
			let dwImg = document.createElement("IMG");
			dwImg.src= 'images/download.png';
			dwImg.title = 'Download attachment';
			let dwLink = document.createElement('a');
			dwLink.href = 'attachment?actionId=17&attachmentId='+item.attachmentId;
			dwLink.download = '';
			dwLink.appendChild(dwImg);
			divRow.appendChild(dwLink);
			divRow.addEventListener("click", function(){
				toggler.toggle(divRow);
				getData('', 'attachment', '?actionId=3&attachmentId='+item.attachmentId, viewAttachment);
			});	
		}, 
		(txtPart,item)=>{
			if(dbg==Module.attachment)
		    	console.log(item);
			txtPart.style.color = 'inherit';
			txtPart.style.backgroundColor  = 'inherit';
			txtPart.innerHTML = item.fileName + " " + item.attachmentType.attachmentTypeName;
			txtPart.title = item.taskLog.description;
			}, 
		(txtPart,item)=>{


		})
}
	
function activateTabLinkedCustomer(){
	getHTML('tabLinkedCustomer.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>getDataEx('cmbLinkedCustomer', 'customertask', '?actionId=9&taskId='+getValue('taskId'), fillSelect, 
			null, 
			(opt,item)=>opt.value = item.customerTaskId, 
			(opt,item)=>opt.text = item.customer.customerName, 
			(opt,item)=>{
				opt.addEventListener("dblclick", ()=>removeLinkedCustomer());
				}))
	.then(()=>getDataEx('cmbNoneLinkedCustomer', 'customer', '?actionId=10&taskId='+getValue('taskId'), fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName, 
			(opt,item)=>opt.addEventListener("dblclick", ()=>addLinkedCustomer()))
	).then(()=>{
		initModel(customerTaskModel);
		setDomPermission(customerTaskModel);
	});
	getById('divTaskTab').style.width = '35em';
}

function activateTabPermission(){
	getHTML('tabPermission.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>viewTaskPermissionList()	)
	.then(()=>getDataEx('cmbPermissionType', 'permissiontype', '?actionId=2', fillSelect, 
			null, 
			(opt,item)=>opt.value = item.permissionTypeId, 
			(opt,item)=>opt.text = item.permissionTypeName, 
			null))
	.then(()=>viewPermissionLoginList());
	getById('divTaskTab').style.width = '35em';
}

function viewPermissionLoginList(){
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	getById('divPermissionLoginList').setAttribute('data-loginId', 0);
	getDataEx('divPermissionLoginList', 'login', '?actionId=2', fillDivList, null, 
			(divRow,item)=>{
				divRow.setAttribute('data-loginId', item.loginId);
				let addressImg = document.createElement("IMG");
				addressImg.src='images/login.png';
				divRow.appendChild(addressImg);	
				divRow.addEventListener("click", ()=>{
					toggler.toggle(divRow);
					divRow.parentElement.setAttribute('data-loginId', item.loginId);
					});					
				divRow.addEventListener("dblclick", ()=>{

				});				
			}, 
			(txtPart,item)=>{
				txtPart.style.color = 'inherit';
				txtPart.style.backgroundColor  = 'inherit';
				txtPart.innerHTML = item.contact.firstName + ' ' + item.contact.lastName + ' [' + item.username + ']'; 
			},
			(txtPart,item)=>{

			}
		)
		initModel(taskPermissionModel);
		setDomPermission(taskPermissionModel);
}

function viewTaskPermissionList(){
	getById('divPermissionList').setAttribute('data-taskPermissionId', 0);
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	getDataEx('divPermissionList', 'taskpermission','?actionId=18&taskId='+taskModel.taskId.getValue(), fillDivList, null, 
			(divRow,item)=>{
				divRow.setAttribute('data-taskPermissionId', item.taskPermissionId);
				let addressImg = document.createElement("IMG");
				if(item.permissionType.permissionTypeId == 2){
					addressImg.src='images/permissiontype_view.png';
					addressImg.title = 'Read only';							
				}else{
					addressImg.src='images/permissiontype_edit.png';
					addressImg.title = 'Read /write';						
				}
				divRow.addEventListener("click", ()=>{
					toggler.toggle(divRow);
					divRow.parentElement.setAttribute('data-taskPermissionId', item.taskPermissionId);
				});
				divRow.addEventListener("dblclick", ()=>{
					
				});				
				divRow.appendChild(addressImg);
				}, 
			(txtPart,item)=>{
				txtPart.style.color = 'inherit';
				txtPart.style.backgroundColor  = 'inherit';
				txtPart.innerHTML = item.login.contact.firstName + ' ' + item.login.contact.lastName + ' [' + item.login.username + ']';
				},
			null
			)	
}


function activateTabConnection(){
	getById('divContactCard').innerHTML = '';
	getHTML('tabConnection.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>showCustomerConnection())
	.then(()=>getDataEx('cmbContactType', 'contacttype', '?actionId=2', fillSelect, 'Contact type:', 
			(opt,item)=>opt.value = item.contactTypeId, 
			(opt,item)=>opt.text = item.contactTypeName, 
			null))
			.then(()=>showAllContacts())
			.then(()=>{
				Object.keys(contactModel).forEach(item=>contactModel[item].dom = getById(contactModel[item].domField));
				Object.keys(customerModel).forEach(item=>customerModel[item].dom = getById(customerModel[item].domField));	
				Object.keys(associationModel).forEach(item=>associationModel[item].dom = getById(associationModel[item].domField));
				Object.keys(addressModel).forEach(item=>addressModel[item].dom = getById(addressModel[item].domField));
			});
}

function toggleShowContacts(img){
	toggleAsBotton(img);
	if(img.getAttribute("data-state") == 0){
		showAssociatedContacts();
		img.setAttribute("data-state", 1);
		img.title="Click to show all contacts"
	}else{
		img.setAttribute("data-state", 0);
		img.title="Click to filter on selected customer"
		showAllContacts();
	}
}

function toggleFilterCustomers(img){
	if(img.getAttribute("data-state") == 0){
		toggleAsBotton(img);
		if(taskModel.taskId.getValue() == 0){
			setMsg(msgType.nok, 'No task selected. cancelling thre filter');
			toggleAsBotton(img);
			return;
		}
		
		img.setAttribute("data-state", 1);
		img.title="Click to show all customers"
		img.setAttribute("data-state", 1);
		showCustomerConnection('?actionId=14&taskId='+taskModel.taskId.getValue())
		setMsg(msgType.ok, 'Filtering on task');
	}else{
		toggleAsBotton(img);
		img.title = 'Filter on selected task';
		img.setAttribute("data-state", 0);
		showCustomerConnection(null);
		setMsg(msgType.ok, 'Filter removed');		
	}
}


function showCustomerConnection(param){
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	if(param == null)
		param =  '?actionId=2';
	getDataEx('cmbConnectedCustomer', 'customer', param, fillSelect, null, 
			(opt,item)=>opt.value = item.customerId, 
			(opt,item)=>opt.text = item.customerName,
			(opt, item)=>opt.addEventListener("click", ()=>{
				if(getById('imgFilterContact').getAttribute("data-state") == 1)
					showAssociatedContacts();
				if(activeCrmTab == tabEnum.connection){
					getById('lblselectedCustomer').innerHTML = item.customerName;
					viewAddressList(item.customerId);
					return;
				}
				if(activeCrmTab == tabEnum.customer){
					//toggler.toggle(divRow);
					getData('', 'customer', '?actionId=3&customerId='+item.customerId, viewCustomer);
				}
				
				})
			)
}
function viewAddressList(customerId){
	newAddress();
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	getDataEx('divAddressList', 'address', '?actionId=13&customerId='+customerId, fillDivList, null, 
			(divRow,item)=>{
				divRow.setAttribute('data-addressId', item.addressId);
				let addressImg = document.createElement("IMG");
				addressImg.src='images/address.png';
				addressImg.title = 'Click to edit address';
				divRow.appendChild(addressImg);
				}, 
			(txtPart,item)=>{
				txtPart.setAttribute('data-addressId', item.addressId);
				txtPart.innerHTML = item.street + ' ' + item.houseNum + ' ' + item.city;
				},
			(txtPart, item)=>txtPart.addEventListener("click", ()=>{
				toggler.toggle(txtPart);
				getData('divConnectedEditAddress', 'address', '?actionId=3&addressId='+item.addressId, viewAddress)
				})
			);		
}
function showAssociatedContacts(){
	let contactCardPopup = getById('divContactCard');
	if(getValue('cmbConnectedCustomer') == '')
		return;
	getDataEx('cmbConnectedContact', 'association', '?actionId=12&customerId='+getValue('cmbConnectedCustomer'), fillSelect, null, 
		(opt,item)=>opt.value = item.contact.contactId, 
		(opt,item)=>opt.text = item.contact.firstName + " " + item.contact.lastName,
		(opt, item)=>{
			opt.addEventListener("click", ()=>{
				contactCardPopup.innerHTML =  item.officePhone + ' ' + item.mobilePhone + '<br>' + item.email
				if(activeCrmTab != tabEnum.connection){
					getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contact.contactId, viewContact);
					return;
				}

				let addressList = getById('divAddressList');
				for(let i = addressList.childNodes.length-1; i > -1; i--){
					let addressNode = addressList.childNodes[i];
					if(addressNode.hasAttribute('data-addressId') && addressNode.getAttribute('data-addressId') == item.address.addressId){
						addressNode.scrollIntoView();
						addressNode.childNodes[1].style.fontWeight = 'bold';
					}else
						addressNode.childNodes[1].style.fontWeight = 'normal';
				}
				associationModel.contactType.setValue(item.contactType.contactTypeId);
				associationModel.associationId.setValue(item.associationId);
			})
		}
	)
}

function showAllContacts(){
	let contactCardPopup = getById('divContactCard');
	getDataEx('cmbConnectedContact', 'contact', '?actionId=2', fillSelect, null,
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>{
			opt.text = item.firstName + " " + item.lastName;
			},
			(opt, item)=>{
				opt.addEventListener("click", ()=>{
					if(activeCrmTab != tabEnum.connection){
						contactCardPopup.innerHTML =  item.officePhone + ' ' + item.mobilePhone + '<br>' + item.email;
						return;
					}
						getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contactId, viewContact);
					})
				}
			)
}

function activateTabCustomer(){
	getHTML('tabCustomer.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>{
		//viewCustomerList();
		Object.keys(customerModel).forEach(item=>customerModel[item].dom = getById(customerModel[item].domField));
	})
}

function viewCustomerList(){
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	getDataEx('divCustomerList', 'customer', '?actionId=2', fillDivList, null,
		(divRow,item)=>{
			if(dbg==Module.attachment)
		    	console.log(item);			
			divRow.setAttribute('data-taskLogId', item.customerId);
			divRow.innerHTML = item.customerName;
			divRow.addEventListener("mouseover",function(){this.style.cursor='pointer';});
			divRow.addEventListener("click", function(){
				toggler.toggle(divRow);
				getData('', 'customer', '?actionId=3&customerId='+item.customerId, viewCustomer);
			});				
		},null	, 
		null)
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
		.then(()=>viewLoginList())
		.then(()=>{
			Object.keys(loginModel).forEach(item=>loginModel[item].dom = getById(loginModel[item].domField));
		})
			.catch(err=>console.log(`err: ${err}` + `err: ${err.stack}`));
}
function viewLoginList(){
	getDataEx('cmbAvailableLogins', 'login', '?actionId=2', fillSelect, 'Select Login', 
		(opt,item)=>opt.value = item.loginId, 
		(opt,item)=>opt.text = item.username,
		(opt, item)=>opt.addEventListener("click", ()=>{getData('', 'login', '?actionId=3&loginId='+item.loginId, viewLogin)})
	)
}
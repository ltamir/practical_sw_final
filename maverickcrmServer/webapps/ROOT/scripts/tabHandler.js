function setTab(tab){
	//taskLog:1, relation:2, attachment:3, customer:4, timeline:5, linkedCustomer:6, login:7, connection:8, permission:9, work:10
	
	switch(tab){
	case tabEnum.taskLog:
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTabSelected';
		getById('TabRelation').className='cssTab';
		getById('TabLinkedCustomer').className='cssTab';
		getById('TabPermission').className='cssTab';
		getById('tabWork').className='cssTab';
		activateTabTaskLog();
		activeTaskTab = tab;
		break;
	case tabEnum.relation:
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTabSelected';
		getById('TabLinkedCustomer').className='cssTab';
		getById('TabPermission').className='cssTab';
		getById('tabWork').className='cssTab';
		activateTabRelation();  
		activeTaskTab = tab;
		break;
	case tabEnum.attachment:
		getById('TabAttachment').className='cssTabSelected';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';		
		getById('TabLinkedCustomer').className='cssTab';
		getById('TabPermission').className='cssTab';
		getById('tabWork').className='cssTab';
		activateTabAttachment();
		activeTaskTab = tab;
		break;
	case tabEnum.work:
		getById('tabWork').className='cssTabSelected';
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';		
		getById('TabLinkedCustomer').className='cssTab';
		getById('TabPermission').className='cssTab';
		activateTabWork();
		activeTaskTab = tab;
		break;		
	case tabEnum.linkedCustomer:
		getById('TabLinkedCustomer').className='cssTabSelected';
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';	
		getById('TabPermission').className='cssTab';
		getById('tabWork').className='cssTab';
		activateTabLinkedCustomer();
		activeTaskTab = tab;
		break;
	case tabEnum.permission:
		getById('TabLinkedCustomer').className='cssTab';
		getById('TabAttachment').className='cssTab';
		getById('TabLog').className='cssTab';
		getById('TabRelation').className='cssTab';	
		getById('TabPermission').className='cssTabSelected';
		getById('tabWork').className='cssTab';
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
		addLog('error received: ' + tab);
	}
}
	
function activateTabTaskLog(){

	getHTML('tabTaskLog.html').then(function(response){fillTab('divTaskTab', response)})
	.then(()=>{
		getDataEx('cmbTaskLogType', 'tasklogtype', '?actionId=2', fillSelect, null, 
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
				let thisDate = getDate(item.sysdate.split(' ')[0]);
				prefixPart.title = thisDate + ": " + item.contact.firstName + " " + item.contact.lastName;
				divRow.appendChild(prefixPart);
				divRow.appendChild(taskLogImg);
				divRow.addEventListener("click", function(){
    				toggler.toggle(divRow);
    				getData('', 'tasklog', '?actionId=3&taskLogId='+item.taskLogId, viewTaskLog);
    			});	
			}, 
    		(txtPart,item)=>{
    			if(dbg==Module.tasklog)
    				addLog(item);
    			let thisDate = getDate(item.sysdate.split(' ')[0]);
    			txtPart.innerHTML = item.description;
    			txtPart.title = thisDate + ": " + item.contact.firstName + " " + item.contact.lastName;
    			}, 
    		null);	
}

function activateTabRelation(){
	getHTML('tabRelation.html').then(function(response){
		fillTab('divTaskTab', response);
		let divRelationViewSelection = getById('divRelationSelection');

		for(let pos = 0; pos< 4; pos++){
			let img = createImage(relationTypeList[pos]);
			img.style.marginRight = '0.2em';
			let selectionDiv = document.createElement('DIV');
			selectionDiv.style.borderRadius = '3px';
			let titleSpan = document.createElement('SPAN');
			selectionDiv.className = (pos == 0)? 'cssTabSelected' : 'cssTab';
			selectionDiv.addEventListener("click", function(){
				for(let divPos = 0; divPos < divRelationViewSelection.children.length; divPos++){
					if(divRelationViewSelection.children[divPos] == this)
						divRelationViewSelection.children[divPos].className = 'cssTabSelected';
					else
						divRelationViewSelection.children[divPos].className = 'cssTab';
				}
				let relationTypeId = pos;
				if(getValue('taskId') > 0){
					getDataEx('divParentTaskList', 'taskrelation', '?actionId=5&taskRelationTypeId=' + pos + '&taskId='+getValue('taskId'), fillTaskRelationList, 1, null, null, null)
					getDataEx('divChildTaskList', 'taskrelation', '?actionId=7&taskRelationTypeId=' + pos + '&taskId='+getValue('taskId'), fillTaskRelationList, 2, null, null, null)
				}
					
			});	
			titleSpan.innerHTML = img.title;
			selectionDiv.style.display = 'inline-block';
			selectionDiv.appendChild(img);
			selectionDiv.appendChild(titleSpan);
			divRelationViewSelection.appendChild(selectionDiv);
		}

		})
	.then(()=>getDataEx('cmbTaskRelationType', 'taskrelationtype', '?actionId=2', fillSelect, 'Relation type', 
			(opt,item)=>opt.value = item.taskRelationTypeId, 
			(opt,item)=>opt.text = item.taskRelationTypeName, 
			null))
	.then(()=>{
		if(getValue('taskId') > 0)
			getDataEx('divParentTaskList', 'taskrelation', '?actionId=5&taskRelationTypeId=0&taskId='+getValue('taskId'), fillTaskRelationList, 1, null, null, null)
			})
	.then(()=>{
		if(getValue('taskId') > 0)
			getDataEx('divChildTaskList', 'taskrelation', '?actionId=7&taskRelationTypeId=0&taskId='+getValue('taskId'), fillTaskRelationList, 2, null, null, null)
	})
	.then(()=>searchProjectTask('cmbTabRelationProject'))
	.then(()=>{
		initModel(taskRelationModel);
		setDomPermission(taskRelationModel);
	});
	getById('divTaskTab').removeAttribute('data-selected');
}

function activateTabWork(){
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	getHTML('tabWork.html').then(function(response){
		fillTab('divTaskTab', response);
		if(getValue('taskId') > 0)
			getDataEx('divParentTaskList', 'taskrelation', '?actionId=5&taskRelationTypeId=0&taskId='+getValue('taskId'), fillDivList, null, 
					(divRow, item) => {
						let task = item.parentTask;
				        let gotoImg = createImage(taskTypeList[task.taskType.taskTypeId]);
				        gotoImg.title = "goto " + gotoImg.title;
				        gotoImg.style.marginLeft = '0.1em';
				        gotoImg.addEventListener("click", function(){getData('', 'task', '?actionId=3&taskId='+task.taskId, viewTask)});
				        divRow.appendChild(gotoImg);
					},
					(txtPart,item)=>{
						let task = item.parentTask;
						let relTask = document.createElement("SPAN");
				    	relTask.style.marginLeft = '0.3em';
				    	relTask.innerHTML = task.title;
				    	relTask.setAttribute("data-taskId", task.taskId);
				    	relTask.classList.add("cssTaskRelationTitle");
						txtPart.innerHTML = task.title;
						
						}, 
					(txtPart,item)=>{
						let task = item.parentTask;
						txtPart.addEventListener("click", function(){
				    		toggler.toggle(txtPart);   		
			    	    	getDataEx('divSelectedTaskLog', 'tasklog', '?actionId=2&taskId='+task.taskId, fillDivList, null, 
			    	        		(divRow,item)=>{
			    	        			divRow.setAttribute('data-taskLogId', item.taskLogId);
			    	    				let taskLogImg = document.createElement("IMG");
			    	    				taskLogImg.src= taskLogTypeList[item.taskLogType.taskLogTypeId].src;
			    	    				taskLogImg.title = taskLogTypeList[item.taskLogType.taskLogTypeId].title;
			    	    				let prefixPart = document.createElement('SPAN');
			    	    				let thisDate = getDate(item.sysdate.split(' ')[0]);
			    	    				prefixPart.title = thisDate + ": " + item.contact.firstName + " " + item.contact.lastName;
			    	    				divRow.appendChild(prefixPart);
			    	    				divRow.appendChild(taskLogImg);
			    	    				divRow.addEventListener("click", function(){
			    	        				toggler.toggle(divRow);
			    	        			});	
			    	    			}, 
			    	        		(txtPart,item)=>{
			    	        			let thisDate = getDate(item.sysdate.split(' ')[0]);
			    	        			txtPart.innerHTML = item.description;
			    	        			txtPart.title = thisDate + ": " + item.contact.firstName + " " + item.contact.lastName;
			    	        			}, 
			    	        		null);
			    		});

					})		
	});
}

function setWorkTaskLog(logType){
	taskLogModel.taskLogType.setValue(logType);
}

function activateTabAttachment(){
	getHTML('tabAttachment.html').then(function(response){
		fillTab('divTaskTab', response);
		viewAttachmentList();
		})
	.then(()=>getDataEx('cmbAttachmentType', 'attachmenttype', '?actionId=2', fillSelect, 'Type',
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
//		addFieldListener(attachmentModel);
		setDomPermission(attachmentModel);
	});
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
			if(dbg==Module.attachment) addLog(item);
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
}

var permissionTypes = {
		edit : {dom:null, value:1},
		view : {dom:null, value:2}		
};
function activateTabPermission(){
	getHTML('tabPermission.html').then(function(response){
		fillTab('divTaskTab', response);
		viewTaskPermissionList();
		viewPermissionLoginList();
		initModel(taskPermissionModel);
		setDomPermission(taskPermissionModel);
		permissionTypes.edit.dom = getById('imgEditPermission');
		permissionTypes.view.dom = getById('imgViewPermission');
		taskPermissionModel.permissiontypeId.setValue(0);
		});
}

function togglePermissionType(permissionType){
	taskPermissionModel.permissiontypeId.setValue(permissionType.value);
	
	for(const d in permissionTypes){
		if(permissionType.value == d.value)
			permissionTypes[d].dom.style.borderStyle = 'inset';
		else
			permissionTypes[d].dom.style.borderStyle = 'outset'			
	}
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
				txtPart.innerHTML = item.contact.firstName + ' ' + item.contact.lastName + ' [' + item.username + ']'; 
			},
			(txtPart,item)=>{

			}
		)

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
				txtPart.innerHTML = item.login.contact.firstName + ' ' + item.login.contact.lastName + ' [' + item.login.username + ']';
				},
			null
			)	
}

var addressList;
function activateTabConnection(){
	getById('divContactCard').innerHTML = '';
	getHTML('tabConnection.html').then(function(response){
		fillTab('divCRM', response);
		showCustomerConnection();
		getDataEx('cmbContactType', 'contacttype', '?actionId=2', fillSelect, 'Contact type:', 
				(opt,item)=>opt.value = item.contactTypeId, 
				(opt,item)=>opt.text = item.contactTypeName, 
				null);
		addressList = getById('divAddressList');
		initModel(contactModel);
		initModel(customerModel);
		initModel(associationModel);
		initModel(addressModel);
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
		customerFilterOn(img);
	}else{
		customerFilterOff(img);	
	}
}
function customerFilterOn(img){
	toggleAsBotton(img);
	if(taskModel.taskId.getValue() == 0){
		setMsg(msgType.nok, 'No task selected. cancelling the filter');
		toggleAsBotton(img);
		return;
	}
	
	img.setAttribute("data-state", 1);
	img.title="Click to show all customers"
	showCustomerConnection('?actionId=14&taskId='+taskModel.taskId.getValue())
	setMsg(msgType.ok, 'Filtering on task');
}

function customerFilterOff(img){
	toggleAsBotton(img);
	img.title = 'Filter on selected task';
	img.setAttribute("data-state", 0);
	showCustomerConnection(null);
	setMsg(msgType.ok, 'Filter removed');	
}

function showCustomerConnection(param){
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	if(param == null)
		param =  '?actionId=2';
	getDataEx('cmbConnectedCustomer', 'customer', param, fillDivList, null, 
			(divRow,item)=>{
				divRow.setAttribute('data-id', item.customerId);
				divRow.addEventListener("click", ()=>{
					toggler.toggle(divRow);
					divRow.parentElement.setAttribute('data-id', item.customerId);
					if(getById('imgFilterContact').getAttribute("data-state") == 1)
						showAssociatedContacts();
					if(activeCrmTab == tabEnum.connection){
						getById('lblselectedCustomer').innerHTML = item.customerName;
						viewAddressList(item.customerId);
						return;
					}
					if(activeCrmTab == tabEnum.customer){
						getData('', 'customer', '?actionId=3&customerId='+item.customerId, viewCustomer);
					}
					
				})				
			}, 
		(divText,item)=>divText.innerHTML = item.customerName,
		null
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
	if(getValue('cmbConnectedCustomer') == null)
		return;
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	
	getDataEx('cmbConnectedContact', 'association', '?actionId=12&customerId='+getValue('cmbConnectedCustomer'), fillDivList, null, 
		(divRow,item)=>{
			divRow.setAttribute('data-id', item.contact.contactId);
			divRow.addEventListener("click", ()=>{
				toggler.toggle(divRow);
				if(activeCrmTab != tabEnum.connection){
					contactCardPopup.innerHTML =  item.contact.officePhone + ' ' + item.contact.mobilePhone + '<br>' + item.contact.email
					return;
				}
				getData('divConnectedContactDetails', 'contact', '?actionId=3&contactId='+item.contact.contactId, viewContact);
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
			}, 
		(txtPart,item)=>txtPart.innerHTML = item.contact.firstName + " " + item.contact.lastName,
		(opt, item)=>{

		}
	)
}

function activateTabCustomer(){
	getHTML('tabCustomer.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>initModel(customerModel))
}

function viewCustomerList(){
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	getDataEx('divCustomerList', 'customer', '?actionId=2', fillDivList, null,
		(divRow,item)=>{
			if(dbg==Module.attachment) addLog(item);			
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

	getHTML('tabTimeline.html').then(function(response){
		fillTab('divCRM', response);
		getDataEx('', 'business', '?actionId=23', 
				function(id, data, defaultOption, funcValue, funcText, eventHandler){
				viewTimeline(data.array);
				}, null, null, null, null);
	});
}

function viewTimeline(taskArray){
	let colors = ['#4CAF50', '#2196F3', '#f44336', '#808080'];
	let colorPos = 0;
	let currentDate = new Date();
	let divTimeline = getById('divTimeline');
	
	for(let i = divTimeline.childNodes.length-1; i > -1; i--)
		divTimeline.removeChild(divTimeline.childNodes[i]);
	
	taskArray.forEach(function (item) {
    	let span = document.createElement('SPAN');
    	span.innerHTML = item.title + ' ' + item.usedEffortFormatted + 'h/' + item.totalEffortFormatted + ' -> ' + jsonToDisplay(item.dueDate);
    	span.title = 'goto task';
    	span.style.cursor = 'pointer';
    	span.style.marginLeft = '0.4em';
    	span.addEventListener('click', ()=>{
    		getData('', 'task', '?actionId=3&taskId='+item.taskId, viewTask);
    	})
    	let div = document.createElement('DIV');
    	div.style.width = '100%';
    	div.style.marginBottom = '0.4em';
    	if(item.dueDate.year < currentDate.getFullYear() 	// if fue date has passed
    			|| (item.dueDate.year == currentDate.getFullYear() && item.dueDate.month < currentDate.getMonth() + 1)
    			|| (item.dueDate.year == currentDate.getFullYear() &&  item.dueDate.month == currentDate.getMonth() + 1 &&  item.dueDate.day < currentDate.getDate())
    			){
    		div.style.backgroundColor = '#FFFFFF';
    	}else    	
    		div.style.backgroundColor = '#EAEAEA';
    	
    	let innerDiv = document.createElement('DIV');
    	innerDiv.style.display = 'inline-block';
    	innerDiv.style.color = 'white';
    	innerDiv.style.backgroundColor = colors[colorPos];
    	div.style.cursor = 'pointer';
    	div.addEventListener("click", ()=>{
    		getDataEx(innerDiv, 'business', '?actionId=24&taskId='+item.taskId, 
					function(id, data, defaultOption, funcValue, funcText, eventHandler){
    				if(id.getAttribute('data-id') == 0)
    					return;
    				let path = document.createElement('SPAN');
    				path.style.cursor = 'pointer';
  					    				
	    			if(data.array.length == 0){
	    				if(getById('timelinePath').lastChild.nodeName == 'SPAN' && getById('timelinePath').lastChild.getAttribute('data-id') == 0)
	    					return;
	    				path.innerHTML = ' ||';
	    				path.title = 'No child tasks';
	    				path.setAttribute('data-id', 0);
	    				id.setAttribute('data-id', 0);
	    				getById('timelinePath').appendChild(path);	
	    				return;
	    			}
    				path.addEventListener("click", ()=>{
    		    		getDataEx('', 'business', '?actionId=24&taskId='+item.taskId, 
    							function(id, data, defaultOption, funcValue, funcText, eventHandler){
    		    				let parentPath = getById('timelinePath');
    		    				while(path.nextSibling != null)
    		    					parentPath.removeChild(path.nextSibling);
    							viewTimeline(data.array);
    						}, null, null, null, null);	
    		    	});  	    			
    				if(getById('timelinePath').lastChild.nodeName == 'SPAN' && getById('timelinePath').lastChild.getAttribute('data-id') == 0)
    					getById('timelinePath').removeChild(getById('timelinePath').lastChild);
					path.innerHTML = ' -> ' + item.title;
					getById('timelinePath').appendChild(path);
					viewTimeline(data.array);
				}, null, null, null, null);	
    	})
    	
    	let totalLeftEffort = item.usedEffort;
    	innerDiv.style.width = totalLeftEffort +'%';
    	innerDiv.innerHTML = totalLeftEffort +  '%'
    	innerDiv.style.textAlign = 'right';
    	innerDiv.title = 'Show child tasks';
    	let imgTaskType = getTaskTypeImg(item.taskType.taskTypeId)
    	
    	div.appendChild(innerDiv);
    	divTimeline.appendChild(imgTaskType);
    	divTimeline.appendChild(span);
    	divTimeline.appendChild(div);
    	colorPos = (colorPos < colors.length-1)?++colorPos:0;
    	
    }); 	
}

function activateTabLogin(){
	getHTML('tabLogin.html').then(function(response){fillTab('divCRM', response)})
	.then(()=>getDataEx('cmbLoginContactList', 'contact', '?actionId=2', fillSelect, null, 
			(opt,item)=>opt.value = item.contactId, 
			(opt,item)=>opt.text = item.firstName + ' ' + item.lastName, 
				null))
		.then(()=>viewLoginList())
		.then(()=>initModel(loginModel))
			.catch(err=>addLog(`err: ${err}` + `err: ${err.stack}`));
}
function viewLoginList(){
	getDataEx('cmbAvailableLogins', 'login', '?actionId=2', fillSelect, null, 
		(opt,item)=>opt.value = item.loginId, 
		(opt,item)=>opt.text = item.username,
		(opt, item)=>opt.addEventListener("click", ()=>{getData('', 'login', '?actionId=3&loginId='+item.loginId, viewLogin)})
	)
}
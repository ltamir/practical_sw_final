function setDomValue(val){this.dom.value = val;}
function getDomValue(){return this.dom.value}

// ***** image to id mapping ***** //

var effortUnitList = {
		1:{src:"images/effortUnit_hours.png", unit:'h', title:'hours', getHours:function(hours){return hours;}},
			2:{src:"images/effortUnit_days.png", unit:'d', title:'days', getHours:function(days){return days*9;}},
			3:{src:"images/effortUnit_months.png", unit:'m', title:'months', getHours:function(months){return months*9*20;}}
}
var taskTypeList = {
		1:{src:"images/tasklist/project.png", title:"Project"},
		2:{src:"images/tasklist/requirements.png", title:"Requirement"},
		3:{src:"images/tasklist/design.png", title:"Design"},
		4:{src:"images/tasklist/develop.png", title:"Development"},
		5:{src:"images/tasklist/qa.png", title:"QA"},
		6:{src:"images/tasklist/delivery.png", title:"Delivery"},
		7:{src:"images/tasklist/support.png", title:"Support"}
	}
var taskStatusList = {
		1:{src:"images/status/new.png", title:"New"},
		2:{src:"images/status/running.png", title:"Running"},
		3:{src:"images/status/delivered.png", title:"Delivered"},
		4:{src:"images/status/closed.png", title:"Closed"},
		5:{src:"images/status/onhold.png", title:"On Hold"}
	}

var relationTypeList = {
		1:{src:"images/derived.png", title:"Derived from task"},
		2:{src:"images/process.png", title:"Process"},
		3:{src:"images/dependency.png", title:"Depends on"}
	}

var taskLogTypeList = {
		1:{src:"images/tasklog_analysis.png", title:"Analysis"},
		2:{src:"images/tasklog_solution.png", title:"Solution"},
		3:{src:"images/tasklog_attachment.png", title:"Attachment"},
		4:{src:"images/tasklog_statuschange.png", title:"Status change"}
	}


//***** TaskList expand / collapse handling ***** //
function ExpandedTask(taskId){
	this.taskId = taskId;
}

var taskListItemStat = {
	    expandImg:{src:"images/row_expand.png", title:"show children"},
	    collapseImg:{src:"images/row_collapse.png", title:"hide children"}
}

function taskListItem(taskId){
	this.id = taskId;
	this.nextItem = null;
}
var taskListItem = {
	head:{id:null, next:null},
	
	add:function(item, taskId){
		if(item.id != null){
			
			this.add(item.nextItem, taskId);
		} else{
			item.id = taskId;
		}
	}
}



var taskListSet = new Set([]);
var selectedTaskList = {
	selectedRow:null,
	origColor:null,
	origBackgroundColor:null,
	toggle:function(row){
		if(row == this.selectedRow)
			return;
		this.origBackgroundColor = row.style.backgroundColor;
		this.origColor = row.style.color
		row.style.backgroundColor = '#8899AA' //'#424f5a';
		row.style.color = '#FFFFFF';
		if(this.selectedRow !=null){
			this.selectedRow.style.color = this.origColor;
			this.selectedRow.style.backgroundColor = (this.origbackgroundColor == undefined)?'':this.origbackgroundColor;
		}
		this.selectedRow = row;
	}
}

var taskList = {
	taskSet:new Set([]),
	toggle:function(img, row, taskId){
    	if(row.hasAttribute('data-isTaskParent')){
    	    for (var i = parent.rows.length - 1; i >= 0; i--) {
    	    	if(parent.rows[i].hasAttribute('data-isTaskChild') && parent.rows[i].getAttribute('data-isTaskChild') == item.taskId)
    	    		parent.deleteRow(i);
    	    }	    		
	    	img.src = expandImg.src;
	    	img.title = expandImg.title;
	    	taskSet.delete(taskId);
    	}else{
    		taskSet.add(taskId);
	    	getDataEx('taskList', 'taskrelation', '?actionId=7&taskId='+item.taskId, fillChildTaskList, row.rowIndex, null, null, null);
	    	img.src = collapseImg.src;
	    	img.title = collapseImg.title;	    		
    	}		
	}	    
}


//***** Model definition and construction ***** //

function Model(domField, dom, api ){
	this.getValue = getDomValue;
	this.setValue = setDomValue;
	this.domField = domField;
	this.dom = dom;
	this.api = api;
}
var ddd = {values:[{val:0}, {val:''}], err:'Please fill the street name'}

var taskLogModel = {
		taskLogId:new Model('taskLogId', null, 'taskLogId'),
		sysdate:new Model('sysDate', null, 'sysdate'),
		contact:new Model('cmbTaskLogContact', null, 'contactId'),
		description:new Model('txtTaskLogDescription', null, 'description'),
		taskLogType:new Model('cmbTaskLogType', null, 'taskLogTypeId'),
		taskId:new Model('taskId', null, 'taskId')
	}

var taskModel={
		taskId:new Model('taskId', null, 'taskId'), 
		taskType:new Model('cmbDetailTaskType', null, 'taskTypeId'), 
		contact:new Model('cmbDetailContact', null, 'contactId'), 
		title:new Model('txtDetailTaskTitle', null, 'title'), 
		effort:new Model('txtDetailTaskEffort', null, 'effort'), 
		effortUnit:new Model('effortUnit', null, 'effortUnit'), 
		dueDate:new Model('txtDetailDueDate', null, 'dueDate'),
		status:new Model('cmbDetailStatus', null, 'statusId') 
	}

var contactModel = {
		contactId:new Model('connectionContactId', null, 'contactId'),
		firstName:new Model('txtFirstName', null, 'firstName'),
		lastName:new Model('txtLastName', null, 'lastName'),
		officePhone:new Model('txtOfficePhone', null, 'officePhone'),
		mobilePhone:new Model('txtMobilePhone', null, 'mobilePhone'),
		email:new Model('txtEmail', null, 'email'),
		notes:new Model('txtNotes', null, 'notes')
}

var customerModel = {
		customerId:new Model('detailCustomerId', null, 'customerId'),
		customerName:new Model('txtCustomerName', null, 'customerName'),
		customerNotes:new Model('txtCustomerNotes', null, 'customerNotes')
}

var loginModel = {
		loginId:new Model('loginId', null, 'loginId'),
		username:new Model('txtUserName', null, 'username'),
		password:new Model('txtPassword', null, 'password'),
		contact:new Model('cmbLoginContactList', null, 'contactId')
}

var attachmentModel = {
		attachmentId:new Model('attachmentId', null, 'attachmentId'),
		type:new Model('cmbAttachmentType', null, 'attachmentTypeId'),
		file:new Model('attachmentFile', null, 'fileName'),
		contact:new Model('cmbAttachmenContact', null, 'contactId'),
		notes:new Model('txtAttachmentNotes', null, 'attachmentNotes'),
		taskLogId:new Model('attachmentTaskLogId', null, 'taskLogId')
}

var associationModel = {
		associationId:new Model('connectionAssociationId', null, 'associationId'),
		contact:new Model('connectionContactId', null, 'contactId'),
		customer:new Model('cmbConnectedCustomer', null, 'customerId'),
		contactType:new Model('cmbContactType', null, 'contactTypeId'),
		address:new Model('addressId', null, 'addressId')
}

var taskRelationModel = {
		taskRelationId:new Model('taskRelationId', null, 'taskRelationId'),
		task:new Model('taskId', null, 'parentTaskId'),
		taskRelationType:new Model('cmbTaskRelationType', null, 'taskRelationTypeId'),
		selectedTask:new Model('taskRelationSelectedTaskId', null, '')
	// NOT used in API	
}

var addressModel = {
		addressId:new Model('addressId', null, 'addressId'),
		street:new Model('txtAddressStreet', null, 'street'),
		houseNum:new Model('txtAddressHouseNum', null, 'houseNum'),
		city:new Model('txtAddressCity', null, 'city'),
		country:new Model('txtAddressCountry', null, 'country')
}

var searchModel = {
		customer:new Model('cmbSearchCustomer', null, ''),
		taskType:new Model('cmbSearchTaskType', null, ''),
		project:new Model('cmbSearchProject', null, ''),
		title:new Model('txtSearchTitle', null, ''),
		dueDate:new Model('txtSearchDueDate', null, ''),
		status:new Model('searchTaskStatus', null, '')
}
searchModel.status.getValue = function(){return this.dom.getAttribute('data-state')};
searchModel.status.setValue = function(val){this.dom.setAttribute('data-state', val);};

function MenuItem(menuid, menuDiv, model, menuList, action ){
	this.menuid = menuid;
	this.menuDiv = menuDiv;
	this.model = model;
	this.menuList = menuList;
	this.action = action;
}
var menuData = {}
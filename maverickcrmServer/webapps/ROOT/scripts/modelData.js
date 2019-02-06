function setDomValue(val){
	if(this.dom != null)
		this.dom.value = val;
	else
		this.value = val;
}
function getDomValue(){
	if(this.dom != null)
		return this.dom.value;
	else
		return this.value;	
	
}

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
	    expandImg:{src:"images/tasklist_expand.png", title:"show children"},
	    collapseImg:{src:"images/tasklist_collapse.png", title:"hide children"}
}

function taskItem(taskId, row){
	this.id = taskId;
	this.row = row;
//	this.nextItem = null;
	this.hasChildren = false;
}

var taskItemList = {
	root:{},
	add:function(parentItem, taskItem){
		parentItem[taskItem.id] = taskItem;
		parentItem.hasChildren = true;
	},
	get:function(parentItem, taskId){
		if(parentItem == null)return;
		if(parentItem.hasChildren == undefined || parentItem.hasChildren == false)return;

		if(parentItem[taskId] != null)
			return parentItem[taskId];
		for(let child in parentItem){
			if(parentItem[child].hasChildren != undefined && parentItem[child].hasChildren == true)
				return this.get(parentItem[child], taskId);
		}		
	},
	remove:function(parentItem, taskId){
		let found = this.get(parentItem, taskId);
		delete found;
		if(parentItem == null)return;
	},	
	clear:function(item){
		this.root = {};
	},
	rowIdx:function(row){return row.rowIndex;},
	deleteRow:function(table, taskItem){
		for(let child in taskItem){
			if(taskItem[child].hasChildren != undefined && taskItem[child].hasChildren)
				this.deleteRow(table, taskItem[child])
			if(taskItem[child].row != undefined){
				table.deleteRow(taskItem[child].row.rowIndex);
				delete taskItem[child];
			}
		}
	}
}

var taskItemLinkedList = {

	size:0,
	ctor:function(taskId){
		this.add(new taskItem(taskId));
	},
	
	add:function(parentItem, taskItem){
		let i = parentItem;
		for(; i.nextItem != null; i = i.nextItem);
		i.nextItem = taskItem;
		taskItemList.size++;
	},

	get:function(head, taskId){
		let i = head;

		for(; i.nextItem != null && i.id != taskId; i = i.nextItem);
		if(i.id == null || i.id != taskId)
			return null;
		return i;
	},	
	remove:function(taskId){
		let i = this.head.nextItem;
		let prev;
		for(; i.id != taskId; prev = i, i = i.nextItem);
		if(i.id == null)
			return;
		if(i.id == taskId){
			if(i.nextItem != null)
				prev.nextItem = i.nextItem;
			else
				prev.nextItem = null;
			delete i;
			taskItemList.size--;
		}	
	},
	clear:function(item){
		if(item.nextItem != null)
			taskItemList.clear(item.nextItem);
		delete item.nextItem;
		delete item;
		taskItemList.size--;
	}
}

var selectedTaskList = {
	selectedRow:null,
	origColor:null,
	origBackgroundColor:null,
	toggle:function(row){
		if(row == this.selectedRow)
			return;
		this.origBackgroundColor = row.style.backgroundColor;
		this.origColor = row.style.color
		row.style.backgroundColor = '#8899AA';
		row.style.color = '#FFFFFF';
		if(this.selectedRow !=null){
			this.selectedRow.style.color = this.origColor;
			this.selectedRow.style.backgroundColor = (this.origbackgroundColor == undefined)?'':this.origbackgroundColor;
		}
		this.selectedRow = row;
	}
}

function divRowToggler(regularCSS, selectedCSS){
	this.regularCSS = regularCSS;
	this.selectedCSS = selectedCSS; 
	this.selectedRow = null;

	this.toggle = function(row){
		if(row == this.selectedRow)
			return;
		row.classList.add(selectedCSS);
		row.classList.remove(regularCSS);
		row.parentElement.classList.add(selectedCSS);
		row.parentElement.classList.remove(regularCSS);
		if(this.selectedRow !=null){
			this.selectedRow.classList.remove(selectedCSS);
			this.selectedRow.classList.add(regularCSS);
			this.selectedRow.parentElement.classList.remove(selectedCSS);
			this.selectedRow.parentElement.classList.add(regularCSS);			
		}
		this.selectedRow = row;
	}	
}

//***** Model definition and construction ***** //

function Model(domField, dom, api, notValid, err ){
	this.getValue = getDomValue;
	this.setValue = setDomValue;
	this.domField = domField;
	this.dom = dom;
	this.api = api;
	this.value = null;
	this.notValid = notValid;
	this.err = err;
}

var taskLogModel = {
		taskLogId:new Model('taskLogId', null, 'taskLogId',[], ''),
		sysdate:new Model('sysDate', null, 'sysdate',[], ''),
		contact:new Model('cmbTaskLogContact', null, 'contactId', [0], 'Please select a contact'),
		description:new Model('txtTaskLogDescription', null, 'description', [''], 'Description cannot be empty'),
		taskLogType:new Model('cmbTaskLogType', null, 'taskLogTypeId', [0], 'Please select a log type'),
		taskId:new Model('taskId', null, 'taskId', [0],'Please select a task from the list'),
	version:2
	}
taskLogModel.taskLogId.validation = {DELETE:{chkValues:[0,''], err:'Cannot delete Attachment or Status change log'}};
taskLogModel.contact.validation = {POST:{chkValues:[0], err:'Please select a contact'}};
taskLogModel.description.validation = {POST:{chkValues:[''] ,err:'Description cannot be empty'}, PUT:{chkValues:[0,''] ,err:'Description cannot be empty'}};
taskLogModel.taskLogType.validation = {POST:{chkValues:[0] ,err:'Please select a log type'}};
taskLogModel.taskId.validation = {POST:{chkValues:[0] ,err:'Please select a task from the list'}};
taskLogModel.sysdate.validation = {};

var taskModel={
		taskId:new Model('taskId', null, 'taskId', [], ''), 
		taskType:new Model('cmbDetailTaskType', null, 'taskTypeId', [], ''), 
		contact:new Model('cmbDetailContact', null, 'contactId', [], ''), 
		title:new Model('txtDetailTaskTitle', null, 'title', [], ''), 
		effort:new Model('txtDetailTaskEffort', null, 'effort', [], ''), 
		effortUnit:new Model('effortUnit', null, 'effortUnit', [], ''), 
		dueDate:new Model('txtDetailDueDate', null, 'dueDate', [], ''),
		dueDateLabel:new Model('lblDetailDueDate', null, null, [], ''),
		status:new Model('cmbDetailStatus', null, 'statusId', [], '') 
	}
taskModel.status.changed = false;
taskModel.dueDate.setValue = function(val){this.dom.value = val; taskModel.dueDateLabel.dom.innerHTML = getDate(this.dom.value);}
taskModel.dueDateLabel.getValue = function(){return this.dom.innerHTML;}
var contactModel = {
		contactId:new Model('connectionContactId', null, 'contactId', [], ''),
		firstName:new Model('txtFirstName', null, 'firstName', [''], 'Contact missing First Name'),
		lastName:new Model('txtLastName', null, 'lastName', [''], 'Contact missing Last Name'),
		officePhone:new Model('txtOfficePhone', null, 'officePhone', [], ''),
		mobilePhone:new Model('txtMobilePhone', null, 'mobilePhone', [], ''),
		email:new Model('txtEmail', null, 'email', [], ''),
		notes:new Model('txtNotes', null, 'notes', [], '')
}

var customerModel = {
		customerId:new Model('detailCustomerId', null, 'customerId', [], ''),
		customerName:new Model('txtCustomerName', null, 'customerName', [''], 'Please fill customer name'),
		customerNotes:new Model('txtCustomerNotes', null, 'customerNotes', [], '')
}

var customerTaskModel = {
		customerTaskId:new Model('cmbLinkedCustomer', null, 'customerTaskId', [], ''),
		newcustomerId:new Model('cmbNoneLinkedCustomer', null, 'customerId', [''], 'Please select a customer'),
		taskId:new Model('taskId', null, 'taskId', [], '')
}

var loginModel = {
		loginId:new Model('loginId', null, 'loginId', [], ''),
		username:new Model('txtUserName', null, 'username', [''], 'Please type a username'),		
		password:new Model('txtPassword', null, 'password', [''], 'Please type a password'),
		contact:new Model('cmbLoginContactList', null, 'contactId', ['', 0], 'Please select a contact')
}
var validation = {
		loginModel:{loginId:[
			{PUT:{chkValues:[0], err:'Please select a login'}},
			{DELETE:{chkValues:[0], err:'Please select a login'}}
			]},
		loginModel:{username:[
			{POST:{chkValues:[''], err:'Please type a username'}},
			{PUT:{chkValues:[''], err:'Please type a username'}}
			]},
		loginModel:{password:[
			{POST:{chkValues:[''], err:'Please type a username'}},
			{PUT:{chkValues:[''], err:'Please type a username'}}
			]}			
}

var attachmentModel = {
		attachmentId:new Model('attachmentId', null, 'attachmentId', [], ''),
		type:new Model('cmbAttachmentType', null, 'attachmentTypeId', [], ''),
		file:new Model('attachmentFile', null, 'fileName', [], ''),
		contact:new Model('cmbAttachmenContact', null, 'contactId', [], ''),
		notes:new Model('txtAttachmentNotes', null, 'attachmentNotes', [], ''),
		taskLogId:new Model('attachmentTaskLogId', null, 'taskLogId', [], '')
}

var associationModel = {
		associationId:new Model('connectionAssociationId', null, 'associationId', [], ''),
		contact:new Model('connectionContactId', null, 'contactId', [], ''),
		customer:new Model('cmbConnectedCustomer', null, 'customerId', [], ''),
		contactType:new Model('cmbContactType', null, 'contactTypeId', [], ''),
		address:new Model('addressId', null, 'addressId', [], ''),
		version:2
}
associationModel.customer.validation = {POST:{chkValues:[0,''], err:'Customer not selected'}};
associationModel.contact.validation = {POST:{chkValues:[0,''], err:'Contact not selected'}};
associationModel.contactType.validation = {POST:{chkValues:[0,''] ,err:'Contact Type not selected'}};
associationModel.address.validation = {POST:{chkValues:[0,''] ,err:'Address not selected'}};

associationModel.customer.validation.PUT = {chkValues:[0,''],err:'Customer not selected'};
associationModel.contact.validation.PUT = {chkValues:[0,''],err:'Contact not selected'};
associationModel.contactType.validation.PUT = {chkValues:[0,''],err:'Contact Type not selected'};
associationModel.address.validation.PUT = {chkValues:[0,''],err:'Address not selected'};

associationModel.customer.validation.DELETE = {chkValues:[0,''],err:'Customer not selected'};
associationModel.contact.validation.DELETE = {chkValues:[0,''],err:'Contact not selected'};
associationModel.associationId.validation = {DELETE:{chkValues:[0,''],err:'Something not selected'}};

var taskRelationModel = {
		taskRelationId:new Model('taskRelationId', null, 'taskRelationId', [], ''),
		task:new Model('taskId', null, 'parentTaskId',[], ''),
		taskRelationType:new Model('cmbTaskRelationType', null, 'taskRelationTypeId', [], ''),
		selectedTask:new Model('taskRelationSelectedTaskId', null, null, [], '')
}

var addressModel = {
		addressId:new Model('addressId', null, 'addressId', [], ''),
		street:new Model('txtAddressStreet', null, 'street', [''], 'Please fill the street name'),
		houseNum:new Model('txtAddressHouseNum', null, 'houseNum', [''], 'Please fill the building number'),
		city:new Model('txtAddressCity', null, 'city', [''], 'Please fill the city name'),
		country:new Model('txtAddressCountry', null, 'country', [], ''),
		customer:new Model('cmbConnectedCustomer', null, 'customerId', [''], 'Please select a Customer')
}

var searchModel = {
		customer:new Model('cmbSearchCustomer', null, 'customerId', [], ''),
		taskType:new Model('cmbSearchTaskType', null, 'tasktypeId', [], ''),
		project:new Model('cmbSearchProject', null, 'projectId', [], ''),
		title:new Model('txtSearchTitle', null, 'title', [], ''),
		dueDate:new Model('txtSearchDueDate', null, 'duedate', [], ''),
		dueDateLabel:new Model('lblSearchDueDate', null, '', [], ''),
		status:new Model('searchOpenTask', null, 'showclosed', [], '')

}
var searchTaskStatusToggle = new Map();

searchModel.status.getValue = function(){return this.value};
searchModel.status.setValue = function(val){this.value = val;};
searchModel.dueDate.setValue = function(val){this.dom.value = val; searchModel.dueDateLabel.dom.innerHTML = 'Set due date';}

function MenuItem(menuid, menuDiv, model, menuList, action ){
	this.menuid = menuid;
	this.menuDiv = menuDiv;
	this.model = model;
	this.menuList = menuList;
	this.action = action;
}
var menuData = {}
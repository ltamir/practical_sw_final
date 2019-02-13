function setDomValue(val){
	this.dom.value = val;
}
function getDomValue(){
	return this.dom.value;	
}

// ***** image to id mapping ***** //

var effortUnitList = [
	{value:-1},
	{value:1, src:"images/effortUnit_hours.png", unit:'h', title:'hours', getHours:function(hours){return hours;}},
	{value:2, src:"images/effortUnit_days.png", unit:'d', title:'days', getHours:function(days){return days*9;}},
	{value:3, src:"images/effortUnit_months.png", unit:'m', title:'months', getHours:function(months){return months*9*20;}}
]
var taskTypeList = [
	{value:0, src:"images/site.png", title:"All"},
	{value:1, src:"images/tasklist/project.png", title:"Project"},
	{value:2, src:"images/tasklist/requirements.png", title:"Requirement"},
	{value:3, src:"images/tasklist/design.png", title:"Design"},
	{value:4, src:"images/tasklist/develop.png", title:"Development"},
	{value:5, src:"images/tasklist/qa.png", title:"QA"},
	{value:6, src:"images/tasklist/delivery.png", title:"Delivery"},
	{value:7, src:"images/tasklist/support.png", title:"Support"}
	]
var taskStatusList = [
	{value:-1},
	{value:1, src:"images/status/new.png", title:"New"},
	{value:2, src:"images/status/running.png", title:"Running"},
	{value:3, src:"images/status/delivered.png", title:"Delivered"},
	{value:4, src:"images/status/closed.png", title:"Closed"},
	{value:5, src:"images/status/onhold.png", title:"On Hold"}
]

var relationTypeList = [
	{value:-1},
	{value:1, src:"images/derived.png", title:"Derived from task"},
	{value:2, src:"images/process.png", title:"Process"},
	{value:3, src:"images/dependency.png", title:"Depends on"}
]

var taskLogTypeList = [
	{value:-1},
	{value:1, src:"images/tasklog_analysis.png", title:"Analysis"},
	{value:2, src:"images/tasklog_solution.png", title:"Solution"},
	{value:3, src:"images/tasklog_attachment.png", title:"Attachment"},
	{value:4, src:"images/tasklog_statuschange.png", title:"Status change"}
]

var searchStatusList = [
	{value:-1},
	{value:1, src:"images/effortUnit_hours.png", unit:'h', title:'hours', getHours:function(hours){return hours;}},
	{value:1, src:"images/effortUnit_days.png", unit:'d', title:'days', getHours:function(days){return days*9;}},
	{value:1, src:"images/effortUnit_months.png", unit:'m', title:'months', getHours:function(months){return months*9*20;}}
]

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
			if(parentItem[child].hasChildren == true){
				let t = this.get(parentItem[child], taskId);
				if(t != null)
					return t;
			}
				
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
		if(this.selectedRow !=null){
			this.selectedRow.classList.remove(selectedCSS);
			this.selectedRow.classList.add(regularCSS);		
		}
		this.selectedRow = row;
	}	
}

//***** Model definition and construction ***** //

function Model(domField, dom, apiField, getter, setter, postMap, putMap, delMap ){
	this.domField = domField;
	this.dom = (dom == null)?{isDefault:true, disabled:false, value:3}:dom;
	this.apiField = apiField;
	this.value = null;
	this.getValue = (getter == null)? getDomValue:getter;
	this.setValue = (setter == null)? setDomValue:setter;
	this.POST = postMap;
	this.PUT = putMap;
	this.DELETE = delMap;
}

function Method(chkValues, err, inApi){
	if(chkValues != null && !(chkValues instanceof Array))
		throw 'Invalid validation array in apiField ' + err;
	this.chkValues = chkValues;
	this.err = err;
	this.inApi = (inApi == null)?false:inApi;
}

var taskLogModel = {
	taskLogId:new Model('taskLogId', null, 'taskLogId', null, null, new Method(), new Method(null, null, true), new Method([0],'Please select a log to delete' , true)),
	sysdate:new Model('sysDate', null, 'sysdate', null, null, new Method(), new Method(), new Method()),
	contact:new Model('cmbTaskLogContact', null, 'contactId', null, null, new Method([0], 'Please select a contact', true), new Method([0], 'Please select a contact', true), new Method()),
	description:new Model('txtTaskLogDescription', null, 'description', null, null, new Method([''], 'Description cannot be empty', true), new Method([''], 'Description cannot be empty', true), new Method()),
	taskLogType:new Model('cmbTaskLogType', null, 'taskLogTypeId', null, null, new Method([0], 'Please select a log type', true), new Method([0], 'Please select a log type', true), new Method([3,4],'Cannot delete Attachment or Status change log' , false)),
	taskId:new Model('taskId', null, 'taskId', null, null, new Method([0], 'Please select a task', true), new Method([0], 'Please select a task', true), new Method([0], 'Please select a task', false)),
	version:new Model(null, null, null, null, null, new Method(), new Method(), new Method())
	}

var taskModel={
	taskId:new Model('taskId', null, 'taskId', null, null, new Method(), new Method([0], 'please select a task', true), new Method(null, null, true)), 
	taskType:new Model('cmbDetailTaskType', null, 'taskTypeId', null, function(val, pastAct){this.dom.value = val; imgListSetter(menuData.taskType, val, pastAct);}, new Method([0], 'Please select a task type', true), new Method(null, null, true), new Method()), 
	contact:new Model('cmbDetailContact', null, 'contactId', null, null, new Method([0], 'Please select a contact', true), new Method(null, null, true), new Method()), 
	title:new Model('txtDetailTaskTitle', null, 'title', null, null, new Method([''], 'Please enter a task title', true), new Method([''], 'Please enter a task title', true), new Method()), 
	effort:new Model('txtDetailTaskEffort', null, 'effort', null, null, new Method([0], 'Please enter an effort', true), new Method([0], 'Please enter an effort', true), new Method()), 
	effortUnit:new Model('effortUnit', null, 'effortUnit', null, function(val){this.dom.value = val; imgListSetter(menuData.taskEffortUnit, val);}, new Method(null, null, true), new Method(null, null, true), new Method()), 
	dueDate:new Model('txtDetailDueDate', null, 'dueDate', null, null, new Method([''], 'Please select a due date', true), new Method([''], 'Please select a due date', true), new Method()),
	dueDateLabel:new Model('lblDetailDueDate', null, null, null, null, new Method(), new Method(), new Method()),
	status:new Model('cmbDetailStatus', null, 'statusId', null, function(val, pastAct){this.dom.value = val; imgListSetter(menuData.taskStatus, val, pastAct);}, new Method(null, null, true), new Method(null, null, true), new Method()),
	permissionType:new Model(null, null, null, null, null, new Method(), new Method(), new Method()), //1:edit, 2:view
	version:new Model(null, null, null, null, null, new Method(), new Method(), new Method())
	}

taskModel.status.changed = false;
taskModel.dueDate.setValue = function(val){this.dom.value = val; taskModel.dueDateLabel.dom.innerHTML = getDate(this.dom.value);}
taskModel.dueDateLabel.getValue = function(){return this.dom.innerHTML;}
var contactModel = {
	contactId:new Model('connectionContactId', null, 'contactId', null, null, new Method(), new Method(null, null, true),new Method(null, null, true)),
	firstName:new Model('txtFirstName', null, 'firstName', null, null, new Method([''], 'Please enter First Name', true), new Method([''], 'Please enter First Name', true), new Method()),
	lastName:new Model('txtLastName', null, 'lastName', null, null, new Method([''], 'Please enter Last Name', true), new Method([''], 'Please enter Last Name', true), new Method()),
	officePhone:new Model('txtOfficePhone', null, 'officePhone', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
	mobilePhone:new Model('txtMobilePhone', null, 'mobilePhone', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
	email:new Model('txtEmail', null, 'email', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
	notes:new Model('txtNotes', null, 'notes', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
	version:new Model(null, null, null, null, null, new Method(), new Method(), new Method())
}

var customerModel = {
	version:new Model(null, null, null, null, null, new Method(), new Method(), new Method()),
	customerId:new Model('detailCustomerId', null, 'customerId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
	customerName:new Model('txtCustomerName', null, 'customerName', null, null, new Method([''], 'Please fill customer name', true), new Method([''], 'Please fill customer name', true), new Method()),
	customerNotes:new Model('txtCustomerNotes', null, 'customerNotes', null, null, new Method(null, null, true), new Method(null, null, true), new Method())
}

var customerTaskModel = {
	version:new Model(null, null, null, null, null, new Method(), new Method(), new Method()),
	customerTaskId:new Model('cmbLinkedCustomer', null, 'customerTaskId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
	newcustomerId:new Model('cmbNoneLinkedCustomer', null, 'customerId', null, null, new Method([''], 'Please select a customer', true), new Method(null, null, true), new Method()),
	taskId:new Model('taskId', null, 'taskId', null, null, new Method(null, null, true), new Method(null, null, true), new Method())
}

var loginModel = {
	version:new Model(null, null, null, null, null, new Method(), new Method(), new Method()),
	loginId:new Model('loginId', null, 'loginId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
	username:new Model('txtUserName', null, 'username', null, null, new Method([''], 'Please type a username', true),new Method([''], 'Please type a username', true), new Method()),		
	password:new Model('txtPassword', null, 'password', null, null, new Method([''], 'Please type a password', true), new Method([''], 'Please type a password', true), new Method()),
	contact:new Model('cmbLoginContactList', null, 'contactId', null, null, new Method(['', 0], 'Please select a contact', true), new Method(['', 0], 'Please select a contact', true), new Method())
}

var taskPermissionModel = {
		taskPermissionId:new Model('divPermissionList', null, 'taskpermissionId', 
			function(){return (this.dom.isDefault == null)?this.dom.getAttribute('data-taskPermissionId'):this.value;}, 
			function(val){(this.dom.isDefault == null)?this.dom.setAttribute('data-taskPermissionId', val):this.value = val;},
			new Method(), new Method([0], 'permission not selected', true), new Method([0], 'permission not selected', true), ), 
		taskId:new Model('taskId', null, 'taskId', null, null, new Method([0], 'Please select a task to assign it permission', true), new Method(), new Method()),
		loginId:new Model('divPermissionLoginList', null, 'loginId', 
			function(){return (this.dom.isDefault == null)?this.dom.getAttribute('data-loginId'):this.value;}, 
			function(val){(this.dom.isDefault == null)?this.dom.setAttribute('data-loginId', val):this.value = val;},
			new Method([0], 'Login not selected', true), new Method(), new Method()),	
		permissiontypeId:new Model('cmbPermissionType', null, 'permissiontypeId', null, null,
				new Method([''], 'Please select Edit or View permision', true), new Method([''], 'Please select Edit or View permision', true), new Method()),
		version:new Model(null, null, null, null, null, new Method(), new Method(), new Method())
}

var attachmentModel = {
		version:new Model(null, null, null, null, null, new Method(), new Method(), new Method()),
		attachmentId:new Model('attachmentId', null, 'attachmentId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
		type:new Model('cmbAttachmentType', null, 'attachmentTypeId', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		file:new Model('attachmentFile', null, 'fileName', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		contact:new Model('cmbAttachmenContact', null, 'contactId', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		notes:new Model('txtAttachmentNotes', null, 'attachmentNotes', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		taskLogId:new Model('attachmentTaskLogId', null, 'taskLogId', null, null, new Method(null, null, true), new Method(null, null, true), new Method())
}

var associationModel = {
		version:new Model(null, null, null, null, null, new Method(), new Method(), new Method()),
		associationId:new Model('connectionAssociationId', null, 'associationId', null, null, new Method(), new Method(null, null, true), new Method([0, ''], 'Something not selected', true)),
		contact:new Model('connectionContactId', null, 'contactId', null, null, new Method([0,''], 'Contact not selected', true), new Method([0,''], 'Contact not selected', true), new Method([0,''], 'Contact not selected', true)),
		customer:new Model('cmbConnectedCustomer', null, 'customerId', null, null, new Method([0,''], 'Customer not selected', true), new Method([0,''], 'Customer not selected', true), new Method([0,''], 'Customer not selected', true)),
		contactType:new Model('cmbContactType', null, 'contactTypeId', null, null, new Method([0,''], 'Contact Type not selected', true), new Method([0,''], 'Contact Type not selected', true), new Method()),
		address:new Model('addressId', null, 'addressId', null, null, new Method([0,''], 'Address not selected', true), new Method([0,''], 'Address not selected', true), new Method())
}

var taskRelationModel = {
		version:new Model(null, {disabled:false, value:3}, null, null, null, new Method(), new Method(), new Method()),
		taskRelationId:new Model('taskRelationId', null, 'taskRelationId', null, null, new Method(), new Method([0], 'Please select a relation', true), new Method([0], 'Please select a relation', true)),
		task:new Model('taskId', null, 'parentTaskId', null, null, new Method([0], 'Please select a task', true), new Method([0], 'Please select a task', true), new Method([0], 'Please select a task', false)),
		taskRelationType:new Model('cmbTaskRelationType', null, 'taskRelationTypeId' , null, null, new Method([0], 'Please select a relation type', true), new Method([0], 'Please select a relation type', true), new Method()),
		selectedTask:new Model('taskRelationSelectedTaskId', null, 'parentTaskId',  null, null, new Method([0], 'Please select a related task', true), new Method([0], 'Please select a related task', true), new Method([0], 'Please select a related task', false))
}

var taskRelationTypeModel = {
		version:new Model(null, {disabled:false, value:3}, null, null, null, new Method(), new Method(), new Method()),
		taskRelationId:new Model('taskRelationId', null, 'taskRelationId', null, null, new Method(), new Method([0], 'Please select a relation', true), new Method([0], 'Please select a relation', true)),
		taskRelationType:new Model('cmbTaskRelationType', null, 'taskRelationTypeId' , null, null, new Method([0], 'Please select a relation type', true), new Method([0], 'Please select a relation type', true), new Method())
}

var addressModel = {
		version:new Model(null, null, null, null, null, new Method(), new Method(), new Method()),
		addressId:new Model('addressId', null, 'addressId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
		street:new Model('txtAddressStreet', null, 'street', null, null, new Method([''], 'Please fill the street name', true), new Method([''], 'Please fill the street name', true), new Method()),
		houseNum:new Model('txtAddressHouseNum', null, 'houseNum', null, null, new Method([''], 'Please fill the building number', true), new Method([''], 'Please fill the building number', true), new Method()),
		city:new Model('txtAddressCity', null, 'city', null, null, new Method([''], 'Please fill the city name', true), new Method([''], 'Please fill the city name', true), new Method()),
		country:new Model('txtAddressCountry', null, 'country', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		customer:new Model('cmbConnectedCustomer', null, 'customerId', null, null, new Method([''], 'Please select a Customer', true), new Method(null, null, true), new Method())
}

var searchModel = {
		version:new Model(null, {disabled:false, value:1}, null, null, null, new Method(), new Method(), new Method()),
		customer:new Model('cmbSearchCustomer', null, 'customerId', null, null),
		taskType:new Model(null, null, 'tasktypeId', null, function(val){this.dom.value = val; imgListSetter(menuData.searchTaskType, val);}),
		project:new Model('cmbSearchProject', null, 'projectId', null, null),
		title:new Model('txtSearchTitle', null, 'title', null, null),
		dueDate:new Model('txtSearchDueDate', null, 'duedate', null, function(val){this.dom.value = val; searchModel.dueDateLabel.dom.innerHTML = 'Set due date';}),
		dueDateLabel:new Model('lblSearchDueDate', null, '', null, null),
		status:new Model('searchOpenTask', null, 'showclosed', function(){return this.value}, function(val){this.value = val;})

}

var newTaskModel = {
		taskType:new Model(null, null, null, null, function(val, pastAct){this.dom.value = val; imgListSetter(menuData.newTaskType, val, pastAct);}, new Method(), new Method(), new Method())
}

var searchTaskStatusToggle = new Map();

function MenuItem(menuid, menuDiv, model, menuList, action, parent ){
	this.menuid = menuid;
	this.menuDiv = menuDiv;
	this.model = model;
	this.menuList = menuList;
	this.action = action;
	this.parent = parent
}
var menuData = {}

function imgListSetter(MenuItem, val, pastAct){
	MenuItem.menuid.src = MenuItem.menuList[val].src;
	MenuItem.menuid.title = MenuItem.menuList[val].title;
	if(pastAct)
		MenuItem.action(val);
}
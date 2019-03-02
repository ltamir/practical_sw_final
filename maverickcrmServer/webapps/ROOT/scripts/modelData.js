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
	{value:0, src:"images/tasklist/allTypes.png", title:"All task types"},
	{value:1, src:"images/tasklist/project.png", title:"Project task"},
	{value:2, src:"images/tasklist/requirements.png", title:"Requirement task"},
	{value:3, src:"images/tasklist/design.png", title:"Design task"},
	{value:4, src:"images/tasklist/develop.png", title:"Development task"},
	{value:5, src:"images/tasklist/qa.png", title:"QA task"},
	{value:6, src:"images/tasklist/delivery.png", title:"Delivery task"},
	{value:7, src:"images/tasklist/support.png", title:"Support task"},
	{value:8, src:"images/tasklist/study.png", title:"Study task"}
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
	{value:0, src:"images/task_status_all.png", title:'All tasks'},
	{value:1, src:"images/task_status_open.png", title:'Open tasks'},
	{value:-1},{value:-1},
	{value:4, src:"images/task_status_closed.png", title:'Closed tasks'}
]

//***** TaskList expand / collapse handling ***** //
function ExpandedTask(taskId){
	this.taskId = taskId;
}

var taskListItemStat = {
	    expandImg:{src:"images/tasklist_expand.png", title:"show children"},
	    collapseImg:{src:"images/tasklist_collapse.png", title:"hide children"},
	    noChildrenImg:{src:"images/tasklist_no_children.png", title:"no children"},
}

function taskItem(taskId, row){	//taskItem constructor
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
				table.deleteRow(taskItem[child].row.rowIndex-1);
				delete taskItem[child];
			}
		}
	}
}

// ***** row selection toggle ***** //

function divRowToggler(regularCSS, selectedCSS){
	this.regularCSS = regularCSS;
	this.selectedCSS = selectedCSS; 
	this.selectedRow = null;

	this.toggle = function(row){
		if(row == this.selectedRow)
			return;
		row.className = this.selectedCSS;
//		row.classList.add(selectedCSS);
//		row.classList.remove(regularCSS);
		if(this.selectedRow !=null){
			this.selectedRow.className = this.regularCSS;
//			this.selectedRow.classList.remove(selectedCSS);
//			this.selectedRow.classList.add(regularCSS);		
		}
		this.selectedRow = row;
	}

}

//***** Model definition and construction ***** //

/**
 * Model constructor
 */
function Model(domField, tabIndex, dom, apiField, getter, setter, postMap, putMap, delMap ){
	this.domField = domField;
	this.tabIndex = tabIndex;	
	this.dom = (dom == null)?{isDefault:true, disabled:false, value:3}:dom;
	this.apiField = apiField;
	this.value = null;
	this.getValue = (getter == null)? getDomValue:getter;
	this.setValue = (setter == null)? setDomValue:setter;
	this.POST = postMap;
	this.PUT = putMap;
	this.DELETE = delMap;
}

function Method(checkValues, err, inApi = false){
	if(checkValues != null && !(checkValues instanceof Array))
		throw 'Invalid validation array in apiField ' + err;
	this.checkValues = checkValues;
	this.err = err;
	this.inApi = inApi;
}

function DefaultDom(disabled=false, value=3){
	this.isDummy = true;
	this.disabled = disabled;
	this.value = value;
	this.tabIndex = -1;
	this.getAttribute = function(attribute){return this.value;};
	this.setAttribute = function(attribute, value){this.value = value;};
}

var taskLogModel = {
	taskLogId:new Model('taskLogId', -1, null, 'taskLogId', null, null, new Method(), new Method(null, null, true), new Method([0],'Please select a log to delete' , true)),
	sysdate:new Model('sysDate', -1, null, 'sysdate', null, null, new Method(), new Method(), new Method()),
	contact:new Model('cmbTaskLogContact', 2, null, 'contactId', null, null, new Method([0], 'Please select a contact', true), new Method([0], 'Please select a contact', true), new Method()),
	description:new Model('txtTaskLogDescription', 1, null, 'description', null, null, new Method([''], 'Description cannot be empty', true), new Method([''], 'Description cannot be empty', true), new Method()),
	taskLogType:new Model('cmbTaskLogType', 3, null, 'taskLogTypeId', null, null, new Method([0], 'Please select a log type', true), new Method([0], 'Please select a log type', true), new Method([3,4],'Cannot delete Attachment or Status change log' , false)),
	taskId:new Model('taskId', -1, null, 'taskId', null, null, new Method([0], 'Please select a task', true), new Method([0], 'Please select a task', true), new Method([0], 'Please select a task', false)),
	version:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method())
	}

var taskModel={
	taskId:new Model('taskId', -1, null, 'taskId', null, null, new Method(), new Method([0], 'please select a task', true), new Method(null, null, true)), 
	taskType:new Model('cmbDetailTaskType', -1, null, 'taskTypeId', null, function(val, pastAct){this.dom.value = val; imgListSetter(menuData.taskType, val, pastAct);}, new Method([0], 'Please select a task type', true), new Method(null, null, true), new Method()), 
	contact:new Model('cmbDetailContact', 1, null, 'contactId', null, null, new Method([0], 'Please select a contact', true), new Method(null, null, true), new Method()), 
	title:new Model('txtDetailTaskTitle', 3, null, 'title', null, null, new Method([''], 'Please enter a task title', true), new Method([''], 'Please enter a task title', true), new Method()), 
	effort:new Model('txtDetailTaskEffort', 2, null, 'effort', null, null, new Method([0], 'Please enter an effort', true), new Method([0], 'Please enter an effort', true), new Method()), 
	effortUnit:new Model('effortUnit', -1, null, 'effortUnit', null, function(val){this.dom.value = val; imgListSetter(menuData.taskEffortUnit, val);}, new Method(null, null, true), new Method(null, null, true), new Method()), 
	dueDate:new Model(null, -1, null, 'dueDate', function(){return this.dom.getIsoDate()}, function(val){this.dom.setJsonDate(val); this.dom.setDisplayDate();}, new Method([''], 'Please select a due date', true), new Method([''], 'Please select a due date', true), new Method()),
	status:new Model('cmbDetailStatus', -1, null, 'statusId', null, function(val, pastAct){this.dom.value = val; imgListSetter(menuData.taskStatus, val, pastAct);}, new Method(null, null, true), new Method(null, null, true), new Method()),
	permissionType:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method()), //1:edit, 2:view
	version:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method())
	}

taskModel.status.changed = false;

var contactModel = {
	contactId:new Model('connectionContactId', -1, null, 'contactId', null, null, new Method(), new Method(null, null, true),new Method(null, null, true)),
	firstName:new Model('txtFirstName', 1, null, 'firstName', null, null, new Method([''], 'Please enter First Name', true), new Method([''], 'Please enter First Name', true), new Method()),
	lastName:new Model('txtLastName', 2, null, 'lastName', null, null, new Method([''], 'Please enter Last Name', true), new Method([''], 'Please enter Last Name', true), new Method()),
	officePhone:new Model('txtOfficePhone', 3, null, 'officePhone', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
	mobilePhone:new Model('txtMobilePhone', 4, null, 'mobilePhone', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
	email:new Model('txtEmail', 5, null, 'email', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
	notes:new Model('txtNotes', 6, null, 'notes', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
	version:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method())
}

var customerModel = {
	version:new Model(null, null, null, null, null, new Method(), new Method(), new Method()),
	customerId:new Model('detailCustomerId', -1, null, 'customerId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
	customerName:new Model('txtCustomerName', 1, null, 'customerName', null, null, new Method([''], 'Please fill customer name', true), new Method([''], 'Please fill customer name', true), new Method()),
	customerNotes:new Model('txtCustomerNotes', 2, null, 'customerNotes', null, null, new Method(null, null, true), new Method(null, null, true), new Method())
}

var customerTaskModel = {
	version:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method()),
	customerTaskId:new Model('cmbLinkedCustomer', 2, null, 'customerTaskId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
	newcustomerId:new Model('cmbNoneLinkedCustomer', 1, null, 'customerId', null, null, new Method([''], 'Please select a customer', true), new Method(null, null, true), new Method()),
	taskId:new Model('taskId', 1, null, 'taskId', null, null, new Method(null, null, true), new Method(null, null, true), new Method())
}

var loginModel = {
	version:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method()),
	loginId:new Model('loginId', -1, null, 'loginId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
	username:new Model('txtUserName', 1, null, 'username', null, null, new Method([''], 'Please type a username', true),new Method([''], 'Please type a username', true), new Method()),		
	password:new Model('txtPassword', 2, null, 'password', null, null, new Method([''], 'Please type a password', true), new Method([''], 'Please type a password', true), new Method()),
	contact:new Model('cmbLoginContactList', 3, null, 'contactId', null, null, new Method(['', 0], 'Please select a contact', true), new Method(['', 0], 'Please select a contact', true), new Method())
}

var taskPermissionModel = {
		taskPermissionId:new Model('divPermissionList', -1, null, 'taskpermissionId', 
			function(){return (this.dom.isDefault == null)?this.dom.getAttribute('data-taskPermissionId'):this.value;}, 
			function(val){(this.dom.isDefault == null)?this.dom.setAttribute('data-taskPermissionId', val):this.value = val;},
			new Method(), new Method([0], 'permission not selected', true), new Method([0], 'permission not selected', true), ), 
		taskId:new Model('taskId', -1, null, 'taskId', null, null, new Method([0], 'Please select a task to assign it permission', true), new Method(), new Method()),
		loginId:new Model('divPermissionLoginList', -1, null, 'loginId', 
			function(){return (this.dom.isDefault == null)?this.dom.getAttribute('data-loginId'):this.value;}, 
			function(val){(this.dom.isDefault == null)?this.dom.setAttribute('data-loginId', val):this.value = val;},
			new Method([0], 'Login not selected', true), new Method(), new Method()),	
		permissiontypeId:new Model(null, -1, {disabled:false, value:0}, 'permissiontypeId', null, null,
				new Method([0], 'Please select Edit or View permision', true), new Method([0], 'Please select Edit or View permision', true), new Method()),
		version:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method())
}

var attachmentModel = {
		version:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method()),
		attachmentId:new Model('attachmentId', -1, null, 'attachmentId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
		type:new Model('cmbAttachmentType', 2, null, 'attachmentTypeId', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		file:new Model('attachmentFile',-1, null, 'fileName', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		contact:new Model('cmbAttachmenContact', 3, null, 'contactId', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		notes:new Model('txtAttachmentNotes', 1, null, 'attachmentNotes', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		taskLogId:new Model('attachmentTaskLogId', -1, null, 'taskLogId', null, null, new Method(null, null, true), new Method(null, null, true), new Method())
}

var associationModel = {
		version:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method()),
		associationId:new Model('connectionAssociationId', -1, null, 'associationId', null, null, new Method(), new Method(null, null, true), new Method([0, ''], 'Something not selected', true)),
		contact:new Model('connectionContactId', -1, null, 'contactId', null, null, new Method([0,''], 'Contact not selected', true), new Method([0,''], 'Contact not selected', true), new Method([0,''], 'Contact not selected', true)),
		customer:new Model('cmbConnectedCustomer', -1, null, 'customerId', null, null, new Method([0,''], 'Customer not selected', true), new Method([0,''], 'Customer not selected', true), new Method([0,''], 'Customer not selected', true)),
		contactType:new Model('cmbContactType', -1, null, 'contactTypeId', null, null, new Method([0,''], 'Contact Type not selected', true), new Method([0,''], 'Contact Type not selected', true), new Method()),
		address:new Model('addressId', -1, null, 'addressId', null, null, new Method([0,''], 'Address not selected', true), new Method([0,''], 'Address not selected', true), new Method())
}

var taskRelationModel = {
		version:new Model(null, -1, {disabled:false, value:3}, null, null, null, new Method(), new Method(), new Method()),
		taskRelationId:new Model('taskRelationId', -1, null, 'taskRelationId', null, null, new Method(), new Method([0], 'Please select a relation', true), new Method([0], 'Please select a relation', true)),
		task:new Model('taskId', -1, null, 'parentTaskId', null, null, new Method([0], 'Please select a task', true), new Method([0], 'Please select a task', true), new Method([0], 'Please select a task', false)),
		taskRelationType:new Model('cmbTaskRelationType', -1, null, 'taskRelationTypeId' , null, null, new Method([0], 'Please select a relation type', true), new Method([0], 'Please select a relation type', true), new Method()),
		selectedTask:new Model('taskRelationSelectedTaskId', -1, null, 'parentTaskId',  null, null, new Method([0], 'Please select a related task', true), new Method([0], 'Please select a related task', true), new Method([0], 'Please select a related task', false))
}

var taskRelationTypeModel = {
		version:new Model(null, -1, {disabled:false, value:3}, null, null, null, new Method(), new Method(), new Method()),
		taskRelationId:new Model('taskRelationId', -1, null, 'taskRelationId', null, null, new Method(), new Method([0], 'Please select a relation', true), new Method([0], 'Please select a relation', true)),
		taskRelationType:new Model('cmbTaskRelationType', -1, null, 'taskRelationTypeId' , null, null, new Method([0], 'Please select a relation type', true), new Method([0], 'Please select a relation type', true), new Method())
}

var addressModel = {
		version:new Model(null, -1, null, null, null, null, new Method(), new Method(), new Method()),
		addressId:new Model('addressId', -1, null, 'addressId', null, null, new Method(), new Method(null, null, true), new Method(null, null, true)),
		street:new Model('txtAddressStreet', 1, null, 'street', null, null, new Method([''], 'Please fill the street name', true), new Method([''], 'Please fill the street name', true), new Method()),
		houseNum:new Model('txtAddressHouseNum', 2, null, 'houseNum', null, null, new Method([''], 'Please fill the building number', true), new Method([''], 'Please fill the building number', true), new Method()),
		city:new Model('txtAddressCity', 3, null, 'city', null, null, new Method([''], 'Please fill the city name', true), new Method([''], 'Please fill the city name', true), new Method()),
		country:new Model('txtAddressCountry', 4, null, 'country', null, null, new Method(null, null, true), new Method(null, null, true), new Method()),
		customer:new Model('cmbConnectedCustomer', -1, null, 'customerId', null, null, new Method([''], 'Please select a Customer', true), new Method(null, null, true), new Method())
}

var searchModel = {
		version:new Model(null, -1, {disabled:false, value:1}, null, null, null, new Method(), new Method(), new Method()),
		customer:new Model('cmbSearchCustomer', -1, null, 'customerId', null, null),
		taskType:new Model(null, -1, null, 'tasktypeId', null, function(val){this.dom.value = val; imgListSetter(menuData.searchTaskType, val);}),
		project:new Model('cmbSearchProject', -1, null, 'projectId', null, null),
		title:new Model('txtSearchTitle', -1, null, 'title', null, null),
		dueDate:new Model(null, -1, null, 'duedate', function(){return this.dom.getIsoDate()}, function(val){this.dom.setJsonDate(val);}),
		status:new Model(null, -1, null, 'showclosed', null, function(val){this.dom.value = val; imgListSetter(menuData.searchTaskStatus, val);})
}

var newTaskModel = {
		taskType:new Model(null, null, {isDefault:true, disabled:false, value:0}, null, function(){return this.dom.value}, function(val, pastAct){this.dom.value = val; imgListSetter(menuData.newTaskType, val, pastAct);}, new Method(), new Method(), new Method())
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
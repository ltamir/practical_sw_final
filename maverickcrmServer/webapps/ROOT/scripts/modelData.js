function setDomValue(val){
	this.dom.value = val;
}
function getDomValue(){
	return this.dom.value;	
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

function Model(domField, dom, api, getter, setter, postMap, putMap, delMap ){
	this.domField = domField;
	this.dom = (dom == null)?{disabled:false, value:3}:dom;
	this.api = api;
	this.value = null;
	this.getValue = (getter == null)? getDomValue:getter;
	this.setValue = (setter == null)? setDomValue:setter;
	this.POST = postMap;
	this.PUT = putMap;
	this.DELETE = delMap;
}

function mapAPI(chkValues, err, inApi){
	this.chkValues = chkValues;
	this.err = err;
	this.inApi = (inApi == null)?false:inApi;
}

var taskLogModel = {
	taskLogId:new Model('taskLogId', null, 'taskLogId', null, null,  new mapAPI(), new mapAPI(null, null, true), new mapAPI([0],'Please select a log to delete' , true)),
	sysdate:new Model('sysDate', null, 'sysdate', null, null, new mapAPI(), new mapAPI(), new mapAPI()),
	contact:new Model('cmbTaskLogContact', null, 'contactId', null, null, new mapAPI([0], 'Please select a contact', true), new mapAPI([0], 'Please select a contact', true), new mapAPI()),
	description:new Model('txtTaskLogDescription', null, 'description', null, null, new mapAPI([''], 'Description cannot be empty', true), new mapAPI([''], 'Description cannot be empty', true), new mapAPI()),
	taskLogType:new Model('cmbTaskLogType', null, 'taskLogTypeId', null, null, new mapAPI([0], 'Please select a log type', true), new mapAPI([0], 'Please select a log type', true), new mapAPI([3,4],'Cannot delete Attachment or Status change log' , false)),
	taskId:new Model('taskId', null, 'taskId', null, null, new mapAPI([0], 'Please select a task', true), new mapAPI([0], 'Please select a task', true), new mapAPI([0], 'Please select a task', false)),
	version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI())
	}

var taskModel={
	taskId:new Model('taskId', null, 'taskId', null, null, new mapAPI(), new mapAPI(null, null, true), new mapAPI(null, null, true)), 
	taskType:new Model('cmbDetailTaskType', null, 'taskTypeId', null, null, new mapAPI(0, 'Please select a task type', true), new mapAPI(null, null, true), new mapAPI()), 
	contact:new Model('cmbDetailContact', null, 'contactId', null, null, new mapAPI(0, 'Please select a contact', true), new mapAPI(null, null, true), new mapAPI()), 
	title:new Model('txtDetailTaskTitle', null, 'title', null, null, new mapAPI('', 'Please enter a task title', true), new mapAPI('', 'Please enter a task title', true), new mapAPI()), 
	effort:new Model('txtDetailTaskEffort', null, 'effort', null, null, new mapAPI(0, 'Please enter an effort', true), new mapAPI(0, 'Please enter an effort', true), new mapAPI()), 
	effortUnit:new Model('effortUnit', null, 'effortUnit', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()), 
	dueDate:new Model('txtDetailDueDate', null, 'dueDate', null, null, new mapAPI('', 'Please select a due date', true), new mapAPI('', 'Please select a due date', true), new mapAPI()),
	dueDateLabel:new Model('lblDetailDueDate', null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
	status:new Model('cmbDetailStatus', null, 'statusId', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
	permissionType:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()), //1:edit, 2:view
	version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI())
	}

taskModel.status.changed = false;
taskModel.dueDate.setValue = function(val){this.dom.value = val; taskModel.dueDateLabel.dom.innerHTML = getDate(this.dom.value);}
taskModel.dueDateLabel.getValue = function(){return this.dom.innerHTML;}
var contactModel = {
	contactId:new Model('connectionContactId', null, 'contactId', null, null, new mapAPI(), new mapAPI(null, null, true),new mapAPI(null, null, true)),
	firstName:new Model('txtFirstName', null, 'firstName', null, null, new mapAPI([''], 'Please enter First Name', true), new mapAPI([''], 'Please enter First Name', true), new mapAPI()),
	lastName:new Model('txtLastName', null, 'lastName', null, null, new mapAPI([''], 'Please enter Last Name', true), new mapAPI([''], 'Please enter Last Name', true), new mapAPI()),
	officePhone:new Model('txtOfficePhone', null, 'officePhone', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
	mobilePhone:new Model('txtMobilePhone', null, 'mobilePhone', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
	email:new Model('txtEmail', null, 'email', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
	notes:new Model('txtNotes', null, 'notes', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
	version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI())
}

var customerModel = {
	version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
	customerId:new Model('detailCustomerId', null, 'customerId', null, null, new mapAPI(), new mapAPI(null, null, true), new mapAPI(null, null, true)),
	customerName:new Model('txtCustomerName', null, 'customerName', null, null, new mapAPI([''], 'Please fill customer name', true), new mapAPI([''], 'Please fill customer name', true), new mapAPI()),
	customerNotes:new Model('txtCustomerNotes', null, 'customerNotes', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI())
}

var customerTaskModel = {
	version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
	customerTaskId:new Model('cmbLinkedCustomer', null, 'customerTaskId', null, null, new mapAPI(), new mapAPI(null, null, true), new mapAPI(null, null, true)),
	newcustomerId:new Model('cmbNoneLinkedCustomer', null, 'customerId', null, null, new mapAPI([''], 'Please select a customer', true), new mapAPI(null, null, true), new mapAPI()),
	taskId:new Model('taskId', null, 'taskId', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI())
}

var loginModel = {
	version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
	loginId:new Model('loginId', null, 'loginId', null, null, new mapAPI(), new mapAPI(null, null, true), new mapAPI(null, null, true)),
	username:new Model('txtUserName', null, 'username', null, null, new mapAPI([''], 'Please type a username', true),new mapAPI([''], 'Please type a username', true), new mapAPI()),		
	password:new Model('txtPassword', null, 'password', null, null, new mapAPI([''], 'Please type a password', true), new mapAPI([''], 'Please type a password', true), new mapAPI()),
	contact:new Model('cmbLoginContactList', null, 'contactId', null, null, new mapAPI(['', 0], 'Please select a contact', true), new mapAPI(['', 0], 'Please select a contact', true), new mapAPI())
}

var taskPermissionModel = {
		taskPermissionId:new Model('divPermissionList', null, 'taskpermissionId', function(){
			if(this.dom != null)
				return this.dom.getAttribute('data-taskPermissionId');
			else
				return this.value;
			
			}, function(val){
				if(this.dom != null)
					this.dom.setAttribute('data-taskPermissionId', val);
				else
					this.value = val;
				}),
		taskId:new Model('taskId', null, 'taskId', null, null),
		loginId:new Model('divPermissionLoginList', null, 'loginId', function(){
			if(this.dom != null)
				return this.dom.getAttribute('data-loginId');
			else
				return this.value;
			
			}, 
			function(val){
				(this.dom != null)?this.dom.setAttribute('data-loginId', val):this.value = val;
				}),	
		permissiontypeId:new Model('cmbPermissionType', null, 'permissiontypeId', null, null),
		version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI())
}


taskPermissionModel.taskPermissionId.POST = new mapAPI();
taskPermissionModel.taskPermissionId.PUT = new mapAPI([0], 'permission not selected', true);
taskPermissionModel.taskPermissionId.DELETE = new mapAPI([0], 'permission not selected', true);
taskPermissionModel.taskId.POST = new mapAPI([0], 'Please select a task to assign it permission', true);
taskPermissionModel.taskId.PUT = new mapAPI();
taskPermissionModel.taskId.DELETE = new mapAPI();
taskPermissionModel.loginId.POST = new mapAPI([0], 'Login not selected', true);
taskPermissionModel.loginId.PUT = new mapAPI();
taskPermissionModel.loginId.DELETE = new mapAPI();
taskPermissionModel.permissiontypeId.POST = new mapAPI([''], 'Please select Edit or View permision', true);
taskPermissionModel.permissiontypeId.PUT = new mapAPI([''], 'Please select Edit or View permision', true);
taskPermissionModel.permissiontypeId.DELETE = new mapAPI();

var attachmentModel = {
		version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
		attachmentId:new Model('attachmentId', null, 'attachmentId', null, null, new mapAPI(), new mapAPI(null, null, true), new mapAPI(null, null, true)),
		type:new Model('cmbAttachmentType', null, 'attachmentTypeId', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
		file:new Model('attachmentFile', null, 'fileName', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
		contact:new Model('cmbAttachmenContact', null, 'contactId', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
		notes:new Model('txtAttachmentNotes', null, 'attachmentNotes', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
		taskLogId:new Model('attachmentTaskLogId', null, 'taskLogId', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI())
}

var associationModel = {
		version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
		associationId:new Model('connectionAssociationId', null, 'associationId', null, null, new mapAPI(), new mapAPI(null, null, true), new mapAPI([0, ''], 'Something not selected', true)),
		contact:new Model('connectionContactId', null, 'contactId', null, null, new mapAPI([0,''], 'Contact not selected', true), new mapAPI([0,''], 'Contact not selected', true), new mapAPI([0,''], 'Contact not selected', true)),
		customer:new Model('cmbConnectedCustomer', null, 'customerId', null, null, new mapAPI([0,''], 'Customer not selected', true), new mapAPI([0,''], 'Customer not selected', true), new mapAPI([0,''], 'Customer not selected', true)),
		contactType:new Model('cmbContactType', null, 'contactTypeId', null, null, new mapAPI([0,''], 'Contact Type not selected', true), new mapAPI([0,''], 'Contact Type not selected', true), new mapAPI()),
		address:new Model('addressId', null, 'addressId', null, null, new mapAPI([0,''], 'Address not selected', true), new mapAPI([0,''], 'Address not selected', true), new mapAPI())
}

var taskRelationModel = {
		version:new Model(null, {disabled:false, value:3}, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
		taskRelationId:new Model('taskRelationId', null, 'taskRelationId', null, null, new mapAPI(), new mapAPI([0], 'Please select a relation', true), new mapAPI([0], 'Please select a relation', true)),
		task:new Model('taskId', null, 'parentTaskId', null, null, new mapAPI([0], 'Please select a task', true), new mapAPI([0], 'Please select a task', true), new mapAPI([0], 'Please select a task', false)),
		taskRelationType:new Model('cmbTaskRelationType', null, 'taskRelationTypeId' , null, null, new mapAPI([0], 'Please select a relation type', true), new mapAPI([0], 'Please select a relation type', true), new mapAPI()),
		selectedTask:new Model('taskRelationSelectedTaskId', null, 'parentTaskId',  null, null, new mapAPI([0], 'Please select a related task', true), new mapAPI([0], 'Please select a related task', true), new mapAPI([0], 'Please select a related task', false))
}

var taskRelationTypeModel = {
		version:new Model(null, {disabled:false, value:3}, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
		taskRelationId:new Model('taskRelationId', null, 'taskRelationId', null, null, new mapAPI(), new mapAPI([0], 'Please select a relation', true), new mapAPI([0], 'Please select a relation', true)),
		taskRelationType:new Model('cmbTaskRelationType', null, 'taskRelationTypeId' , null, null, new mapAPI([0], 'Please select a relation type', true), new mapAPI([0], 'Please select a relation type', true), new mapAPI())
}

var addressModel = {
		version:new Model(null, null, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
		addressId:new Model('addressId', null, 'addressId', null, null, new mapAPI(), new mapAPI(null, null, true), new mapAPI(null, null, true)),
		street:new Model('txtAddressStreet', null, 'street', null, null, new mapAPI([''], 'Please fill the street name', true), new mapAPI([''], 'Please fill the street name', true), new mapAPI()),
		houseNum:new Model('txtAddressHouseNum', null, 'houseNum', null, null, new mapAPI([''], 'Please fill the building number', true), new mapAPI([''], 'Please fill the building number', true), new mapAPI()),
		city:new Model('txtAddressCity', null, 'city', null, null, new mapAPI([''], 'Please fill the city name', true), new mapAPI([''], 'Please fill the city name', true), new mapAPI()),
		country:new Model('txtAddressCountry', null, 'country', null, null, new mapAPI(null, null, true), new mapAPI(null, null, true), new mapAPI()),
		customer:new Model('cmbConnectedCustomer', null, 'customerId', null, null, new mapAPI([''], 'Please select a Customer', true), new mapAPI(null, null, true), new mapAPI())
}

var searchModel = {
		version:new Model(null, {disabled:false, value:1}, null, null, null, new mapAPI(), new mapAPI(), new mapAPI()),
		customer:new Model('cmbSearchCustomer', null, 'customerId', null, null),
		taskType:new Model('cmbSearchTaskType', null, 'tasktypeId', null, null),
		project:new Model('cmbSearchProject', null, 'projectId', null, null),
		title:new Model('txtSearchTitle', null, 'title', null, null),
		dueDate:new Model('txtSearchDueDate', null, 'duedate', null, function(val){this.dom.value = val; searchModel.dueDateLabel.dom.innerHTML = 'Set due date';}),
		dueDateLabel:new Model('lblSearchDueDate', null, '', null, null),
		status:new Model('searchOpenTask', null, 'showclosed', function(){return this.value}, function(val){this.value = val;})

}
var searchTaskStatusToggle = new Map();

function MenuItem(menuid, menuDiv, model, menuList, action ){
	this.menuid = menuid;
	this.menuDiv = menuDiv;
	this.model = model;
	this.menuList = menuList;
	this.action = action;
}
var menuData = {}
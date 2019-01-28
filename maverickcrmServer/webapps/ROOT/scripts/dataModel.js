function setDomValue(val){this.dom.value = val;}
function getDomValue(){return this.dom.value}

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

var taskLogModel = {
		taskLogId:{getValue:getDomValue, setValue:setDomValue, domField:'taskLogId', dom:null, api:'taskLogId'}, 
		sysdate:{getValue:getDomValue, setValue:setDomValue, domField:'sysDate', dom:null, api:'sysdate'}, 
		contact:{getValue:getDomValue, setValue:setDomValue, domField:'cmbTaskLogContact', dom:null, api:'contactId'}, 
		description:{getValue:getDomValue, setValue:setDomValue, domField:'txtTaskLogDescription', dom:null, api:'description'}, 
		taskLogType:{getValue:getDomValue, setValue:setDomValue, domField:'cmbTaskLogType', dom:null, api:'taskLogTypeId'},
		taskId:{getValue:getDomValue, setValue:setDomValue, domField:'taskId', dom:null, api:'taskId'}
		}
var taskModel={
		taskId:{getValue:getDomValue, setValue:setDomValue, domField:'taskId', dom:null, api:'taskId'}, 
		taskType:{getValue:getDomValue, setValue:setDomValue, domField:'cmbDetailTaskType', dom:null, api:'taskTypeId'}, 
		contact:{getValue:getDomValue, setValue:setDomValue, domField:'cmbDetailContact', dom:null, api:'contactId'}, 
		title:{getValue:getDomValue, setValue:setDomValue, domField:'txtDetailTaskTitle', dom:null, api:'title'}, 
		effort:{getValue:getDomValue, setValue:setDomValue, domField:'txtDetailTaskEffort', dom:null, api:'effort'}, 
		effortUnit:{getValue:getDomValue, setValue:setDomValue, domField:'effortUnit', dom:null, api:'effortUnit'}, 
		dueDate:{getValue:getDomValue, setValue:setDomValue, domField:'txtDetailDueDate', dom:null, api:'dueDate', 
			getDate:function(isoDate){
				let dateObject = {day:0, month:0, year:0};
				let dateArr = isoDate.split("-");
				dateObject.day = dateArr[2];
				dateObject.month = dateArr[1];
				dateObject.year = dateArr[0];
				let formattedDate = (dateObject.day.length == 1)?"0":"";
				formattedDate += dateObject.day + "/";	
				formattedDate += (dateObject.month.length == 1)?"0":"";
				formattedDate += dateObject.month + "/";
				formattedDate += dateObject.year;			
				return formattedDate;
			},
			getISODate:function(dateObject){	//ISO 8601
				let date = dateObject.year + "-";
				date += (dateObject.month<10)?"0":"";
				date += dateObject.month + "-";
				date += (dateObject.day<10)?"0":"";
				date += dateObject.day;			
				return date;
			}
		}, 
		status:{getValue:function(){return this.dom.value}, setValue:setDomValue, domField:'cmbDetailStatus', dom:null, api:'statusId'} 
		}

var contactModel = {
		contactId:{getValue:getDomValue, setValue:setDomValue, domField:'connectionContactId', dom:null, api:'contactId'},
		firstName:{getValue:getDomValue, setValue:setDomValue, domField:'txtFirstName', dom:null, api:'firstName'},
		lastName:{getValue:getDomValue, setValue:setDomValue, domField:'txtLastName', dom:null, api:'lastName'},
		officePhone:{getValue:getDomValue, setValue:setDomValue, domField:'txtOfficePhone', dom:null, api:'officePhone'},
		mobilePhone:{getValue:getDomValue, setValue:setDomValue, domField:'txtMobilePhone', dom:null, api:'mobilePhone'},
		email:{getValue:getDomValue, setValue:setDomValue, domField:'txtEmail', dom:null, api:'email'},
		notes:{getValue:getDomValue, setValue:setDomValue, domField:'txtNotes', dom:null, api:'notes'}
}

var customerModel = {
		customerId:{getValue:getDomValue, setValue:setDomValue, domField:'detailCustomerId', dom:null, api:'customerId'},
		customerName:{getValue:getDomValue, setValue:setDomValue, domField:'txtCustomerName', dom:null, api:'customerName'},
		customerNotes:{getValue:getDomValue, setValue:setDomValue, domField:'txtCustomerNotes', dom:null, api:'customerNotes'}
}

var loginModel = {
		loginId:{getValue:getDomValue, setValue:setDomValue, domField:'loginId', dom:null, api:'loginId'},
		username:{getValue:getDomValue, setValue:setDomValue, domField:'txtUserName', dom:null, api:'username'},
		password:{getValue:getDomValue, setValue:setDomValue, domField:'txtPassword', dom:null, api:'password'},
		contact:{getValue:getDomValue, setValue:setDomValue, domField:'cmbLoginContactList', dom:null, api:'contactId'}
}

var attachmentModel = {
		attachmentId:{getValue:getDomValue, setValue:setDomValue, domField:'attachmentId', dom:null, api:'attachmentId'},
		type:{getValue:getDomValue, setValue:setDomValue, domField:'cmbAttachmentType', dom:null, api:'attachmentTypeId'},
		file:{getValue:getDomValue, setValue:setDomValue, domField:'attachmentFile', dom:null, api:'fileName'},
		contact:{getValue:getDomValue, setValue:setDomValue, domField:'cmbAttachmenContact', dom:null, api:'contactId'},
		notes:{getValue:getDomValue, setValue:setDomValue, domField:'txtAttachmentNotes', dom:null, api:'attachmentNotes'},
		taskLogId:{getValue:getDomValue, setValue:setDomValue, domField:'attachmentTaskLogId', dom:null, api:'taskLogId'}
		
}

var associationModel = {
		associationId:{getValue:getDomValue, setValue:setDomValue, domField:'connectionAssociationId', dom:null, api:'associationId'},
		contact:{getValue:getDomValue, setValue:setDomValue, domField:'connectionContactId', dom:null, api:'contactId'},
		customer:{getValue:getDomValue, setValue:setDomValue, domField:'cmbConnectedCustomer', dom:null, api:'customerId'},
		contactType:{getValue:getDomValue, setValue:setDomValue, domField:'cmbContactType', dom:null, api:'contactTypeId'},
		address:{getValue:getDomValue, setValue:setDomValue, domField:'addressId', dom:null, api:'addressId'}
}

var taskRelationModel = {
		taskRelationId:{getValue:getDomValue, setValue:setDomValue, domField:'taskRelationId', dom:null, api:'taskRelationId'},
		task:{getValue:getDomValue, setValue:setDomValue, domField:'taskId', dom:null, api:'parentTaskId'},
		taskRelationType:{getValue:getDomValue, setValue:setDomValue, domField:'cmbTaskRelationType', dom:null, api:'taskRelationTypeId'},
		selectedTask:{getValue:getDomValue, setValue:setDomValue, domField:'taskRelationSelectedTaskId', dom:null, api:''}
	// NOT used in API	
}

var addressModel = {
		addressId:{getValue:getDomValue, setValue:setDomValue, domField:'addressId', dom:null, api:'addressId'},
		street:{getValue:getDomValue, setValue:setDomValue, domField:'txtAddressStreet', dom:null, api:'street'},
		houseNum:{getValue:getDomValue, setValue:setDomValue, domField:'txtAddressHouseNum', dom:null, api:'houseNum'},
		city:{getValue:getDomValue, setValue:setDomValue, domField:'txtAddressCity', dom:null, api:'city'},
		country:{getValue:getDomValue, setValue:setDomValue, domField:'txtAddressCountry', dom:null, api:'country'}
}

var searchModel = {
		customer:{getValue:getDomValue, setValue:setDomValue, domField:'cmbSearchCustomer', dom:null},
		taskType:{getValue:getDomValue, setValue:setDomValue, domField:'cmbSearchTaskType', dom:null},
		project:{getValue:getDomValue, setValue:setDomValue, domField:'cmbSearchProject', dom:null},
		title:{getValue:getDomValue, setValue:setDomValue, domField:'txtSearchTitle', dom:null},
		dueDate:{getValue:getDomValue, setValue:setDomValue, domField:'txtSearchDueDate', dom:null},
		status:{getValue:function(){return this.dom.getAttribute('data-state')},
			setValue:function(val){
				this.dom.setAttribute('data-state', val);
			},
			domField:'searchTaskStatus', dom:null}
};

function MenuItem(menuid, menuDiv, model, menuList, action ){
	this.menuid = menuid;
	this.menuDiv = menuDiv;
	this.model = model;
	this.menuList = menuList;
	this.action = action;
}
var menuData = {}
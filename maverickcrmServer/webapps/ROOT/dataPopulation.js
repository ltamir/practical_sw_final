
function getTaskTypeImg(taskType){
	let img = document.createElement("IMG");
	switch(taskType){
	case 1:
		img.src="images/tasklist/project.png";
		img.title="Project";
		break;
	case 2:
		img.src="images/tasklist/requirements.png";
		img.title="Requirement";
		break;
	case 3:
		img.src="images/tasklist/design.png";
		img.title="Design";
		break;
	case 4:
		img.src="images/tasklist/develop.png";
		img.title="Development";
		break;
	case 5:
		img.src="images/tasklist/qa.png";
		img.title="QA";
		break;
	case 6:
		img.src="images/tasklist/delivery.png";
		img.title="Delivery";
		break;
	case 7:
		img.src="images/tasklist/support.png"; 
		img.title="Support";
		break;       		
	}
	return img;
}


function getTaskStatus(statusId){

	switch(statusId){
	case 1:
		return {src:"images/status/new.png", title:"New"};
	case 2:
		return {src:"images/status/running.png", title:"Running"};
	case 3:
		return {src:"images/status/delivered.png", title:"Delivered"};
	case 4:
		return {src:"images/status/closed.png", title:"Closed"};
	case 5:
		return {src:"images/status/onhold.png", title:"On Hold"};	
	}
}

function fillTaskList(id, data){
	//taskListBody
	var selectElement = getById(id);
    for (var i = selectElement.rows.length - 1; i >= 0; i--) {
        selectElement.deleteRow(i);
    }

    var newText;
    var input;
    selectElement.removeAttribute('data-selected')
    data.array.forEach(function (item) {
    	var newRow = selectElement.insertRow(selectElement.rows.length);
    	newRow.id = 'taskList' + item.taskId;
    	newRow.addEventListener("click", function(){
    		if(selectElement.hasAttribute('data-selected')){
    			let prevRow = getById(selectElement.getAttribute('data-selected'));
    			prevRow.style.backgroundColor = prevRow.getAttribute('data-backgroundColor');
    			prevRow.style.color = '#000000';
    		}
    			
    		newRow.setAttribute('data-backgroundColor', newRow.style.backgroundColor);
    		newRow.style.backgroundColor = '#424f5a';
    		newRow.style.color = '#FFFFFF';
    		selectElement.setAttribute('data-selected', newRow.id);
    		getData('', 'task', '?actionId=3&taskId='+item.taskId, fillTaskDetails);
    		});
    	
    	var customerNameCell  = newRow.insertCell(0);
        customerNameCell.classList.add("cssTaskListCustomer");
        let typeImg = getTaskTypeImg(item.taskType.taskTypeId);

    	customerNameCell.appendChild(typeImg);
    	customerNameCell.classList.add("cssTaskListType");   
    	
    	var titleCell  = newRow.insertCell(1);
    	titleCell.innerHTML = item.title;
        titleCell.classList.add("cssTaskListTitle");         

    	var dueDateCell  = newRow.insertCell(2);
        let day = (item.dueDate.day<10)?'0'+item.dueDate.day:item.dueDate.day;
        let month = (item.dueDate.month<10)?'0'+item.dueDate.month:item.dueDate.month;
        dueDateCell.innerHTML = day + "/" + month + "/" + item.dueDate.year;
        dueDateCell.classList.add("cssTaskListDueDate");
    	
    	var effortCell  = newRow.insertCell(3);
    	effortCell.classList.add("cssTaskListEffort");
    	var strEffort = new String(item.effort)
    	effortCell.innerHTML = (strEffort.length==1)?'0'+strEffort:strEffort ;
    	effortCell.innerHTML +=' ' + new String((item.effortUnit==1)?'h':'d');
    	
    	var statusNameCell  = newRow.insertCell(4);
    	statusNameCell.classList.add("cssTaskListStatus");
    	statusNameCell.innerHTML = item.status.statusName;
    	
    }); 
}

function fillAttachmentList(id, data){
	var element = getById('cmbAttachmentList');
    for (var i = element.length - 1; i >= 0; i--) {
    	element.remove(i);
	}
	if(dbg==dbgModule.attachment)
		console.log(data);
    data.array.forEach(function (item) {
        let opt = document.createElement("OPTION");
        opt.value = item.attachmentId;
        opt.text = item.fileName + " " + item.attachmentType.attachmentTypeName;
        opt.title = item.taskLog.description;
        opt.addEventListener("mouseover", function(){this.style.cursor='pointer';});
        opt.addEventListener("click", function(){getData('', 'attachment', '?actionId=3&attachmentId='+item.attachmentId, fillAttachmentDetails);});
        element.appendChild(opt);                        
    }); 	
}

function fillContactList(id, data){
	var element = getById(id);
	
    for (var i = element.length - 1; i >= 0; i--) {
    	element.remove(i);
	}
	if(dbg==dbgModule.contact)
		console.log(data);
    data.array.forEach(function (item) {
        let opt = document.createElement("OPTION");
        let phone = (item.officePhone == '')?((item.cellPhone == '')?'':item.cellPhone):item.officePhone
        let txtValue = item.firstName + " " + item.lastName + " : " + new String((phone == null)?"  -  ":phone);
        opt.value = item.contactId;
        opt.text = txtValue; 
        opt.addEventListener("mouseover", function(){this.style.cursor='pointer';});
        opt.addEventListener("click", function(){getData('', 'contact', '?actionId=3&contactId='+item.contactId, fillContactDetails);});
        element.appendChild(opt);                        
    });         	
}

function fillContactCard(id, item){
	let card = getById(id);
	
	setValue('txtFirstName', item.firstName);
	setValue('txtLastName', item.lastName);
	setValue('txtOfficePhone', item.officePhone);
	setValue('txtMobilePhone', item.mobilePhone);
	setValue('txtEmail', item.email);
	setValue('txtNotes', item.notes);
	setValue('ConnectionContactId', item.contactId);
}

function fillAddressCard(id, item){
	let card = getById(id);
	
	setValue('txtAddressStreet', item.street);
	setValue('txtAddressHouseNum', item.houseNum);
	setValue('txtAddressCity', item.city);
	setValue('txtAddressCountry', item.country);
	setValue('addressId', item.addressId);
}

function fillCustomerList(id, data){
    let selectElement = getById(id);
    for (let i = selectElement.length - 1; i >= 0; i--) {
        selectElement.remove(i);
	}
	if(dbg==dbgModule.customer)
    	console.log(data);
    data.array.forEach(function (item) {
    	let opt = document.createElement("OPTION");
        opt.value = item.customerId;
        opt.text = item.customerName;
        opt.addEventListener("mouseover", function(){this.style.cursor='pointer';});
        opt.addEventListener("click", function(){getData('', 'customer', '?actionId=3&customerId='+item.customerId, fillCustomerDetails);});
        selectElement.appendChild(opt);                        
    });        	
}

function fillTaskRelationSearchResult(id, data){
	let selectElement = getById(id);
	
	if(dbg==dbgModule.tasklog)
   		console.log(data);
	
    for (let i = selectElement.length - 1; i >= 0; i--) {
        selectElement.remove(i);
	}
    setValue('taskRelationId', 0);
    data.array.forEach(function (item) {
    	let thisDate = new Date(item.sysdate);
        let opt = document.createElement("OPTION");
        opt.value = item.taskId;
        opt.text = item.title;
        opt.addEventListener("mouseover", function(){this.style.cursor='pointer';});
        opt.addEventListener("click", function(){getById('lblDetailTaskRelationTitle').innerHTML = item.title; setValue('taskRelationSelectedTaskId', item.taskId);});
        selectElement.appendChild(opt);
    });            
}

function fillTaskRelationList(id, data, defaultOption, funcValue, funcText, eventHandler){
	let parentElement = getById(id);
	
	for(let i = parentElement.childNodes.length-1; i > -1; i--)
		parentElement.removeChild(parentElement.childNodes[i]);
	
	if(dbg==dbgModule.relation)
    	console.log(data);
	data.array.forEach(function (item) {
		let divRow = document.createElement('DIV');
		parentElement.appendChild(divRow);
		
    	let relType = document.createElement("IMG");
    	switch(item.taskRelationType.taskRelationTypeId){
    	case 2:
    		relType.src="images/process.png";
    		relType.title="process";
    		break;
    	case 1:
    		relType.src="images/derived.png";
    		relType.title="derived from task";
    		break;
    	case 3:
    		relType.src="images/dependency.png";
    		relType.title="depends on";
    		break;    		
    	}
    	divRow.appendChild(relType);

    	let gotoImg = document.createElement("IMG");
    	gotoImg.src="images/goto_task.png";
    	gotoImg.title="goto task";
    	gotoImg.style.marginLeft = '0.5em';
    	gotoImg.addEventListener("click", function(){getData('', 'task', '?actionId=3&taskId='+taskId, fillTaskDetails)});
    	divRow.appendChild(gotoImg);
    	
    	
    	let relTask = document.createElement("SPAN");
    	let taskId;
    	let taskTitle;
    	if(defaultOption == 1){	//filling with parent tasks
    		taskId = item.parentTask.taskId;
    		taskTitle = item.parentTask.title;
    		relTask.id = 'taskParentList' + taskId;
    	}
    	else{
    		taskId = item.childTask.taskId;
    		taskTitle = item.childTask.title;
    		relTask.id = 'taskChildList' + taskId;
    	}

    	relTask.style.marginLeft = '1em';
    	relTask.innerHTML = taskTitle;
    	relTask.setAttribute("data-taskId", taskId);
    	relTask.classList.add("cssTaskRelationTitle");
    	relTask.addEventListener("click", function(){
    		let containerDiv = getById('divTaskTab');
    		if(containerDiv.hasAttribute('data-selected')){
    			let prevRow = getById(containerDiv.getAttribute('data-selected'));
    			prevRow.classList.remove("cssTaskRelationTitleSelected");
    			prevRow.parentElement.classList.remove("cssTaskRelationTitleSelected");
    			prevRow.classList.add("cssTaskRelationTitle");
    			prevRow.parentElement.classList.add("cssTaskRelationTitle");
    		}
    		relTask.classList.remove("cssTaskRelationTitle");
    		relTask.parentElement.classList.remove("cssTaskRelationTitle");
    		relTask.classList.add("cssTaskRelationTitleSelected");
    		relTask.parentElement.classList.add("cssTaskRelationTitleSelected");
    		containerDiv.setAttribute('data-selected', relTask.id);    		
    		getData('', 'taskrelation', '?actionId=3&taskRelationId='+item.taskRelationId, fillTaskRelationDetails); setValue('taskRelationSelectedTaskId', taskId);
    		});
    		
    	divRow.appendChild(relTask);

    	divRow.classList.add("cssTaskRelationTitle");
	});
		
}    
    	
function fillTaskRelationDetails(id, data){
	getById('cmbTaskRelationType').value = data.taskRelationType.taskRelationTypeId;
	getById('taskRelationId').value=data.taskRelationId;
	getById('cmbTaskRelationType').value=data.taskRelationType.taskRelationTypeId;
	
	if(getById('taskId').value==data.parentTask.taskId){
		getById('lblDetailTaskRelationTitle').innerText = data.childTask.title;
	}else{
		getById('lblDetailTaskRelationTitle').innerText = data.parentTask.title;
	}
}
        
function fillTaskLogList(id, data){
	let selectElement = getById('cmbTaskLogList');
	
    for (let i = selectElement.length - 1; i >= 0; i--) {
        selectElement.remove(i);
	}
	if(dbg==dbgModule.tasklog)
   		console.log(data);
    data.array.forEach(function (item) {
        var thisDate = new Date(item.sysdate);
        var opt = document.createElement("OPTION");
        opt.value = item.taskLogId;
        opt.text = thisDate.toLocaleDateString() + ", " + item.contact.firstName + " " + item.contact.lastName + ": " + item.description ;
        opt.addEventListener("mouseover", function(){this.style.cursor='pointer';});
        opt.addEventListener("click", function(){getData('', 'tasklog', '?actionId=3&taskLogId='+item.taskLogId, fillTaskLogDetails);});
        selectElement.appendChild(opt);
    });        	
}

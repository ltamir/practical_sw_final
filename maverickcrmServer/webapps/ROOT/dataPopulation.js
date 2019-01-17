function fillTaskList(id, data){
	//taskListBody
	var selectElement = getById(id);
    for (var i = selectElement.rows.length - 1; i >= 0; i--) {
        selectElement.deleteRow(i);
    }

    var newText;
    var input;

    data.array.forEach(function (item) {
    	var newRow   = selectElement.insertRow(selectElement.rows.length);
    	newRow.addEventListener("click", function(){getData('', 'task', '?actionId=3&taskId='+item.taskId, fillTaskDetails);});
    	
    	var customerNameCell  = newRow.insertCell(0);
//        customerNameCell.innerHTML = item.customer.customerName;
        customerNameCell.classList.add("cssTaskListCustomer");
        let typeImg = document.createElement("IMG");
    	switch(item.taskType.taskTypeId){
    	case 1:
    		typeImg.src="images/tasklist/project.png";
    		typeImg.title="Project";
    		break;
    	case 2:
    		typeImg.src="images/tasklist/requirements.png";
    		typeImg.title="Requirement";
    		break;
    	case 3:
    		typeImg.src="images/tasklist/design.png";
    		typeImg.title="Design";
    		break;
    	case 4:
    		typeImg.src="images/tasklist/develop.png";
    		typeImg.title="Development";
    		break;
    	case 5:
    		typeImg.src="images/tasklist/qa.png";
    		typeImg.title="QA";
    		break;
    	case 6:
    		typeImg.src="images/tasklist/delivery.png";
    		typeImg.title="Delivery";
    		break;
    	case 7:
    		typeImg.src="images/tasklist/support.png";
    		typeImg.title="Support";
    		break;       		
    	}
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

function fillTaskRelationListParent(id, data){
	let parentElement = getById(id);
    for (let i = parentElement.length - 1; i >= 0; i--) {
    	parentElement.remove(i);
	}
	if(dbg==dbgModule.relation)
    	console.log(data);
    data.array.forEach(function (item) {
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
    	parentElement.appendChild(relType);
    	let relTask = document.createElement("SPAN");
    	relTask.style.marginLeft = '1em';
    	relTask.innerHTML = item.parentTask.title;
    	relTask.setAttribute("data-taskId", item.parentTask.taskId);
    	relTask.addEventListener("click", function(){getData('', 'taskrelation', '?actionId=3&taskRelationId='+item.taskRelationId, fillTaskRelationDetails); setValue('taskRelationSelectedTaskId', item.parentTask.taskId);});
    	parentElement.appendChild(relTask);

    	relType = document.createElement("IMG");
    	relType.src="images/goto_task.png";
    	relType.title="goto task";
    	relType.style.float='right';
    	relType.style.marginRight = '0.5em';
    	relType.addEventListener("click", function(){getData('', 'task', '?actionId=3&taskId='+item.parentTask.taskId, fillTaskDetails)});
    	parentElement.appendChild(relType);
    	let relBr = document.createElement("BR");
    	parentElement.appendChild(relBr);     	
    	                      
    });             
}  

function fillTaskRelationListChild(id, data){
	let parentElement = getById(id);
    for (let i = parentElement.length - 1; i >= 0; i--) {
    	parentElement.remove(i);
	}
	if(dbg==dbgModule.relation)
    	console.log(data);

    data.array.forEach(function (item) {
    	let relType = document.createElement("IMG");
    	switch(item.taskRelationType.taskRelationTypeId){
    	case 2:
    		relType.src="images/process.png";
    		relType.title="process";
    		break;
    	case 1:
    		relType.src="images/derived.png";
    		relType.title="derived task";
    		break;
    	case 3:
    		relType.src="images/dependency.png";
    		relType.title="dependent on";
    		break;    		
    	}
    	parentElement.appendChild(relType);
    	let relTask = document.createElement("SPAN");
    	relTask.style.marginLeft = '1em';
    	relTask.innerHTML = item.childTask.title;
    	relTask.setAttribute("data-taskId", item.childTask.taskId);
    	relTask.addEventListener("click", function(){getData('', 'taskrelation', '?actionId=3&taskRelationId='+item.taskRelationId, fillTaskRelationDetails); setValue('taskRelationSelectedTaskId', item.childTask.taskId);});
    	parentElement.appendChild(relTask);

    	relType = document.createElement("IMG");
    	relType.src="images/goto_task.png";
    	relType.title="goto task";
    	relType.style.float='right';
    	relType.style.marginRight = '0.5em';
    	relType.addEventListener("click", function(){getData('', 'task', '?actionId=3&taskId='+item.childTask.taskId, fillTaskDetails)});
    	parentElement.appendChild(relType);
    	let relBr = document.createElement("BR");
    	parentElement.appendChild(relBr);                 
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

function fillLoginDetails(id, data){
	setValue('txtUserName', data.username);
	setValue('txtPassword', data.password);
	setValue('cmbLoginContactList', data.contact.contactId);
}
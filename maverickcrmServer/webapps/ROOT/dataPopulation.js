
function getTaskTypeImg(taskType){
	let img = document.createElement("IMG");

	img.src = taskTypeImg[taskType].src;
	img.title = taskTypeImg[taskType].title;
	return img;
}

function fillChildTaskList(id, data, rowIndex, funcValue, funcText, eventHandler){

	let parentTable = getById(id);
    
    let firstRow = 0;
    let lastRow = data.array.length-1;
    let rowPos = 0;
    
    data.array.forEach(function (item) {
    	var row = parentTable.insertRow(rowIndex+1+rowPos);
    	if(rowPos == firstRow){
    		row.style.borderTop='4px inset #898989';	
    	}
    	if(rowPos == lastRow){
    		row.style.borderBottom='4px inset #898989';
    	}
    	row.setAttribute('data-isTaskChild', item.parentTask.taskId);
    	row.style.borderLeft='4px inset #121212';
    	row.style.borderRight='4px inset #121212';
    	createTaskRow(row, item.childTask, parentTable); 
    	rowPos++;
    }); 
}

function fillTaskList(id, data){
	//taskListBody
	let selectElement = getById(id);
    for (var i = selectElement.rows.length - 1; i >= 0; i--) {
        selectElement.deleteRow(i);
    }

    selectElement.removeAttribute('data-selected')
    data.array.forEach(function (item) {
    	var newRow = selectElement.insertRow(selectElement.rows.length);
    	createTaskRow(newRow, item, selectElement);    	
    }); 
}

function createTaskRow(row, item, parent){
	row.id = 'taskList' + item.taskId;
	row.addEventListener("click", function(){
		if(parent.hasAttribute('data-selected')){
			let prevRow = getById(parent.getAttribute('data-selected'));
			prevRow.style.backgroundColor = prevRow.getAttribute('data-backgroundColor');
			prevRow.style.color = '#000000';
		}
			
		row.setAttribute('data-backgroundColor', row.style.backgroundColor);
		row.style.backgroundColor = '#424f5a';
		row.style.color = '#FFFFFF';
		parent.setAttribute('data-selected', row.id);
		getData('', 'task', '?actionId=3&taskId='+item.taskId, fillTaskDetails);
		});
	
	let taskTypeCell  = row.insertCell(0);
	taskTypeCell.classList.add("cssTaskListCustomer");
    let typeImg = getTaskTypeImg(item.taskType.taskTypeId);

    taskTypeCell.appendChild(typeImg);

    let expandImg = document.createElement("IMG");

    expandImg.src="images/row_expand.png";
    expandImg.title = "show children"; 
    expandImg.addEventListener("click", function(evt){
    	evt = window.event || evt; 
	    if(this === evt.target) {
	    	
	    	if(row.hasAttribute('data-isTaskParent')){
	    	    for (var i = parent.rows.length - 1; i >= 0; i--) {
	    	    	if(parent.rows[i].hasAttribute('data-isTaskChild') && parent.rows[i].getAttribute('data-isTaskChild') == item.taskId)
	    	    		parent.deleteRow(i);
	    	    }	    		
	    	    expandImg.src="images/row_expand.png";
	    	    expandImg.title = "show children";
	    	    row.removeAttribute('data-isTaskParent');
	    	}else{
		    	row.setAttribute('data-isTaskParent', item.taskId);
		    	getDataEx('taskList', 'taskrelation', '?actionId=7&taskId='+item.taskId, fillChildTaskList, row.rowIndex, null, null, null);
		        expandImg.src="images/row_collapse.png";
		        expandImg.title = "hide children";	    		
	    	}
	    }
    });
    taskTypeCell.appendChild(expandImg);
    taskTypeCell.classList.add("cssTaskListType");   
	
    let titleCell  = row.insertCell(1);
	titleCell.innerHTML = item.title;
    titleCell.classList.add("cssTaskListTitle");         

    let dueDateCell  = row.insertCell(2);
    let day = (item.dueDate.day<10)?'0'+item.dueDate.day:item.dueDate.day;
    let month = (item.dueDate.month<10)?'0'+item.dueDate.month:item.dueDate.month;
    dueDateCell.innerHTML = day + "/" + month + "/" + item.dueDate.year;
    dueDateCell.classList.add("cssTaskListDueDate");
	
    let effortCell  = row.insertCell(3);
	effortCell.classList.add("cssTaskListEffort");
	let strEffort = new String(item.effort)
	effortCell.innerHTML = (strEffort.length==1)?'0'+strEffort:strEffort ;

	effortCell.innerHTML +=' ' + effortUnit[item.effortUnit].unit;

	
	let statusNameCell  = row.insertCell(4);
	statusNameCell.classList.add("cssTaskListStatus");
	statusNameCell.innerHTML = item.status.statusName;
	
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
        opt.addEventListener("click", function(){setValue('taskRelationSelectedTaskId', item.taskId);});
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
		divRow.style.zIndex = 0;
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
    	relType.addEventListener("click", function(){
    		let containerDiv = getById('divTaskTab');
    		let popup = getById('divRelationTypeList');
    		if(popup.style.display == 'none'){
    			divRow.insertBefore(popup, divRow.childNodes[2]);
//    			popup.style.top = divRow.offsetTop;
//				popup.style.left = divRow.offsetLeft;
    			popup.style.display='inline';
    			popup.setAttribute('data-taskrelationId', item.taskRelationId);
    		}else{
    			popup.style.display='none'; 
    			containerDiv.appendChild(getById('divRelationTypeList'));
    			popup.removeAttribute('data-taskrelationId');
    		}

    	});
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


function getTaskTypeImg(taskType){
	let img = document.createElement("IMG");

	img.src = taskTypeList[taskType].src;
	img.title = taskTypeList[taskType].title;
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
    		row.style.borderTop='3px outset #8B8B8B';	
    	}
    	if(rowPos == lastRow){
    		row.style.borderBottom='3px inset #b1b1b0';
    	}
    	row.setAttribute('data-isTaskChild', item.parentTask.taskId);
    	row.style.borderLeft='3px outset #8B8B8B';
    	row.style.borderRight='3px inset #b1b1b0';
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
		row.style.backgroundColor = '#8899AA' //'#424f5a';
		row.style.color = '#FFFFFF';
		parent.setAttribute('data-selected', row.id);
		getData('', 'task', '?actionId=3&taskId='+item.taskId, viewTask);
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

	effortCell.innerHTML +=' ' + effortUnitList[item.effortUnit].unit;

	
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
        opt.addEventListener("click", function(){getData('', 'attachment', '?actionId=3&attachmentId='+item.attachmentId, viewAttachment);});
        element.appendChild(opt);                        
    }); 	
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
        opt.addEventListener("click", function(){getData('', 'customer', '?actionId=3&customerId='+item.customerId, viewCustomer);});
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
    	gotoImg.addEventListener("click", function(){getData('', 'task', '?actionId=3&taskId='+taskId, viewTask)});
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
    		getData('', 'taskrelation', '?actionId=3&taskRelationId='+item.taskRelationId, viewTaskRelationDetails); setValue('taskRelationSelectedTaskId', taskId);
    		});
    		
    	divRow.appendChild(relTask);

    	divRow.classList.add("cssTaskRelationTitle");
	});
		
}

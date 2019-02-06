
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
    let parentItem = null;
    if(data.array.length > 0){
    	parentItem = taskItemList.get(taskItemList.root, data.array[0].parentTask.taskId);
    }
    	
    data.array.forEach(function (item) {
    	var row = parentTable.insertRow(rowIndex+1+rowPos);
    	if(rowPos == firstRow){
    		row.style.borderTop='3px outset #8B8B8B';	
    	}
    	if(rowPos == lastRow){
    		row.style.borderBottom='3px inset #b1b1b0';
    	}
    	
    	taskItemList.add(parentItem, new taskItem(item.childTask.taskId, row))

    	row.setAttribute('data-isTaskChild', item.parentTask.taskId);
    	row.style.borderLeft='3px outset #8B8B8B';
    	row.style.borderRight='3px inset #b1b1b0';
    	createTaskRow(row, item.childTask, parentTable); 
    	rowPos++;
    }); 
}

function fillTaskList(id, data){
	if(data.status == 'nack'){
		console.log(data.err);
		setMsg(msgType.nok, data.msg);
		return;
	}
	//taskListBody
	let selectElement = getById(id);
    for (var i = selectElement.rows.length - 1; i >= 0; i--) {
        selectElement.deleteRow(i);
    }
    let prevItemList = Object.assign({}, taskItemList);
    taskItemList.clear(taskItemList.head);
    
    data.array.forEach(function (item) {
    	
    	var newRow = selectElement.insertRow(selectElement.rows.length);
    	taskItemList.add(taskItemList.root, new taskItem(item.taskId, newRow));
    	createTaskRow(newRow, item, selectElement);    	
    }); 
    
    restoreHierarchy(prevItemList.root, taskItemList);
    prevItemList.clear();
}

function restoreHierarchy(prevItemList, newTaskItemList){
	for(let child in prevItemList){
		if(prevItemList[child].hasChildren != undefined && prevItemList[child].hasChildren == true){
			let parentItem = newTaskItemList.get(newTaskItemList.root, prevItemList[child].id);
			if(parentItem != null){
				let event = new MouseEvent('click', {
				    view: window,
				    bubbles: true,
				    cancelable: true
				});
				parentItem.row.cells[0].childNodes[1].dispatchEvent(event);			
			}

		}
//			return this.get(prevItemList[child], taskId);
	}
}

function createTaskRow(row, item, parent){
	row.id = 'taskList' + item.taskId;
	row.addEventListener("click", function(event){
		evt = window.event || event; 
		if(row.childNodes[0].childNodes[1] === evt.target)
			return;
		selectedTaskList.toggle(row);
		getData('', 'task', '?actionId=3&taskId='+item.taskId, viewTask);		
	
	});
	
	let taskTypeCell  = row.insertCell(0);
	taskTypeCell.classList.add("cssTaskListCustomer");
    let typeImg = getTaskTypeImg(item.taskType.taskTypeId);

    taskTypeCell.appendChild(typeImg);

    let expandImg = document.createElement("IMG");

    expandImg.src = taskListItemStat.expandImg.src;
    expandImg.title = taskListItemStat.expandImg.title; 
    expandImg.addEventListener("click", function(event){
    	evt = window.event || event; 
	    if(this === evt.target) {
	    	let parentTaskItem = taskItemList.get(taskItemList.root, item.taskId);
	    	if(parentTaskItem.hasChildren){
	    		taskItemList.deleteRow(parent, parentTaskItem);
	    		parentTaskItem.hasChildren = false;
	    	    expandImg.src = taskListItemStat.expandImg.src;
	    	    expandImg.title = taskListItemStat.expandImg.title; 
	    	}else{
		    	getDataEx('taskList', 'taskrelation', '?actionId=7&taskId='+item.taskId, fillChildTaskList, row.rowIndex, null, null, null);
		        expandImg.src = taskListItemStat.collapseImg.src;
		        expandImg.title = taskListItemStat.collapseImg.title; ;	    		
	    	}
	    }
    });
    taskTypeCell.appendChild(expandImg);
    taskTypeCell.classList.add("cssTaskListType");   
	
    let titleCell  = row.insertCell(1);
	titleCell.innerHTML = item.title;
	setTextDirection(titleCell, titleCell.innerHTML);
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


//TODO move to a div 
function fillTaskRelationSearchResult(id, data){
	let selectElement = getById(id);
	
	if(dbg==Module.tasklog)
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
	let toggler = new divRowToggler('cssTaskRelationTitle', 'cssTaskRelationTitleSelected');
	
	for(let i = parentElement.childNodes.length-1; i > -1; i--)
		parentElement.removeChild(parentElement.childNodes[i]);
	
	if(dbg==Module.relation)
    	console.log(data);
	
	data.array.forEach(function (item) {
		let divRow = document.createElement('DIV');

		divRow.style.zIndex = 0;
		parentElement.appendChild(divRow);
		
    	let relType = document.createElement("IMG");
    	relType.src = relationTypeList[item.taskRelationType.taskRelationTypeId].src;
    	relType.title = relationTypeList[item.taskRelationType.taskRelationTypeId].title;

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
    	gotoImg.style.marginLeft = '0.1em';
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

    	relTask.style.marginLeft = '0.3em';
    	relTask.innerHTML = taskTitle;

    	relTask.setAttribute("data-taskId", taskId);
    	relTask.classList.add("cssTaskRelationTitle");
    	relTask.addEventListener("click", function(){
    		toggler.toggle(relTask);   		
    		getData('', 'taskrelation', '?actionId=3&taskRelationId='+item.taskRelationId, viewTaskRelationDetails); setValue('taskRelationSelectedTaskId', taskId);
    		});
    		
    	setTextDirection(relTask, relTask.innerHTML);
		if(relTask.style.direction == 'rtl'){
			relTask.style.float = 'right';
			relTask.style.display = 'table-row';
//			relTask.style.width = '85%';
		}else{
			
		} 
		divRow.appendChild(relTask);
    	

    	divRow.classList.add("cssTaskRelationTitle");
	});
		
}

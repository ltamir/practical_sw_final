
function getTaskTypeImg(taskType){
	let img = document.createElement("IMG");
	setImage(img, taskTypeList[taskType])
	return img;
}

function setImage(targetImg, imgNode){
	targetImg.src = imgNode.src;
	targetImg.title = imgNode.title;
}

function fillChildTaskList(id, data, rowIndex, funcValue, funcText, eventHandler){

	let parentTable = getById(id);
    
    let firstRow = 0;
    let lastRow = data.array.length-1;
    let rowPos = 0;
    let parentItem = null;
    if(data.array.length > 0){
    	parentItem = taskItemList.get(taskItemList.root, data.array[0].parentTask.taskId);
    }else{
    	setImage(parentTable.rows[rowIndex-1].children[0].children[1], taskListItemStat.noChildrenImg);
    	return;
    }
    
    let toggler = new divRowToggler('cssTaskListRegular', 'cssTaskListSelected');
    data.array.forEach(function (item) {
    	var row = parentTable.insertRow(rowIndex+rowPos);
    	if(rowPos == firstRow){
    		row.style.borderTop='3px outset #8B8B8B';	
    	}
    	if(rowPos == lastRow){
//    		row.style.borderBottom='3px inset #b1b1b0';
    		row.style.display='inline-block';
    		row.classList.add('card');
    	}
    	
    	taskItemList.add(parentItem, new taskItem(item.childTask.taskId, row))

    	row.setAttribute('data-isTaskChild', item.parentTask.taskId);
    	row.style.borderLeft='3px outset #8B8B8B';
    	row.style.borderRight='3px inset #b1b1b0';
    	createTaskRow(row, item.childTask, parentTable, toggler); 
    	rowPos++;
    }); 
}

function fillTaskList(id, data){
	if(data.status == 'nack'){
		addLog(data.err);
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
	if(dbg==Module.task)
		addLog(data.array);
    let toggler = new divRowToggler('cssTaskListRegular', 'cssTaskListSelected');
    data.array.forEach(function (item) {
    	
    	var newRow = selectElement.insertRow(selectElement.rows.length);
    	taskItemList.add(taskItemList.root, new taskItem(item.taskId, newRow));
    	createTaskRow(newRow, item, selectElement, toggler);    	
    }); 
    
    restoreHierarchy(prevItemList.root, taskItemList);
    prevItemList.clear();
}

function restoreHierarchy(prevItemList, newTaskItemList){
	for(let child in prevItemList){
		if(prevItemList[child].hasChildren == true){
			let parentItem = newTaskItemList.get(newTaskItemList.root, prevItemList[child].id);
			if(parentItem != null){
				let event = new MouseEvent('click', {
				    view: window,
				    bubbles: true,
				    cancelable: true
				});
				parentItem.row.cells[0].childNodes[1].dispatchEvent(event);	
				restoreHierarchy(prevItemList[child], newTaskItemList);
			}

		}
//			return this.get(prevItemList[child], taskId);
	}
}

function updateTaskRow(){
	let row;
	let taskList = getById('taskList');
	
    for (var i = taskList.rows.length - 1; i >= 0; i--) {
    	let id = 'taskList'+taskModel.taskId.getValue();
    	if(id == taskList.rows[i].id)
    		row = taskList.rows[i];
    }
    setImage(row.cells[0].children[0], taskTypeList[taskModel.taskType.getValue()]);
    row.cells[1].innerHTML = taskModel.title.getValue();
    setTextDirection(row.cells[1], row.cells[1].innerHTML);
    row.cells[2].innerHTML = getDate(taskModel.dueDate.getValue());
    
    let effort = taskModel.effort.getValue();
    row.cells[3].innerHTML = (effort.length==1)?'0'+effort:effort ;
    row.cells[3].innerHTML +=' ' + effortUnitList[taskModel.effortUnit.getValue()].unit;
    row.cells[4].innerHTML = taskStatusList[taskModel.status.getValue()].title;
}

function createTaskRow(row, item, parent, toggler){
	row.id = 'taskList' + item.taskId;
	row.addEventListener("click", function(event){
		evt = window.event || event; 
		if(row.childNodes[0].childNodes[1] === evt.target)
			return;
		toggler.toggle(row);
		getData('', 'task', '?actionId=3&taskId='+item.taskId, viewTask);		
	
	});
	
	let taskTypeCell = row.insertCell(0);
	taskTypeCell.classList.add("cssTaskListCustomer");
    let typeImg = getTaskTypeImg(item.taskType.taskTypeId);
    typeImg.style.marginRight= '0.3em';

    taskTypeCell.appendChild(typeImg);

    let expandImg = document.createElement("IMG");

    setImage(expandImg, taskListItemStat.expandImg); 
    expandImg.addEventListener("click", function(event){
    	evt = window.event || event; 
	    if(this === evt.target) {
	    	let parentTaskItem = taskItemList.get(taskItemList.root, item.taskId);
	    	if(parentTaskItem == null) return;
	    	if(parentTaskItem.hasChildren){
	    		taskItemList.deleteRow(parent, parentTaskItem);
	    		parentTaskItem.hasChildren = false;
	    		setImage(expandImg, taskListItemStat.expandImg);
	    	}else{
		    	getDataEx('taskList', 'taskrelation', '?actionId=7&taskId='+item.taskId, fillChildTaskList, row.rowIndex, null, null, null);
		    	setImage(expandImg, taskListItemStat.collapseImg);    		
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
		addLog(data);
	
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
		addLog(data);
	
	data.array.forEach(function (item) {
		let divRow = document.createElement('DIV');

		divRow.style.zIndex = 0;
		parentElement.appendChild(divRow);
		
    	let relType = document.createElement("IMG");
    	setImage(relType, relationTypeList[item.taskRelationType.taskRelationTypeId]);

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
    	
    	let gotoImg = document.createElement("IMG");
    	gotoImg.src="images/goto_task.png";
    	gotoImg.title="goto task";
    	gotoImg.style.marginLeft = '0.1em';
    	gotoImg.addEventListener("click", function(){getData('', 'task', '?actionId=3&taskId='+taskId, viewTask)});

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
			divRow.style.direction = 'rtl'; 					
		}
		divRow.appendChild(relType);
    	divRow.appendChild(gotoImg);
    	divRow.appendChild(relTask);
    	

    	divRow.classList.add("cssTaskRelationTitle");
	});
		
}

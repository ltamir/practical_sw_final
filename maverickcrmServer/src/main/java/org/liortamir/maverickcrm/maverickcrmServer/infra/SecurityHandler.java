package org.liortamir.maverickcrm.maverickcrmServer.infra;

import java.sql.SQLException;
import java.util.List;

import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskDAL;
import org.liortamir.maverickcrm.maverickcrmServer.dal.TaskRelationDAL;
import org.liortamir.maverickcrm.maverickcrmServer.model.Task;
import org.liortamir.maverickcrm.maverickcrmServer.model.TaskRelation;

public class SecurityHandler {

	private TaskDAL taskDal = TaskDAL.getInstance();
	private TaskRelationDAL taskRelationDal = TaskRelationDAL.getInstance();
	
	public Task getRootTask(int taskId) throws SQLException {
		Task task = null;
		try {
			task = taskDal.get(taskId);
		} catch (SQLException e) {
			throw new SQLException("SecurityHandler.getRootTask(): " + e.toString());
		}
		
		if(task.getTaskType().getTaskTypeId() == 1)
			return task;
		
		
		return loopOnParent(task);
	}
	
	private Task loopOnParent(Task task) throws SQLException{
		
		List<TaskRelation> bulk = taskRelationDal.getParents(task.getTaskId());
		for(TaskRelation r : bulk) {
			if(r.getParentTask().getTaskType().getTaskTypeId() == 1)
				return r.getParentTask();
			return loopOnParent(r.getParentTask());
		}
		
		return task;
	}
}

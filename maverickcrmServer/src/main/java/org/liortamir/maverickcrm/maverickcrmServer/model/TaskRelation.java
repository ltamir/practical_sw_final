package org.liortamir.maverickcrm.maverickcrmServer.model;

public class TaskRelation {

	private int taskRelationId;
	private Task parentTask;
	private Task childTask;
	private Task rootTask;
	private TaskRelationType taskRelationType;
	public TaskRelation(int taskRelationId, Task parentTask, Task childTask, Task rootTask, TaskRelationType taskRelationType) {
		this.taskRelationId = taskRelationId;
		this.parentTask = parentTask;
		this.childTask = childTask;
		this.rootTask = rootTask;
		this.taskRelationType = taskRelationType;
	}
	public int getTaskRelationId() {
		return taskRelationId;
	}
	public void setTaskRelationId(int taskRelationId) {
		this.taskRelationId = taskRelationId;
	}
	public Task getParentTask() {
		return parentTask;
	}
	public void setParentTask(Task parentTask) {
		this.parentTask = parentTask;
	}
	public Task getChildTask() {
		return childTask;
	}
	public void setChildTask(Task childTask) {
		this.childTask = childTask;
	}
	public Task getRootTask() {
		return rootTask;
	}
	public void setRootTask(Task rootTask) {
		this.rootTask = rootTask;
	}	
	public TaskRelationType getTaskRelationType() {
		return taskRelationType;
	}
	public void setTaskRelationType(TaskRelationType taskRelationType) {
		this.taskRelationType = taskRelationType;
	}
	
	
}

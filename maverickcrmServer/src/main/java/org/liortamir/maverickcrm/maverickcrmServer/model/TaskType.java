package org.liortamir.maverickcrm.maverickcrmServer.model;

public class TaskType implements Comparable<TaskType>{

	private int taskTypeId;
	private String taskTypeName;
	
	public TaskType(int taskTypeId, String taskTypeName) {
		this.taskTypeId = taskTypeId;
		this.taskTypeName = taskTypeName;
	}
	public int getTaskTypeId() {
		return taskTypeId;
	}
	public void setTaskTypeId(int taskTypeId) {
		this.taskTypeId = taskTypeId;
	}
	public String getTaskTypeName() {
		return taskTypeName;
	}
	public void setTaskTypeName(String taskTypeName) {
		this.taskTypeName = taskTypeName;
	}
	@Override
	public int compareTo(TaskType o) {
		return o.getTaskTypeId() - getTaskTypeId();
	}
	
	
}

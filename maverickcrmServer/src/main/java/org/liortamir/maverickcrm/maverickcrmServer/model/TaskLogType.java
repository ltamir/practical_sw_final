package org.liortamir.maverickcrm.maverickcrmServer.model;

public class TaskLogType {

	private int taskLogTypeId;
	private String taskLogTypeName;
	
	public TaskLogType(int taskLogTypeId, String taskLogTypeName) {
		this.taskLogTypeId = taskLogTypeId;
		this.taskLogTypeName = taskLogTypeName;
	}
	public int getTaskLogTypeId() {
		return taskLogTypeId;
	}
	public void setTaskLogTypeId(int taskLogTypeId) {
		this.taskLogTypeId = taskLogTypeId;
	}
	public String getTaskLogTypeName() {
		return taskLogTypeName;
	}
	public void setTaskLogTypeName(String taskLogTypeName) {
		this.taskLogTypeName = taskLogTypeName;
	}
	
	
}

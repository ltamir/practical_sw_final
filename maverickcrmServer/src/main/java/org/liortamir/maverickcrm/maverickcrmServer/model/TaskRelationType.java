package org.liortamir.maverickcrm.maverickcrmServer.model;

public class TaskRelationType {

	private int taskRelationTypeId;
	private String taskRelationTypeName;
	
	public TaskRelationType(int taskRelationTypeId, String taskRelationTypeName) {
		this.taskRelationTypeId = taskRelationTypeId;
		this.taskRelationTypeName = taskRelationTypeName;
	}
	
	public int getTaskRelationTypeId() {
		return taskRelationTypeId;
	}
	public void setTaskRelationTypeId(int taskRelationTypeId) {
		this.taskRelationTypeId = taskRelationTypeId;
	}
	public String getTaskRelationTypeName() {
		return taskRelationTypeName;
	}
	public void setTaskRelationTypeName(String taskRelationTypeName) {
		this.taskRelationTypeName = taskRelationTypeName;
	}
	
	
}

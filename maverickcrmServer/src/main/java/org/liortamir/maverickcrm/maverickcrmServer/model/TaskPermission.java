package org.liortamir.maverickcrm.maverickcrmServer.model;

public class TaskPermission {

	private int taskPermissionId;
	private Task task;
	private Login login;
	private PermissionType permissionType;
	
	
	public TaskPermission(int taskPermissionId, Task task, Login login, PermissionType permissionType) {
		super();
		this.taskPermissionId = taskPermissionId;
		this.task = task;
		this.login = login;
		this.permissionType = permissionType;
	}
	public int getTaskPermissionId() {
		return taskPermissionId;
	}
	public void setTaskPermissionId(int taskPermissionId) {
		this.taskPermissionId = taskPermissionId;
	}
	public Task getTask() {
		return task;
	}
	public void setTask(Task task) {
		this.task = task;
	}
	public Login getLogin() {
		return login;
	}
	public void setLogin(Login login) {
		this.login = login;
	}
	public PermissionType getPermissionType() {
		return permissionType;
	}
	public void setPermissionType(PermissionType permissionType) {
		this.permissionType = permissionType;
	}
	
	
	
	
}

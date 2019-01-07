package org.liortamir.maverickcrm.maverickcrmServer.model;

import java.util.Date;

public class TaskLog {

	private int taskLogId;
	private Date sysdate;
	private Task task;
	private Contact contact;
	private String description;
	private TaskLogType taskLogType;
	
	
	public TaskLog(int taskLogId, Date sysdate, Task task,Contact contact, String description, TaskLogType taskLogType) {
		this.taskLogId = taskLogId;
		this.sysdate = sysdate;
		this.task = task;
		this.description = description;
		this.contact = contact;
		this.taskLogType = taskLogType;
	}

	public int getTaskLogId() {
		return taskLogId;
	}

	public void setTaskLogId(int taskLogId) {
		this.taskLogId = taskLogId;
	}

	public Date getSysdate() {
		return sysdate;
	}

	public void setSysdate(Date sysdate) {
		this.sysdate = sysdate;
	}

	public Task getTask() {
		return task;
	}

	public void setTask(Task task) {
		this.task = task;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Contact getContact() {
		return contact;
	}

	public void setContact(Contact contact) {
		this.contact = contact;
	}

	public TaskLogType getTaskLogType() {
		return taskLogType;
	}

	public void setTaskLogType(TaskLogType taskLogType) {
		this.taskLogType = taskLogType;
	}
	
	
	
}

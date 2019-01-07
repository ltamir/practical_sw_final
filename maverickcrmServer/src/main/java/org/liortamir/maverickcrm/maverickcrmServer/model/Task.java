package org.liortamir.maverickcrm.maverickcrmServer.model;

import java.time.LocalDate;

/**
 * POJO depicting the task table
 * @author liort
 *
 */
public class Task {

	private int taskId;
	private TaskType taskType;
	private Contact contact;
	private String title;
	private int effort;
	private int effortUnit;
	private LocalDate dueDate;
	private Status status;
	
	public Task(int taskId, TaskType taskType, Contact contact, String title, int effort, int effortUnit, LocalDate dueDate, Status status) {
		this.taskId = taskId;
		this.taskType = taskType;
		this.contact = contact;
		this.title = title;
		this.effort = effort;
		this.effortUnit = effortUnit;
		this.dueDate = dueDate;
		this.status = status;
	}

	public int getTaskId() {
		return taskId;
	}

	public void setTaskId(int taskId) {
		this.taskId = taskId;
	}

	public TaskType getTaskType() {
		return taskType;
	}

	public void setTaskType(TaskType taskType) {
		this.taskType = taskType;
	}

	public Contact getContact() {
		return contact;
	}

	public void setContact(Contact contact) {
		this.contact = contact;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public int getEffort() {
		return effort;
	}

	public void setEffort(int effort) {
		this.effort = effort;
	}

	public int getEffortUnit() {
		return effortUnit;
	}

	public void setEffortUnit(int effortUnit) {
		this.effortUnit = effortUnit;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}
	
	
	
}

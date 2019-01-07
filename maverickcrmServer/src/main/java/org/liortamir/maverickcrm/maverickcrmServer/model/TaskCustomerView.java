package org.liortamir.maverickcrm.maverickcrmServer.model;

import java.time.LocalDate;

public class TaskCustomerView extends Task{

	private Customer customer;
	
	public TaskCustomerView(int taskId, TaskType taskType, Contact contact, String title, int effort, int effortUnit,
			LocalDate dueDate, Status status) {
		super(taskId, taskType, contact, title, effort, effortUnit, dueDate, status);

	}
	
	public TaskCustomerView(Task task, Customer customer){
		super(task.getTaskId(), task.getTaskType(), task.getContact(), task.getTitle(), task.getEffort(), task.getEffortUnit(), task.getDueDate(), task.getStatus());
		this.customer = customer;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

}

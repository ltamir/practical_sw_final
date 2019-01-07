package org.liortamir.maverickcrm.maverickcrmServer.model;

/**
 * CustomerTask is the connection between a top task and a customer.<br>
 * The Task must be of the type Project
 * @author liort
 *
 */
public class CustomerTask {

	private int customerTaskId;
	private Customer customer;
	private Task task;
	
	public CustomerTask(int customerTaskId, Customer customer, Task task) {

		this.customerTaskId = customerTaskId;
		this.customer = customer;
		this.task = task;
	}
	
	public int getCustomerTaskId() {
		return customerTaskId;
	}
	public void setCustomerTaskId(int customerTaskId) {
		this.customerTaskId = customerTaskId;
	}
	public Customer getCustomer() {
		return customer;
	}
	public void setCustomer(Customer customer) {
		this.customer = customer;
	}
	public Task getTask() {
		return task;
	}
	public void setTask(Task task) {
		this.task = task;
	}
	
	
}

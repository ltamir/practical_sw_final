package org.liortamir.maverickcrm.maverickcrmServer.infra;

public enum ActionEnum {

	ACT_NONE,	//0
	ACT_AUTH,	//1
	ACT_ALL,	//2
	ACT_SINGLE,	//3
	ACT_LOGIN_CONTACT_ALL,	//4
	ACT_RELATION_PARENTS,	//5
	ACT_CUSTOMER_TASK_BY_CUSTOMER,	//6
	ACT_RELATION_CHILDREN,	//7
	ACT_CUSTOMER_BY_CONTACT,	//8
	ACT_CUSTOMER_TASK_BY_TASK,	//9
	ACT_CUSTOMER_NOT_LINKED_TASK,	//10
	ACT_CUSTOMER_NOT_LINKED_CONTACT, //11
	ACT_CONTACT_BY_CUSTOMER,	//12
	ACT_BY_CUSTOMER,			//13
	ACT_CUSTOMER_LINKED_BY_TASK;	//14
}

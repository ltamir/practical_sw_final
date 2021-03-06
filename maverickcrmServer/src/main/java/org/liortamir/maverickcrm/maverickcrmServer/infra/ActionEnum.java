package org.liortamir.maverickcrm.maverickcrmServer.infra;

public enum ActionEnum {

	NONE,							//0
	DO_AUTH,						//1
	GET_ALL,						//2
	GET_SINGLE,						//3
	GET_LOGIN_CONTACT_ALL,			//4
	GET_RELATION_PARENTS,			//5
	CUSTOMERTASK_BY_CUSTOMER,		//6
	GET_TASK_CHILDREN,				//7
	GET_CUSTOMER_BY_CONTACT,		//8
	CUSTOMERTASK_BY_TASK,			//9
	CUSTOMER_NOT_LINKED_TASK,		//10
	CUSTOMER_NOT_LINKED_CONTACT, 	//11
	CONTACT_BY_CUSTOMER,			//12
	ADDRESS_BY_CUSTOMER,			//13
	CUSTOMER_LINKED_BY_TASK,		//14
	DO_LOGOUT,						//15
	GET_LOGGED_IN,					//16
	GET_ATTACHMENT,					//17
	PERMISSION_BY_TASK,				//18
	PERMISSION_BY_TASK_AND_LOGIN,	//19
	LOGIN_BY_CONTACT,				//20
	GET_TOTAL_HOURS,				//21
	GENERATE_HASH,					//22
	TIMELINE_PROJECTS,				//23
	TIMELINE_SUB_TASKS,				//24
	TASKLIST_SORT;					//25
}

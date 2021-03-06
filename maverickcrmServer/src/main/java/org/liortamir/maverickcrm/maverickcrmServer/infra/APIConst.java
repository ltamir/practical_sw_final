package org.liortamir.maverickcrm.maverickcrmServer.infra;

public class APIConst {
	
	public static final String FLD_CUSTOMER_ID = "customerId";
	public static final String FLD_CUSTOMER_NAME = "customerName";
	public static final String FLD_CUSTOMER_NOTES = "customerNotes";
	
	public static final String FLD_CUSTOMERTASK_ID = "customerTaskId";
	public static final String FLD_CUSTOMERTASK_CUSTOMER_ID = "customerId";
	public static final String FLD_CUSTOMERTASK_TASK_ID = "taskId";
	
	public static final String FLD_CONTACT_ID = "contactId";
	public static final String FLD_CONTACT_FIRST_NAME = "firstName";
	public static final String FLD_CONTACT_LAST_NAME = "lastName";
	public static final String FLD_CONTACT_OFFICE_PHONE = "officePhone";
	public static final String FLD_CONTACT_CELL_PHONE = "mobilePhone";
	public static final String FLD_CONTACT_EMAIL = "email";
	public static final String FLD_CONTACT_NOTES = "notes";
	
	public static final String FLD_TASKLOG_ID = "taskLogId";
	public static final String FLD_TASKLOG_SYSDATE = "sysdate";
	public static final String FLD_TASKLOG_TASK_ID = "taskId";
	public static final String FLD_TASKLOG_CONTACT_ID = "contactId";
	public static final String FLD_TASKLOG_DESCRIPTION = "description";
	public static final String FLD_TASKLOG_TASKLOGTYPE_ID = "taskLogTypeId";
	
	public static final String FLD_TASKLOGTYPE_ID = "taskLogTypeId";
	
	public static final String FLD_TASKRELATION_ID = "taskRelationId";
	public static final String FLD_TASKRELATION_PARENT_TASK_ID = "parentTaskId";
	public static final String FLD_TASKRELATION_CHILD_TASK_ID = "childTaskId";
	public static final String FLD_TASKRELATION_ROOT_TASK_ID = "rootTaskId";
	public static final String FLD_TASKRELATION_TASKRELATIONTYPE_ID = "taskRelationTypeId";
	
	public static final String TASKTYPE_ID = "taskTypeId";
	
	public static final String FLD_TASK_ID = "taskId";
	public static final String FLD_TASK_TASKTYPEID = "taskTypeId";
	public static final String FLD_TASK_CONTACT_ID = "contactId";
	public static final String FLD_TASK_TITLE = "title";
	public static final String FLD_TASK_EFFORT = "effort";
	public static final String FLD_TASK_EFFORT_UNIT = "effortUnit";
	public static final String FLD_TASK_DUE_DATE = "dueDate";
	public static final String FLD_TASK_STATUS_ID = "statusId";
	
	public static final String FLD_ADDRESS_ID = "addressId";
	public static final String FLD_ADDRESS_STREET = "street";
	public static final String FLD_ADDRESS_HOUSENUM = "houseNum";
	public static final String FLD_ADDRESS_CITY = "city";
	public static final String FLD_ADDRESS_COUNTRY = "country";
	
	public static final String FLD_ASSOCIATION_ID = "associationId";
	public static final String FLD_ASSOCIATION_CONTACTID = "contactId";
	public static final String FLD_ASSOCIATION_CUSTOMERID = "customerId";
	public static final String FLD_ASSOCIATION_CONTACT_TYPE_ID = "contactTypeId";
	public static final String FLD_ASSOCIATION_ADDRESS_ID = "addressId";
	
	public static final String FLD_ATTACHMENT_ID = "attachmentId";
	public static final String FLD_ATTACHMENT_ATTACHMENT_TYPE_ID = "attachmentTypeId";
	public static final String FLD_ATTACHMENT_TASK_LOG_ID = "taskLogId";
	public static final String FLD_ATTACHMENT_FILENAME = "fileName";
	public static final String FLD_ATTACHMENT_FILEPATH = "filePath";
	public static final String FLD_ATTACHMENT_WEB_NOTES = "attachmentNotes";
	
	public static final String FLD_LOGIN_ID = "loginId";
	public static final String FLD_LOGIN_USERNAME = "username";
	public static final String FLD_LOGIN_PASSWORD = "password";
	public static final String FLD_LOGIN_CONTACT_ID = "contactId";
	
	public static final String FLD_TASKPERMISSION_ID = "taskpermissionId";
	public static final String FLD_TASKPERMISSION_TASKID = "taskId";
	public static final String FLD_TASKPERMISSION_LOGINID = "loginId";
	public static final String FLD_TASKPERMISSION_PERMISSIONTYPEID = "permissiontypeId";
	
	public static final String FLD_PERMISSIONTYPE_ID = "permissiontypeId";
	public static final String FLD_PERMISSIONTYPE_NAME = "permissiontypeName";

	public static final String PARAM_ACTION_ID = "actionId";
	public static final String CONTENT_TYPE = "application/json; charset=utf-8";	
	
}

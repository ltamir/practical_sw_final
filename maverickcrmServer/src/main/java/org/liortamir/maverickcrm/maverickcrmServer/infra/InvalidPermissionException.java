package org.liortamir.maverickcrm.maverickcrmServer.infra;

public class InvalidPermissionException extends AbstractMaverickException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1745988792950576244L;
	private static final String ERROR = "You do not have permissions to view this task";
	private static final String TAG = ": ";
	
	public InvalidPermissionException(String error) {
		super(error);
	}
	public InvalidPermissionException(int taskId, int loginId) {
		super(APIConst.FLD_TASK_ID + TAG + taskId + APIConst.FLD_LOGIN_ID + TAG + loginId);
	}
	@Override
	public String getUserMessage() {
		return ERROR;
	}

	
}

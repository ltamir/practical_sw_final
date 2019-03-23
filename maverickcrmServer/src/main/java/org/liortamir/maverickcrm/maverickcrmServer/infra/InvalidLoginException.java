package org.liortamir.maverickcrm.maverickcrmServer.infra;

public class InvalidLoginException extends AbstractMaverickException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1175810870045292018L;
	private String error = "Login or password fields are invalid";
	
	public InvalidLoginException(String error) {
		super(error);
		this.error = error;
	}
	
	@Override
	public String getUserMessage() {
		return error;
	}
}

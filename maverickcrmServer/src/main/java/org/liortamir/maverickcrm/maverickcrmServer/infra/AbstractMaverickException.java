package org.liortamir.maverickcrm.maverickcrmServer.infra;

public abstract class AbstractMaverickException extends Exception implements IUserExceptionMessage{

	/**
	 * 
	 */
	private static final long serialVersionUID = 2981649817235374584L;

	
	public AbstractMaverickException(String error){
		super(error);
	}
	public AbstractMaverickException(){

	}
	

	
	
}

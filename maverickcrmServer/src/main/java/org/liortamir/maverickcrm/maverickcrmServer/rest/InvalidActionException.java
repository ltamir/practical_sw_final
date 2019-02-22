package org.liortamir.maverickcrm.maverickcrmServer.rest;

import org.liortamir.maverickcrm.maverickcrmServer.infra.AbstractMaverickException;

public class InvalidActionException extends AbstractMaverickException {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5765008476214462851L;
	private static final String ERROR = "Invalid action id for request: ";
	private final String actionId;


	public InvalidActionException(int actionId) {
		super("Invalid action id for request: " + actionId);
		this.actionId = String.valueOf(actionId);;
	}
	
	public InvalidActionException(String actionId) {
		super("Invalid action id for request: " + actionId);
		this.actionId = actionId;
	}

	@Override
	public String getUserMessage() {
		return ERROR + actionId;
	}
}

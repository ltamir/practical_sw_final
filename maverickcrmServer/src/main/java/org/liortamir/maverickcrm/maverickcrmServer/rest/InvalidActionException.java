package org.liortamir.maverickcrm.maverickcrmServer.rest;

public class InvalidActionException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5765008476214462851L;

	public InvalidActionException(int actionId) {
		super("Invalid action id for request: " + actionId);
	}
	
	public InvalidActionException(String actionId) {
		super("Invalid action id for request: " + actionId);
	}
}

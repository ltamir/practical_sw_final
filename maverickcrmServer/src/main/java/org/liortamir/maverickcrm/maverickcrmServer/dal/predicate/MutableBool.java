package org.liortamir.maverickcrm.maverickcrmServer.dal.predicate;

/**
 * Class representing mutable boolean
 * @author liort
 *
 */
public class MutableBool {
	private boolean value;
	
	// ***** constructors ***** //
	public MutableBool() {}
	
	public MutableBool(boolean value) {
		set(value);
	}
	
	/**
	 * Set the boolean value
	 * @param value
	 */
	public void set(boolean value) {
		this.value = value;
	}
	
	/**
	 * Set the boolean value to true
	 * @param value
	 */
	public void flag() {
		this.value = true;
	}	
	
	/**
	 * Set the boolean value to false
	 * @param value
	 */
	public void unflag() {
		this.value = false;
	}	
	
	/**
	 * perform logical AND on the boolean value
	 * @param value
	 */
	public void add(boolean value) {
		this.value = this.value & value;
	}
	
	/**
	 * return the boolean value
	 * @return
	 */
	public boolean get() {
		return this.value;
	}
}

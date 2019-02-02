package org.liortamir.maverickcrm.maverickcrmServer.dal.predicate;

/**
 * Class representing mutable integer
 * @author liort
 *
 */
public class MutableInt {

	private int value;
	
	// ***** constructors ***** //
	public MutableInt() {}
	
	public MutableInt(int value) {
		set(value);
	}
	
	/**
	 * Set the int value
	 * @param value
	 */
	public void set(int value) {
		this.value = value;
	}
	
	/**
	 * Increment / decrement the int value
	 * @param value
	 */
	public void add(int value) {
		this.value += value;
	}
	
	/**
	 * return the int value
	 * @return
	 */
	public int get() {
		return this.value;
	}
}

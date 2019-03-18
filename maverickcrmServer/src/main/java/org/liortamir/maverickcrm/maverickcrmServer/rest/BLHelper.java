package org.liortamir.maverickcrm.maverickcrmServer.rest;

public class BLHelper {

	public static int getEffortHours(int effortUnit, int effort){
		int hours = 0;
		switch(effortUnit){
		case 1:
			hours = effort;
			break;
		case 2:
			hours = daysToHours(effort);
			break;
		case 3:
			hours = monthsToHours(effort);
			break;
		}	
		return hours;
	}
	
	public static int daysToHours(int effort){
		int hours = 0;
		hours = effort * 9;
		return hours;
	}
	
	public static int monthsToHours(int effort){
		int hours = 0;
		hours = effort * 9 * 20;
		return hours;
	}	
	
}

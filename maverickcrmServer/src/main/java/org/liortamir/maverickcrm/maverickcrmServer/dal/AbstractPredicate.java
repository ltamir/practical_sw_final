package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public abstract class AbstractPredicate <T>{

	final static String WHERE = " where ";
	final static String AND = " and ";
	
	protected final int paramCount;
	protected final String predicateString;
	protected final static String NONE = "";
	protected final T ALL;
	
	protected T param;
	protected int paramPosition;
	protected boolean hasPredicate = false; 
	
	public AbstractPredicate(T all, String predicate, int paramIndex) {
		this.predicateString = predicate;
		this.ALL = all;
		this.paramCount = paramIndex;
	}

	protected boolean hasPredicate(T value) {
		if(ALL != null && !value.equals(ALL))
			return true;
		return false;
	}
	
	public int prepare(T value, int totalParams, StringBuilder sb) {
		
		if(hasPredicate(value)) {
			if(totalParams == 0)
				sb.append(WHERE);
			else
				sb.append(AND);
			
			sb.append(predicateString);
			this.hasPredicate = true;
			this.param = value;
			this.paramPosition = totalParams;
			return paramPosition + this.paramCount;
		}
		sb.append(NONE);
		return 0;
	}
	
	public void set(PreparedStatement ps)  throws SQLException{
		if(!this.hasPredicate) return;
		
		for(int i = 1; i <= this.paramCount; i++) {
			setParam(ps, i+paramPosition, this.param);
		}

	}
	
	protected abstract void setParam(PreparedStatement ps, int pos, T value) throws SQLException;
}

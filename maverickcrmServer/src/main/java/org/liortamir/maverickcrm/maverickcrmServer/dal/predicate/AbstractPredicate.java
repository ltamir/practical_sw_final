package org.liortamir.maverickcrm.maverickcrmServer.dal.predicate;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public abstract class AbstractPredicate <T>{

	final static String WHERE = " where ";
	final static String AND = " and ";
	
	protected final int paramCount;
	protected String predicateString;
	protected final static String NONE = "";
	protected final T ALL;
	
//	protected int paramPosition;
	
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
	
	public void prepare(T value, MutableBool whereUsed, StringBuilder sb) {
		
		if(hasPredicate(value)) {
			if(!whereUsed.get()) {
				sb.append(WHERE);
				whereUsed.flag();
			}
			else
				sb.append(AND);
			sb.append(predicateString);
		}
		sb.append(NONE);
	}
	
	public void set(PreparedStatement ps, MutableInt paramPosition, T value)  throws SQLException{
		if(!this.hasPredicate(value))return;
		
		for(int i = 1; i <= this.paramCount; i++) {
			setParam(ps, i+paramPosition.get(), value);
		}
		paramPosition.add(paramCount);
	}
	
	
	protected abstract void setParam(PreparedStatement ps, int pos, T value) throws SQLException;
}

package org.liortamir.maverickcrm.maverickcrmServer.dal.predicate;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TaskStatusPredicate extends IntPredicate {

	private String allOpen = " statusId!=? ";
//	private String allClosed = "";
			
	public TaskStatusPredicate(Integer all, String predicate, int paramIndex) {
		super(all, predicate, paramIndex);
	}

	@Override
	public void prepare(Integer value, MutableBool whereUsed, StringBuilder sb) {
		if(value != 4 && value > 0)
			predicateString = allOpen;
		super.prepare(value, whereUsed, sb);
	}

	@Override
	protected void setParam(PreparedStatement ps, int pos, Integer value) throws SQLException {
		if(value != 4 && value > 0)
			value = 4;
		super.setParam(ps, pos, value);
	}

	
}

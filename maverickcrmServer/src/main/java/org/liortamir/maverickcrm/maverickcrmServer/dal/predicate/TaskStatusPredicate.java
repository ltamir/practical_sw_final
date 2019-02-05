package org.liortamir.maverickcrm.maverickcrmServer.dal.predicate;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TaskStatusPredicate extends IntPredicate {

	private String allOpen = " statusId!=? ";
	private String allClosed = " statusId=? ";
			
	public TaskStatusPredicate(Integer all, String predicate, int paramIndex) {
		super(all, predicate, paramIndex);
	}

	@Override
	public void prepare(Integer value, MutableBool whereUsed, StringBuilder sb) {
		String statusClause;
		if(value != 4 && value > 0)
			statusClause = allOpen;
		else
			statusClause = allClosed;
		if(hasPredicate(value)) {
			if(!whereUsed.get()) {
				sb.append(WHERE);
				whereUsed.flag();
			}
			else
				sb.append(AND);
			sb.append(statusClause);
		}
		sb.append(NONE);
	}

	@Override
	protected void setParam(PreparedStatement ps, int pos, Integer value) throws SQLException {
		if(value != 4 && value > 0)
			value = 4;
		super.setParam(ps, pos, value);
	}

	
}

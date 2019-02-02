package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DatePredicate extends AbstractPredicate<Date> {

	public DatePredicate(Date all, String predicate, int paramIndex) {
		super(all, predicate, paramIndex);
	}

	@Override
	protected void setParam(PreparedStatement ps, int pos, Date value) throws SQLException {
		ps.setDate(pos, value);
		
	}

}

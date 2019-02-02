package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public class IntPredicate extends AbstractPredicate<Integer> {

	public IntPredicate(Integer all, String predicate, int paramIndex) {
		super(all, predicate, paramIndex);
	}

	@Override
	protected void setParam(PreparedStatement ps, int pos, Integer value) throws SQLException {
			ps.setInt(pos, value);
	}


}

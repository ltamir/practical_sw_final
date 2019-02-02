package org.liortamir.maverickcrm.maverickcrmServer.dal.predicate;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public class BoolPredicate extends AbstractPredicate<Boolean>{

	public BoolPredicate(Boolean all, String predicate, int paramIndex) {
		super(all, predicate, paramIndex);
	}

	@Override
	public void setParam(PreparedStatement ps, int pos, Boolean value) throws SQLException {
			ps.setBoolean(pos, value);
	}

}

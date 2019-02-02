package org.liortamir.maverickcrm.maverickcrmServer.dal;

import java.util.HashMap;
import java.util.Map;

public class PredicateContainer {

	private Map<String, AbstractPredicate> predicateMap = new HashMap<>();
	
	public <T> void add(String name, AbstractPredicate<T> predicate) {
		predicateMap.put(name, predicate);
	}
	
	public <T extends AbstractPredicate> AbstractPredicate get(String name){
		return predicateMap.get(name);
	}
	
}

package com.example.demotech.base.helper;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.*;

public class QueryHelper<T> {
    private final EntityManager em;
    private final String alias;
    private final StringBuilder selectJpql;
    private final StringBuilder countJpql;
    private final Map<String, Object> params = new HashMap<>();

    public QueryHelper(EntityManager em, String selectClause, String countClause, String alias) {
        this.em = em;
        this.alias = alias;
        this.selectJpql = new StringBuilder(selectClause);
        this.countJpql = new StringBuilder(countClause);
    }

    public QueryHelper<T> like(String field, String value, String paramName) {
        if (value != null && !value.isBlank()) {
            String condition = String.format("AND %s.%s LIKE :%s ", alias, field, paramName);
            selectJpql.append(condition);
            countJpql.append(condition);
            params.put(paramName, "%" + value + "%");
        }
        return this;
    }

    public QueryHelper<T> orLike(String[] fields, String value, String paramName) {
        if (value != null && !value.isBlank()) {
            StringBuilder orCondition = new StringBuilder("AND (");
            for (int i = 0; i < fields.length; i++) {
                if (i > 0) orCondition.append(" OR ");
                orCondition.append(alias).append(".").append(fields[i]).append(" LIKE :").append(paramName);
            }
            orCondition.append(") ");
            selectJpql.append(orCondition);
            countJpql.append(orCondition);
            params.put(paramName, "%" + value + "%");
        }
        return this;
    }

    public QueryHelper<T> equal(String field, Object value, String paramName) {
        if (value != null) {
            String condition = String.format("AND %s.%s = :%s ", alias, field, paramName);
            selectJpql.append(condition);
            countJpql.append(condition);
            params.put(paramName, value);
        }
        return this;
    }

    public Result<T> build(int pageIndex, int pageSize, Class<T> dtoClass) {
        TypedQuery<T> query = em.createQuery(selectJpql.toString(), dtoClass);
        TypedQuery<Long> countQuery = em.createQuery(countJpql.toString(), Long.class);

        params.forEach((k, v) -> {
            query.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        query.setFirstResult(pageIndex * pageSize);
        query.setMaxResults(pageSize);

        return new Result<>(query.getResultList(), countQuery.getSingleResult());
    }

    public record Result<T>(List<T> list, long total) {
    }

    public void isNullOrEqual(String field, String paramName) {
        // nếu không có giá trị thì mặc định filter voided IS NULL OR voided = false
        String condition = String.format("AND (%s.%s IS NULL OR %s.%s = false) ", alias, field, alias, field);
        selectJpql.append(condition);
        countJpql.append(condition);
    }

}

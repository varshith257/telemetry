import { DynamicFilter, Operator } from "../dto/material-view-fetch.dto";

export function whereClauseBuilder(filters: Array<DynamicFilter>): string {
    let whereClause = '';
    if (filters) {
        for (const filter of filters) {
            whereClause += `\nAND ${filter.column} ${Operator[filter.operator]} ${typeof(filter.value) === 'string' ? `'${filter.value}'` : `${filter.value}`}`
        }
    }
    return whereClause;
}
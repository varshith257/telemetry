import { DynamicFilter, Operator } from "../dto/material-view-fetch.dto";

export function whereClauseBuilder(filters: Array<DynamicFilter>): { whereStatement: string, params: Record<string, any> } {
    let whereClause = '';
    let params = {};
    if (filters) {
        let count = 0;
        for(let filter of filters) {
            whereClause += `\nAND ${filter.column} ${Operator[filter.operator]} {filter${count}: String}`;
            params[`filter${count}`] = filter.value;
            count++;
        }
    }
    return {
        whereStatement : whereClause,
        params : params
    };
}
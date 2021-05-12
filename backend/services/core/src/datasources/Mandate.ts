import { UserInputError } from 'apollo-server';
import { dbUtils } from 'dsek-shared';
import * as gql from '../types/graphql';
import * as sql from '../types/mysql';

export default class MandateAPI extends dbUtils.KnexDataSource {

    private convertMandate(mandate: sql.DbMandate): gql.Mandate {
        const m: gql.Mandate = {
            position: { id: mandate.position_id },
            member: { id: mandate.member_id },
            start: mandate.start_date,
            end: mandate.end_date,
        }
        return m;
    }

    async getMandates(filter?: gql.MandateFilter): Promise<gql.Mandate[]> {
        const res = await this.knex<sql.DbMandate>('mandates').select('*').where(filter || {})
        return res.map(m => this.convertMandate(m));
    }
}
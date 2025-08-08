declare module '@agung_dhewe/pgsqlc' {
  export interface SqlCommand {
    text: string;
    values: any[];
  }

  export interface Pgsqlc {
    readonly db: any;
    connect(db: any): void;

    createWhereClause(
      criteria: Record<string, any>,
      searchMap?: Record<string, string>
    ): string;

    createSqlSelect(param: Record<string, any>): SqlCommand;

    createInsertCommand(
      tablename: string,
      data: Record<string, any>,
      keys?: string[]
    ): SqlCommand;

    createUpdateCommand(
      tablename: string,
      data: Record<string, any>,
      keys?: string[]
    ): SqlCommand;

    createDeleteCommand(
      tablename: string,
      keys: Record<string, any>
    ): SqlCommand;
  }

  const pgsqlc: Pgsqlc;
  export default pgsqlc;
}
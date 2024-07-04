export interface SQLDatabaseWrapper {
  query(queryString: string, values?: unknown[]): Promise<{ rows: any[] }>
}

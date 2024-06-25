export interface SQLDatabaseWrapper {
  query(queryString: string): Promise<{ rows: any[] }>
}

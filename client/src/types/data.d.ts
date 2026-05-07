/**
 * Type of any entry or record as it is
 * sent to the server, each one can have an id and different properties.
 */
export type ClientEntry = {
  id?: string
  [key: string]: any
}

/**
 * Type of any entry or record as it is
 * received from the server, each one has an id and different properties.
 */
export type ServerEntry = {
  id: string
  [key: string]: any
}

/**
 * Payload sent to the server with data
 * and information about the resource where
 * the data will be stored
 */
export type Payload = {
  targetResource?: {
    dbName: string
    fileId: string
  }
  data: ClientEntry | ClientEntry[]
}

/**
 * Type of the object that contains the tables
 * of data client-side.
 */
export type DataTables = {
  [tableName: string]: ServerEntry[]
}

/**
 * Interface of the server responses.
 * Each one has a success property, a messsage
 * with extra information about the process done server side and data, which is an array of entries.
 */
export interface Response {
  success: boolean;
  message: string;
  data: ServerEntry | ServerEntry[] | null;
}
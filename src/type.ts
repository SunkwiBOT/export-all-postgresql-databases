export interface optionsType {
  env: {
    PGPASSWORD: string;
  };
}

export interface databaseObjectType {
  hostname: string;
  port: string;
  username: string;
  password: string;
}

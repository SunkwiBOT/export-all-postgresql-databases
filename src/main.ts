import { exec } from 'child_process';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { optionsType } from './type';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const DATA_PATH = process.env.DATA_PATH || './data';
const PG_DUMP_CMD_PATH = process.env.PG_DUMP_PATH || 'pg_dump';
const PSQL_CMD_PATH = process.env.PSQL_PATH || 'psql';

if (!DATABASE_URL) {
  console.error('env DATABASE_URL is not defined');
  process.exit(1);
}

const DATABASE_DETAILS = new URL(DATABASE_URL);

const executeCommand = async (command: string, options: optionsType): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(`Execution error: ${error || stderr}`);
        return reject(error || stderr);
      }
      resolve(stdout.trim().split('\n'));
    });
  });
};

const generateUniqueFilename = (baseName: string): string => {
  let counter = 1;
  let fileName = baseName;

  while (existsSync(`${DATA_PATH}/${fileName}.sql`)) {
    fileName = `${baseName}_${counter}`;
    counter++;
  }

  return fileName;
};

const exportDatabase = async (database: string): Promise<void> => {
  const uniqueFilename = generateUniqueFilename(database);
  const command = `${PG_DUMP_CMD_PATH} --no-owner -h ${DATABASE_DETAILS.hostname} -p ${DATABASE_DETAILS.port} -U ${DATABASE_DETAILS.username} -f ${DATA_PATH}/${uniqueFilename}.sql -F p ${database}`;

  await executeCommand(command, { env: { PGPASSWORD: DATABASE_DETAILS.password } });
};

const fetchAllDatabases = async (): Promise<string[]> => {
  const listDatabasesCommand = `${PSQL_CMD_PATH} -h ${DATABASE_DETAILS.hostname} -p ${DATABASE_DETAILS.port} -U ${DATABASE_DETAILS.username} -t -c "SELECT datname FROM pg_database WHERE datistemplate = false;"`;

  return (await executeCommand(listDatabasesCommand, { env: { PGPASSWORD: DATABASE_DETAILS.password } })).map((e) => e.trim()).filter((f) => f !== DATABASE_DETAILS.username);
};

const main = async () => {
  console.log('Initiating backup directory if needed ...');
  await mkdir(DATA_PATH, { recursive: true });

  console.log('Retrieving the list of databases ...');
  const databases = await fetchAllDatabases();

  for (const database of databases) {
    console.log(`Exporting database [${database}] ...`);
    try {
      await exportDatabase(database);
    } catch (error) {
      console.error(`Failed to export database [${database}]. Error: ${error}`);
    }
  }

  console.log('Completed exporting all databases.');
};

main().catch((error) => {
  console.error('Unexpected error:', error);
});

# 🗄️ Export All PostgreSQL Databases

This project allows for exporting all databases from a PostgreSQL server into individual SQL files. Each SQL file represents a database from the server.

## 🛠️ Installation

1. Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2. Clone this repository:

   ```bash
   git clone https://github.com/sunkwibot/export-all-postgresql-databases.git
   ```

3. Navigate to the project folder and install the required packages:

   ```bash
   cd export-all-postgresql-databases
   yarn install
   ```

## ⚙️ Configuration

Before running the script, you need to set the URL of your PostgreSQL database. This URL, along with paths for `pg_dump`, `psql`, and your desired data directory, should be defined in a `.env` file at the root of the project.

**Example .env configuration**:
```
DATABASE_URL="postgresql://username:password@127.0.0.1:5432"
DATA_PATH="./data"
PG_DUMP_CMD_PATH="/usr/bin/pg_dump"
PSQL_CMD_PATH="/usr/bin/psql"
```

Replace `username`, `password`, `hostname`, and `port` with your connection details. Set `DATA_PATH`, `PG_DUMP_CMD_PATH`, and `PSQL_CMD_PATH` to their respective paths. If these paths are not set, the script will default to certain behaviors described in the code.

## 🚀 Usage

After configuring the database URL, you can build and run the bot with the following commands:

```bash
yarn build
yarn start
```

Alternatively, for development purposes, you can use:

```bash
yarn dev
```

The script will create a `data` folder (or the folder specified by `DATA_PATH` if it doesn't already exist) and begin exporting each database into separate `.sql` files. If a file with the same name already exists, a number will be appended to the filename to avoid any conflict.

---

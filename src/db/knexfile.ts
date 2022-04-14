import type { Knex } from "knex";
import path from 'path';

const migDir = path.join(__dirname, 'migrations');
const seedDir = path.join(__dirname, 'seeds');

console.log(migDir, seedDir);

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "better-sqlite3",
    pool: {
      afterCreate(conn: any, done: any) {
        try {
          conn.pragma('foreign_keys = ON');
          done(null, conn);
        } catch (err) {
          done(err, conn);
        }
      }
    },
    connection: {
      filename: "./dev.sqlite3"
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'migrations',
      stub: 'migration.stub.ts'
    }
  },
  test: {
    client: "better-sqlite3",
    pool: {
      afterCreate(conn: any, done: any) {
        try {
          conn.pragma('foreign_keys = ON');
          done(null, conn);
        } catch (err) {
          done(err, conn);
        }
      }
    },
    connection: {
      filename: ":memory:"
    },
    useNullAsDefault: true,
    migrations: {
      directory: migDir
    },
    seeds: {
      directory: seedDir
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

export default config;

export default [
  {
    "statements": [
      "CREATE TABLE \"users\" (\n  \"id\" TEXT NOT NULL,\n  \"username\" TEXT NOT NULL,\n  \"email\" TEXT NOT NULL,\n  \"avatar\" TEXT,\n  \"password\" TEXT NOT NULL,\n  \"birthdate\" TEXT,\n  \"registeredat\" TEXT,\n  CONSTRAINT \"users_pkey\" PRIMARY KEY (\"id\")\n) WITHOUT ROWID;\n",
      "INSERT OR IGNORE INTO _electric_trigger_settings (namespace, tablename, flag) VALUES ('main', 'users', 1);",
      "DROP TRIGGER IF EXISTS update_ensure_main_users_primarykey;",
      "CREATE TRIGGER update_ensure_main_users_primarykey\n  BEFORE UPDATE ON \"main\".\"users\"\nBEGIN\n  SELECT\n    CASE\n      WHEN old.\"id\" != new.\"id\" THEN\n      \t\tRAISE (ABORT, 'cannot change the value of column id as it belongs to the primary key')\n    END;\nEND;",
      "DROP TRIGGER IF EXISTS insert_main_users_into_oplog;",
      "CREATE TRIGGER insert_main_users_into_oplog\n   AFTER INSERT ON \"main\".\"users\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'users')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'users', 'INSERT', json_patch('{}', json_object('id', new.\"id\")), json_object('avatar', new.\"avatar\", 'birthdate', new.\"birthdate\", 'email', new.\"email\", 'id', new.\"id\", 'password', new.\"password\", 'registeredat', new.\"registeredat\", 'username', new.\"username\"), NULL, NULL);\nEND;",
      "DROP TRIGGER IF EXISTS update_main_users_into_oplog;",
      "CREATE TRIGGER update_main_users_into_oplog\n   AFTER UPDATE ON \"main\".\"users\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'users')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'users', 'UPDATE', json_patch('{}', json_object('id', new.\"id\")), json_object('avatar', new.\"avatar\", 'birthdate', new.\"birthdate\", 'email', new.\"email\", 'id', new.\"id\", 'password', new.\"password\", 'registeredat', new.\"registeredat\", 'username', new.\"username\"), json_object('avatar', old.\"avatar\", 'birthdate', old.\"birthdate\", 'email', old.\"email\", 'id', old.\"id\", 'password', old.\"password\", 'registeredat', old.\"registeredat\", 'username', old.\"username\"), NULL);\nEND;",
      "DROP TRIGGER IF EXISTS delete_main_users_into_oplog;",
      "CREATE TRIGGER delete_main_users_into_oplog\n   AFTER DELETE ON \"main\".\"users\"\n   WHEN 1 = (SELECT flag from _electric_trigger_settings WHERE namespace = 'main' AND tablename = 'users')\nBEGIN\n  INSERT INTO _electric_oplog (namespace, tablename, optype, primaryKey, newRow, oldRow, timestamp)\n  VALUES ('main', 'users', 'DELETE', json_patch('{}', json_object('id', old.\"id\")), NULL, json_object('avatar', old.\"avatar\", 'birthdate', old.\"birthdate\", 'email', old.\"email\", 'id', old.\"id\", 'password', old.\"password\", 'registeredat', old.\"registeredat\", 'username', old.\"username\"), NULL);\nEND;"
    ],
    "version": "2"
  }
]
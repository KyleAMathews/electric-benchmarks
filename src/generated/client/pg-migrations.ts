export default [
  {
    "statements": [
      "CREATE TABLE users (\n    id uuid NOT NULL,\n    username text NOT NULL,\n    email text NOT NULL,\n    avatar text,\n    password text NOT NULL,\n    birthdate date,\n    registeredat timestamp without time zone,\n    CONSTRAINT users_pkey PRIMARY KEY (id)\n)",
      "INSERT INTO \"public\".\"_electric_trigger_settings\" (\"namespace\", \"tablename\", \"flag\")\n  VALUES ('public', 'users', 1)\n  ON CONFLICT DO NOTHING;",
      "DROP TRIGGER IF EXISTS update_ensure_public_users_primarykey ON \"public\".\"users\";",
      "CREATE OR REPLACE FUNCTION update_ensure_public_users_primarykey_function()\nRETURNS TRIGGER AS $$\nBEGIN\n  IF OLD.\"id\" IS DISTINCT FROM NEW.\"id\" THEN\n    RAISE EXCEPTION 'Cannot change the value of column id as it belongs to the primary key';\n  END IF;\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;",
      "CREATE TRIGGER update_ensure_public_users_primarykey\n  BEFORE UPDATE ON \"public\".\"users\"\n    FOR EACH ROW\n      EXECUTE FUNCTION update_ensure_public_users_primarykey_function();",
      "DROP TRIGGER IF EXISTS insert_public_users_into_oplog ON \"public\".\"users\";",
      "    CREATE OR REPLACE FUNCTION insert_public_users_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'users';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'users',\n            'INSERT',\n            json_strip_nulls(json_build_object('id', new.\"id\")),\n            jsonb_build_object('avatar', new.\"avatar\", 'birthdate', new.\"birthdate\", 'email', new.\"email\", 'id', new.\"id\", 'password', new.\"password\", 'registeredat', new.\"registeredat\", 'username', new.\"username\"),\n            NULL,\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER insert_public_users_into_oplog\n  AFTER INSERT ON \"public\".\"users\"\n    FOR EACH ROW\n      EXECUTE FUNCTION insert_public_users_into_oplog_function();",
      "DROP TRIGGER IF EXISTS update_public_users_into_oplog ON \"public\".\"users\";",
      "    CREATE OR REPLACE FUNCTION update_public_users_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'users';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'users',\n            'UPDATE',\n            json_strip_nulls(json_build_object('id', new.\"id\")),\n            jsonb_build_object('avatar', new.\"avatar\", 'birthdate', new.\"birthdate\", 'email', new.\"email\", 'id', new.\"id\", 'password', new.\"password\", 'registeredat', new.\"registeredat\", 'username', new.\"username\"),\n            jsonb_build_object('avatar', old.\"avatar\", 'birthdate', old.\"birthdate\", 'email', old.\"email\", 'id', old.\"id\", 'password', old.\"password\", 'registeredat', old.\"registeredat\", 'username', old.\"username\"),\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER update_public_users_into_oplog\n  AFTER UPDATE ON \"public\".\"users\"\n    FOR EACH ROW\n      EXECUTE FUNCTION update_public_users_into_oplog_function();",
      "DROP TRIGGER IF EXISTS delete_public_users_into_oplog ON \"public\".\"users\";",
      "    CREATE OR REPLACE FUNCTION delete_public_users_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'users';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'users',\n            'DELETE',\n            json_strip_nulls(json_build_object('id', old.\"id\")),\n            NULL,\n            jsonb_build_object('avatar', old.\"avatar\", 'birthdate', old.\"birthdate\", 'email', old.\"email\", 'id', old.\"id\", 'password', old.\"password\", 'registeredat', old.\"registeredat\", 'username', old.\"username\"),\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER delete_public_users_into_oplog\n  AFTER DELETE ON \"public\".\"users\"\n    FOR EACH ROW\n      EXECUTE FUNCTION delete_public_users_into_oplog_function();"
    ],
    "version": "2"
  }
]
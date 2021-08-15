-- CREATE TABLE "files" (
--   "id" SERIAL PRIMARY KEY,
--   "name" text,
--   "path" text NOT NULL,
--   "product_id" integer
-- );

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

------------- FOREIGN KEYS -------------

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

------------- PROCEDURE -------------

-- CREATE FUNCTION trigger_set_timestamp()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

------------- AUTO UPDATED_AT PRODUCTS -------------
-- CREATE TRIGGER set_timestamp
-- BEFORE UPDATE ON products
-- FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_timestamp();

------------- AUTO UPDATED_AT USERS -------------
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


------------- SESSION ID -------------
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
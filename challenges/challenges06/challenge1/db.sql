CREATE TABLE "customers" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text NOT NULL,
  "bought" integer NOT NULL
);

CREATE TABLE "agencies" (
  "id" SERIAL PRIMARY KEY,
  "adress_id" integer NOT NULL,
  "name" text NOT NULL,
  "founder" text NOT NULL,
  "stars" integer NOT NULL
);

CREATE TABLE "adresses" (
  "id" SERIAL PRIMARY KEY,
  "rua" text NOT NULL,
  "bairro" text NOT NULL,
  "numero" integer NOT NULL,
  "complemento" text NOT NULL
);

CREATE TABLE "cars" (
  "id" SERIAL PRIMARY KEY,
  "model_id" integer NOT NULL,
  "cor" text NOT NULL,
  "placa" text NOT NULL,
  "direcao" integer NOT NULL
);

CREATE TABLE "models" (
  "id" SERIAL PRIMARY KEY,
  "marca" text NOT NULL,
  "modelo" text NOT NULL,
  "ano" integer NOT NULL,
  "gas" integer NOT NULL
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "customer_id" integer NOT NULL,
  "agency_id" integer NOT NULL
);

CREATE TABLE "cars_orders" (
  "id" SERIAL PRIMARY KEY,
  "car_id" integer NOT NULL,
  "order_id" integer NOT NULL,
  "created_at" timestamp DEFAULT 'now()',
  "updated_at" timestamp DEFAULT 'now()'
);

ALTER TABLE "adresses" ADD FOREIGN KEY ("id") REFERENCES "agencies" ("adress_id");

ALTER TABLE "cars" ADD FOREIGN KEY ("model_id") REFERENCES "models" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("agency_id") REFERENCES "agencies" ("id");

ALTER TABLE "cars_orders" ADD FOREIGN KEY ("car_id") REFERENCES "cars" ("id");

ALTER TABLE "cars_orders" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

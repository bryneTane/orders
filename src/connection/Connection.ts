import { createConnection } from "typeorm";
import Order from "../entity/Order";
import Product from "../entity/Product";
import dotenv from "dotenv";

dotenv.config();

export const connection = createConnection({
  type: "postgres",
  host: "localhost",
  port: Number(process.env.POSTGRES_PORT), // default port of postgres
  username: process.env.POSTGRES_USER, // our created username, you can have your own user name
  password: process.env.POSTGRES_PASSWORD, // our created username, you can have your own password
  database: process.env.POSTGRES_DB, // our created database name, you can have your own
  entities: [
    // typeORM will not be able to create database table if we forget to put entity class name here..
    Order, // our SuperHero entity class
    Product, // our Power entity class
  ],
  synchronize: true,
  logging: false,
});

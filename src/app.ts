import express from "express";
import { Routes } from "./routes/order-routes";
import bodyParser = require("body-parser");
class App {
  public app: express.Application;
  public routePrv: Routes;
  constructor() {
    // initializing express in this application
    this.app = express();
    // support application/json type post data
    this.app.use(bodyParser.text());
    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // for routing the http request to controller
    this.routePrv = new Routes();
    this.routePrv.routes(this.app);
  }
}
export default new App().app;

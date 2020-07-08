import { Request, Response } from "express";
import OrderController from "../controllers/order-controller";
class Routes {
  private controller: OrderController;
  constructor() {
    this.controller = new OrderController();
  }
  public routes(app: any): void {
    app.route("/").get((request: Request, response: Response) => {
      response.status(200).send({
        message: "GET request successfully.",
      });
    });
    // following code is to handle http://localhost:3004/orders request.
    app
      .route("/orders")
      .get(this.controller.getAllOrders)
      .post(this.controller.addOrder);
    // following code is to handle http://localhost:3000/orders/{orderId} request.
    app
      .route("/orders/:orderId")
      .get(this.controller.getOrderById)
      .put(this.controller.updateOrder)
      .delete(this.controller.deleteOrder);
  }
}
export { Routes };

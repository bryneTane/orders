import { Request, Response } from "express";
import { connection } from "../connection/Connection";
import Order from "../entity/Order";
import Product from "../entity/Product";
import csvOrderToJSON from "../tools/csvToJSON";
import fs from "fs";
const { default: PQueue } = require("p-queue");

const queue = new PQueue({ concurrency: 1 });

class OrderController {
  constructor() {}
  public getAllOrders(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        const orders: Order[] = await connection.manager.find(Order);
        res.json(orders);
      })
      .catch((error) => {
        console.error("Error ", error);
        res.json(error);
      });
  }
  public addOrder(req: Request, res: Response) {
    console.log("Add function");
    let requestOrder = csvOrderToJSON(req.body);
    try {
      //If the recieved data is inconsistent we store it in a file
      if (requestOrder.inconsistent) {
        fs.appendFile(
          __dirname + "/../../inconsistent.csv",
          req.body + "\n\n\n",
          function (err) {
            if (err) throw err;
            console.log("Saved!");
            res.json({ message: "Inconsistent element." });
          }
        );
      } else {
        connection
          .then(async (connection) => {
            let requestProducts = requestOrder.products || [];
            if (Array.isArray(requestProducts)) {
              let order = new Order();
              order.id = requestOrder.id;
              order.vat = requestOrder.vat;
              order.total = requestOrder.total;
              order.products = [];
              //make some Products objects from the list of products in the request
              requestProducts.forEach(
                (requestProduct: {
                  id: string;
                  name: string;
                  price: number;
                }) => {
                  let product: Product = new Product();
                  product.id = requestProduct.id;
                  product.name = requestProduct.name;
                  product.price = requestProduct.price;
                  order.products.push(product);
                }
              );
              (async () => {
                try {
                  //putting the database queries in a queue so that they are not in concurrency
                  //if there are too many requests
                  await queue.add(() => connection.manager.save(order));
                  console.log("Done");
                  res.json({ message: "Successfully Saved." });
                } catch (err) {
                  res.json(err);
                }
              })();
            } else {
              res.json({ err: 400, message: "Bad request !" });
            }
          })
          .catch((error) => {
            console.error("Error ", error);
            res.json(error);
          });
      }
    } catch (err) {
      res.json(err);
    }
  }
  public updateOrder(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        let order = await connection.manager.findOne(Order, req.params.orderId);
        if (order) {
          let requestOrder = req.body;
          let requestProduct = requestOrder.products;
          order.id = requestOrder.id;
          order.vat = requestOrder.vat;
          order.total = requestOrder.total;
          order.products = [];
          // delete previous products of our order
          order.products.forEach(async (product) => {
            await connection.manager.remove(Product, {
              data: { id: product.id },
            });
          });
          // add new products to our order
          requestProduct.forEach(
            (requestProduct: { id: string; name: string; price: number }) => {
              let product: Product = new Product();
              product.id = requestProduct.id;
              product.name = requestProduct.name;
              product.price = requestProduct.price;
              order?.products.push(product);
            }
          );
          try {
            await connection.manager.save(order);
            res.json({ message: "Successfully Updated." });
          } catch (err) {
            res.json(err);
          }
        } else {
          res.json({ err: 404, message: "Order not found in database" });
        }
      })
      .catch((error) => {
        console.error("Error ", error);
        res.json(error);
      });
  }
  public getOrderById(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        let order = await connection.manager.findOne(Order, req.params.orderId);
        res.json(order);
      })
      .catch((error) => {
        console.error("Error ", error);
        res.json(error);
      });
  }
  public deleteOrder(req: Request, res: Response) {
    connection
      .then(async (connection) => {
        let order = await connection.manager.findOne(Order, req.params.orderId);
        // delete all products first
        order?.products.forEach(async (product) => {
          await connection.manager.remove(Product, {
            data: { id: product.id },
          });
        });
        // delete our order
        await connection.manager.remove(Order, {
          data: {
            id: req.params.orderId,
          },
        });
        res.json({ message: "Successfully Removed." });
      })
      .catch((error) => {
        console.error("Error ", error);
        res.json(error);
      });
  }
}
export default OrderController;

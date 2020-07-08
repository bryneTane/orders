import { Column, Entity, PrimaryColumn, ManyToOne } from "typeorm";
import Order from "./Order";
@Entity()
class Product {

  @PrimaryColumn()
  public id!: string;

  @Column()
  public name!: string;

  @Column({type: 'real'})
  public price!: number;

  @ManyToOne(() => Order, (order) => order.products)
  public order!: Order;
}

export default Product;

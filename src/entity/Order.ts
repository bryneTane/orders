import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import Product from './Product';

@Entity()
class Order {
  @PrimaryColumn()
  public id!: number;

  @Column({type: 'real'})
  public vat!: number;

  @Column({type: 'real'})
  public total!: number;

  @OneToMany(() => Product, (product) => product.order, {
    eager: true,
    cascade: true,
  })
  public products!: Product[];
}

export default Order;

import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => String) //graphql
  @Property({ type: "text", unique: true }) //mikro orm
  username!: string;

  // @Field(() => String) //graphql dont allow passwords to show on api
  @Property({ type: "text" }) //mikro orm
  password!: string;
}

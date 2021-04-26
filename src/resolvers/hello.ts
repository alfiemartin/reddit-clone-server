import { Resolver, Query } from "type-graphql";

@Resolver()
export class helloResolver {
  @Query(() => String)
  hello() {
    return "hrllo from server";
  }
}

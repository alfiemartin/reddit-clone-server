import { MikroORM } from "@mikro-orm/core";
import { __PROD__ } from "./constants";

const main = async () => {
  const orm = await MikroORM.init({
    dbName: "reddit-clone",
    entities: [],
    user: "postgres",
    password: "fuckyouChina1",
    debug: !__PROD__,
    type: "postgresql",
  });
};

main();
console.log("hedllo");

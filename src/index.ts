import { MikroORM } from "@mikro-orm/core";
import { __PROD__ } from "./constants";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
};

main();
console.log("hedllo");

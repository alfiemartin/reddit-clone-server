import { MikroORM } from "@mikro-orm/core";
import { __PROD__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);

  const post = orm.em.create(Post, { title: "My First Post" });
  await orm.em.persistAndFlush(post);
  console.log(__dirname);
};

main();

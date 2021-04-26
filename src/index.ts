import { MikroORM } from "@mikro-orm/core";
import { __PROD__ } from "./constants";
import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const post = orm.em.create(Post, { title: "My fourth Postt" });
  await orm.em.persistAndFlush(post);

  orm.em.find(Post, {}).then((posts) => console.log(posts));
};

main();

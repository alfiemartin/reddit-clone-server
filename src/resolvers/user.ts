import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class userResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    if (user) {
      return user;
    }

    return null;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const userAlreadyExists = await em.findOne(User, {
      username: options.username,
    });

    if (userAlreadyExists) {
      //use this or try catch the persistAndFlush
      return {
        errors: [{ field: "username", message: "username is already taken" }],
      };
    }

    if (options.username.length <= 5) {
      return {
        errors: [{ field: "username", message: "username must be > 5" }],
      };
    }

    if (options.password.length <= 5) {
      return {
        errors: [{ field: "password", message: "password must be > 5" }],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [{ field: "username", message: "username not found" }],
      };
    }

    const passwordIsValid = await argon2.verify(
      user.password,
      options.password
    );

    if (!passwordIsValid) {
      return {
        errors: [{ field: "password", message: "password incorrect" }],
      };
    }

    if (req.session.userId === user.id) {
      return {
        errors: [{ field: "User", message: "User already logged in" }],
        user: user,
      };
    }

    //This sets cookie and keeps them logged in
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}

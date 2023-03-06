import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../../prisma/db";

export type Context = {
  prisma: PrismaClient;
};

const typeDefs = `#graphql
    type Novel {
    id: ID!
    title: String
    image: String
    createdAt: String
    updatedAt: String
    authors: [Author]
  }

  type Author {
    id: ID!
    name: String
    novelId: String
  }


  type Query {
	novel(id: ID!): Novel 
    novels: [Novel]
  }
`;

const resolvers = {
  Query: {
    //get novel by id
    novel: async (_parent: any, args: any, context: Context) => {
      return await context.prisma.novel.findUnique({
        where: {
          id: args.id,
        },
      });
    },
    // get all novels
    novels: async (_parent: any, _args: any, context: Context) => {
      return await context.prisma.novel.findMany({
        include: { author: true },
      });
    },
  },
  // nested resolve function to get authors in novels
  Novel: {
    authors: async (parent: any, _args: any, context: Context) => {
      return await context.prisma.author.findMany({
        where: {
          novelId: parent.id,
        },
      });
    },
  },
};

const apolloServer = new ApolloServer<Context>({ typeDefs, resolvers });

export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({ req, res, prisma }),
});

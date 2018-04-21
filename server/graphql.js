import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

// Queries
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLFloat,
      resolve: root => ({
        username: root.session
      })
    }
  }
});

// Mutations
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUserAndLogIn: {
      type: GraphQLFloat,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      }
      // resolve: (root, { username, email, password }) => {

      // }
    }
  }
});

export default new GraphQLSchema({ query: queryType, mutation: mutationType });

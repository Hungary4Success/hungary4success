import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import bcrypt from 'bcrypt';

// Queries
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getUsername: {
      type: GraphQLString,
      resolve: ({ session }) => {
        if (session.isLoggedIn) return session.username;
        return null;
      }
    },
    whoIsGoingOut: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ session }) => {
        if (!session.isLoggedIn) return null;

        return global.goingOutUsernames;
      }
    }
  }
});

// Mutations
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    loginUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: ({ session }, { username, password }) => new Promise((resolve) => {
        const correctPassword = '$2a$10$AeTTyz7O9cxA6mdOxvyiEuzFxdZEYlO1B.MlPbH7z7STaABmsbIWu';

        bcrypt.compare(password, correctPassword, (err, res) => {
          if (err) {
            console.error('Couldn\'t compare password hases.');
            resolve(false);
          }

          if (res === true) {
            session.isLoggedIn = true;
            session.username = username;

            resolve(session.isLoggedIn);
          } else {
            resolve(false);
          }
        });
      })
    },
    logoutUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ session }) => {
        session.isLoggedIn = false;
        return session.isLoggedIn;
      }
    },
    goingOut: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ session }) => {
        if (!session.isLoggedIn) return null;

        if (!global.goingOutUsernames.includes(session.username)) {
          global.goingOutUsernames.push(session.username);
        }

        return global.goingOutUsernames;
      }
    },
    cameBack: {
      type: new GraphQLList(GraphQLString),
      resolve: ({ session }) => {
        if (!session.isLoggedIn) return null;

        const usernameIndex = global.goingOutUsernames.indexOf(session.username);

        if (usernameIndex > -1) {
          global.goingOutUsernames.splice(usernameIndex, 1);
        }

        return global.goingOutUsernames;
      }
    }
  }
});

export default new GraphQLSchema({ query: queryType, mutation: mutationType });

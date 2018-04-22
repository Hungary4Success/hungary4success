import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import bcrypt from 'bcrypt';
import bluebird from 'bluebird';
import challengeData from '../src/challenges.json';
import fs from 'fs';

const Promise = bluebird;
Promise.promisifyAll(fs);

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    level: { type: new GraphQLNonNull(GraphQLInt) }
  }
});

const challengeType = new GraphQLObjectType({
  name: 'Challenge',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subject: { type: new GraphQLNonNull(GraphQLString) },
    profilePicture: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) }
  }
});

// Queries
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      resolve: ({ session }) => {
        if (session.user) return session.user;
        return null;
      }
    },
    challenge: {
      type: challengeType,
      args: {
        level: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (_, { level }) => {
        if (level >= challengeData.length) return null;

        const fileName = `src/emails/${challengeData.emails[level]}.json`;
        const jsonData = await fs.readFileAsync(fileName);

        const challenge = JSON.parse(jsonData);
        const contentFileName = `src/emails/${challenge.content}`;
        challenge.content = await fs.readFileAsync(contentFileName);

        return challenge;
      }
    }
  }
});

// Mutations
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    login: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: ({ session }, { username, password }) => new Promise((resolve) => {
        const correctPassword = '$2a$08$9GqXIVPwSM/v/pSGgQCcu.Ea/HYXBLusNzqzKiYZlXkllaNOL8XGq';

        bcrypt.compare(password, correctPassword, (err, res) => {
          if (err) {
            console.error('Couldn\'t compare password hases.');
            resolve(false);
          }

          if (res === true) {
            session.user = { name: username, level: 0 };
            resolve(session.user.name);
          } else {
            resolve(false);
          }
        });
      })
    },
    logout: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ session }) => {
        session.user = null;
      }
    },
    increaseLevel: {
      type: GraphQLBoolean,
      resolve: ({ session }) => {
        if (session.user) {
          session.user.level++;
        }
      }
    }
  }
});

export default new GraphQLSchema({ query: queryType, mutation: mutationType });

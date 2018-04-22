import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import Promise from 'bluebird';
import bcrypt from 'bcrypt';
import challengeData from '../res/challenges.json';
import fs from 'fs';
import sqlite3 from 'sqlite3';

Promise.promisifyAll(fs);

const sqlite = sqlite3.verbose();
const db = new sqlite.Database('res/database.db');

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

const challangeCodeType = new GraphQLObjectType({
  name: 'ChallengeCode',
  fields: {
    code: { type: new GraphQLNonNull(GraphQLString) },
    hint: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLString }
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
        if (level >= challengeData.emails.length) return null;

        const fileName = `res/emails/${challengeData.emails[level]}.json`;
        const jsonData = await fs.readFileAsync(fileName);

        const challenge = JSON.parse(jsonData);
        const contentFileName = `res/emails/${challenge.content}`;
        challenge.content = await fs.readFileAsync(contentFileName);

        return challenge;
      }
    },
    challengeCode: {
      type: challangeCodeType,
      args: {
        level: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: async (_, { level }) => {
        if (level >= challengeData.code.length) {
          return null;
        } else if (level === 0) {
          return { code: '', hint: '', type: 'intro' };
        }

        const codeFileName = `res/code/${challengeData.code[level]}`;
        const code = await fs.readFileAsync(codeFileName);

        const hintFileName = `res/hints/${challengeData.hints[level]}.txt`;
        const hint = await fs.readFileAsync(hintFileName);

        const fileName = `res/emails/${challengeData.emails[level]}.json`;
        const jsonData = await fs.readFileAsync(fileName);

        return { code, hint, type: JSON.parse(jsonData).type };
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
    },
    executeSql: {
      type: GraphQLString,
      args: {
        query: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, { query }) => new Promise((resolve) => {
        db.serialize(() => {
          const rows = [];
          db.each(query, (err, row) => {
            if (Object.keys(row).length === null) resolve(null);
            const rowString = Object.keys(row).map(key => `${key}: ${row[key]}`)
              .join(', ');
            rows.push(rowString);
          }, () => {
            resolve(rows.join('\n'));
          });
        });

        db.close();
      })
    }
  }
});

export default new GraphQLSchema({ query: queryType, mutation: mutationType });

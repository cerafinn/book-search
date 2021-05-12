const { AuthenticationError } = require('apollo-server-errors');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await (await User.findOne({ _id: context.user._id })).isSelected('-__v -password');
        return userData;
      }
      throw new AuthenticationError('You are not logged in')
    }
  },

  Mutation: {
    login: async (parent, {email, password}) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect email/password')
      };
      
      const pswd = await user.isCorrectPassword(password);
      if (!pswd) {
        throw new AuthenticationError('Incorrect email/password')
      };

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async () => {

    },
    removeBook: async () => {

    },
  }
}
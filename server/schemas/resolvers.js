const { AuthenticationError } = require('apollo-server-errors');
const { User } = require('../models');
const { findByIdAndUpdate } = require('../models/User');
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

    saveBook: async (parent, { bookInfo }, context) => {
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookInfo } },
          { new: true }
        );
        return updateUser;
      }
      throw new AuthenticationError('You must be logged in to save a book to your saved books')
    },

    removeBook: async (parent, { bookId}, context ) => {
      if (context.user) {
        const updateUser = await findByIdAndUpdate(
          { _id: context.user_id },
          { $pull: {savedBooks: { bookId} } },
          { new: true }
        );
        return updateUser;
      }
      throw new AuthenticationError('You must be logged in to remove a book from your saved books')
    },
  }
}

module.exports = resolvers;
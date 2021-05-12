const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: 
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input NewBook {

  }

  type Query {
    me: User
  }

  type Mutation {
    login
    addUser
    saveBook
    removeBook
  }
`

module.exports = typeDefs;
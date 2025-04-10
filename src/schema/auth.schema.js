export const authTypeDefs = `#graphql
  type AuthResponse {
    accessToken: String!
    refreshToken: String!
    user: User!
  }

  type Message {
    message: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    giuId: String
    phone: String
    gender: Boolean!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input VerificationInput {
    email: String!
    code: String!
  }

  input TokenInput {
    token: String!
  }

  type Query {
    validateToken(token: String!): AuthResponse!
    validateRefreshToken(token: String!): AuthResponse!
  }

  type Mutation {
    register(input: RegisterInput!): Message!
    verifyRegistration(input: VerificationInput!): Message!
    login(input: LoginInput!): Message!
    verifyLogin(input: VerificationInput!): AuthResponse!
    refreshToken(input: TokenInput!): AuthResponse!
    revokeToken(input: TokenInput!): Boolean!
    validateAccessToken(input: TokenInput!): Boolean!
  }
`; 
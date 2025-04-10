export const driverTypeDefs = `#graphql
  type Car {
    id: ID!
    make: String!
    model: String!
    year: Int!
    color: String!
    licensePlate: String!
    licensePicture: String
    createdAt: String!
    updatedAt: String!
  }

  type Driver {
    id: ID!
    userId: ID!
    car: Car
    createdAt: String!
    updatedAt: String!
  }

  input CarInput {
    make: String!
    model: String!
    year: Int!
    color: String!
    licensePlate: String!
  }

  type Query {
    myDriverCar: Driver
  }

  type Mutation {
    addDriverCar(input: CarInput!): Driver!
    updateDriverCar(input: CarInput!): Driver!
    deleteDriverCar: Driver!
    uploadLicense(file: Upload!): Driver!
  }
`; 
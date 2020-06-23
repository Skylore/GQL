const graphql = require('graphql')

const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLID, GraphQLList } = graphql

const User = require('../models/user')

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        login: { type: GraphQLString },
        creationDate: { type: GraphQLString },
        id: { type: GraphQLID }
    })
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return User.findById(args.id)
            }
        },
        users: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({})
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: () => ({
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                login: { type: GraphQLString }
            },
            resolve(parent, args) {
                const { name, age, login } = args

                const user = new User({
                    name,
                    age,
                    login,
                    creationDate: (new Date()).toDateString()
                })

                return user.save()
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
            },
            async resolve(parent, args) {
                return await User.findByIdAndDelete(args.id)
            }
        }
    })
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})
const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/Book');
const Author = require('../models/Author');

const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = graphql;

// const books = [
// 	{
// 		id: '1',
// 		name: 'Book 1',
// 		genre: 'Story',
// 		authorId: '1'
// 	},
// 	{
// 		id: '2',
// 		name: 'Book 2',
// 		genre: 'Story',
// 		authorId: '2'
// 	},
// 	{
// 		id: '3',
// 		name: 'Book 3',
// 		genre: 'Story',
// 		authorId: '3'
// 	},
// 	{
// 		id: '4',
// 		name: 'Book 4',
// 		genre: 'Story',
// 		authorId: '1'
// 	},
// 	{
// 		id: '5',
// 		name: 'Book 5',
// 		genre: 'Story',
// 		authorId: '2'
// 	},
// 	{
// 		id: '6',
// 		name: 'Book 6',
// 		genre: 'Story',
// 		authorId: '3'
// 	}
// ];

// const authors = [
// 	{
// 		id: '1',
// 		name: 'Author 1',
// 		age: 25
// 	},
// 	{
// 		id: '2',
// 		name: 'Author 2',
// 		age: 30
// 	},
// 	{
// 		id: '3',
// 		name: 'Author 3',
// 		age: 35
// 	}
// ];

const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: ()=>({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		genre: {type: GraphQLString},
		author: {
			type: AuthorType,
			resolve(parent,args){
				// console.log(parent);
				// return _.find(authors, {id: parent.authorId});
				return Author.findById(parent.authorId);
			}
		}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: ()=>({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		age: {type: GraphQLInt},
		book: {
			type: GraphQLList(BookType),
			resolve(parent,args){
				// return _.filter(books, {authorId: parent.id});
				return Book.find({authorId: parent.id})
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields:{
		book: {
			type: BookType,
			args: {id:{type: GraphQLID}},
			resolve(parent,args){
				// console.log(typeof(args.id));
				// return _.find(books,{id: args.id});
				return Book.findById(args.id);
			}
		},
		author: {
			type: AuthorType,
			args: {id:{type: GraphQLID}},
			resolve(parent,args){
				// return _.find(authors,{id: args.id});
				return Author.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent,args){
				// return books;
				return Book.find({});
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent,args){
				// return authors;
				return Author.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent,args){
				let author = new Author({
					name: args.name,
					age:  args.age
				});
				return author.save();
			}
		},
		addBook: {
			type: BookType,
			args: {
				name: {type: new GraphQLNonNull(GraphQLString)},
				genre: {type: new GraphQLNonNull(GraphQLString)},
				authorId: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve(parent,args){
				let book = new Book({
					name: args.name,
					genre:  args.genre,
					authorId: args.authorId
				});
				return book.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
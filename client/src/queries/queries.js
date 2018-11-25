import { gql } from 'apollo-boost';

const getBooksQuery = gql`
	{
		books{
      		id
			name
			genre
		}
	}
`;

const getAuthorsQuery = gql`
	{
		authors{
      		id
			name
		}
	}
`;

const addBookMutation = gql`
	mutation($name: String!,$genre: String!,$authorId: ID!){
		addBook(name:$name,genre:$genre,authorId:$authorId){
			name
			id
		}
	}
`;

const getBookQuery = gql`
	query($id: ID){
		book(id: $id){
			id
			name
			genre
			author{
				id
				name
				age
				book{
					name
					id
				}
			}
		}
	}
`;

export { getAuthorsQuery, getBooksQuery, addBookMutation, getBookQuery };
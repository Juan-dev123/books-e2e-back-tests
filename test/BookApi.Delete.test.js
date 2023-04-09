const axios = require('axios');
const { expect, assert } = require('chai');
const { StatusCodes } = require('http-status-codes');

const booksEndpoint = 'http://127.0.0.1:8080/books';

describe('Verifying the deletion of a book', () => {

    let createdBook;
    let responseOfCreateABook;
    let responseOfGettingAllTheInitialBooks;
    let numOfInitialBooks;
    
    beforeEach(async () => {
        let book = {
            id: 'ef22bbf2-78bc-48a7-b4f9-15c2478d5d21',
            name: 'El caballo y el muchacho',
            author: 'C. S. Lewis'
        };
        responseOfGettingAllTheInitialBooks = await axios.get(booksEndpoint);
        numOfInitialBooks = responseOfGettingAllTheInitialBooks.data.length;
        responseOfCreateABook = await axios.post(booksEndpoint, book);
        createdBook = responseOfCreateABook.data;
    });

    it('should delete a book when given the book id', async () => {
        const responseOfDeleteABook = await axios.delete(booksEndpoint+'/'+createdBook.id);
        const responseOfGettingAllTheBooksAfterDelete = await axios.get(booksEndpoint);
        let booksAfterDelete = responseOfGettingAllTheBooksAfterDelete.data;
        let numOfBooksAfterDelete = booksAfterDelete.length;

        expect(responseOfGettingAllTheInitialBooks.status).to.equal(StatusCodes.OK);
        expect(responseOfCreateABook.status).to.equal(StatusCodes.OK);
        expect(responseOfDeleteABook.status).to.equal(StatusCodes.OK);
        expect(responseOfGettingAllTheBooksAfterDelete.status).to.equal(StatusCodes.OK);
        expect(numOfInitialBooks).to.equal(numOfBooksAfterDelete);
        for(let i = 0; i < numOfBooksAfterDelete; i++){
            let areTheBooksTheSame = booksAfterDelete[i].id === createdBook.id &&
                                    booksAfterDelete[i].name === createdBook.name &&
                                    booksAfterDelete[i].author === createdBook.author;
            if(areTheBooksTheSame){
                assert.fail('The book was not deleted');
            }
        }
    });

    it('should not delete any book when the given book id does not belong to any book', async () => {
        const responseOfDeleteABookFirstTime = await axios.delete(booksEndpoint+'/'+createdBook.id);
        const responseOfDeleteABookSeconTime = await axios.delete(booksEndpoint+'/'+createdBook.id);
        const responseOfGettingAllTheBooksAfterSecondDelete = await axios.get(booksEndpoint);
        let numOfBooksAfterSecondDelete = responseOfGettingAllTheBooksAfterSecondDelete.data.length;

        expect(responseOfGettingAllTheInitialBooks.status).to.equal(StatusCodes.OK);
        expect(responseOfCreateABook.status).to.equal(StatusCodes.OK);
        expect(responseOfDeleteABookFirstTime.status).to.equal(StatusCodes.OK);
        expect(responseOfDeleteABookSeconTime.status).to.equal(StatusCodes.BAD_REQUEST);
        expect(numOfInitialBooks).to.equal(numOfBooksAfterSecondDelete);
    });
});
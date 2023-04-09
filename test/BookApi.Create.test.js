const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const booksEndpoint = 'http://127.0.0.1:8080/books';

describe('Verifying the creation of a book', () => {

    let book = {
        id: String,
        name: String,
        author: String
    };
    
    beforeEach(() => {
        book = {
            id: 'ef22bbf2-78bc-48a7-b4f9-15c2478d5d29',
            name: 'El caballo y el muchacho',
            author: 'C. S. Lewis'
        }
    });

    let assignedId;

    describe('Happy path', () => {

        it('should create a book when given all the data', async () => {
            const response = await axios.post(booksEndpoint, book);
            let bookDTO = response.data;
            expect(response.status).to.equal(StatusCodes.OK);
            expect(bookDTO.id).to.not.be.null;
            expect(bookDTO.name).to.equal(book.name);
            expect(bookDTO.author).to.equal(book.author);
            assignedId = bookDTO.id;
        });

        //The provided book id does not matter because the id that is assigned to the book is created in the controller
        it('should create a book when given all the data except the id', async () => {
            book.id = null;
            const response = await axios.post(booksEndpoint, book);
            let bookDTO = response.data;
            expect(response.status).to.equal(StatusCodes.OK);
            expect(bookDTO.id).to.not.be.null;
            expect(bookDTO.name).to.equal(book.name);
            expect(bookDTO.author).to.equal(book.author);
            assignedId = bookDTO.id;
        });

        afterEach(async () => {
            await axios.delete(booksEndpoint+'/'+assignedId);
        });
        
    });

    describe('Unhappy path', () => {
        describe('The data is incomplete', () => {
            it('shoud not create a book when the name is null', async () => {
                book.name = null;
                const response = await axios.post(booksEndpoint, book);
                expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
            });
    
            it('shoud not create a book when the name is empty', async () => {
                book.name = "";
                const response = await axios.post(booksEndpoint, book);
                expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
            });
    
            it('shoud not create a book when the author is null', async () => {
                book.author = null;
                const response = await axios.post(booksEndpoint, book);
                expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
            });
    
            it('shoud not create a book when the author is empty', async () => {
                book.author = "";
                const response = await axios.post(booksEndpoint, book);
                expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
            });
        });
        
        describe('The data is repeated', () => {
            it('should not create a book when the book already exists', async () => {
                const responseOfOriginalBook = await axios.post(booksEndpoint, book);
                assignedId = responseOfOriginalBook.data.id;
                const responseOfBooksBefore = await axios.get(booksEndpoint);
                let numOfBooksBeforeTryingToAddTheBookCopy = responseOfBooksBefore.data.length;
                const responseOfBookCopy = await axios.post(booksEndpoint, book);
                const responseOfBooksAfter = await axios.get(booksEndpoint);
                let numOfBooksAfterTryingToAddTheBookCopy = responseOfBooksAfter.data.length;
                expect(responseOfBookCopy.status).to.equal(StatusCodes.BAD_REQUEST);
                expect(numOfBooksBeforeTryingToAddTheBookCopy).to.equal(numOfBooksAfterTryingToAddTheBookCopy);
            });

            afterEach(async () => {
                await axios.delete(booksEndpoint+'/'+assignedId);
            });
        });
    });
});
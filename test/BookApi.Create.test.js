const axios = require('axios');
const { expect, should } = require('chai');
const { StatusCodes } = require('http-status-codes');

const booksEndpoint = 'http://localhost:8080/books';

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

    describe('Happy path', () => {

        let assignedId;

        afterEach(async () => {
            await axios.delete(booksEndpoint+'/'+assignedId);
        });
        
        it('should create a book when given all the data', async () => {
            const response = await axios.post(booksEndpoint, book);
            let bookDTO = response.data;
            expect(response.status).to.equal(StatusCodes.OK);
            expect(bookDTO.id).to.not.be.null;
            expect(bookDTO.name).equal(book.name);
            expect(bookDTO.author).equal(book.author);
            assignedId = bookDTO.id;
        });

        //The provided book id does not matter because the id that is assigned to the book is created in the controller
        it('should create a book when given all the data except the id', async () => {
            book.id = null;
            const response = await axios.post(booksEndpoint, book);
            let bookDTO = response.data;
            expect(response.status).to.equal(StatusCodes.OK);
            expect(bookDTO.id).to.not.be.null;
            expect(bookDTO.name).equal(book.name);
            expect(bookDTO.author).equal(book.author);
            assignedId = bookDTO.id;
        });
        
    });

    describe('Unhappy path', () => {
        it('shoud not create a book when the name is null', async () => {
            book.name = null;
            const response = await axios.post(booksEndpoint, book);
            expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
        });

        it('shoud not create a book when the author is null', async () => {
            book.author = null;
            const response = await axios.post(booksEndpoint, book);
            expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
        });
    })

});
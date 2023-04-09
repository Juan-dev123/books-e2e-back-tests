const axios = require('axios');
const { expect, should } = require('chai');
const { StatusCodes } = require('http-status-codes');

const booksEndpoint = 'http://127.0.0.1:8080/books';

describe('Verifying the consult of books', () => {
    let initialBooks;
    let numOfBooks;
    let book1 = {
        id: 'ef22bbf2-78bc-48a7-b4f9-15c2478d5d21',
        name: 'El caballo y el muchacho',
        author: 'C. S. Lewis'
    }
    beforeEach(async () => {
        const response = await axios.get(booksEndpoint);
        initialBooks = Object.assign({} , response.data);
        let booksToDelete = Object.assign({} , response.data);
        numOfBooks = response.data.length;
        for (let i = 0; i < numOfBooks; i++){
            await axios.delete(booksEndpoint+'/'+booksToDelete[i].id);
        }
    });

    afterEach(async () => {
        for (let i = 0; i < numOfBooks; i++){
            await axios.post(booksEndpoint, initialBooks[i]);
        }
    });

    it('should get all the books', async () => {

        let book2 = {
            id: 'ef22bbf2-78bc-48a7-b4f9-15c2478d5d22',
            name: 'Momo',
            author: 'Michael Ende'
        }

        let book3 = {
            id: 'ef22bbf2-78bc-48a7-b4f9-15c2478d5d23',
            name: '1984',
            author: 'George Orwell'
        }

        await axios.post(booksEndpoint, book1);
        await axios.post(booksEndpoint, book2);
        await axios.post(booksEndpoint, book3);

        const response = await axios.get(booksEndpoint);
        let books = response.data;
        books.sort((x, y) => x.name.charCodeAt(0) - y.name.charCodeAt(0));
        expect(response.status).to.equal(StatusCodes.OK);
        expect(books.length).equal(3);
        expect(books[0].name).equal('1984');
        expect(books[0].author).equal('George Orwell');
        expect(books[1].name).equal('El caballo y el muchacho');
        expect(books[1].author).equal('C. S. Lewis');
        expect(books[2].name).equal('Momo');
        expect(books[2].author).equal('Michael Ende');
    });
})
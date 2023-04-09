const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const booksEndpoint = 'http://127.0.0.1:8080/books';

describe('Verifying the consult of books', () => {
    let initialBooks;
    let numOfBooks;

    beforeEach(async () => {
        const response = await axios.get(booksEndpoint);
        initialBooks = Object.assign({} , response.data);
        let booksToDelete = Object.assign({} , response.data);
        numOfBooks = response.data.length;
        for (let i = 0; i < numOfBooks; i++){
            await axios.delete(booksEndpoint+'/'+booksToDelete[i].id);
        }
    });

    it('should get all the books', async () => {
        let booksToAdd = [
            {
                id: 'ef22bbf2-78bc-48a7-b4f9-15c2478d5d21',
                name: 'El caballo y el muchacho',
                author: 'C. S. Lewis'
            },
            {
                id: 'ef22bbf2-78bc-48a7-b4f9-15c2478d5d22',
                name: 'Momo',
                author: 'Michael Ende'
            },
            {
                id: 'ef22bbf2-78bc-48a7-b4f9-15c2478d5d23',
                name: '1984',
                author: 'George Orwell'
            }
        ]

        for (let i = 0; i < booksToAdd.length; i++){
            await axios.post(booksEndpoint, booksToAdd[i]);
        }

        const response = await axios.get(booksEndpoint);
        let consultedBooks = response.data;

        const mapOfIndex = {};

        booksToAdd.forEach((bookToAdd, indexBookToAdd) => {
            consultedBooks.forEach((consultedBook, indexConsultedBook) => {
                if(bookToAdd.author === consultedBook.author && bookToAdd.name === consultedBook.name){
                    mapOfIndex['bookToAdd'+indexBookToAdd] = indexConsultedBook;
                }
            });
        });

        expect(response.status).to.equal(StatusCodes.OK);
        expect(consultedBooks.length).equal(booksToAdd.length);

        for (let i = 0; i < booksToAdd.length; i++){
            expect(consultedBooks[mapOfIndex['bookToAdd'+i]].name).equal(booksToAdd[i].name);
            expect(consultedBooks[mapOfIndex['bookToAdd'+i]].author).equal(booksToAdd[i].author);
        }

        for (let i = 0; i < booksToAdd.length; i++){
            await axios.delete(booksEndpoint+'/'+consultedBooks[i].id);
        }
    });

    afterEach(async () => {
        for (let i = 0; i < numOfBooks; i++){
            await axios.post(booksEndpoint, initialBooks[i]);
        }
    });
})
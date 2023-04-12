const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

const booksEndpoint = 'https://books-back-juans.azurewebsites.net/books';

describe('Verifying the update of a book', () => {

    let responseOfTheCreationOfABook;
    let createdBookId;
    let book = {
        name: String,
        author: String
    };

    beforeEach(async () => {
        book = {
            name: 'El caballo y el muchacho',
            author: 'C. S. Lewis'
        }

        responseOfTheCreationOfABook = await axios.post(booksEndpoint, book);
        createdBookId = responseOfTheCreationOfABook.data.id;
    });

    describe('Happy path', () => {
        it('should update a book when given a new name and author', async () => {
            let newDataOfBook = {
                name: 'Momo',
                author: 'Michael Ende'
            }
            
            const responseOfTheUpdateOfABook = await axios.put(booksEndpoint+'/'+createdBookId, newDataOfBook);
            let bookUpdated = responseOfTheUpdateOfABook.data;

            expect(responseOfTheCreationOfABook.status).to.equal(StatusCodes.OK);
            expect(responseOfTheUpdateOfABook.status).to.equal(StatusCodes.OK);
            expect(bookUpdated.name).to.equal(newDataOfBook.name);
            expect(bookUpdated.author).to.equal(newDataOfBook.author);
        })

        it('should update a book when given a new name and the same author', async () => {
            let newDataOfBook = {
                name: 'Momo',
                author: book.author
            }

            const responseOfTheUpdateOfABook = await axios.put(booksEndpoint+'/'+createdBookId, newDataOfBook);
            let bookUpdated = responseOfTheUpdateOfABook.data;

            expect(responseOfTheCreationOfABook.status).to.equal(StatusCodes.OK);
            expect(responseOfTheUpdateOfABook.status).to.equal(StatusCodes.OK);
            expect(bookUpdated.name).to.equal(newDataOfBook.name);
            expect(bookUpdated.author).to.equal(newDataOfBook.author);
        });

        it('should update a book when given a new author and the same name', async () => {
            let newDataOfBook = {
                name: book.name,
                author: 'Michael Ende'
            }

            const responseOfTheUpdateOfABook = await axios.put(booksEndpoint+'/'+createdBookId, newDataOfBook);
            let bookUpdated = responseOfTheUpdateOfABook.data;

            expect(responseOfTheCreationOfABook.status).to.equal(StatusCodes.OK);
            expect(responseOfTheUpdateOfABook.status).to.equal(StatusCodes.OK);
            expect(bookUpdated.name).to.equal(newDataOfBook.name);
            expect(bookUpdated.author).to.equal(newDataOfBook.author);
        });

        afterEach(async () => {
            await axios.delete(booksEndpoint+'/'+createdBookId);
        });
    });

    describe('Unhappy path', () => {
        describe('The data is incomplete', () => {
            it('should not update a book when the name is null', async () => {
                let newDataOfBook = {
                    name: null,
                    author: 'Michael Ende'
                }
    
                const responseOfTheUpdateOfABook = await axios.put(booksEndpoint+'/'+createdBookId, newDataOfBook);
                
                expect(responseOfTheCreationOfABook.status).to.equal(StatusCodes.OK);
                expect(responseOfTheUpdateOfABook.status).to.equal(StatusCodes.BAD_REQUEST);
            });
    
            it('should not update a book when the name is empty', async () => {
                let newDataOfBook = {
                    name: "",
                    author: 'Michael Ende'
                }
    
                const responseOfTheUpdateOfABook = await axios.put(booksEndpoint+'/'+createdBookId, newDataOfBook);
                
                expect(responseOfTheCreationOfABook.status).to.equal(StatusCodes.OK);
                expect(responseOfTheUpdateOfABook.status).to.equal(StatusCodes.BAD_REQUEST);
            });
    
            it('should not update a book when the author is null', async () => {
                let newDataOfBook = {
                    name: 'Momo',
                    author: null
                }
    
                const responseOfTheUpdateOfABook = await axios.put(booksEndpoint+'/'+createdBookId, newDataOfBook);
                
                expect(responseOfTheCreationOfABook.status).to.equal(StatusCodes.OK);
                expect(responseOfTheUpdateOfABook.status).to.equal(StatusCodes.BAD_REQUEST);
            });
    
            it('should not update a book when the author is empty', async () => {
                let newDataOfBook = {
                    name: 'Momo',
                    author: ''
                }
    
                const responseOfTheUpdateOfABook = await axios.put(booksEndpoint+'/'+createdBookId, newDataOfBook);
                
                expect(responseOfTheCreationOfABook.status).to.equal(StatusCodes.OK);
                expect(responseOfTheUpdateOfABook.status).to.equal(StatusCodes.BAD_REQUEST);
            });

            afterEach(async () => {
                await axios.delete(booksEndpoint+'/'+createdBookId);
            });
        });
        
        describe('The book does not exists', () => {
            it('should not update a book when the book id does not belong to any book', async () => {
                let newDataOfBook = {
                    name: 'Momo',
                    author: 'Michael Ende'
                }
    
                const responseOfDeleteTheBook = await axios.delete(booksEndpoint+'/'+createdBookId);
                const responseOfTheUpdateOfABook = await axios.put(booksEndpoint+'/'+createdBookId, newDataOfBook);
    
                expect(responseOfDeleteTheBook.status).to.equal(StatusCodes.OK);
                expect(responseOfTheUpdateOfABook.status).to.equal(StatusCodes.BAD_REQUEST);
            });
        });
    });
});
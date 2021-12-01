namespace sap.ui.bookshop;
using { cuid } from '@sap/cds/common';

entity Books: cuid {
  title  : String(30) ;
  descr  : String;
  bookPictureURL: String;
  author : Association to Authors;
  genre  : String(20);
  stock  : Integer;
  price  : Decimal(9,2);

  currency_code : String;
  orders : Association to many Orders on orders.book = $self;
  rating: Integer;
}

entity Authors : cuid {
  name   : String(18);
  dateOfBirth  : Date;
  placeOfBirth: String;
  dateOfDeath: Date;
  books  : Association to many Books on books.author = $self @assert.integrity:false;
}

entity Orders: cuid  { 
    deliveryDate: Date @title: 'Delivery date';
    customerName: String;
    phoneNumber: String;
    book: Association to Books;
    amount: Integer;

    // items : Composition of many { 
    //     key book : Association to Books @assert.integrity:false;
    //     amount: Integer;
    // };

    customerCity: String;
    customerStreet: String;
    customerHouseNumber: Integer;
    customerApartmentNumber: Integer;

    paymentMethod: String enum { Cash; CreditCard; Online};
    totalCost: Decimal(9,2);
    currency_code : String;
}
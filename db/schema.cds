namespace sap.ui.bookshop;
using { cuid } from '@sap/cds/common';

entity Books: cuid {
  title  : String(40) ;
  descr  : String;
  bookPictureURL: String;
  author : Association to Authors;
  genre  : String(30);
  stock  : Integer;
  price  : Decimal(9,2);

  currency_code : String;
  orders : Association to many Orders on orders.book = $self;
  rating: Integer;
}

entity Authors : cuid {
  name   : String(25);
  surname:String(40);
  books  : Association to many Books on books.author = $self @assert.integrity:false;
}

entity Orders: cuid  { 
    deliveryDate: Date @title: 'Delivery date';
    customerName: String;
    phoneNumber: String;
    book: Association to Books;
    amount: Integer;
    customerCity: String;
    customerStreet: String;
    customerHouseNumber: Integer;
    customerApartmentNumber: Integer;
    paymentMethod: String enum { Cash; CreditCard; Online};
    totalCost: Decimal(9,2);
}
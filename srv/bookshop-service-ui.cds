using BookshopService from './bookshop-service';

annotate BookshopService.Books with {
    title          @title : 'Title';
    descr          @title : 'Description';
    genre          @title : 'Genre';
    price          @title : 'Price';
    stock          @title : 'Stock';
    author         @title : 'Author`s name';
    currency_code  @title : 'Currency code';
    rating         @title : 'Rating';
    bookPictureURL @title : 'Book';
}

annotate BookshopService.Authors with {
    name         @title : 'Name';
    placeOfBirth @title : 'Place of birth';

}

annotate BookshopService.Books with {
    @UI.IsImageURL : true
    bookPictureURL
};

annotate BookshopService.Books with @(
    UI           : {
        HeaderInfo         : {
            TypeName       : 'Book',
            TypeNamePlural : 'Books',
            Title          : {
                $Type : 'UI.DataField',
                Value : title
            }
        },

        SelectionFields    : [title],

        DataPoint #Rating  : {
            Value         : rating,
            TargetValue   : 5,
            Visualization : #Rating
        },

        LineItem           : [
            {Value : author_ID},
            {
                $Type             : 'UI.DataField',
                Value             : bookPictureURL,
                ![@UI.Importance] : #High
            },
            {Value : title},
            {Value : genre},
            {Value : price},
            {Value : stock},
            {
                $Type  : 'UI.DataFieldForAnnotation',
                Label  : 'Rating',
                Target : '@UI.DataPoint#Rating',

            },
        ],
        Facets             : [
            {
                $Type  : 'UI.ReferenceFacet',
                Label  : 'Brief information',
                Target : '@UI.FieldGroup#Brief'
            },
            {
                $Type  : 'UI.ReferenceFacet',
                Label  : 'Full description',
                Target : '@UI.FieldGroup#Full'
            },
            {
                $Type  : 'UI.ReferenceFacet',
                Label  : 'Rating',
                Target : '@UI.FieldGroup#Rating'
            }
        ],
        FieldGroup #Brief  : {Data : [
            {Value : bookPictureURL},
            {Value : author_ID},
            {Value : title},
            {Value : price}
        ]},
        FieldGroup #Full   : {Data : [
            {Value : descr},
            {Value : genre},
            {Value : stock}
        ]},
        FieldGroup #Rating : {Data : [{
            $Type  : 'UI.DataFieldForAnnotation',
            Label  : 'Rating',
            Target : '@UI.DataPoint#Rating',

        }]}
    },
    Capabilities : {
        InsertRestrictions  : {
            Insertable                    : true,
        },
        SearchRestrictions.Searchable : true,
        Insertable                    : true,
        Updatable                     : true,
        Deletable                     : true
    },
    sap.creatable:                      true
) {};

annotate BookshopService.Books with {
    author @(Common : {
        Text            : author.name,
        TextArrangement : #TextOnly,
        ValueList       : {
            Label          : 'Author`s name',
            CollectionPath : 'Authors',
            Parameters     : [
                {
                    $Type             : 'Common.ValueListParameterOut',
                    LocalDataProperty : 'author_ID',
                    ValueListProperty : 'ID'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'placeOfBirth'
                }
            ]
        }
    });

    price  @Measures.ISOCurrency : currency_code;
};

annotate BookshopService.Authors with {
    ID @(Common : {
        Text            : name,
        TextArrangement : #TextOnly,
    });

}

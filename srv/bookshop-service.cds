using {sap.ui.bookshop as my} from '../db/schema';

@path : 'service/shop'
service BookshopService {
    entity Books   as projection on my.Books;
    annotate Books with @odata.draft.enabled;
    entity Authors as projection on my.Authors;
    annotate Authors with @odata.draft.enabled;
    entity Orders  as projection on my.Orders;
    annotate Orders with @odata.draft.enabled;
}

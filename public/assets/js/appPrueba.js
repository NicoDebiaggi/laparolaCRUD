class Pizzeria{
    constructor(){
        this.products = {pizzas: []};
        this.pizzas = [];
        this.pizzaOffer = [];
        this.pizzaPromo = [];

        //give context
        this.loadCollection = this.loadCollection.bind(this);
        this.addProduct = this.addProduct.bind(this);

    }
    
    addProduct(collection, product){
        console.log(collection, product);
    }

    checkSubCollection(doc){
        let subCollection = "items"
        console.log(doc.ref.collection(subCollection))
        doc?.ref.collection(subCollection) ? this.loadSubCollection(doc, subCollection) : console.log("no existe")
    }

    loadSubCollection(doc, subCollection){
        doc.ref.collection(subCollection).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((item) => {
                console.log(item.data())
            })
        })
    }

    loadCollection(collection, querySnapshot){
        querySnapshot.forEach((doc) => {
            let objToPush = doc.data();
            objToPush.id = doc.id;
            this[collection].push(objToPush);
            
            this.checkSubCollection(doc)
        })
    }
}

const db = firebase.firestore();
const getElements = (collection, callback) => db.collection(collection).get()
                                            .then((querySnapshot) => callback(collection, querySnapshot));

db.getElements = (collection, callback) => db.collection(collection).get()
                                        .then((querySnapshot) => querySnapshot.forEach((doc) => {
                                            callback(collection, {...doc.data(), id: doc.id});
                                        }));



const pizzeria = new Pizzeria();

//getElements("pizzeria", pizzeria.loadCollection)
db.getElements("pizzas", pizzeria.addProduct)
//pizzeria.addProduct()
// Layout navbar-toggle
$('#navbar-toggle').click(function(){ 
	$('html, body').toggleClass('u-overflow-md-h'); 
	$('.root').toggleClass('toggled'); 
});

const db = firebase.firestore();
const elementsTable = document.querySelector(".elementsTable");
const editElementForm = document.getElementById("edit-element-form");
const editElement = document.getElementById("edit-element");
let id = '';
let propToEdit = '';

const getElement = (id, collection) => db.collection(collection).doc(id).get();
const updateElement = (id, updatedElementName, collection) => db.collection(collection).doc(id).update(updatedElementName);
const refreshElementsTable = (collection, callback) => db.collection(collection).get()
                                                            .then((querySnapshot) => callback(querySnapshot))
const drawElements = (querySnapshot) => {
    elementsTable.innerHTML = "";

    querySnapshot.forEach(async(doc) => {

        if(elementsTable.dataset.collection == "pizzas"){
            elementsTable.innerHTML += `
                    <tr>
                        <th scope="row">${doc.id}</th>
                        <td>${doc.data().pizzaName}</td>
                        <td>${doc.data().pizzaPrice}</td>
                        <td>
                            <span class="mr-2 btn btn-outline-primary btn-sm btn-edit-value" data-bs-toggle="modal" data-bs-target="#valueEdit" data-id="${doc.id}" data-prop="pizzaName" >Editar Pizza</span>
                            <span class="btn btn-outline-danger btn-sm btn-edit-value" data-bs-toggle="modal" data-bs-target="#valueEdit" data-id="${doc.id}" data-prop="pizzaPrice" >Editar Precio</span>
                        </td>
                    </tr>`
        }  

        if(elementsTable.dataset.collection == "pizzaOffer"){
            elementsTable.innerHTML += `
                    <tr>
                        <th scope="row">${doc.id}</th>
                        <td>${doc.data().OfferName}</td>
                        <td>
                            <span class="mr-2 btn btn-outline-primary btn-sm btn-edit-value" data-bs-toggle="modal" data-bs-target="#valueEdit" data-id="${doc.id}" data-prop="OfferName" >Editar Pizza</span>
                        </td>
                    </tr>`
            await doc.ref.collection("ingredients").get()
            .then((querySnapshot2) => {
                querySnapshot2.forEach((ingredient) => {
                    elementsTable.innerHTML +=
                    `<tr>
                        <th scope="row">${doc.id}</th>
                        <td>${ingredient.data().ingredient}</td>
                        <td>
                            <span class="mr-2 btn btn-outline-primary btn-sm btn-edit-value" data-bs-toggle="modal" data-bs-target="#valueEdit" data-id="${doc.id}" data-prop="pizzaName" >Editar Pizza</span>
                        </td>
                    </tr>`
                })
            })
        }
                 
        /* if(elementsTable.dataset.collection == "pizzas"){
            elementsTable.innerHTML += `
                    <tr>
                        <th scope="row">${doc.id}</th>
                        <td>${doc.data().pizzaName}</td>
                        <td>${doc.data().pizzaPrice}</td>
                        <td>
                        <span class="mr-2 btn btn-outline-primary btn-sm btn-edit-value" data-bs-toggle="modal" data-bs-target="#valueEdit" data-id="${doc.id}" data-prop="pizzaName" >Editar Pizza</span>
                        <span class="btn btn-outline-danger btn-sm btn-edit-value" data-bs-toggle="modal" data-bs-target="#valueEdit" data-id="${doc.id}" data-prop="pizzaPrice" >Editar Precio</span>
                        </td>
                    </tr>`
        } */   
    });
    listenButtons()
}

function listenButtons(){
    const btnsEditvalue = document.querySelectorAll(".btn-edit-value");
    btnsEditvalue.forEach((btn) => {
        btn.addEventListener("click", (e) => escucharBotones(e));
    });
} 

async function escucharBotones(e){
    try {
        console.log(btn);
        propToEdit = e.target.dataset.prop;
        const doc = await getElement(e.target.dataset.id, col);
        const element = doc.data();
        editElement.value = element[propToEdit];
        id = doc.id;
    } 
    catch {
        console.log("error");
    }
}

if (editElementForm != null){
    
    refreshElementsTable(elementsTable.dataset.collection, drawElements);

    editElementForm.addEventListener("submit", async (e) =>{
        e.preventDefault();
        try{
            await updateElement(id, {
                [propToEdit]: editElement.value
            }, elementsTable.dataset.collection);
            editElementForm.reset();
            refreshElementsTable(elementsTable.dataset.collection);
        }
        catch{
            console.log("error")
        }
    });
}

function estructura(dato){
    return `<tr> ${dato} </tr>`
}
class Producto{

    constructor(id,{pizzaName, pizzaPrice}){
        this.id = id;
        this.pizzaName = pizzaName;
        this.pizzaPrice = pizzaPrice;
    }

    dibujarTabla = {
        pizzas: () => `pepe`,
        pizzaOffer: () => `asd`
    }
}
let prod = new Producto({nombre: "pizza1", precio: "399"})
console.log(prod.dibujarTabla["pizzas"]())

class Pizzeria{
    constructor(){
        this.productos = {pizzas: [],
                        pizzaOffer: [],
        }
    }

    cargarProducto(producto, collection){
        this.productos[collection].push(new Producto (producto))
    }

    cargarProductos(collection){
        //obtiene la coleccion y por cada elem llama a cargarProducto
    }
}
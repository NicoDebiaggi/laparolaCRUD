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
const refreshElementsTable = (collection) => db.collection(collection).get().then((querySnapshot) => {
    var col = collection;
    elementsTable.innerHTML = "";

    querySnapshot.forEach((doc) => {

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
            doc.ref.collection("ingredients").get()
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
    const btnsEditvalue = document.querySelectorAll(".btn-edit-value");
        btnsEditvalue.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                console.log(e.target.dataset.id)
                try {
                    propToEdit = e.target.dataset.prop;
                    const doc = await getElement(e.target.dataset.id, col);
                    const element = doc.data();
                    editElement.value = element[propToEdit];
                    id = doc.id;
                } 
                catch {
                    console.log("error");
                }
            });
        });
});

if (editElementForm != null){
    
    refreshElementsTable(elementsTable.dataset.collection);

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
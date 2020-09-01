let createField = document.getElementById('create-field')

function itemTemplate(item) {

    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
            <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
    </li>
    `
}

// Initial Page Render
let ourHtml = items.map( (item) => {
    return itemTemplate(item) ;
}).join('')
document.getElementById('item-list').insertAdjacentHTML("beforeend" ,ourHtml)

// Create Feature
document.getElementById('create-form').addEventListener('submit' , (e) => {
    e.preventDefault()
    axios.post('/create-item' , {text: createField.value })
    .then( (response) => {
        // Create the html for new item'
        createField.value = ""
        createField.focus() 
        document.getElementById('item-list').insertAdjacentHTML("beforeend" , itemTemplate(response.data)) ;
       
    })
    .catch( () => {
        // sorry i am not able to delete please try again
        console.log("Cant insert");
    })
})

document.addEventListener('click' , (e) => {

    // Edit me
    if (e.target.classList.contains('edit-me')){
        let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML )
        if(userInput != "")
        {axios.post('/update-item' , {text : userInput , id: e.target.getAttribute("data-id")})
        .then( () => {
            // do something interesting
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
        })
        .catch( () => {
            // sorry i am not able to submit please try again
            console.log("Please try again");
        })}
    }

    // Delete me
    if (e.target.classList.contains('delete-me')){
        if (confirm("Are you sure want to delete ?")){
                axios.post('/delete-item' , {id: e.target.getAttribute("data-id")})
            .then( () => {
                // do something interesting
                e.target.parentElement.parentElement.remove()
            })
            .catch( () => {
                // sorry i am not able to delete please try again
                console.log("Please try again");
            })
        }
    }
})
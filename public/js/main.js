const deleteBtn = document.querySelectorAll('.fa-trash') //targets an icon from fontawesome and assigns it the variable of deleteBtn
const item = document.querySelectorAll('.item span') //targets all <span> tags where the parent has the class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') //targets all <span> tags where the class of the element is 'completed' and the parent is 'item'

Array.from(deleteBtn).forEach((element) => {
        element.addEventListener('click', deleteItem)
    }) //create an array from the querySelector results, loop through them, and add a 'click' event that fires the 'deleteItem' function

Array.from(item).forEach((element) => {
        element.addEventListener('click', markComplete)
    }) //create an array from the querySelector results, loop through them, and add a 'click' event that fires the 'markComplete' function

Array.from(itemCompleted).forEach((element) => {
        element.addEventListener('click', markUnComplete)
    }) //create an array from the querySelector results, loop through them, and add a 'click' event that fires the 'markUncomplete' function

async function deleteItem() { //seeks the parent (li) and gets the text inside of the first <span>
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('deleteItem', { // send a request to the 'deleteItem' endpoint on the server telling it to delete the var. 'itemText', arming the request with what it needs to hear the response (sets the headers to accept json) and sends the itemText var. contents in the body.
                method: 'delete', //we are deleting something.
                headers: { 'Content-Type': 'application/json' }, //need to learn more about this...(look into the basics of HTTP...) headers 'basically get passed between server and client. needed, but never really read by either endpoint. 
                body: JSON.stringify({ //turn it into json
                    'itemFromJS': itemText
                })
            }) //waiting for server to respond
        const data = await response.json() //parsing the json (unstringify, if you will)
        console.log(data) //toss 'er into the browser console
        location.reload() //reload the page

    } catch (err) {
        console.log(err)
    }
}
//^^^^^^^try/catch block. a method of handling potential errors. //It is going to grab the first item inside the <li> with the class of 'completed' and delete it

async function markComplete() { //traverses the dom up to the parent li and gets the text inside of the first span element.
    const itemText = this.parentNode.childNodes[1].innerText
    try { // send a request to the 'markComplete' endpoint on the server telling it to delete the var. 'itemText', arming the request with what it needs to hear the response (sets the headers to accept json) and sends the itemText var. contents in the body.
        const response = await fetch('markComplete', {
            method: 'put', //we are adding something
            headers: { 'Content-Type': 'application/json' }, //need to learn more about this...(look into the basics of HTTP...) headers 'basically get passed between server and client. needed, but never really read by either endpoint. 
            body: JSON.stringify({ //turn it into json
                'itemFromJS': itemText
            })
        })
        const data = await response.json() //wait for server to respond
        console.log(data) //console log it
        location.reload() //reload the page

    } catch (err) {
        console.log(err)
    } //if there's an error, console log it.
}

async function markUnComplete() {
    const itemText = this.parentNode.childNodes[1].innerText
    try { // send a request to the 'markComplete' endpoint on the server telling it to delete the var. 'itemText', arming the request with what it needs to hear the response (sets the headers to accept json) and sends the itemText var. contents in the body.
        const response = await fetch('markUnComplete', { //wait for the fetch to complete
            method: 'put', //we are adding something
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ //turn it into json
                'itemFromJS': itemText
            })
        })
        const data = await response.json() //wait for the response that will be in json, so be ready for json.
        console.log(data) //console.log it
        location.reload() // reload the page

    } catch (err) {
        console.log(err)
    } //if there's an error, console log it.
}
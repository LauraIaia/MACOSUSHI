function addDish(data, success){
    $.ajax({
        type:'POST',
        url: "addDish",
        data: {idPiatto: data},
        success: success,
        dataType: "json"
    });
}

function removeDish(data, success){
    $.ajax({
        type:'POST',
        url: "/removeDish",
        data: {idPiatto: data},
        success: success,
        dataType: "json"
    });
}

function addedToCart(){
    $('#cart-counter')[0].innerHTML++;
}

// non utilizzata
function removedFromCart(){
    const cart_badge = $('#cart-counter')[0];

    if(cart_badge.innerHTML > 0)
        cart_badge.innerHTML--;
}

function dishAdded(id){
    const qty = $(`#order${id} .qty`)[0];
    qty.innerHTML++;
}

function dishRemoved(id){
    const qty = $(`#order${id} .qty`)[0];
    if(qty.innerHTML > 0){
        qty.innerHTML--;
    }
}

function submitOrder(){
    const tavolo = $('#tavolo')[0].value;
    if(tavolo){
        $.ajax({
            type:'POST',
            url: '/cart/submit',
            data: {tavolo},
            success: orderSubmitted,
            dataType: "json"
        });
    } else {
        var myModal = new bootstrap.Modal(document.getElementById('noTableError'))
        myModal.show();
    }    
}

function orderSubmitted(){
    var myModal = new bootstrap.Modal(document.getElementById('orderSubmitted'));
    myModal.show();
}


function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

function addReview(idOrdine, review){
    $.ajax({
        type:'POST',
        url: "/review",
        data: {idOrdine, review},
        dataType: "json"
    });
}

function sortCards(containerSelector, sortFunction){
    $(containerSelector + " .card").sort(sortFunction).appendTo(containerSelector);
}

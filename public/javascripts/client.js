function addDish(data, success){
    $.ajax({
        type:'POST',
        url: '/menu/addDish',
        data: {idPiatto: data},
        success: success,
        dataType: "json"
    });
}

function delDish(data, success){
    $.ajax({
        type:'POST',
        url: '/menu/delDish',
        data: {idPiatto: data},
        success: success,
        dataType: "json"
    });
}

function addedToCart(){
    $('.cart .badge')[0].innerHTML++;
}

// non utilizzata
function removedFromCart(){
    const cart_badge = $('.cart .badge')[0];

    if(cart_badge.innerHTML > 0)
        cart_badge.innerHTML--;
}

function orderAdded(id){
    const qty = $(`#order${id} .qty`)[0];
    qty.innerHTML++;
}

function orderRemoved(id){
    const qty = $(`#order${id} .qty`)[0];
    if(qty.innerHTML > 0){
        qty.innerHTML--;
    }
}

function submitOrder(){
    const tavolo = $('#tavolo')[0].value;
    $.ajax({
        type:'POST',
        url: '/cart/submit',
        data: {tavolo},
        success: orderSubmitted
    });    
}

function orderSubmitted(){
    var myModal = new bootstrap.Modal(document.getElementById('orderSubmitted'))
    myModal.show()
}

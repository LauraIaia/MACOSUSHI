function orderDishes(data){
    $.ajax({
        type:'POST',
        url: '/menu',
        data: {idPiatto: data},
       // success: success,
        dataType: "json"
    });
}
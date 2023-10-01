const addToCart = async (idProducto) => {
    const url = window.location.href.replace(`/${idProducto}`,"").replace("products","") + "api/carts";
    console.log(url);
    console.log({products: [{product: idProducto}]});
    let response = await fetch(url,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify
        (
            {
                "products": [{
                    "product": idProducto
                }]
            }
        )
    });

    if (response.ok) {
        let json = await response.json();
        console.log(json);
    } else {
    alert("Error-HTTP: " + response.status);
    }
}
window.addEventListener('load', () => {

    console.log('orders loaded');
    axios.get(`http://localhost:4000/orders`).then((orders) => {

      console.log(orders.data);
      listOrders(orders.data.orders);
    }).catch(err => console.log(err));
    
   
});

function listOrders(orders) {

    const ordersList = document.querySelector('.orders-list');
    ordersList.innerHTML = "";
    orders.forEach(order => {
        console.log(order);
        const orderItem = document.createElement('div');
        orderItem.innerHTML = `ORDER ID: ${order.id}`;
        orderItem.classList.add('order-item');
        console.log(orderItem);
        ordersList.appendChild(orderItem);
        console.log(ordersList);
        listOrderProducts(order.products);

    });

}

function listOrderProducts(orderProducts) {

    console.log(orderProducts);
    const orderProductsList = document.querySelector('.orders-list');
    //orderProductsList.innerHTML = "";
    orderProducts.forEach(orderProduct => {
        const orderProductItem = document.createElement('div');
        orderProductItem.innerHTML = orderProduct.title;
        orderProductItem.innerHTML += ` - ${orderProduct.orderItem.quantity}`;
        orderProductsList.appendChild(orderProductItem);
      

    });

}
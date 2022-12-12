
const btn = document.getElementById('btn');
const cart = document.getElementById('cart');

const cart_items = document.querySelector('.cart-items');

btn.addEventListener('click', () => {
    cart.classList.toggle('active');
    btn.classList.toggle('active');
});

document.addEventListener('click', (e) => {

    if(e.target.className == 'shop-item-button') {
       
        let item = e.target.parentElement.parentElement; // item is the div with class shop-item or addtocart button
        let title = item.querySelector('.shop-item-title').textContent;
        let price = item.querySelector('.itemPrice').textContent;
        let img = item.children[1].src;

        let newItem = document.createElement('div');
        newItem.classList.add('cart-item');
        newItem.innerHTML = `
            <img src="${img}" alt="">
            <div class="cart-item-info">
                <h4>${title}</h4>
                <p>${price}</p>
            </div>
            <button class="cart-item-button">Remove</button>
        `;

        cart_items.appendChild(newItem);
        showNotification('Item added to cart', false);


    }
});
function showNotification(message, iserror){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.style.backgroundColor = iserror ? 'red' : 'wheat';
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}</h4>`
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500)
}



const btn = document.getElementById('btn');
const cart = document.getElementById('cart');

const cart_items = document.querySelector('.cart-items');
window.addEventListener('load', () => {

    console.log('loaded');
    axios.get('http://localhost:5000/products').then((products) => {

        let productsList = products.data;
        let output = '';
        productsList.forEach((product) => {
            output += `
            <div class="shop-item">
                <div class="shop-item-image">
                    <img src="${product.imageUrl}" alt="">
                </div>
                <div class="shop-item-details">
                    <h4 class="shop-item-title">${product.title}</h4>
                    <h4 class="itemPrice">${product.price}</h4>
                </div>
                <div class="shop-item-button">
                    <button>Add to cart</button>
                </div>
            </div>
            `;
        });
        document.getElementById('maincourse').children[1].innerHTML = output;
        //console.log(output);
        console.log(products);
        
    }).catch(err=>console.log(err));
});

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
            
            <div class="cart-column cart-item-info">
                <img class="cartimg" src="${img}" alt="">
                <h4>${title}</h4>
            </div>
            <div class="cart-column cart-price">
                <h4>${price}</h4>
            </div>

            <button class="cart-item-button">Remove</button>
        `;

        cart_items.appendChild(newItem);
        showNotification(`Item ${title} was added to cart`, false);


    }
});
function showNotification(message, iserror){
    const container = document.getElementById('noti-container');
    const notification = document.createElement('div');
    notification.style.backgroundColor = iserror ? 'red' : 'wheat';
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}</h4>`
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500)
}



const btn = document.getElementById('btn');
const cart = document.getElementById('cart');
let productsList = [];
const cart_items = document.querySelector('.cart-items');
window.addEventListener('load', () => {

    console.log('loaded');
    axios.get('http://localhost:5000/products').then((products) => {

        productsList = products.data;
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
                    <button id='addbutn'>Add to cart</button>
                </div>
                <div class="itemid">
                    <h4 hidden>${product.id}</h4>
                </div>
            </div>
            `;
        });
        document.getElementById('maincourse').children[1].innerHTML = output;
        //console.log(output);
        //console.log(products);
        
    }).catch(err=>console.log(err));
});

btn.addEventListener('click', () => {
    
    
    cart.classList.toggle('active');
    btn.classList.toggle('active');
    axios.get('http://localhost:5000/cart').then((cartProducts) => {
        console.log(cartProducts);
        showCartProducts(cartProducts.data);
    }).catch(err => console.log(err));
});

document.addEventListener('click', (e) => {

    if(e.target.id == 'addbutn') {
       
        let title = e.target.parentElement.parentElement.children[1].children[0].textContent;
        let id = Number(document.querySelector('.itemid').textContent);
        axios.post('http://localhost:5000/cart', {
            id: id,
        }).then(res => {
            console.log(res);
        }).catch(err => console.log(err));
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

function showCartProducts(cartProducts) {
    
 cart_items.innerHTML = "";
 cartProducts.forEach((product) => {


    let title = product.title;
    let price = product.price;
    let img = product.imageUrl;
    //console.log(img);
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
 });
}
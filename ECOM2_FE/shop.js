
const btn = document.getElementById('btn');
const cart = document.getElementById('cart');
let productsList = [];
let cartItemsList = [];
const cart_items = document.querySelector('.cart-items');
window.addEventListener('load', () => {

    console.log('loaded');
    const page = 1;
    axios.get(`http://localhost:4000/products?page=${page}`).then((products) => {

    //console.log(products);    
    productsList = products.data.products;
    listProducts(productsList);
    showPagination(products.data,'shop');   
        
    }).catch(err=>console.log(err));
});

btn.addEventListener('click', () => {
    
    
    cart.classList.toggle('active');
    btn.classList.toggle('active');
    const page = 1;
    axios.get(`http://localhost:4000/cart?page=${page}`).then((cartProducts) => {
        
        console.log(cartProducts);
        cartItemsList = cartProducts.data.products;
        showCartProducts(cartProducts.data.products);
        showPagination(cartProducts.data,'cart');
    }).catch(err => console.log(err));
});

document.addEventListener('click', (e) => {

    if(e.target.id == 'addbutn') {
       
        let title = e.target.parentElement.parentElement.children[1].children[0].textContent;
        let id = productsList.find((product) => product.title == title).id; //find the id of the product
        //console.log(id);
        axios.post('http://localhost:4000/cart', {
            id: id,
            
        }).then(res => {
            if(res.status == 200) {
                console.log(res);
                showNotification(`Item ${title} was added to cart`, false);
                axios.get(`http://localhost:4000/cart?page=1`).then((cartProducts) => {

                    cartItemsList = cartProducts.data.products;
                    showCartProducts(cartProducts.data.products);
                    showPagination(cartProducts.data,'cart');
                }).catch(err => console.log(err));


            }
            else{
                throw new Error(response.data.message);
            }
        }).catch(err => {
            
            console.log(err);
            showNotification(err.message, true);
        });
     
        


    }
    if(e.target.id == 'remove') {
            
        let title = e.target.parentElement.children[0].children[1].textContent;
        let id = cartItemsList.find((product) => product.title == title).id; //find the id of the product
        removeFromCart(id,title);
    }
    if(e.target.id == 'checkout') {
       
        axios.post('http://localhost:4000/create-order').then((res) => {
            if(res.status == 200) {
                
                showNotification(`Order placed successfully`, false);
                axios.get(`http://localhost:4000/cart?page=1`).then((cartProducts) => {

                    cartItemsList = cartProducts.data.products;
                    showCartProducts(cartProducts.data.products);
                    showPagination(cartProducts.data,'cart');
                }).catch(err => console.log(err));
            }
        }).catch(err => {

            console.log(err);
            showNotification(err.message, true);
        });
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
    
 //console.log(cartProducts);
 cart_items.innerHTML = "";
 cartProducts.forEach((product) => {

    //console.log(product);
    let title = product.title;
    let price = product.price;
    let img = product.imageUrl;
    let quantity = product.quantity;
    //console.log(img);
    let newItem = document.createElement('div');
    newItem.classList.add('cart-row');
    newItem.innerHTML = `
    
        <span class="cart-column cart-item-info">
            <img class="cartimg" src="${img}" alt="">
            <h4>${title}</h4>
        </span>
        <span class="cart-column cart-price">
            <h4>₹. ${price}</h4>
        </span>
        <span class="cart-column cart-quantity">

            <h4>${quantity}</h4>

        </span>
      
        <button id ="remove"class="cart-item-button cart-column">Remove</button>
      
    
    `;
    cart_items.appendChild(newItem);
 });
}

function listProducts(productsList){

    let output = '';
    productsList.forEach((product) => {
        output += `
        <div class="shop-item">
            <div class="shop-item-image">
                <img src="${product.imageUrl}" alt="">
            </div>
            <div class="shop-item-details">
                <h4 class="shop-item-title">${product.title}</h4>
                <h4 class="itemPrice">₹. ${product.price}</h4>
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
}

function showPagination(pageData,flag) {

    if(flag == 'shop'){

        //console.log(pageData);
        const pagination = document.querySelector('.pagination');
        const prev = pageData.hasPreviousPage; 
        const next = pageData.hasNextPage;
        pagination.innerHTML = "";

        if(prev){

            const prevbtn = document.createElement('button');
            prevbtn.innerHTML = pageData.previousPage;
            prevbtn.addEventListener('click', () => getProducts(pageData.previousPage));
            pagination.appendChild(prevbtn);
        }
        const current = document.createElement('button');
        current.innerHTML = pageData.currentPage;
        pagination.appendChild(current);

        if(next){

            const nextbtn = document.createElement('button');
            nextbtn.innerHTML = pageData.nextPage;
            nextbtn.addEventListener('click', () => getProducts(pageData.nextPage));
            pagination.appendChild(nextbtn);
        }

    }
    else if(flag == 'cart'){

        console.log(pageData);
        const pagination = document.querySelector('.cart-pagination');
        const prev = pageData.hasPreviousPage; 
        const next = pageData.hasNextPage;
        pagination.innerHTML = "";

        if(prev){

            const prevbtn = document.createElement('button');
            prevbtn.innerHTML = pageData.previousPage;
            prevbtn.addEventListener('click', () => getCartProducts(pageData.previousPage));
            pagination.appendChild(prevbtn);
        }
        const current = document.createElement('button');
        current.innerHTML = pageData.currentPage;
        pagination.appendChild(current);

        if(next){

            const nextbtn = document.createElement('button');
            nextbtn.innerHTML = pageData.nextPage;
            nextbtn.addEventListener('click', () => getCartProducts(pageData.nextPage));
            pagination.appendChild(nextbtn);
        }

    }
    
}
    
function getProducts(page) {
    axios.get(`http://localhost:4000/products?page=${page}`).then((products) => {

        productsList = products.data.products;
        //console.log(productsList);
        listProducts(productsList);
        showPagination(products.data,'shop');
    }).catch(err => console.log(err));
}

function getCartProducts(page) {

    axios.get(`http://localhost:4000/cart?page=${page}`).then((cartProducts) => {
        
        console.log(cartProducts);
        cartItemsList = cartProducts.data.products;
        showCartProducts(cartProducts.data.products);
        showPagination(cartProducts.data,'cart');
    }).catch(err => console.log(err));
}

function removeFromCart(id,title) {
    
    axios.post(`http://localhost:4000/cart-delete-item/${id}`)
      .then(res => {
        if (res.status === 200) {
          showNotification(`Item ${title} was removed from the cart`, false);
          // Update the displayed list of products in the cart
          const page = 1;
          axios.get(`http://localhost:4000/cart?page=${page}`)
            .then((cartProducts) => {
              
              cartItemsList = cartProducts.data.products;
              showCartProducts(cartProducts.data.products);
              showPagination(cartProducts.data, 'cart');
            })
            .catch(err => console.log(err));
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch(err => {
        console.log(err);
        showNotification(err.message, true);
      });
  }
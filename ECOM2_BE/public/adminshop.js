const addprodbutton = document.getElementById('addprod');

addprodbutton.addEventListener('click', (e) => {

    axios.post('http://localhost:4000/admin/addproduct', {

        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        imageUrl: document.getElementById('image').value,
        description: document.getElementById('description').value

    }).then((res) => {

        console.log(res);

    }).catch((err) => {

        console.log(err);

    });
});


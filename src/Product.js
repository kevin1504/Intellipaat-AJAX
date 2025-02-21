import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
    retries: 3,
    retryDelay: () => 2000
})
function Product() {
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState(
        {
            "name": "",
            "description": "",
            "price": "",
            "quantity": ""
        }
    )

    const [editable, setEditable] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchProducts()
    }, [])

    const displayProducts = () => {
        const list = products.map(product => {
            return <li key={product._id}>    {product.name}  {product.description}  {product.price} {product.quantity}
                <button onClick={() => deleteProduct(product._id)}>Delete</button> &nbsp;
                <button onClick={() => editProduct(product)}>Edit</button>
            </li>
        })
        return list
    }

    const saveProduct = () => {
        console.log("save product");
        console.log(product);
        axios.put(`http://localhost:5000/products/${currentId}`, product).then(
            (response) => {
                if (response.data._id === currentId) {
                    fetchProducts();
                    clearValues();
                    setEditable(false);
                }
            },
            (error) => {
                alert("Something went wrong!")
            }
        )
    }

    const editProduct = (product) => {
        console.log("product: ", product)
        setProduct({
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "quantity": product.quantity
        })
        setEditable(true);
        setCurrentId(product._id);
    }

    const deleteProduct = (pid) => {

        axios.delete(`http://localhost:5000/products/${pid}`).then(
            (response) => {
                console.log(response)
                fetchProducts()
            },
            (error) => {
                console.log(error)
            }
        )
    }

    const addProduct = () => {
        console.log("product", product);
        axios.post("http://localhost:5000/products", product).then(
            (response) => {
                console.log(response)
                if (response.data._id) {
                    clearValues()
                    fetchProducts()
                }
            },
            (error) => {
                console.log(error)
            }
        )
    }

    const clearValues = () => {
        setProduct({
            "name": "",
            "description": "",
            "price": "",
            "quantity": ""
        })
    }

    const fetchProducts = async () => {
        const response = await axios.get("http://localhost:5000/products");
        if (response instanceof Error) {
            console.log("Error occured");

        } else {
            setProducts(response.data);
        }

    }

    // const fetchProducts = () => {
    //     axios.get("http://localhost:5000/products").then((response) => {
    //         console.log(response);
    //         let productList = response.data;
    //         setProducts(productList)
    //     },
    //         (error) => {
    //             console.log(error);
    //         })
    // }
    return (
        <div>
            <h1>Product Component</h1>


            <input type="text" placeholder="enter name" value={product.name} onChange={
                (event) => {
                    setProduct({ ...product, name: event.target.value })
                }
            }></input> <br></br><br></br>
            <input type="text" placeholder="enter description" value={product.description} onChange={
                (event) => {
                    setProduct({ ...product, description: event.target.value })
                }
            }></input> <br></br><br></br>
            <input type="text" placeholder="enter price" value={product.price} onChange={
                (event) => {
                    setProduct({ ...product, price: event.target.value })
                }
            }></input> <br></br><br></br>
            <input type="text" placeholder="enter quantity" value={product.quantity} onChange={
                (event) => {
                    setProduct({ ...product, quantity: event.target.value })
                }
            }></input> <br></br><br></br>

            {editable ? <button onClick={() => {
                saveProduct()
            }}>Update Product</button> : <button onClick={() => {
                addProduct()
            }}>Add Product</button>
            }

            <ul>
                {displayProducts()}
            </ul>


        </div>
    )

}
export default Product;
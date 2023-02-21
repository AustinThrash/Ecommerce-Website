//This is the Product app to display a Product
//Below are needed extensions
//import '../App.css';
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Modify() {
    //setting initialValues for the formik
    const initialValues = {
        title: "",
        productDesc: "",
        productPrice: "",
        productStock: "",
        productType: "",
    }
    //used to validate the input of the user
    const validationSchema = Yup.object().shape({
        title: Yup.string().min(3).max(255).required(),
        productDesc: Yup.string().min(3).max(255).required(),
        productPrice: Yup.string().min(0).max(255).required(),
        productStock: Yup.string().min(0).max(255).required(),
        productType: Yup.string().min(3).max(255).required(),
    })
    //Using the param passed in the navigate('/product/${value.id}') command used when clicking a product on the Products.js page
    let { id } = useParams();
    const [prodObject, setProductObject] = useState([]);
    const [loginStatus, setLoginStatus] = useState("")
    const [currentUser, setUser] = useState("")
    let navigate = useNavigate()
    
    //when submited a post request is made to update the product with the same id
    const onSubmit = (data) => {
            data.productPrice = parseFloat(data.productPrice, 10)
            data.productStock = parseInt(data.productStock, 10)
            axios.post("https://theshopaholicstore.com/api/products/update", {
                id: id,
                title: data.title,
                productDesc: data.productDesc,
                productPrice: data.productPrice,
                productStock: data.productStock,
                productType: data.productType,
            }).then((response) => {
                console.log(response);
            });
            

      };
    useEffect( () => {
        //get request with id variable, go to server/routes/Products.js to follow flow of information
        let user = sessionStorage.getItem('accessToken')
        axios.get(`https://theshopaholicstore.com/api/products/byId/${id}`).then((response) => {
            //setting response.data(Product loaded by id) to prodObject
            setProductObject(response.data)
            //this is just to see the response of the server for testing purposes. Use inspect on the webpage in your browser to read console log
            console.log(response)
            
        })
        //checking and setting login status. go to server/routes/Users.js to follow flow of information
        axios.get("https://theshopaholicstore.com/api/auth/login", {headers: {'accessToken': user }}).then((response) => {
            if(!response.data.user) {
              navigate('/home')
              window.location.reload(false);
                if(response.data.user.email !== 'admin@gmail.com'){
                  navigate('/home')
                  window.location.reload(false);
                }
            
            }
            if(response.data.user.email !== 'admin@gmail.com'){
                navigate('/home')
                window.location.reload(false);
            }
            setLoginStatus(response.data.loggedIn)
            setUser(response.data.user)

        })

    }, []);
    console.log(prodObject)
    function removeProduct(data){
        var answer = window.confirm("Do you want to delete this Product?");
        if(answer){
            axios.post("https://theshopaholicstore.com/api/products/deleteProduct", { id: id }).then((response) => {
              if(response.data == "Success"){
                navigate('/adminproducts')
                window.location.reload(true);
              }
            
            })
        }
    }
    function loggout() {
        sessionStorage.removeItem("accessToken");
        navigate('/home')
        window.location.reload(false);
    }
    
    return (
        <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="admin.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />
        <title>Admin Dashboard</title>
        <div className="container">
          <aside>
            <div className="top">
              <div className="logo">
                <img className ="im" src={require('../img/logo.png')} />
              </div>
              <div className="close" id="close-btn">
                <span className="material-icons-sharp">close</span>
              </div>
            </div>
            <div className="sidebar">
              <a href="/admin" >
                <span className="material-icons-sharp">dashboard</span>
                <h3>Dashboard</h3>
              </a>
              <a href="/adminproducts" className="active">
                <span className="material-icons-sharp">inventory</span>
                <h3>Products</h3>
              </a>
              <a href="/admincoupons">
                <span className="material-icons-sharp">discount</span>
                <h3>Coupons</h3>
              </a>
              <a href="/adminorders">
                <span className="material-icons-sharp">receipt_long</span>
                <h3>Orders</h3>
              </a>
              <a href="/admincustomers">
                <span className="material-icons-sharp">person_outline</span>
                <h3>Customers</h3>
              </a>
              <a>
                <span className="material-icons-sharp">logout</span>
                <h3 onClick={() => {loggout();}}>Logout</h3>
              </a>
            </div>
          </aside>
          {/*-----------END OF ASIDE----------*/}
          <main>
            <h1>Product</h1>
            {/*-----------End of Insights-----------*/}
            
        {prodObject.map(data =>
        <section id="details" className="section-p1">
        <div className="single-img">
            <img src={require(process.env.PUBLIC_URL + `${data.productImg}`)} alt="" width="100%" id="main-img" />
        </div>
        <div className="form-inner" style={{width: "100%",margin: "auto"}}>
        <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        >
            <Form className="formContainer">
                <div className="field">
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="title"
                    placeholder={data.title}
                />
                </div>
                <div className="field">
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="productDesc"
                    placeholder={data.productDesc}
                />
                </div>
                <div className="field">
                <Field
                    autoComplete="off"
                    type="number"
                    id="updateProduct"
                    name="productPrice"
                    placeholder={data.productPrice}
                />
                </div>
                <div className="field">
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="productStock"
                    placeholder={data.productStock}
                />
                </div>
                <div className="field">
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="productType"
                    placeholder={data.productType}
                />
                </div>
                <div className="field btn">
                    <div className="btn-layer"></div>
                    <input type="submit" value="Update"/>
                </div>
            </Form>
        </Formik>
        </div>
        </section>
        )}
        <div id="adminCoupon"><button className="normal" onClick={() => {removeProduct({id: id})}}>Remove Product</button></div>
          </main>
          {/*-----------End of Main-----------*/}
        </div>
      </div>
    );


}

export default Modify;
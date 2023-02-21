import './admin.css'
import { React, useEffect, useState, useMemo } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '@fortawesome/fontawesome-svg-core/styles.css'
//Used to sort the data in the table
const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          console.log("accend")
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
    
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
//Displays the table with ability to sort columns
const ProductTable = (props) => {
  let navigate = useNavigate()
  const { items, requestSort, sortConfig } = useSortableData(props.products);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      
      return;
    }
    
    return sortConfig.key === name ? sortConfig.direction : undefined;
    
  };
  return (
    <div className="recent-orders">
    <table>
      <thead>
        <tr>
        <th>
            Image
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('title')}
              className={getClassNamesFor('title')}
            >
              Name
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('productPrice')}
              className={getClassNamesFor('productPrice')}
            >
              Price
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('productStock')}
              className={getClassNamesFor('productStock')}
            >
              In Stock
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} onClick={() => {navigate(`/modify/${item.id}`)}}>
            <img src={require(process.env.PUBLIC_URL + `${item.productImg}`)} alt="" />
            <td>{item.title}</td>
            <td>${item.productPrice}</td>
            <td>{item.productStock}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};


function AdminProducts() {
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
      productPrice: Yup.number().min(0).max(255).required(),
      productStock: Yup.number().min(0).max(255).required(),
      productType: Yup.string().min(3).max(255).required(),
    })
    let navigate = useNavigate()
    const [listOfProducts, setListOfProducts] = useState([]);
    const [currentInventory, setCurrentInventory] = useState([]);
    const [currentUser, setUser] = useState("")
    const [loginStatus, setLoginStatus] = useState("")
    function loggout() {
        sessionStorage.removeItem("accessToken");
        navigate('/home')
        window.location.reload(false);
    }
    useEffect(() => {
        let user = sessionStorage.getItem('accessToken')
        //Checking to see if user is signed in and if admin, if not, send to /home
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
        })
        //gets lists of both in and out of stock items.
        //will create a different call for this so that 
        //it gets all the items together no matter the stock
        axios.get("https://theshopaholicstore.com/api/products/allProducts").then((response) => {
            setListOfProducts(response.data)
        })
        

    }, [])
    function current_Inventory() {
      var currInventory = 0
        for(let i = 0; i < (listOfProducts).length; i++){
          currInventory = currInventory + listOfProducts[i].productStock
        }
        return(currInventory)
    }
    const onSubmit = (data) => {
      axios.post("https://theshopaholicstore.com/api/products/addProduct", data).then((response) => {
            if(response.data == "Success"){
                navigate('/adminproducts')
                window.location.reload(false);
            }
        })
      

    };

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
            <h1>Products</h1>
            {/*-----------End of Insights-----------*/}
            <div className="recent-orders">
            <h2>Add a new Product</h2>
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
                    placeholder="Product Title"
                />
                </div>
                <div className="field">
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="productDesc"
                    placeholder="Description"
                />
                </div>
                <div className="field">
                <Field
                    autoComplete="off"
                    type="number"
                    id="updateProduct"
                    name="productPrice"
                    placeholder="Price"
                />
                </div>
                <div className="field">
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="productStock"
                    placeholder="Stock"
                />
                </div>
                <div className="field">
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="productType"
                    placeholder="Type"
                />
                </div>
                <div className="field btn">
                    <div className="btn-layer"></div>
                    <input type="submit" value="Add Product"/>
                </div>
            </Form>
        </Formik>
        </div>
        <div></div>
              <h2>~Currently Offered~</h2>
              <ProductTable
                products={listOfProducts}
              />
            </div>
          </main>
          {/*-----------End of Main-----------*/}
        </div>
      </div>
    
  )
}

export default AdminProducts
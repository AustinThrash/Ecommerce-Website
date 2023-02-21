import './admin.css'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { React, useEffect, useState, useMemo } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup";

function AdminCoupons() {
  const [listOfCoupons, setListOfCoupons] = useState([]);
  const initialValues = {
    couponName: "",
    couponAmount: "",
  }
  const validationSchema = Yup.object().shape({
    couponName: Yup.string().min(3).max(20).required (),
    couponAmount: Yup.number().min(0).required(),
  })
  const onSubmit = (data) => {
    axios.post("https://theshopaholicstore.com/api/auth/createCoupon", data).then((response) => {
      console.log(response.data);

    });
    
  };
  const removeCoupon = (data) => {
    axios.post("https://theshopaholicstore.com/api/auth/removeCoupon", data).then((response) => {
      console.log(response.data);

    });
    
  };


  let navigate = useNavigate()
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
        axios.get("https://theshopaholicstore.com/api/auth/getCoupons").then((response) => {
          setListOfCoupons(response.data)
        })
    })
    
  })
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
              <a href="/admin">
                <span className="material-icons-sharp">dashboard</span>
                <h3>Dashboard</h3>
              </a>
              <a href="/adminproducts">
                <span className="material-icons-sharp">inventory</span>
                <h3>Products</h3>
              </a>
              <a href="/admincoupons" className="active">
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
          {/*<div class="container2">*/}
          <main>
          <div className="recent-orders">
            <h1>Discount Coupons</h1>
            <div className="form-inner" style={{width: "200px",margin: "auto"}}>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              <Form className="formContainer">
                <div className="field"><div>
                <ErrorMessage name="couponName" component="span" />
                </div>
               <Field
                 autoComplete="off"
                  id="inputCreatePost"
                  name="couponName"
                  placeholder="Coupon Name"
                />
              </div>
              <div className="field">
                <ErrorMessage name="couponAmount" component="span" />
                <Field
                 autoComplete="off"
                 id="inputCreatePost"
                 name="couponAmount"
                 placeholder="Coupon Amount"
                />
             </div>
              <div className="field btn">
                  <div className="bt-layer"></div>
                  <input type="submit" value="Add Coupon"/>
              </div>
              </Form>
            </Formik>
            </div>
            <table>
              <thead>
                <tr>
                <th>
                  Name:
                </th>
                <th>
                  Amount:
                </th>
                <th>
              
                </th>
                </tr>
              </thead>
              <tbody>
              {listOfCoupons.map((item) => (
                <tr key={item.id}>
                  <td>{item.couponName}</td>
                  <td>{item.couponAmount}</td>
                  <td><div id="adminCoupon"><button className="normal" onClick={() => {removeCoupon({id: item.id})}}>Remove</button></div></td>
                </tr>
              ))}
              </tbody>
            </table>
            
          </div>
          </main>
        </div>
      </div>
  )
}

export default AdminCoupons
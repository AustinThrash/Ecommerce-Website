//Current userdashboard just includes logout button. Will contain account settings, current and maybe previous orders.
import { React, useEffect, useState, useMemo } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"

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
  function cartInfo(data) {
    var dataJSON = JSON.parse(data)
    console.log(dataJSON)
    return(
    <p>
    {dataJSON.map((item) => (
      <p>Product Id: {item.productId} <br/>
      Quantity: {item.productQuantity}</p>
    ))}
    </p>
    )

  }
  function orderStatus(data) {
    
    if(data) {
      return <p className="success">Fulfilled</p>
    } else {
      return <p className="danger">Not Fulfilled</p>
    }
  }
    
  
  return (
    <table>
      <thead>
        <tr>
          <th>
              Shipping Info:
          </th>
          <th>
              Cart Info:
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('cartTotal')}
              className={getClassNamesFor('cartTotal')}
            >
              Cart Total:
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('createdAt')}
              className={getClassNamesFor('createdAt')}
            >
              Order Date:
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('orderStatus')}
              className={getClassNamesFor('orderStatus')}
            >
              Order Status:
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.shippingInfo.split("\n")[0]}<br/>{item.shippingInfo.split("\n")[1]}</td>
            <td>{cartInfo(item.cartInfo)}</td>
            <td>${item.cartTotal}</td>
            <td>{item.createdAt.slice(0,-14)}</td>
            <td>{orderStatus(item.orderStatus)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function UserDashboard() {
    let navigate = useNavigate()
    const [currentUser, setUser] = useState("")
    const [loginStatus, setLoginStatus] = useState("")
    const [userOrders, setUserOrders] = useState("")
    function loggout() {
        sessionStorage.removeItem("accessToken");
        navigate('/home')
        window.location.reload(false);
    }
    
    useEffect(async () => {
        //sending a get request to this url
        let user = sessionStorage.getItem('accessToken')
        axios.get("https://theshopaholicstore.com/api/auth/login", {headers: {'accessToken': user }}).then((response) => {
            
            if(!response.data.user) {
                navigate('/home')
                window.location.reload(false);
                
            }
            setUser(response.data.user)
            
            axios.get("https://theshopaholicstore.com/api/auth/getUserOrders", {headers: {'accessToken': user }}).then((response) => {
                setUserOrders(response.data)
              
            })
        })
        
      }, [])
      console.log(currentUser)
  return (
    <div>
        <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="css/style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
        <title>User Dashboard</title>
        <section id="header">
          <a href="#"><img src="img/logo.png" className="logo" alt="" width="300px" height="auto" /></a>
          <div>
            <ul id="navbar">
              <li><a href="/home">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/cart"><i className="fa-solid fa-bag-shopping" /></a></li>
              <li><a id="dashBoard"><button className="normal" onClick={() => {loggout()}}>Logout</button></a></li>
            </ul>
          </div>
        </section>
        <section id="dash-header">
          <h2>Hello, {currentUser.email}!</h2>
          <p>User Dashboard</p>
        </section>
        <h2 className="dash-h2">Order History</h2>
        <section id="or-his">
          <ProductTable
                products={userOrders}
              />
        </section>
        <footer className="section-p1">
          <div className="col">
            <img className="logo" src="img/logo.png" alt="" width="300px" height="auto" />
            <h4>Contact</h4>
            <p><strong>Address: </strong> 1 UTSA circle blvd, San Antonio TX</p>
            <p><strong>Phone: </strong> +1 210 123 4567</p>
            <div className="follow">
              <h4>Follow Us</h4>
              <div className="icon">
                <i className="fab fa-facebook-f" />
                <i className="fab fa-twitter" />
                <i className="fab fa-instagram" />
              </div>
            </div>
          </div>
          <div className="col">
            <h4>About</h4>
            <a href="#">About Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="col">
            <h4>My Account</h4>
            <a href="/login">Sign In</a>
            <a href="/cart">View Cart</a>
            <a href="/about">Help</a>
          </div>
          <div className="col install">
            <h4>Install App</h4>
            <p>From App Store or Google Play</p>
            <div className="row">
              <img src="img/pay/app.jpg" alt="" />
              <img src="img/pay/play.jpg" alt="" />
            </div>
            <p>Secured Payment Gateways</p>
            <img src="img/pay/pay.png" alt="" />
          </div>
          <div className="copyright">
            <p>© 2022 Shopaholic, Inc.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default UserDashboard
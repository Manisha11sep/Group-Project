import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import {getProducts, getProduct, actions, reducedData } from "../ducks/reducer";
import "../Styling/shop.css";
import Button from "@material-ui/core/Button";
import Product from './product'
import Popup from "reactjs-popup";
import { withStyles } from '@material-ui/core/styles';

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      filteredData: [],
      open: false
    };
  }
  

  componentDidMount(props) {
    axios.get("/api/shop")
      .then(products => {
        this.props.getProducts(products.data);
      })
      .catch(err => {
        console.log(err);
      });
      this.props.getCart()
  }

  openModal = () => {
    this.setState({ open: true });
  };
  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const reduced = this.props.products.reduce((arr, current) => {
      if (!arr.length) {
        arr.push({
          name: current.productname,
          category: current.productcategory,
          products: [current]
        });
        return arr;
      }
      let i = arr.findIndex(e => {
        return e.name === current.productname;
      });
      if (i !== -1) {
        arr[i].products.push(current);

        return arr;
      } else {
        arr.push({
          name: current.productname,
          category: current.productcategory,
          products: [current]
        });
        return arr;
      }
    }, []);

    const filterCategory = category => {
      const filtered = reduced.filter(
        item => item.category === category
      );
      this.setState({ filteredData: filtered });
    };

    const products = reduced.map((e,i) => {
      return <div key={i} className='item'>
                  <div className='item-contain'
                    onClick={() => this.props.getProduct({ 
                      name: e.products[0].productname, 
                      image: e.products[0].productimage, 
                      price: e.products[0].productprice, 
                      info: e.products[0].productcartdesc, 
                      subinfo: e.products[0].productshortdesc, 
                      details: e.products}) && this.openModal()}
                    >
                    <p>{e.name}</p>
                    <img src ={e.products[0].productimage} alt={e.products[0].productname}/>
                    <p>${e.products[0].productprice}</p>
      
                    <p className='stock'>
                      {e.products[0].productstock <=0
                      ? 'out-of-stock' 
                      : e.products[0].productstock >0 && e.products[0].productstock <= 10 
                      ? 'limited-stock' 
                      : 'in-stock'}
                    </p>
                  </div>
              </div>
            })

    const filtered = this.state.filteredData.length ? this.state.filteredData.map((e,i) => {
      return <div key={i} className='item'>
                  <div className='item-contain'
                    onClick={() => this.props.getProduct({ 
                      name: e.products[0].productname, 
                      image: e.products[0].productimage, 
                      price: e.products[0].productprice, 
                      info: e.products[0].productcartdesc, 
                      subinfo: e.products[0].productshortdesc, 
                      details: e.products}) && this.openModal()}
                    >
                    <h3>{e.name}</h3>
                    <img src ={e.products[0].productimage} alt={e.products[0].productname}/>
                    <p>${e.products[0].productprice}</p>
      
                    <p className='stock'>
                      {e.products[0].productstock <=0
                      ? 'out-of-stock' 
                      : e.products[0].productstock >0 && e.products[0].productstock <= 10 
                      ? 'limited-stock' 
                      : 'in-stock'}
                    </p>
                  </div>
              </div>
            })
          : null
      
    return (
      <div className="popup-content">
         <Popup 
          open={this.state.open}
          closeOnDocumentClick
          onClose={this.closeModal}
        >
          <div className="modal">
            <a className="close" onClick={this.closeModal}>
              &times;
            </a>
            <br/>
            <Product/>
          </div>
        </Popup>
        <div>
          {
            (this.state.filteredData.length!==0)
          ?
          <div className="container">
            <div className="sidebar">
      
              <Button variant="raised" color="primary"
          
                color="primary"
                value="T-shirts"
                onClick={() => filterCategory("shirt")}
              >
                T-shirts
                
              </Button>
        

              <Button className="buttons"variant="raised"
                color="primary"
                value="Jeans"
                onClick={() => filterCategory("pant")}
              >
                Jeans
              </Button>

              <Button className="buttons"variant="raised"
                color="primary"
                value="Shoes"
                onClick={() => filterCategory("shoe")}
              >
                Shoes
              </Button>

              <Button className="buttons"variant="raised"
                color="primary"
                value="Watch"
                onClick={() => filterCategory("accessory")}
              >
                Accessory
              </Button>

              <Button className="buttons"variant="raised"
                color="primary"
                value="All"
                onClick={() => filterCategory(null)}
              >
                All
              </Button>
        </div>
           { filtered }
           <div className="footer">footer component here</div>
        </div>
          :
          <div className="container">
            <div className="sidebar">
              <Button className="buttons"variant="raised"
                color="primary"
                value="T-shirts"
                onClick={() => filterCategory("shirt")}
              >
                T-shirts
              </Button>

              <Button className="buttons"variant="raised"
                color="primary"
                value="Jeans"
                onClick={() => filterCategory("pant")}
              >
                Jeans
              </Button>

              <Button className="buttons"variant="raised"
                color="primary"
                value="Shoes"
                onClick={() => filterCategory("shoe")}
              >
                Shoes
              </Button>

              <Button className="buttons"variant="raised" color="primary"
                value="Watch"
                onClick={() => filterCategory("accessory")}
              >
                Accessory
              </Button>
            
        </div>
           { products }
          </div>
        }
     </div>
    </div>
    );
  }
}

const mapDispatchToProps = {
  ...actions,
  getProducts,
  getProduct,
  reducedData
}

const mapStateToProps = state => {
  return {
    products: state.products,
    product: state.product,
    reducedDataItems: state.reducedDataItems
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Shop);
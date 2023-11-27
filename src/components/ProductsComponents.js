import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsComponent = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/products/?productname=${searchQuery}`);
            console.log('Response:', response.data); // Add this log
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [searchQuery]);
    return (
    <div>
            <h1>Product List</h1>
            <div>
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search by product name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button type="submit">Search</button>
            </form>
            </div>       
    <div style={flexContainerStyle}>
       <div></div>
      {products.map((product) => (
        <div key={product.productid} style={cardStyle}>
          <div style={productNameStyle}>{product.productname}</div>
          <img src={product.productimage} alt={product.productname} style={productImageStyle} />
          <div style={productPriceStyle}>${product.productprice}</div>
        </div>
      ))} 
    </div>
</div>
    );
};

const flexContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width:'100%', // Adjust as needed
    height:'100%'
};
const ChatContainerStyle = {
    backgroundColor: '#f0f0f0',
    width:'30%',
    height:'50%', // Adjust as needed
    flexDirection:'row',
    display:'flex',
    justifyContent: 'flex-end'

}; 
  const cardStyle = {
    height: '200px',
    width: '300px',
    border: '1px solid #ddd',
    margin: '10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
  };
  
  const productNameStyle = {
    paddingTop: '5px', // Adjust as needed
    fontWeight: 'bold',
  };
  
  const productImageStyle = {
    maxHeight: '70%', // Adjust as needed
    maxWidth: '100%',
    backgroundColor: '#f0f0f0',
  };
  
  const productPriceStyle = {
    paddingTop: '5px', // Adjust as needed
  };
  
export default ProductsComponent;

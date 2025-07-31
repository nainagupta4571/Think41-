import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">🔙 Back to List</Link>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} style={{ width: '200px' }} />
      <p><strong>Description:</strong> {product.description || 'N/A'}</p>
      <p><strong>Price:</strong> ₹{product.price || 'N/A'}</p>
      <p><strong>Department:</strong> {product.department}</p>
    </div>
  );
}

export default ProductDetails;

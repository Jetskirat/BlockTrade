import { useState, useContext, useEffect, useCallback } from 'react';
import { MarketplaceContext } from '../../context/Marketplace.jsx';

const Home = () => {
  const { createProduct, purchaseProduct, getProducts, currentAccount, connectWallet } = useContext(MarketplaceContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error while fetching products:', error);
      setErrorMessage('Error while fetching products');
    }
  }, [getProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const product = { name, price };
    try {
      await createProduct(product);
      setErrorMessage('');
      setName('');
      setPrice('');
      fetchProducts();
    } catch (error) {
      console.error('Error while creating product:', error);
      setErrorMessage(error.message || 'Error while creating product');
    }
  };

  const handlePurchaseProduct = async (id, price) => {
    try {
      await purchaseProduct(id, price);
      fetchProducts();
    } catch (error) {
      console.error('Error while purchasing product:', error);
      setErrorMessage(error.message || 'Error while purchasing product');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Marketplace</h1>
      {!currentAccount ? (
        <button
          style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginBottom: '20px' }}
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ marginTop: '10px' }}>Connected Wallet: {currentAccount}</p>
        </div>
      )}
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>Create Product</h2>
      <form onSubmit={handleCreateProduct} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px' }}>Name:</label>
          <input
            style={{ width: '100%', padding: '10px' }}
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontSize: '16px', marginBottom: '5px' }}>Price:</label>
          <input
            style={{ width: '100%', padding: '10px' }}
            type='number'
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>
        <button
          type='submit'
          style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}
        >
          Create Product
        </button>
        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
      </form>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>Products</h2>
      <div>
        {products.map((product, index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{product.name}</h3>
            <p>Price: {product.price}</p>
            <p>Owner: {product.owner}</p>
            <p>Purchased: {product.purchased ? 'Yes' : 'No'}</p>
            {!product.purchased && (
              <button
                onClick={() => handlePurchaseProduct(product.id, product.price)}
                style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}
              >
                Purchase
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

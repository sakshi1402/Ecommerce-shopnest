import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handlePayment = async () => {
    try {
      const orderRes = await fetch('/api/payment/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert('Payment initialization failed');
        return;
      }

      const options = {
        key: 'rzp_test_T5XlW0Ahx1nxp8',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'ShopNest',
        description: 'Test Transaction',
        order_id: orderData.order.id,

        handler: async function (response) {
          try {
            console.log('Razorpay Response:', response);

            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            console.log('Verify Response:', verifyData);

            if (!verifyRes.ok) {
              alert('Payment verification failed');
              return;
            }

            // Backend schema ke according transform
            const orderItems = cartItems.map((item) => ({
              productId: item.productId || item._id,
              quantity: item.qty,
              price: item.price,
            }));

            const saveOrderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                items: orderItems,
                totalAmount: totalPrice,
                address,
                paymentId: response.razorpay_payment_id,
              }),
            });

            const saveOrderData = await saveOrderRes.json();

            console.log('Save Order Response:', saveOrderData);

            if (!saveOrderRes.ok) {
              alert(saveOrderData.message || 'Order saving failed');
              return;
            }

            dispatch(clearCart());
            navigate('/ordersuccess');
          } catch (error) {
            console.error('Order Save Error:', error);
          }
        },

        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999',
        },

        theme: {
          color: '#f97316',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment Error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }

    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>

          <input
            type="text"
            placeholder="Full Name"
            required
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Street"
            required
            value={address.street}
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="City"
            required
            value={address.city}
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="State"
            required
            value={address.state}
            onChange={(e) =>
              setAddress({ ...address, state: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Postal Code"
            required
            value={address.postalCode}
            onChange={(e) =>
              setAddress({ ...address, postalCode: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Country"
            required
            value={address.country}
            onChange={(e) =>
              setAddress({ ...address, country: e.target.value })
            }
          />

          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>

            <button type="submit" className="btn">
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
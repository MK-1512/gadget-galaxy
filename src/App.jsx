import React, { useEffect } from 'react'; // NEW: Import useEffect
import { useDispatch, useSelector } from 'react-redux'; // NEW: Import hooks
import { fetchProducts } from './redux/features/productsSlice'; // NEW: Import fetch action
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const productStatus = useSelector(state => state.products.status); // NEW: Get product status

  // NEW: Effect to fetch all products on initial app load
  useEffect(() => {
    // We only want to fetch if the status is 'idle' (i.e., they haven't been fetched yet)
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productStatus, dispatch]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
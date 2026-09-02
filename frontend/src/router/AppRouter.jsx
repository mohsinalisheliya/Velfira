import { Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Customer pages
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";
import MyAccount from "../pages/MyAccount";
import OrderHistory from "../pages/OrderHistory";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

// Admin pages
import AdminLogin from "../admin/AdminLogin";
import AdminLayout from "../admin/AdminLayout";
import Dashboard from "../admin/Dashboard";
import ProductList from "../admin/products/ProductList";
import ProductForm from "../admin/products/ProductForm";
import OrderList from "../admin/orders/OrderList";
import CouponList from "../admin/coupons/CouponList";
import BannerList from "../admin/banners/BannerList";
import LogViewer from "../admin/logs/LogViewer";
import ThemeList from "../admin/themes/ThemeList";
import AdminRoute from "./AdminRoute";

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {/* ===== Customer-facing routes ===== */}
      <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
      <Route path="/product/:slug" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
      <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
      <Route path="/order-confirmation/:orderId" element={<CustomerLayout><OrderConfirmation /></CustomerLayout>} />
      <Route path="/account" element={<CustomerLayout><MyAccount /></CustomerLayout>} />
      <Route path="/account/orders" element={<CustomerLayout><OrderHistory /></CustomerLayout>} />
      <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
      <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />

      {/* ===== Admin routes — completely separate layout, no customer Navbar/Footer ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="coupons" element={<CouponList />} />
        <Route path="banners" element={<BannerList />} />
        <Route path="logs" element={<LogViewer />} />
        <Route path="themes" element={<ThemeList />} />
      </Route>

      <Route path="*" element={<CustomerLayout><NotFound /></CustomerLayout>} />
    </Routes>
  );
}
import SideBar from "../components/SideBar";
import { getCategories } from "../api/categoriesService";
import { getProductsByCategory } from "../api/productsService";
import React, { useEffect } from "react";
import { baseUrlImage } from "../api/apiConfig";
import { createCart } from "../api/cartService";
import { createProductInCart, getProductsByIdCart } from "../api/productsInCartService";

interface Category {
  id_categoria_productos: number;
  nombre: string;
  descripcion: string;
}
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id_productos: number;
  nombre: string;
  precio: number;
  descripcion: string;
  id_categoria: number;
  peso: number;
  imagen: string | null;
}

interface ProductInCart {
  id_carrito: number | null;
  id_producto: number;
  producto: Product;
  cantidad_producto: number;
}

function ListProductsUsers() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [productsInCart, setProductsInCart] = React.useState<ProductInCart[]>([]);
  const [user, setUser] = React.useState<User>();
  const [cartOpen, setCartOpen] = React.useState(false);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data.categorias);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });

    const userJSON = localStorage.getItem("user");
    if (userJSON !== null) {
      const user = JSON.parse(userJSON);
      setUser(user);
      console.log("uservar: ", user);
      createCart({ id_user: user.id, costo_total: 0 })
        .then((createdCart) => {
          if (createdCart.carrito_id) {
            localStorage.setItem("id_carrito", createdCart.carrito_id);
            refreshCart(createdCart.carrito_id)
          }
          if (createdCart.id_carritos) {
            localStorage.setItem("id_carrito", createdCart.id_carritos);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    } else {
      console.error("El usuario no está en el almacenamiento local");
    }
  }, []);

  const refreshProductsInCart = (id_producto: number) => {
    const id_carrito_string = localStorage.getItem("id_carrito");
    const id_carrito = id_carrito_string ? parseInt(id_carrito_string, 10) : null;

    const productInCart: ProductInCart = {
      id_carrito: id_carrito,
      id_producto: id_producto,
      producto: {} as Product,
      cantidad_producto: 1,
    };

    createProductInCart(productInCart)
      .then((createdCart) => {
        if (createdCart) {
          console.log("Producto añadido:", createdCart);
          refreshCart(createdCart.id_carrito);
        } else {
          console.error("Error al agregar el producto al carrito");
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const handleCategoryClick = (category: Category) => {
    setLoading(true);
    setSelectedCategory(category);
    getProductsByCategory(category.id_categoria_productos)
      .then((data) => {
        console.log("Datos recibidos:", data);
        setProducts(data.productos);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
        setProducts([]);
        setLoading(false);
      });
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const refreshCart = (id_cart: number) => {
    getProductsByIdCart(id_cart)
      .then((data) => {
        console.log("Datos recibidos:", data);
        setProductsInCart(data);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  };

  const calculateTotal = () => {
    return productsInCart.reduce((total, item) => total + (item.producto.precio * item.cantidad_producto), 0);
  };

  return (
    <div className="row">
      <SideBar />
      <div
        className={`column ${cartOpen ? "w-50" : "w-75"} ps-5 pe-5`}
        style={{ height: 600, borderRadius: 10 }}
      >
        <div className="d-flex flex-row-reverse">
          <div className="p-2" onClick={toggleCart}>
            <div className="position-relative">
              <i className="bi-cart" style={{ fontSize: "20px", color: "#686B75" }}></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ backgroundColor: "#353C59" }}>
                {productsInCart.length}
                <span className="visually-hidden">unread messages</span>
              </span>
            </div>
          </div>
          <div className="p-2 fw-semibold d-flex align-self-center">
            Hola {user?.name}
          </div>
        </div>
        <div className="column d-flex justify-content-center mt-1" style={{ height: 50 }}>
          <p className="align-self-center fw-normal" style={{ color: "#686B75" }}>
            Agrega a tu carrito los artículos que deseas comprar
          </p>
        </div>
        <div>
          <ul className="nav nav-tabs">
            {categories.map((category) => (
              <li className="nav-item" key={category.id_categoria_productos}>
                <a
                  className={`nav-link ${selectedCategory?.id_categoria_productos === category.id_categoria_productos ? "active" : ""}`}
                  style={{ color: "black", cursor: "pointer" }}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.nombre}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 w-100" style={{ overflowY: "scroll", maxHeight: "430px" }}>
          {loading ? (
            <p>Cargando categorías...</p>
          ) : selectedCategory ? (
            <div>
              <div className="row">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div className={`${cartOpen ? "col-md-4" : "col-md-3"} mb-3 h-50`} key={product.id_productos}>
                      <div className="card p-1" style={{ backgroundColor: "#E0E3F0" }}>
                        {product.imagen && (
                          <img
                            src={`${baseUrlImage + product.imagen}`}
                            className="card-img-top d-flex align-self-center"
                            style={{ width: "auto", height: "100px" }}
                            alt={product.nombre}
                          />
                        )}
                        <div className="card-body d-flex flex-column h-50">
                          <div style={{ backgroundColor: "white", borderRadius: 10, padding: 5 }}>
                            <p className="card-title">{product.nombre}</p>
                            <p className="card-text fw-semibold">${product.precio}</p>
                          </div>
                          <div onClick={() => refreshProductsInCart(product.id_productos)}>
                            <a href="#" className="btn btn-primary d-flex justify-content-center w-100 mt-1" style={{ backgroundColor: "#353C59", color: "white" }}>
                              Agregar
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay productos disponibles en esta categoría.</p>
                )}
              </div>
            </div>
          ) : (
            <p>Bienvenido a StrappBerry seleccione una categoria</p>
          )}
        </div>
      </div>
      {cartOpen && (
        <div className="column w-25">
          <div className="row" style={{ height: "10%" }}>
            <h5>Mi carrito</h5>
          </div>
          <div className="row" style={{ maxHeight:400, overflowY: "scroll" }}>
            {productsInCart.map((productInCart) => (
              <div className="col-12 mb-2" key={productInCart.id_producto}>
                <div className="card p-1" style={{ backgroundColor: "#E0E3F0" }}>
                  {productInCart.producto.imagen && (
                    <img
                      src={`${baseUrlImage + productInCart.producto.imagen}`}
                      className="card-img-top d-flex align-self-center"
                      style={{ width: "auto", height: "100px" }}
                      alt={productInCart.producto.nombre}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <div style={{ backgroundColor: "white", borderRadius: 10, padding: 5 }}>
                      <p className="card-title">{productInCart.producto.nombre}</p>
                      <p className="card-text fw-semibold">Precio: ${productInCart.producto.precio}</p>
                      <p className="card-text">Cantidad: {productInCart.cantidad_producto}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row" style={{ height: "20%" }}>
            <h5 className="d-flex justify-content-center">Total: ${calculateTotal()}</h5>
            <div className="d-flex justify-content-center h-25">
              <a href="#" className="btn d-flex justify-content-center align-self-center w-75" style={{ backgroundColor: "#353C59", color: "white" }}>
                Comprar ahora
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListProductsUsers;

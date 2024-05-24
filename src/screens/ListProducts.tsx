import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import {
  getProducts,
  deleteProduct,
  updateProduct, // Asegúrate de importar la función de actualización
} from "../api/productsService";
import { baseUrlImage } from "../api/apiConfig";

interface Product {
  id_productos: number;
  nombre: string;
  precio: number;
  descripcion: string;
  id_categoria: number;
  peso: number;
  imagen: File | null;
}

function ListProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.productos);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  }, []);

  async function refreshProducts() {
    getProducts()
      .then((data) => {
        console.log("Datos recibidos:", data);
        setProducts(data.productos);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  }

  const handleDelete = async (id_producto: number) => {
    try {
      await deleteProduct(id_producto);
      await refreshProducts();
      Swal.fire({
        title: "¡Producto eliminado exitosamente!",
        icon: "success",
        confirmButtonText: "Ok :D",
      });
    } catch (error) {
      Swal.fire({
        title: "¡No se pudo eliminar el producto!",
        icon: "error",
        confirmButtonText: "Ok :(",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    console.log(currentProduct);
    setShowModal(true);
  };

  const handleSave = async () => {
    console.log(currentProduct);
    if (currentProduct) {
      try {
        await updateProduct(currentProduct.id_productos, currentProduct);
        await refreshProducts();
        setShowModal(false);
        Swal.fire({
          title: "¡Producto actualizado exitosamente!",
          icon: "success",
          confirmButtonText: "Ok :D",
        });
      } catch (error) {
        Swal.fire({
          title: "¡No se pudo actualizar el producto!",
          icon: "error",
          confirmButtonText: "Ok :(",
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentProduct && e.target.files) {
      setCurrentProduct({
        ...currentProduct,
        imagen: e.target.files[0],
      });
    }
  };

  return (
    <div className="row">
      <SideBar />
      <div
        className="column w-75 ps-5 pe-5"
        style={{
          height: 600,
          backgroundColor: "white",
          borderRadius: 10,
        }}
      >
        <div
          className="column d-flex justify-content-center mt-1"
          style={{
            height: 50,
            backgroundColor: "#353C59",
            borderRadius: 10,
          }}
        >
          <h5
            className="align-self-center fw-normal"
            style={{ color: "white" }}
          >
            Productos
          </h5>
        </div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid d-flex justify-content-end">
            <form className=" d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Buscar"
                aria-label="Buscar"
              />
              <button className="btn btn-outline-info" type="submit">
                Buscar
              </button>
            </form>
          </div>
        </nav>
        {products.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{ backgroundColor: "#353C59", color: "white" }}
                >
                  Imagen
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#353C59", color: "white" }}
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#353C59", color: "white" }}
                >
                  Precio
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#353C59", color: "white" }}
                >
                  Descripción
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#353C59", color: "white" }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((producto: Product) => (
                <tr key={producto.id_productos}>
                  <td>
                    <img
                      src={`${baseUrlImage + producto.imagen}`}
                      alt={producto.nombre}
                      style={{ maxWidth: 50 }}
                    />
                  </td>
                  <td>{producto.nombre}</td>
                  <td style={{ color: "#D15253" }}>${producto.precio}</td>
                  <td>{producto.descripcion}</td>
                  <td>
                    <button
                      type="button"
                      className="btn"
                      style={{ backgroundColor: "#353C59", color: "white" }}
                      onClick={() => handleEdit(producto)}
                    >
                      <i
                        className="bi-pencil-square"
                        style={{ fontSize: "15px", color: "white" }}
                      ></i>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{ backgroundColor: "#353C59", color: "white" }}
                      onClick={() => handleDelete(producto.id_productos)}
                    >
                      <i
                        className="bi-trash"
                        style={{ fontSize: "15px", color: "white" }}
                      ></i>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProduct && (
            <Form>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={currentProduct.nombre}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formPrecio">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  value={currentProduct.precio}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={currentProduct.descripcion}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formImagen">
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="file"
                  name="imagen"
                  onChange={handleImageChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListProducts;

import React, { useEffect } from "react";
import SideBar from "../components/SideBar";
import { getCategories } from "../api/categoriesService";
import { createProduct } from "../api/productsService";
import Swal from "sweetalert2";

interface Category {
  id_categoria_productos: number;
  nombre: string;
}

function AddProducts() {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [image, setImage] = React.useState<File | null>(null); 
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number>(0);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data.categorias);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category.nombre);
    setSelectedCategoryId(category.id_categoria_productos);
    console.log(selectedCategoryId);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length === 1) {
      const selectedImage = event.target.files[0];
      setImage(selectedImage); // Guardar la imagen como un objeto File
    }
  };

  const handleDivClick = () => {
    const fileInput = document.getElementById("imageUpload");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSaveProduct = async () => {
    try {
      // Crear un objeto de FormData para enviar los datos del producto al servidor
      const formData = new FormData();
      formData.append("nombre", name);
      formData.append("precio", price);
      formData.append("descripcion", description);
      formData.append("id_categoria", selectedCategoryId.toString());
      formData.append("peso", "0"); // Puedes asignar el peso según lo necesites
      if (image) {
        formData.append("imagen", image); // Agregar la imagen al formData
      }

      // Mostrar los datos del FormData en la consola
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Llamar a la función createProduct para agregar el nuevo producto
      await createProduct(formData);

      // Limpiar los campos después de agregar el producto
      setName("");
      setPrice("");
      setDescription("");
      setSelectedCategory("");
      setSelectedCategoryId(0);
      setImage(null); // Restablecer el estado de la imagen

      // Mostrar un mensaje de éxito
      Swal.fire({
        title: "¡Producto creado exitosamente!",
        icon: "success",
        confirmButtonText: "Ok :D",
      });

    } catch (error) {
      console.error("Error creating product:", error);

      // Mostrar un mensaje de error
      Swal.fire({
        title: "No se pudo crear el producto",
        icon: "error",
        confirmButtonText: "Ok :(",
      });
    }
  };

  return (
    <div className="row">
      <SideBar />
      {loading ? (
        <p>Cargando categorías...</p>
      ) : error ? (
        <p>Error al cargar categorías</p>
      ) : (
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
              Agregar Producto
            </h5>
          </div>
          <div className="mt-5 ">
            <input
              type="text"
              className="form-control w-75"
              id="input_name"
              placeholder="Nombre"
              value={name}
              style={{ backgroundColor: "#E0E3F0" }}
              onChange={(text) => {
                const target =
                  (text.nativeEvent.target as HTMLInputElement) || null;
                if (target) {
                  setName(target.value);
                }
              }}
            />
          </div>
          <div className="mt-3 ">
            <input
              type="number"
              className="form-control w-25"
              id="input_name"
              placeholder="Precio"
              value={price}
              style={{ backgroundColor: "#E0E3F0" }}
              onChange={(text) => {
                const target =
                  (text.nativeEvent.target as HTMLInputElement) || null;
                if (target) {
                  setPrice(target.value);
                }
              }}
            />
          </div>
          <div className="dropdown mt-3">
            <button
              className="btn btn-secondary dropdown-toggle w-25"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ backgroundColor: "#E0E3F0", color: "black" }}
            >
              {selectedCategory || "Categoria"}
            </button>
            <ul className="dropdown-menu w-25">
              {categories.map((category) => (
                <li key={category.id_categoria_productos}>
                  <a
                    className="dropdown-item"
                    // href="#"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 w-75">
            <textarea
              className="form-control"
              placeholder="Descripción"
              value={description}
              style={{ backgroundColor: "#E0E3F0" }}
              onChange={(text) => {
                const target =
                  (text.nativeEvent.target as HTMLInputElement) || null;
                if (target) {
                  setDescription(target.value);
                }
              }}
              rows={4}
            ></textarea>
          </div>
          <div
            className="mt-3 w-25 h-25 rounded d-flex justify-content-center align-items-center flex-column"
            style={{
              backgroundColor: "#E0E3F0",
              border: "4px dotted black",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={handleDivClick}
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <>
                <div className="d-flex justify-content-center">
                  <i
                    className="bi-file-earmark-image"
                    style={{ fontSize: "40px", color: "#686B75" }}
                  ></i>
                </div>
                <div className="d-flex justify-content-center">
                  <p>Carga tu imagen</p>
                </div>
              </>
            )}
          </div>
          <input
            type="file"
            id="imageUpload"
            style={{ display: "none" }}
            accept="image/*"
            multiple={false}
            onChange={handleImageChange}
          />

          <div className="container d-flex justify-content-end">
            <button
              type="button"
              className="btn w-25"
              style={{ color: "white", backgroundColor: "#353C59" }}
              onClick={handleSaveProduct}
            >
              Guardar producto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AddProducts;
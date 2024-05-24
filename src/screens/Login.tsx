import strapberryLogo from "../assets/image.png";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser } from "../api/authService";
import { getUserByEmail } from "../api/userService";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("Por favor, completa todos los campos.");
    } else {
      try {
        const loginData = { email, password };
        await loginUser(loginData);
        const response = await loginUser(loginData);
        localStorage.setItem("accessToken", response.access_token);
        const responseGetUser = await getUserByEmail(email);
        console.log(responseGetUser);
        console.log(responseGetUser.user);

        const userJSON = JSON.stringify(responseGetUser.user);
        localStorage.setItem("user", userJSON);

        Swal.fire({
          title: "¡Inicio de sesión exitoso!",
          icon: "success",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/products");
          }
        });

        // Limpiar los campos del formulario
        setEmail("");
        setPassword("");
        setErrorMessage("");
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(`Hubo un error al iniciar sesión: ${error.message}`);
        } else {
          setErrorMessage("Hubo un error inesperado al iniciar sesión.");
        }
      }
    }
  };

  return (
    <div
      className="container-fluid d-flex flex-column"
      style={{ height: 800, backgroundColor: "#353C59" }}
    >
      <div className="container d-flex justify-content-center align-items-center">
        <img className="w-25 mt-5" src={strapberryLogo} alt="Logo" />
      </div>
      <div className="container d-flex justify-content-center align-items-center">
        <div
          className="card w-50 mt-5"
          style={{
            height: "min-content",
            display: "flex",
          }}
        >
          <form
            className="card-body d-flex flex-column"
            onSubmit={handleSubmit}
          >
            <div className="mt-3 d-flex justify-content-center">
              <input
                type="email"
                className="form-control w-50"
                id="input_email"
                placeholder="Email"
                value={email}
                required
                style={{ backgroundColor: "#E0E3F0" }}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="mb-4 mt-3 d-flex justify-content-center">
              <input
                type="password"
                className="form-control w-50"
                id="input_password"
                placeholder="Contraseña"
                value={password}
                required
                style={{ backgroundColor: "#E0E3F0" }}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {errorMessage && (
              <div className="mb-3 mt-3 d-flex justify-content-center">
                <span style={{ color: "red" }}>{errorMessage}</span>
              </div>
            )}
            <div className="container d-flex justify-content-center">
              <button
                type="submit"
                className="btn w-25"
                style={{ color: "white", backgroundColor: "#353C59" }}
              >
                Ingresar
              </button>
            </div>
            <div
              className="container d-flex flex-column"
              style={{ marginTop: "20%" }}
            >
              <div className=" d-flex justify-content-center">
                <div className="fw-normal">¿Aún no tienes cuenta?</div>
              </div>
              <div className=" d-flex justify-content-center">
                <div className="fw-normal">
                  <a href="/register">Regístrate</a>
                </div>
              </div>
              <div className="container d-flex justify-content-center mt-4">
                <p className="fw-normal">
                  Vicente Yael Pérez Moreno | yaelproo2712@gmail.com
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

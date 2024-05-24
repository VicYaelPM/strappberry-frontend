import strapberryLogo from "../assets/image.png";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/userService";

interface User {
  name: string;
  email: string;
  password: string;
}

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Expresión regular para validar la contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setErrorMessage("Por favor, completa todos los campos.");
    } else if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
    } else if (!passwordRegex.test(password)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, incluir al menos un símbolo y una letra mayúscula."
      );
    } else {
      Swal.fire({
        title: "¡Registro exitoso!",
        icon: "success",
        confirmButtonText: "Ok",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const user: User = {
            name: name,
            email: email,
            password: password,
          };
          await createUser(user);
          navigate("/");
        }
      });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrorMessage("");
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
          style={{ height: "min-content", display: "flex" }}
        >
          <form
            className="card-body d-flex flex-column"
            onSubmit={handleSubmit}
          >
            <div className="mt-3 d-flex justify-content-center align-items-center flex-column input-group">
              <input
                type="text"
                className="form-control w-50"
                id="input_name"
                placeholder="Nombre"
                value={name}
                style={{ backgroundColor: "#E0E3F0" }}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mt-3 d-flex justify-content-center">
              <input
                type="email"
                className="form-control w-50"
                id="input_email"
                placeholder="Email"
                value={email}
                style={{ backgroundColor: "#E0E3F0" }}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-3 d-flex justify-content-center">
              <input
                type="password"
                className="form-control w-50"
                id="input_password"
                placeholder="Contraseña"
                value={password}
                style={{ backgroundColor: "#E0E3F0" }}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 mt-3 d-flex justify-content-center">
              <input
                type="password"
                className="form-control w-50"
                id="input_confirm_password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                style={{ backgroundColor: "#E0E3F0" }}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="container d-flex justify-content-center">
              <button
                type="submit"
                className="btn w-25"
                style={{ color: "white", backgroundColor: "#353C59" }}
              >
                Registrarse
              </button>
            </div>
            <div
              className="container d-flex flex-column"
              style={{ marginTop: "20%" }}
            >
              <div className=" d-flex justify-content-center">
                <div className="fw-normal">Ya tienes cuenta</div>
              </div>
              <div className=" d-flex justify-content-center">
                <div className="fw-normal">
                  <a href="/">Iniciar sesión</a>
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

export default Register;

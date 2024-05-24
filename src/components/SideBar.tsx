import strapberryLogo from "../assets/image.png";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/authService";

function SideBar() {
  const navigate= useNavigate();

  const Logout=async ()=>{
    try {
      
      await logoutUser();
      navigate('/');
    } catch (error) {
      
    }
    
  }
  return (
    <div
      className="column w-25"
      style={{
        height: 600,
        backgroundColor: "#353C59",
        borderRadius: 10,
      }}
    >
      <div className="container d-flex justify-content-center align-items-center">
        <img className="w-100 mt-3 ms-1" src={strapberryLogo} alt="Logo" />
      </div>
      <div className="w-100" style={{ color: "white", marginTop: 70 }}>
        <div className="dropdown d-flex justify-content-center">
          <button
            className="btn dropdown-toggle w-75"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{color: 'white'}}
          >
            Productos
          </button>
          <ul className="dropdown-menu w-75">
            <li>
              <a className="dropdown-item" href="/products">
                Lista de Productos
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/addProducts">
                Agregar Productos
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* <div className="w-100" style={{ color: "white", marginTop: 20 }}>
        <div className="dropdown d-flex justify-content-center">
          <button
            className="btn dropdown-toggle w-75"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{color: 'white'}}
          >
            Categorías
          </button>
          <ul className="dropdown-menu w-75">
            <li>
              <a className="dropdown-item" href="/productsAdm">
                Lista de Categorías
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/addProducts">
                Agregar Categorías
              </a>
            </li>
          </ul>
        </div>
      </div> */}
      <div className="ms-3" style={{ color: "white", marginTop: 250 }}>
    <a 
        href="#" 
        onClick={Logout} 
        style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
    >
        <h5 className="fw-light">Cerrar sesión</h5>
    </a>
</div>

    </div>
  );
}
export default SideBar;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté importado
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Información sobre la empresa */}
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Acerca de Nosotros</h5>
            <p>
              Somos una empresa dedicada a la gestión de apartamentos y soluciones de automatización para mejorar la experiencia de los clientes.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-md-4 mb-3 mb-md-0 text-center">
            
          </div>

          {/* Información de contacto */}
          <div className="col-md-4 text-md-end text-center">
            <h5>Contacto</h5>
            <p>Email: info@alejandrogl.es</p>
            <p>Teléfono: +34 634 21 15 16</p>
            <div className="d-flex justify-content-md-end justify-content-center">
              <a href="https://facebook.com" className="text-light me-3">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="https://twitter.com" className="text-light me-3">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="https://instagram.com" className="text-light">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} Alejandro Gómez Lozano. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
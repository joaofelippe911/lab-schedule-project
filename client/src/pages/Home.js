import logoImg from "../images/logo.png";

import "../styles/home.scss";

export function Home() {
  return (
    <div id="page-home">
      <div className="content">
        <div className="header-container">
          <h1 className="title">Estamos construindo um novo site.</h1>
        </div>
        <div className="grid-container">
          <div className="card">
            <p>
              <span>Acesse o resultado</span>
              <span>de seus exames</span>
            </p>
            <a href="http://bioprev.com.br" className="button">
              VER RESULTADOS
            </a>
          </div>
          <div className="card">
            <p>
              <span>Chegue</span> <span>até nós</span>
            </p>
            <a href="http://bioprev.com.br" className="button">
              VER ROTA
            </a>
          </div>
          <div className="horario">
            <p>Horário de atendimento</p>
            <p>
              <b>Segunda</b> à <b>Sexta</b> <b>06h30</b> às <b>18h30</b> |{" "}
              <b>Sábado </b>
              <b>06h30</b> às <b>12h30</b>
            </p>
          </div>
          <div className="contato">
            <p>Fale com o Bioprev</p>
            <p>
              <b>(44) 3623-6090</b> | <b>(44) 99956-2383</b>
            </p>
          </div>
        </div>
      </div>
      <footer>
        <img src={logoImg} alt="Logo Bioprev" />
        <p>
          <b>Av. Rio Branco, 4329</b> - Umuarama - PR
        </p>
      </footer>
    </div>
  );
}

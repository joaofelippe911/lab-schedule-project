import { Link } from 'react-router-dom'; 

import "../styles/novaHome.scss";

import { Header } from "../components/Header";
import facadeImg from '../images/foto-teste.jpeg';
import coletaImg from '../images/foto-teste2.jpeg';
import { Footer } from '../components/Footer';

export function novaHome() {
  return (
    <div id="page-newHome">
      <Header />
      <section className="results">
        <div className="results-access">
          <h1>Resultados Online</h1>
          <p>Tenha acesso ao resultado de seus exames onde e quando quiser!</p>
          <Link to="http://201.48.165.200:8080/ConcentWeb/servlet/hlab8000" className="results-link">Acessar resultados</Link>
          <svg width="100%" height="150" viewBox="0 0 500 150" preserveAspectRatio="none">
				<path d="M0,150 L0,40 Q250,150 500,40 L580,150 Z" fill="#fbfbfb"></path>
			  </svg>
        </div>
      </section>
      <section className="about-us">
        <div className="container">
          <div className="about-grid">
           <div className="about-text">
             <span>Conheça-nos um pouco mais</span>
            <h2>Sobre o Bioprev</h2>
            <p>O Laboratório Bioprev foi idealizado pela Dra. Hilda M. Souto, com  o objetivo de proporcionar aos associados Umuprev, e posteriormente, toda a população de Umuarama e região, um atendimento de qualidade e segurança em seus exames.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris quis iaculis nibh. Fusce eu mi dictum, fermentum nulla et, porttitor nisl. Pellentesque id tempus tellus. Suspendisse egestas augue ut dolor maximus convallis. In at lacus sed nisl finibus vehicula vitae ut tortor. Suspendisse rutrum felis eu neque aliquet, consequat suscipit ex molestie. Ut consequat est in quam auctor, et sollicitudin felis facilisis. In scelerisque aliquam ante, tristique maximus lacus sagittis a.</p>
            <p>O Laboratório Bioprev foi idealizado pela Dra. Hilda M. Souto, com  o objetivo de proporcionar aos associados Umuprev, e posteriormente, toda a população de Umuarama e região, um atendimento de qualidade e segurança em seus exames.</p>
           </div>
           <img src={facadeImg} alt="Fachada Bioprev" />
          </div>
        </div>
      </section>
      <section className="exams">
        <div className="container">
          <div className="exams-container">
            <h2>Exames</h2>
            <p>Confira a lista de todos os exames que oferecemos, com algumas informações e recomendações.</p>
            <Link to="/exames" className="exams-link">Acessar lista</Link>
          </div>
        </div>
      </section>
      <section className="scheduling">
        <div className="container">
          <div className="scheduling-container">
            <img src={coletaImg} alt="Coleta Residencial"/>
            <div className="scheduling-text">
              <span>Nós vamos até você</span>
              <h2>Coleta residencial</h2>
              <p>Oferecemos o serviço de coleta em residência para facilitar o atendimento.</p>
              <p>Confira os horários disponíveis e faça o seu agendamento.</p>
              <Link to="/agendamento" className="scheduling-link">Agendar</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="locale">
        <div className="container">
          <div className="locale-container">
            <h2>Localização</h2>
            <p>Venha até nós. Estaremos te esperando com um sorriso no rosto.</p>
            <Link to="/agendamento" className="locale-link">Ver rota</Link>
          </div>
        </div>
      </section>
      <section className="contact">
        <div className="container">
          <div className="contact-container">
            <h2>Contato</h2>
            <div className="card-container">
              <div className="card">
                <h5>Telefone</h5>
                <p>(44) 9 9966-3514</p>
              </div>
              <div className="card">
                <h5>Whatsapp</h5>
                <p>(44) 9 99953-2383</p>
              </div>
              <div className="card">
                <h5>Fale com a Umuprev</h5>
                <p>(44) 3623-7070</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

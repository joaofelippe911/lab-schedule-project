import logoImg from "../../images/logo_bioprev_branca.png";

import "./styles.scss";

export function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="footer-container">
                    <div className="footer-card">
                        <img src={logoImg} />
                        <p>Bioprev</p>
                        <p>Exames</p>
                        <p>Contato</p>
                        
                    </div>
                    <div className="footer-card">
                    <img src={logoImg} />
                        <p>Bioprev</p>
                        <p>Exames</p>
                        <p>Contato</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
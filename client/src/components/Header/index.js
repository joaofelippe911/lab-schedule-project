import logoImg from '../../images/logo_bioprev_branca.png';
import './styles.scss';
import { Link } from 'react-router-dom';

export function Header() {
    return (
        <header>
            <img src={logoImg} alt="Logo Bioprev"/>
            <nav>
                <ul>
                    <li>
                        <Link to="/" >Bioprev</Link>
                    </li>
                    <li>
                        <Link to="/" >Exames</Link>
                    </li>
                    <li>
                        <Link to="/" className="contact-btn">Contato</Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
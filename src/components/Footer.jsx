import "../assets/css/Footer.css";
import logo from "../assets/img/logocut.png";

function Footer(){
    return(
        <div id="Footer">
            
            <p>PlebisCIT©<br /> Todos los derechos reservados<br/></p>
            <p></p>
            <img src={logo}/>
        </div>
    )
}
export default Footer;
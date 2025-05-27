import React from "react";
import {Link} from 'react-router-dom';

import {FaInstagram} from 'react-icons/fa';


const Footer = ()=>{
    const navigationLinks = [
        {name: 'Inicio', path: '/'},
        {name: 'Registrarse', path: '/sign-up'},
        {name: 'Iniciar Sesión', path: '/sign-in'},
        {name: 'Buscar alimentos', path: '/buscar-alimentos'},
        {name: 'Publicar donacion', path: '/publicar-donacion'}
    ]
    const exploreLinks = [
        {name: 'Preguntas frecuentes', path: '/preguntasFrecuentes'},
        {name: 'Contacto', path: '/formularioContacto'},
        {name: 'Terminos y Condiciones', path: '/terminosCondiciones'},
        {name: 'Políticas de privacidad', path: '/politicaPrivacidad'},
        {name: 'Políticas de uso de datos', path: '/politicaUsoDatos'}

    ]
    const voluntarioLink = [
        {name: 'Formulario de voluntario', path: '/formulario-voluntario'}

    ];

    return (
        <footer  className="bg-gradient-to-r from-slate-500 to-emerald-300 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-auto">

            <div className="container mx-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
                    
                    {/*Columna Logo/redes y botón contacto */}
                    <div className="space-y-4 flex flex-col items-start">
                        <Link to="/" className="inline-block" aria-label="Página de inicio de ResQfood">

                        {/*icono Instagram */}
                        <FaInstagram size={36} className ="text-slate-800 hover:text-slate-600 transition-colors duration-200"/>

                        </Link>
                        <Link to="/formularioContacto" className="px-6 py-2 border border-slate-700 rounded-lg text-slate-700 font-medium 
                                       hover:bg-slate-700 hover:text-white transition-colors duration-200 
                                       focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50
                                       w-auto"> 
                         Contacto
                         </Link>
                    </div>


                    {/*columna navegación */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Navegación</h3>
                        <ul className="space-y-2">
                            {navigationLinks.map((link)=>(
                                <li key={link.name}>
                                    <Link to={link.path} 
                    className="hover:text-slate-600 transition-colors duration-200 text-sm">
                        {link.name}
                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/*Columna Explorar */}
                    <div>
                        <h3 className="text-lg font-bold mb-4"> Explorar</h3>
                        <ul className="space-y-2">
                            {exploreLinks.map((link)=>(
                                <li key={link.name}>
                                    <Link to={link.path} 
                    className="hover:text-slate-600 transition-colors duration-200 text-sm">
                        {link.name}
                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/**voluntarios */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Voluntarios</h3>
                        <ul className="space-y-2">
                            {voluntarioLink.map((link)=>(
                                <li key={link.name}>
                                    <Link  to={link.path} 
                    className="hover:text-slate-600 transition-colors duration-200 text-sm">
                        {link.name}
                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-400 text-center">
                    <p className="text-sm text-slate-600">
                         © {new Date().getFullYear()} ResQFood. Todos los derechos reservados
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
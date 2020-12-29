import React, { Component } from 'react';

import { Pannellum } from "pannellum-react";
import myImage from "../images/360photo.jpg";
import myImageLow from "../images/360photoLow.jpg";
import { isMobile } from 'react-device-detect';


export default class Panorama extends Component {

    render() {
        return <div >
            <Pannellum
                width="100vw%"
                height="100vh"
                image={isMobile ? myImageLow : myImage}
                pitch={-5}
                type="equirectangular"
                haov={200}
                vaov={110}
                vOffset={0}
                yaw={0}
                hfov={80}
                maxHfov = {120}
                minHfov= {20}
                autoLoad
                showControls={true}
                onLoad={() => {
                    console.log("panorama loaded");
                }}
            >

                <Pannellum.Hotspot
                    type="info"
                    pitch={-8.1}
                    yaw={-75}
                    text="Almacen maderas del Rey"
                    URL="https://es.wikipedia.org/wiki/Archivo:Almacen_maderas_del_Rey_nuevoyviejo.jpg"
                />                
                <Pannellum.Hotspot
                    type="info"
                    pitch={-7.3}
                    yaw={-56.3}
                    text="Iglesia de Omnium Sanctorum"
                    URL="https://es.wikipedia.org/wiki/Iglesia_de_Omnium_Sanctorum_(Sevilla)"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-7.1}
                    yaw={-48}
                    text="Iglesia de Santa María Magdalena"
                    URL="https://es.wikipedia.org/wiki/Iglesia_de_Santa_Mar%C3%ADa_Magdalena_(Sevilla)"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-7.9}
                    yaw={-45}
                    text="Torre de Don Fadrique"
                    URL="https://es.wikipedia.org/wiki/Torre_de_Don_Fadrique_(Sevilla)"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-7.1}
                    yaw={-38}
                    text="Plaza de toros de Sevilla"
                    URL="https://es.wikipedia.org/wiki/Plaza_de_toros_de_Sevilla"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-6.5}
                    yaw={-22.4}
                    text="Iglesia de la Anunciación"
                    URL="https://es.wikipedia.org/wiki/Iglesia_de_la_Anunciaci%C3%B3n_(Sevilla)"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-6.5}
                    yaw={-13}
                    text="Iglesia del Salvador"
                    URL="https://es.wikipedia.org/wiki/Iglesia_del_Salvador_(Sevilla)"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-6.3}
                    yaw={-3.5}
                    text="Iglesia de San Alberto"
                    URL="https://es.wikipedia.org/wiki/Iglesia_de_San_Alberto_(Sevilla)"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-3}
                    yaw={11}
                    text="Catedral de Sevilla"
                    URL="https://es.wikipedia.org/wiki/Catedral_de_Sevilla"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-5.7}
                    yaw={22.5}
                    text="Iglesia y Hospital de la Caridad"
                    URL="https://es.wikipedia.org/wiki/Iglesia_y_Hospital_de_la_Caridad_(Sevilla)"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-9.7}
                    yaw={22.5}
                    text="Real Maestranza de Artillería"
                    URL="https://es.wikipedia.org/wiki/Real_Maestranza_de_Artiller%C3%ADa_de_Sevilla"
                />                
                <Pannellum.Hotspot
                    type="info"
                    pitch={-8}
                    yaw={32}
                    text="Aduana de Sevilla"
                    URL="https://es.wikipedia.org/wiki/Aduana_de_Sevilla"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-7}
                    yaw={34}
                    text="Real Alcázar"
                    URL="https://es.wikipedia.org/wiki/Real_Alc%C3%A1zar_de_Sevilla"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-6.8}
                    yaw={39.3}
                    text="Torre de la Plata"
                    URL="https://es.wikipedia.org/wiki/Torre_de_la_Plata"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-8}
                    yaw={52.5}
                    text="Real Fábrica de Tabacos"
                    URL="https://es.wikipedia.org/wiki/Real_Fábrica_de_Tabacos_de_Sevilla"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-5}
                    yaw={57}
                    text="Torre del Oro"
                    URL="https://es.wikipedia.org/wiki/Torre_del_Oro"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-7}
                    yaw={76.5}
                    text="Palacio de San Telmo"
                    URL="https://es.wikipedia.org/wiki/Palacio_de_San_Telmo"
                />
                <Pannellum.Hotspot
                    type="info"
                    pitch={-6.4}
                    yaw={99.2}
                    text="Convento de los Remedios"
                    URL="https://es.wikipedia.org/wiki/Convento_de_los_Remedios_(Sevilla)"
                />
            </Pannellum>



        </div>
    }

}
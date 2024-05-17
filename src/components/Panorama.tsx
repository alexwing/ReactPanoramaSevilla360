import React, { useState, useEffect } from "react";
import myImage from "../images/360photo.jpg";
import ReactPannellum from 'react-pannellum';
import { Container } from 'react-bootstrap';

const Panorama = () => {
    const [hotspots, setHotspots] = useState(null);

    useEffect(() => {
        fetch('./hotspots.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(data => setHotspots(data))
        .catch(function() {
            console.log("Error al leer el archivo JSON.");
        });
        
    }, []);


    const config = {
        autoLoad: true,
        showControls: true,
        pitch: -5,
        type: "equirectangular",
        haov: 200,
        vaov: 110,
        vOffset: 0,
        yaw: 0,
        hfov: 80,
        maxHfov: 120,
        minHfov: 20,
        compass: true,
        hotSpots: hotspots
    };

    return hotspots !== null ? (
        <Container fluid className="p-0">
            <ReactPannellum
                id="1"
                sceneId="Sevilla"
                imageSource={myImage}
                config={config}
                style={{
                    width: "100%",
                    height: "100vh"
                }}
            >
            </ReactPannellum>
        </Container>
    ) : null;
}

export default Panorama;
import React, { useRef, useEffect, useState } from "react";
import { MapContainer,  TileLayer,  LayersControl,  LayerGroup,  FeatureGroup } from "react-leaflet";
import ReactLeafletGoogleLayer from "react-leaflet-google-layer";
//import { EditControl } from "react-leaflet-draw";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import Search from "./Search";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("./images/marker-icon-2x.png").default,
  iconUrl: require("./images/marker-icon.png").default,
  shadowUrl: require("./images/marker-shadow.png").default,
});

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);
  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <h3>Burdasınız</h3>
      </Popup>
    </Marker>
  );
};

const center = [41.032, 28.683];
const zoom = 17;
const { BaseLayer } = LayersControl;

function ShowGoogle() {
  return (
    <div className="App">
      <MapContainer center={center} zoom={zoom}>
        {/* <TileLayer
          url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          maxZoom={25}
          subdomains={["mt1", "mt2", "mt3"]}
        /> */}
        <ReactLeafletGoogleLayer
              googleMapsLoaderConf={{
                KEY: "AIzaSyA8ekvarLy5isA-5eITym_Ez-R8iT0j8j8",
              }}
              type={"hybrid"}
            />
        <Search apiKey="AIzaSyA8ekvarLy5isA-5eITym_Ez-R8iT0j8j8" />
      </MapContainer>
    </div>
  );
}

export default ShowGoogle;

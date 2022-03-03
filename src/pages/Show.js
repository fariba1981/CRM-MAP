
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { Stack, TextField, FormControl, Select, MenuItem, InputLabel, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import "./App.css";
import "leaflet/dist/leaflet.css";
import BlueShapes from './BlueShapes.json'
import RedShapes from './RedShapes.json'
import Search from './Search'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("./images/marker-icon.png").default,
  iconRetinaUrl: require("./images/marker-icon-2x.png").default,
  shadowUrl: require("./images/marker-shadow.png").default,
});


const loadShapes = async () => {
  let newPoint = [];
  let shapePoints = [];
  let title = '';
  let description = '';
  let color = '';
  const responseShapes = await fetch('http://208.73.206.195:5009/api/shapelist');
  const shapes = await responseShapes.json();
  shapes.map((shape) => {
    title = shape.title;
    description = shape.description;
    color = shape.color;
    shape.points.map((point) => {
      newPoint = [point.lat, point.lng];
      shapePoints.push(newPoint);
    })
    if (color === "red" || color === "Kırmızı"){
      RedShapes.features.push(
        {
          "type": "Feature",
          "properties": {
            "name": title,
            "description": description
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [shapePoints]
          }
        }
      )
    } else if (color === "blue" || color === "Mavi"){
      BlueShapes.features.push(
        {
          "type": "Feature",
          "properties": {
            "name": title,
            "description": description
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [shapePoints]
          }
        }
      )
    } 
    shapePoints = [];
  })
}


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
    <Marker position={position} >
      <Popup><h3>Burdasınız</h3></Popup>
    </Marker>
  );
}

const Show = () =>{

  const [defaultCenter, setDefaultCenter] = useState([41.032, 28.683]);
  const [defaultZoom, setDefaultZoom] = useState(16);
  const [loaded, setLoaded] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [bina, setBina] = useState();
  const [blok, setBlok] = useState();
  const [daire, setDaire] = useState();
  const [isim, setİsim] = useState();
  const [telefon, setTelefon] = useState();
  const [speed, setSpeed] = useState();
  let locationName = "";
  
  const goolgApiKey = 'AIzaSyBrY-Us5qXj55yUXpEMVo4i88hrsO_Mdys';
  const goolgEarthApiKey = 'ge-5118b8e7fe4703dd';

  const handleChangeBina = (e) => {
    let data = e.target.value
    setBina(data);
  }
  const handleChangeBlok = (e) => {
    let data = e.target.value
    setBlok(data);
  }
  const handleChangeDaire = (e) => {
    let data = e.target.value
    setDaire(data);
  }
  const handleChangeİsim = (e) => {
    let data = e.target.value
    setİsim(data);
  }
  const handleChangeTelefon = (e) => {
    let data = e.target.value
    setTelefon(data);
  }
  const handleChangeSpeed = (e) => {
    let data = e.target.value
    setSpeed(data);
  }

  const openRequest = (e) => {
    let layer = e.target;
    locationName = layer.feature.properties.name;
    setBina(locationName);
    setShowRequest(false);
    setShowRequest(true);
  }
  
  const redirectRequest = () => {
    let gponUrl = "";
    if (speed === "35"){
      gponUrl = "https://atlantisnet.com.tr/basvuru/20";
    } else if (speed === "50"){
      gponUrl = "https://atlantisnet.com.tr/basvuru/24";
    } else if (speed === "100"){
      gponUrl = "https://atlantisnet.com.tr/basvuru/37";
    } 
    console.log(bina, blok, daire, isim, telefon, speed)
    window.open(gponUrl);
    setShowRequest(false);
  }

  useEffect(async ()=>{
    await loadShapes();
    setLoaded(true);
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault()
    });
    
  },[]);

  const onEachFeature = (feature, layer)=>{
    if (feature.properties && feature.properties.name){
      layer.bindPopup(feature.properties.name);
      layer.on('contextmenu', openRequest);
    }
  }

    return (
      <div className="App">
        <br/>
        <ul className="title">
          <li>
            <h5>
              Tum GPON kapsama alanı görmek istersiniz harita yakınlaştırmasını değiştirebilirsiniz
            </h5>
          </li>
          <li>
            <h5>
              İstek göndermek istersiniz istediğiniz renkli binaya sağ tıklayabilirsiniz
            </h5>
          </li>
          <li>
            <h5>
              Binanın ismini görmek istersiniz üzerine tıklayabilirsiniz
            </h5>
          </li>
        </ul>
        <br/>
        {showRequest && 
          <div className="showRequest">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                style={{minWidth: 250}}
                label="Bina"
                onChange={handleChangeBina}
                defaultValue={bina}
              />
              <TextField
                style={{minWidth: 120}}
                label="Blok"
                onChange={handleChangeBlok}
              />
              <TextField
                style={{minWidth: 120}}
                label="Daire"
                onChange={handleChangeDaire}
              />
              <TextField
                fullWidth
                label="İsim, Soyisim"
                onChange={handleChangeİsim}
              />
              <TextField
                style={{minWidth: 250}}
                label="Telefon"
                onChange={handleChangeTelefon}
              />
              <FormControl style={{minWidth: 250}}>
                <InputLabel>İnternet hızını seçin</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Gpon hızı"
                  onChange={handleChangeSpeed}>
                  <MenuItem value={"35"}>35 Mbps</MenuItem>
                  <MenuItem value={"50"}>50 Mbps</MenuItem>
                  <MenuItem value={"100"}>100 Mbps</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                component={RouterLink}
                to="#"
                onClick={redirectRequest}>
                  Gönder
              </Button>
            </Stack>
            <br/>
          </div>
        }
        {loaded &&
          <MapContainer center={defaultCenter} zoom={defaultZoom}>
            <TileLayer 
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            />
            <GeoJSON data= {BlueShapes} pathOptions={{ color: 'blue' }} onEachFeature={onEachFeature}  />
            <GeoJSON data= {RedShapes} pathOptions={{ color: 'red' }} onEachFeature={onEachFeature} />
            <LocationMarker/>
            <Search apiKey={goolgEarthApiKey} />
          </MapContainer>
        }
          
      </div>
    );
  }

export default Show;



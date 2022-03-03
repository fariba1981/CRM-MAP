import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import BlueShapes from "./BlueShapes.json";
import RedShapes from "./RedShapes.json";
import {
  Stack,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("./images/marker-icon-2x.png"),
//   iconUrl: require("./images/marker-icon.png"),
//   shadowUrl: require("./images/marker-shadow.png"),
// });

const loadShapes = async () => {
  let newPoint = [];
  let shapePoints = [];
  let title = "";
  let description = "";
  let color = "";
  const responseShapes = await fetch(
    "http://208.73.206.195:5009/api/shapelist"
  );
  const shapes = await responseShapes.json();
  shapes.map((shape) => {
    title = shape.title;
    description = shape.description;
    color = shape.color;
    shape.points.map((point) => {
      newPoint = [point.lat, point.lng];
      shapePoints.push(newPoint);
    });
    if (color === "red") {
      RedShapes.features.push({
        type: "Feature",
        properties: {
          name: title,
          description: description,
        },
        geometry: {
          type: "Polygon",
          coordinates: [shapePoints],
        },
      });
    } else if (color === "blue") {
      BlueShapes.features.push({
        type: "Feature",
        properties: {
          name: title,
          description: description,
        },
        geometry: {
          type: "Polygon",
          coordinates: [shapePoints],
        },
      });
    }
    shapePoints = [];
  });
};

const AddLocation = () => {
  const [mapLayers, setMapLayers] = useState([]);
  const [defaultCenter, setDefaultCenter] = useState([41.032, 28.683]);
  const [defaultZoom, setDefaultZoom] = useState(16);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("my title");
  const [description, setDescription] = useState("my description");
  const [color, setColor] = useState("blue");
  let newPoints = [];
  let shapeData = {
    user: "",
    title: "44",
    description: "",
    color: "",
    shapeStatus: "",
    radius: 0,
    points: [],
  };

  const navigate = useNavigate();

  const _onCreate = (e) => {
    //console.log(e);
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, latlngs: layer.getLatLngs()[0] },
      ]);
    }
  };

  const fetchData = () => {
    fetch("http://208.73.206.195:5009/api/shape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shapeData),
    }).then(() => {
      navigate("/dashboard/locations", { replace: true });
    });
  };

  const handleChangeTitle = (e) => {
    let data = e.target.value;
    setTitle(data);
  };

  const handleChangeDescription = (e) => {
    let data = e.target.value;
    setDescription(data);
  };

  const handleChangeColor = (e) => {
    let data = e.target.value;
    setColor(data);
  };

  useEffect(async () => {
    await loadShapes();
    setLoaded(true);
  }, []);

  return (
    <div className="App">
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          style={{ minWidth: 250 }}
          //label="title"
          label="Başlık"
          onChange={handleChangeTitle}
        />
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Renk</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Color"
            onChange={handleChangeColor}
          >
            <MenuItem value={"Kırmızı"}>Kırmızı</MenuItem>
            <MenuItem value={"Mavi"}>Mavi</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          //label="description"
          label="Açıklama"
          onChange={handleChangeDescription}
        />
      </Stack>
      <br />
      {loaded && (
        <MapContainer center={defaultCenter} zoom={defaultZoom}>
          <FeatureGroup>
            <EditControl
              position="topleft"
              onCreated={_onCreate}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                polyline: false,
                marker: false,
              }}
            />
          </FeatureGroup>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      )}
      {mapLayers.map((item) => {
        newPoints = item.latlngs;
        newPoints.map((item) => {
          let temp = 0;
          temp = item.lat;
          item.lat = item.lng;
          item.lng = temp;
        });
        newPoints.push(newPoints[0]);
        //manipulagting shapeData
        shapeData.user = "61fee84d200cfcaeeaf04975";
        shapeData.title = title;
        shapeData.description = description;
        shapeData.color = color;
        shapeData.shapeStatus = "polygon";
        shapeData.radius = 0;
        shapeData.points = newPoints;
        fetchData();
      })}
    </div>
  );
};

export default AddLocation;

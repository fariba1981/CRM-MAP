import React, { useEffect } from 'react';
import { GeoSearchControl, MapBoxProvider, OpenStreetMapProvider, GoogleProvider, GeocodeEarthProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';

const Search = ({apiKey}) => {

  //Open Street Map Provider
  const osmProvider = new OpenStreetMapProvider();

  //Google Map Provider
  const gmProvider = new GoogleProvider({
    params: {
      key: apiKey,
    },
  });

  //Google Earth Map Provider
  const gemProvider = new GeocodeEarthProvider({
    params: {
      api_key: apiKey,
    },
  });

  /* const provider = new MapBoxProvider({
    params: {
      access_token: apiKey,
    },
  }); */

  const searchControl = new GeoSearchControl({
    provider: osmProvider,
    provider: gmProvider,
    provider: gemProvider,
  });
      
  const map = useMap();

  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);
  
  return null;

}

  export default Search;
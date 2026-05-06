import { useEffect, useRef } from 'react';
import { Box, Button, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';

const QUICK_CITIES = [
  { key: 'muenster', lonLat: [7.6261, 51.9607] },
  { key: 'berlin', lonLat: [13.405, 52.52] },
];

const cityRadius = (population) => 3 + Math.sqrt(population / 50000);

const cityStyle = (feature) =>
  new Style({
    image: new CircleStyle({
      radius: cityRadius(feature.get('population')),
      fill: new Fill({ color: 'rgba(229, 62, 62, 0.85)' }),
      stroke: new Stroke({ color: '#fff', width: 1.5 }),
    }),
  });

export default function MapView({ cities, zoomTarget, showPopulationGrid }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const citiesSourceRef = useRef(null);
  const popGridLayerRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const citiesSource = new VectorSource();
    citiesSourceRef.current = citiesSource;

    const popGridLayer = new TileLayer({
      source: new TileWMS({
        url: 'https://gisco-services.ec.europa.eu/maps/wms',
        params: {
          LAYERS: 'PopulationGrid2021',
          STYLES: '',
          FORMAT: 'image/png',
          TRANSPARENT: true,
        },
        attributions: '© European Commission – GISCO',
      }),
      visible: false,
      opacity: 0.75,
    });
    popGridLayerRef.current = popGridLayer;

    mapRef.current = new Map({
      target: containerRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        popGridLayer,
        new VectorLayer({ source: citiesSource, style: cityStyle }),
      ],
      view: new View({
        center: fromLonLat([10.4515, 51.1657]),
        zoom: 6,
      }),
    });

    return () => {
      mapRef.current?.setTarget(undefined);
      mapRef.current = null;
      citiesSourceRef.current = null;
      popGridLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const source = citiesSourceRef.current;
    if (!source) return;
    const features = cities.map(
      (c) =>
        new Feature({
          geometry: new Point(fromLonLat([c.lon, c.lat])),
          name: c.name,
          population: c.population,
        }),
    );
    source.clear();
    source.addFeatures(features);
  }, [cities]);

  useEffect(() => {
    popGridLayerRef.current?.setVisible(!!showPopulationGrid);
  }, [showPopulationGrid]);

  useEffect(() => {
    if (!zoomTarget) return;
    const view = mapRef.current?.getView();
    if (!view) return;
    view.animate({
      center: fromLonLat([zoomTarget.lon, zoomTarget.lat]),
      zoom: zoomTarget.zoom ?? 11,
      duration: 800,
    });
  }, [zoomTarget]);

  const zoomTo = (lonLat) => {
    const view = mapRef.current?.getView();
    if (!view) return;
    view.animate({
      center: fromLonLat(lonLat),
      zoom: 11,
      duration: 800,
    });
  };

  return (
    <Box position="relative" w="100%" h="100%">
      <Box ref={containerRef} w="100%" h="100%" />
      <VStack
        position="absolute"
        bottom={4}
        right={4}
        spacing={2}
        align="stretch"
        zIndex={1}
      >
        {QUICK_CITIES.map((city) => (
          <Button
            key={city.key}
            size="sm"
            colorScheme="blue"
            boxShadow="md"
            onClick={() => zoomTo(city.lonLat)}
          >
            {t('map.zoomTo', { city: t(`map.cities.${city.key}`) })}
          </Button>
        ))}
      </VStack>
    </Box>
  );
}

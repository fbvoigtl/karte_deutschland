import { useMemo, useState } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import MapView from './components/MapView.jsx';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import PopulationSlider from './components/PopulationSlider.jsx';
import CityList from './components/CityList.jsx';
import { getGermanCities } from './api/germanCities.js';

const ALL_CITIES = getGermanCities({ minPopulation: 50000 });
const MIN_POP = 50000;
const MAX_POP = 4000000;

export default function App() {
  const { t } = useTranslation();
  const [minPop, setMinPop] = useState(MIN_POP);
  const [zoomTarget, setZoomTarget] = useState(null);

  const filtered = useMemo(
    () => ALL_CITIES.filter((c) => c.population >= minPop),
    [minPop],
  );

  const handleSelectCity = (city) => {
    setZoomTarget({ lon: city.lon, lat: city.lat, zoom: 11 });
  };

  return (
    <Flex direction="column" h="100vh" w="100vw">
      <Flex
        as="header"
        align="center"
        gap={6}
        px={4}
        py={3}
        borderBottomWidth="1px"
        bg="white"
      >
        <Heading size="md" whiteSpace="nowrap">
          {t('app.title')}
        </Heading>
        <PopulationSlider
          value={minPop}
          onChange={setMinPop}
          min={MIN_POP}
          max={MAX_POP}
        />
        <LanguageSwitcher />
      </Flex>
      <Flex flex="1" minH={0}>
        <Box flex="1" position="relative">
          <MapView cities={filtered} zoomTarget={zoomTarget} />
        </Box>
        <CityList cities={filtered} onSelectCity={handleSelectCity} />
      </Flex>
    </Flex>
  );
}

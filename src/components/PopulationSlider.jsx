import {
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function PopulationSlider({
  value,
  onChange,
  min = 50000,
  max = 4000000,
  step = 10000,
}) {
  const { t, i18n } = useTranslation();
  const fmt = new Intl.NumberFormat(i18n.resolvedLanguage || i18n.language);

  return (
    <HStack flex="1" maxW="600px" spacing={4}>
      <Text fontSize="sm" whiteSpace="nowrap" color="gray.600">
        {t('map.minPopulation')}
      </Text>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        flex="1"
        colorScheme="blue"
        focusThumbOnChange={false}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text
        fontSize="sm"
        minW="90px"
        textAlign="right"
        whiteSpace="nowrap"
        sx={{ fontVariantNumeric: 'tabular-nums' }}
      >
        ≥ {fmt.format(value)}
      </Text>
    </HStack>
  );
}

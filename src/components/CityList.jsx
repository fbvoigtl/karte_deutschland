import { useMemo } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function CityList({ cities, onSelectCity }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language;
  const fmt = new Intl.NumberFormat(lang);

  const sorted = useMemo(
    () => [...cities].sort((a, b) => b.population - a.population),
    [cities],
  );

  return (
    <Box
      w="280px"
      h="100%"
      borderLeftWidth="1px"
      bg="white"
      display="flex"
      flexDirection="column"
    >
      <Box px={4} py={3} borderBottomWidth="1px" bg="white">
        <Heading size="sm">
          {t('cities.heading', { count: cities.length })}
        </Heading>
      </Box>
      <Box flex="1" overflowY="auto">
        <VStack align="stretch" spacing={0}>
          {sorted.map((c) => (
            <Button
              key={c.id}
              variant="ghost"
              onClick={() => onSelectCity(c)}
              borderRadius={0}
              py={2}
              px={4}
              h="auto"
              fontWeight="normal"
              justifyContent="space-between"
            >
              <Text fontSize="sm" isTruncated>
                {(lang === 'en' ? c.nameEn : c.name) || c.name}
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                sx={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {fmt.format(c.population)}
              </Text>
            </Button>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

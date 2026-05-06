import { Box, Flex, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import MapView from './components/MapView.jsx';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';

export default function App() {
  const { t } = useTranslation();

  return (
    <Flex direction="column" h="100vh" w="100vw">
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={4}
        py={3}
        borderBottomWidth="1px"
        bg="white"
      >
        <Heading size="md">{t('app.title')}</Heading>
        <LanguageSwitcher />
      </Flex>
      <Box flex="1" position="relative">
        <MapView />
      </Box>
    </Flex>
  );
}

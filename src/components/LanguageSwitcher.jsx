import { Button, ButtonGroup } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language;

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      {LANGUAGES.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          colorScheme={current === lang.code ? 'blue' : 'gray'}
          variant={current === lang.code ? 'solid' : 'outline'}
        >
          {lang.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}

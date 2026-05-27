function strings(key, locale) {
  // Simple dictionary
  const translations = {
    addonName: {
      en: 'Efiz Folder Duplicator',
      es: 'Efiz Duplicador de Carpetas',
      pt: 'Efiz Duplicador de Pastas',
      fr: 'Efiz Duplicateur de Dossiers',
      it: 'Efiz Duplicatore di Cartelle',
    },
    showSidebar: {
      en: 'Show Sidebar',
      es: 'Mostrar Barra Lateral',
      pt: 'Mostrar Barra Lateral',
      fr: 'Afficher la Barre Latérale',
      it: 'Mostra Barra Laterale',
    },
    create: {
      en: 'Create',
      es: 'Crear',
      pt: 'Criar',
    },
    save: {
      en: 'Save',
      es: 'Guardar',
      pt: 'Salvar',
    },
  };

  // Detect user locale
  const userLocale = locale || Session.getActiveUserLocale(); // e.g. "en", "es", "pt-BR"
  const lang = userLocale.substring(0, 2); // normalize to "en", "es", "pt"

  // Fallback to English if translation is missing
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  if (translations[key] && translations[key].en) {
    return translations[key].en;
  }
  return `??? ${key} ???`; // debugging case
}

module.exports = strings;

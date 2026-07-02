
const themes = {
  supabase: {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    accentColor: '#28a745',
    backgroundColor: '#ffffff',
    textColor: '#000000'
  },
  firebase: {
    primaryColor: '#ff5722',
    secondaryColor: '#ffffff',
    accentColor: '#03a9f4',
    backgroundColor: '#f5f5f5',
    textColor: '#ffffff'
  },
  python: {
    primaryColor: '#3776ab',
    secondaryColor: '#f5f5f5',
    accentColor: '#ffd700',
    backgroundColor: '#ffffff',
    textColor: '#000000'
  },
  github: {
    primaryColor: '#24292e',
    secondaryColor: '#f6f8fa',
    accentColor: '#509e2a',
    backgroundColor: '#ffffff',
    textColor: '#000000'
  },
  gemini: {
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#000000'
  },
  mistral: {
    primaryColor: '#0d1117',
    secondaryColor: '#ffffff',
    accentColor: '#00f0ff',
    backgroundColor: '#0d1117',
    textColor: '#ffffff'
  },
  groq: {
    primaryColor: '#1a1a1a',
    secondaryColor: '#f0f0f0',
    accentColor: '#00ff00',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff'
  }
};

const ThemeSelector = ({ onThemeChange }) => {
  const handleThemeChange = (themeName) => {
    onThemeChange(themes[themeName]);
  };

  return (
    <div className="theme-selector">
      <h3>Select Theme:</h3>
      <div className="theme-options">
        {Object.keys(themes).map(themeName => (
          <button
            key={themeName}
            onClick={() => handleThemeChange(themeName)}
            style={{
              backgroundColor: themes[themeName].primaryColor,
              color: themes[themeName].textColor,
              border: `2px solid ${themes[themeName].secondaryColor}`
            }}
          >
            {themeName}
          </button>
        ))}
      </div>
    </div>
  );
};

export { ThemeSelector, themes };
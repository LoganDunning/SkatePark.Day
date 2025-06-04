# 🛹 SkatePark.Day

**Best SkatePark.Day** - Find the perfect day to skate with intelligent weather analysis.

## Overview

SkatePark.Day is a single-page web application that analyzes 7-day weather forecasts to determine the optimal day for skateboarding. Using real-time weather data, it evaluates temperature, wind speed, UV index, and precipitation to recommend the best skating conditions.

## Features

- **7-Day Skate Forecast** - Complete weekly weather analysis
- **Smart Scoring Algorithm** - Prioritizes temperature and wind speed (above 15km/h = no-skate day)
- **Hourly Time Blocks** - Best 2-hour windows for optimal skating
- **Location Detection** - GPS with IP fallback for accurate local weather
- **Dark Gaming Theme** - Modern glassmorphism design with purple/blue accents
- **Zero Dependencies** - Pure HTML, CSS, and JavaScript
- **Mobile Optimized** - Responsive design with touch-friendly interface
- **PWA Ready** - Progressive Web App capabilities

## Weather Scoring Criteria

The application prioritizes weather conditions as follows:

**Priority 1 & 2 (Equal importance):**
- Temperature (ideal: 18-25°C, too hot: >30°C)
- Wind speed (write-off threshold: >15km/h)

**Priority 3:**
- UV index and sun exposure
- Precipitation (any rain significantly reduces score)
- Cloud coverage

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Weather API**: Open-Meteo (free, no API key required)
- **Location**: Geolocation API with ipapi.co fallback
- **Design**: CSS Grid, Flexbox, Glassmorphism effects
- **Performance**: Single-page application, optimized for mobile

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/LoganDunning/SkatePark.Day.git
cd SkatePark.Day
```

2. Open `index.html` in your browser or serve via local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

3. Navigate to `http://localhost:8000`

## File Structure

```
SkatePark.Day/
├── index.html          # Main application file
├── app.css            # Styling and animations
├── app.js             # Core application logic
├── favicon.svg        # Skateboard emoji favicon
├── manifest.json      # PWA manifest
├── robots.txt         # SEO crawler instructions
├── sitemap.xml        # Site structure for search engines
├── CLAUDE.md          # Development guidance
├── img/               # Weather condition SVG icons
│   ├── clear.svg
│   ├── cloudy.svg
│   ├── drizzle.svg
│   ├── fog.svg
│   ├── partly-cloudy.svg
│   ├── rain.svg
│   ├── snow.svg
│   └── thunderstorm.svg
└── README.md          # This file
```

## API Usage

The application uses the [Open-Meteo API](https://open-meteo.com/) for weather data:
- **Free tier**: No API key required
- **Data**: 7-day forecast with hourly wind, temperature, UV, precipitation
- **Location**: Automatic coordinate-based requests
- **Updates**: Hourly data refresh

## Browser Support

- **Modern browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Features**: CSS backdrop-filter, ES6+ JavaScript, Geolocation API
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## Performance

- **Load time**: <2 seconds on 3G
- **Bundle size**: ~15KB total (HTML + CSS + JS)
- **Dependencies**: Zero external libraries
- **Caching**: Service worker ready for offline capabilities

## License

© 2025 [Social Dunn Right Inc.](https://www.logandunning.com/) All rights reserved.

## Live Demo

Visit the live application: [skatepark.day](https://skatepark.day)

---

*Built with ❤️ for the skateboarding community*
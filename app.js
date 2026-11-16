const ICONS = {
    sun: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    partly: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v1.5M3.5 8H5M4.8 4.8l1 1M11.2 4.8l-1 1"/><path d="M5.6 10.6A3 3 0 1 1 10.9 7.6"/><path d="M9 20h8.5a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 8.4 14 3 3 0 0 0 9 20z"/></svg>',
    cloud: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 11 3.5 3.5 0 0 0 7 18z"/></svg>',
    fog: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16M3 13h18M5 17h14M8 21h8"/></svg>',
    drizzle: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 15h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 8 3.5 3.5 0 0 0 7 15z"/><path d="M9 18v1M13 18v1M17 18v1"/></svg>',
    rain: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 14h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 7 3.5 3.5 0 0 0 7 14z"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/></svg>',
    snow: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 14h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 7 3.5 3.5 0 0 0 7 14z"/><path d="M8 18h.01M12 20h.01M16 18h.01M10 22h.01M14 22h.01"/></svg>',
    storm: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 14h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.1 7 3.5 3.5 0 0 0 7 14z"/><path d="M12.5 14L10 18h4l-2.5 4"/></svg>',
    wind: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7"/></svg>',
    uv: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>',
    sunHours: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18h18M6 18a6 6 0 0 1 12 0M12 6V4M5.6 10.6L4.2 9.2M18.4 10.6l1.4-1.4"/></svg>',
    target: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/></svg>',
    clock: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    drop: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>',
    pin: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    trophy: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0V4zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4v3h-4z"/></svg>',
    hot: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 11v6"/><path d="M18 5h2M18 9h2"/></svg>',
    info: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    share: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
    cold: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 15v2"/><path d="M18 7h3M19.5 5.5v3"/></svg>',
};

class SkateParkDay {
    constructor() {
        this.location = null;
        this.weatherData = null;
        const pageShare = document.getElementById('page-share');
        if (pageShare) pageShare.onclick = () => this.sharePage();
        const locate = document.getElementById('locate-btn');
        if (locate) locate.onclick = () => this.useCurrentLocation();
        this.setupLocationPill();
        Flyouts.init();
        CalendarFeed.init(this);
        this.setupLocationSearch();
        this.init();
    }

    getSavedLocation() {
        try {
            const saved = localStorage.getItem('skatepark-location');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            return null;
        }
    }

    saveLocation(location) {
        try {
            localStorage.setItem('skatepark-location', JSON.stringify(location));
        } catch (error) {
            console.log('Could not save location to localStorage');
        }
    }

    async init() {
        const saved = this.getSavedLocation();
        // A shared link opens on the sharer's location and day without replacing the visitor's saved location.
        this.shared = readSharedLink(location.search);
        this.location = (this.shared && this.shared.location) || saved || { ...DEFAULT_LOCATION };
        if (this.shared && this.shared.date) {
            this.selectedDayDate = new Date(this.shared.date + 'T12:00:00').toDateString();
            this.qualificationLocation = `${this.location.lat},${this.location.lon}`;
        }
        if (this.shared && this.shared.location && !this.shared.location.city) this.reverseGeocode(this.shared.location).then(() => { if (this.weatherData) this.updateLocationDisplay(); });

        // Paint instantly from cached forecast for this location, if any
        const cached = this.getCachedForecast(this.location);
        if (cached) {
            this.weatherData = cached.data;
            this.updateLocationDisplay();
            this.calculateBestDay();
            this.renderForecast();
        }

        try {
            if (!cached || Date.now() - cached.ts > FORECAST_MAX_AGE) {
                await this.getWeatherData();
                this.calculateBestDay();
                this.renderForecast();
            }
        } catch (error) {
            if (!cached) this.showError(error.message);
        }

        // User-searched locations win; otherwise refine with geolocation in the background
        if (!(this.shared && this.shared.location) && (!saved || saved.source !== 'manual')) this.refineWithGeolocation();
    }

    requestGeolocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) return resolve(null);
            navigator.geolocation.getCurrentPosition(
                (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude, source: 'gps' }),
                () => resolve(null),
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 30 * 60 * 1000 }
            );
        });
    }

    async refineWithGeolocation() {
        const gps = await this.requestGeolocation();
        if (!gps) return;
        const current = this.getSavedLocation();
        if ((current && current.source === 'manual') || (this.location && this.location.source === 'shared')) return;
        if (this.location && distanceKm(this.location, gps) <= 5) {
            if (this.location.source !== 'gps') return;
            this.saveLocation(this.location);
            return;
        }
        this.location = gps;
        await this.reverseGeocode(gps);
        this.saveLocation(gps);
        try {
            await this.getWeatherData();
            this.calculateBestDay();
            this.renderForecast();
        } catch (error) {
            console.log('Could not refresh forecast for GPS location');
        }
    }

    async reverseGeocode(loc) {
        try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&addressdetails=1&lat=${loc.lat}&lon=${loc.lon}`);
            const d = await r.json();
            if (d && d.address) {
                loc.city = this.extractCity(d);
                loc.region = this.extractRegion(d);
                loc.country = d.address.country || '';
            }
        } catch (error) {}
    }

    async getLocation() {
        const saved = this.getSavedLocation();
        if (saved) { this.location = saved; return; }
        const gps = await this.requestGeolocation();
        this.location = gps || { ...DEFAULT_LOCATION };
        if (gps) { await this.reverseGeocode(gps); this.saveLocation(gps); }
    }

    getCachedForecast(location) {
        try {
            const c = JSON.parse(localStorage.getItem('skatepark-forecast'));
            if (c && c.data && c.data.daily && distanceKm(c, location) <= 5) return c;
        } catch (error) {}
        return null;
    }

    cacheForecast(location, data) {
        try {
            localStorage.setItem('skatepark-forecast', JSON.stringify({ lat: location.lat, lon: location.lon, ts: Date.now(), data }));
        } catch (error) {}
    }

    async getWeatherData() {
        if (!this.location) {
            throw new Error('Location not available');
        }

        try {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log('Using timezone:', userTimezone, 'for location:', this.location.lat, this.location.lon);
            const response = await fetchWithRetry(
                `https://api.open-meteo.com/v1/forecast?latitude=${this.location.lat}&longitude=${this.location.lon}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_gusts_10m_max,precipitation_sum,weather_code,uv_index_max,sunshine_duration&hourly=wind_speed_10m,temperature_2m,uv_index,precipitation,weather_code&timezone=${encodeURIComponent(userTimezone)}&forecast_days=7`
            );
            
            if (!response.ok) {
                throw new Error('Weather data unavailable');
            }
            
            this.weatherData = await response.json();
            this.cacheForecast(this.location, this.weatherData);
            console.log('Weather data received:', this.weatherData.daily.time, this.weatherData.daily.precipitation_sum);
            this.updateLocationDisplay();
        } catch (error) {
            throw new Error('Failed to fetch weather data');
        }
    }

    calculateBestDay() {
        if (!this.weatherData || !this.weatherData.daily) {
            return;
        }

        const daily = this.weatherData.daily;
        const hourly = this.weatherData.hourly;
        
        this.days = daily.time.map((date, index) => {
            const dayStart = index * 24;
            const dayEnd = dayStart + 24;
            const dayHourlyWinds = hourly.wind_speed_10m.slice(dayStart, dayEnd);
            const maxHourlyWind = Math.max(...dayHourlyWinds);
            
            const day = {
                date: new Date(date + 'T12:00:00'),
                tempMax: daily.temperature_2m_max[index],
                tempMin: daily.temperature_2m_min[index],
                windMax: daily.wind_speed_10m_max[index],
                windGusts: daily.wind_gusts_10m_max[index],
                maxHourlyWind: maxHourlyWind,
                precipitation: daily.precipitation_sum[index],
                weatherCode: daily.weather_code[index],
                uvIndex: daily.uv_index_max[index],
                sunshine: daily.sunshine_duration[index],
                score: 0,
                reasons: [],
                hourlyData: {
                    times: hourly.time.slice(dayStart, dayEnd),
                    temps: hourly.temperature_2m.slice(dayStart, dayEnd),
                    winds: hourly.wind_speed_10m.slice(dayStart, dayEnd),
                    uvs: hourly.uv_index.slice(dayStart, dayEnd),
                    precipitation: hourly.precipitation.slice(dayStart, dayEnd),
                    weatherCodes: hourly.weather_code.slice(dayStart, dayEnd)
                }
            };

            day.score = this.calculateDayScore(day);
            return day;
        });

        // Filter out significantly rainy days (>1mm) from being #1, then find the best
        const lowRainDays = this.days.filter(day => day.precipitation <= 1.0);
        
        if (lowRainDays.length > 0) {
            this.bestDay = lowRainDays.reduce((best, current) => this.betterDay(current, best));
        } else {
            // If all days have significant rain, pick the least rainy one
            this.bestDay = this.days.reduce((best, current) => this.betterDay(current, best));
        }
        
        console.log('Best day selected:', this.bestDay.date.toDateString(), 'Score:', this.bestDay.score, 'Rain:', this.bestDay.precipitation + 'mm');
        
        // Calculate best time blocks for the best day
        this.calculateBestTimeBlocks();
    }
    
    // Higher day score wins; on a tie, the better whole-day weather, then the earlier day.
    betterDay(current, best) {
        if (current.score !== best.score) return current.score > best.score ? current : best;
        return (current.weatherScore || 0) > (best.weatherScore || 0) ? current : best;
    }

    calculateBestTimeBlocks() {
        if (!this.bestDay || !this.bestDay.hourlyData) return;
        // Never headline a time block that has already passed today
        if (this.days && this.bestDay === this.days[0] && this.shareBlocksFor(0).length === 0 && this.days.length > 1) {
            const upcoming = this.days.slice(1);
            const dry = upcoming.filter(d => d.precipitation <= 1.0);
            this.bestDay = (dry.length ? dry : upcoming).reduce((b, c) => this.betterDay(c, b));
        }
        const idx = this.days ? this.days.indexOf(this.bestDay) : -1;
        this.bestTimeBlocks = (idx >= 0 ? this.shareBlocksFor(idx) : this.computeTimeBlocks(this.bestDay))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }

    computeTimeBlocks(day) {
        const hourly = day.hourlyData;
        const timeBlocks = [];
        
        // Create 2-hour blocks from 6am to 8pm
        for (let hour = 6; hour <= 18; hour += 2) {
            const blockData = {
                startHour: hour,
                endHour: hour + 2,
                temps: hourly.temps.slice(hour, hour + 2),
                winds: hourly.winds.slice(hour, hour + 2),
                uvs: hourly.uvs.slice(hour, hour + 2),
                precipitation: hourly.precipitation.slice(hour, hour + 2)
            };
            
            // Calculate block score
            const avgWind = blockData.winds.reduce((a, b) => a + b, 0) / blockData.winds.length;
            const maxWind = Math.max(...blockData.winds);
            const avgTemp = blockData.temps.reduce((a, b) => a + b, 0) / blockData.temps.length;
            const maxUV = Math.max(...blockData.uvs);
            const totalPrecip = blockData.precipitation.reduce((a, b) => a + b, 0);
            
            let blockScore = 100;
            
            // Wind penalties
            if (maxWind > 15) blockScore = 0;
            else blockScore -= Math.min(avgWind * 3, 50);
            
            // Temperature scoring
            if (avgTemp > 30) blockScore -= 25;
            else if (avgTemp < 10) blockScore -= 20;
            else if (avgTemp >= 18 && avgTemp <= 25) blockScore += 15;
            
            // UV penalties
            if (maxUV > 8) blockScore -= 10;
            
            // Rain penalties - any rain disqualifies the time block
            if (totalPrecip > 0.1) blockScore = 0;
            else if (totalPrecip > 0) blockScore -= 40;
            
            blockScore = Math.max(0, Math.min(100, blockScore));
            
            timeBlocks.push({
                ...blockData,
                score: blockScore,
                label: this.formatTimeBlock(hour, hour + 2)
            });
        }
        
        return timeBlocks;
    }
    
    formatTimeBlock(start, end) {
        const formatHour = (hour) => {
            if (hour === 12) return '12pm';
            if (hour > 12) return `${hour - 12}pm`;
            return `${hour}am`;
        };
        return `${formatHour(start)}-${formatHour(end)}`;
    }
    
    isHeavyRainDay(day) {
        if (!day.hourlyData || day.precipitation <= 3) return false;
        
        // Count consecutive hours with significant rain
        let consecutiveRainHours = 0;
        let maxConsecutiveHours = 0;
        
        day.hourlyData.precipitation.forEach((precip) => {
            if (precip > 0.1) {
                consecutiveRainHours++;
                maxConsecutiveHours = Math.max(maxConsecutiveHours, consecutiveRainHours);
            } else {
                consecutiveRainHours = 0;
            }
        });
        
        return day.precipitation > 3 && maxConsecutiveHours > 2;
    }

    getMainIssue(day) {
        if (day.precipitation > 0) return null; // Rain takes priority and is shown separately
        
        if (day.maxHourlyWind > 25) return `${ICONS.wind} Extreme winds`;
        if (day.maxHourlyWind > 15) return `${ICONS.wind} High winds`;
        if (day.tempMax > 30) return `${ICONS.hot} Over 30°C heat`;
        if (day.tempMax < 10) return `${ICONS.cold} Too cold`;
        if (day.uvIndex > 8) return `${ICONS.uv} High UV levels`;
        
        return null;
    }

    getRainTiming(day) {
        if (!day.hourlyData || day.precipitation <= 0) return '';
        
        const rainHours = [];
        day.hourlyData.precipitation.forEach((precip, index) => {
            if (precip > 0.1) {
                const hour = index;
                if (hour >= 6 && hour <= 22) { // Only show daylight hours
                    const formatHour = (h) => {
                        if (h === 12) return '12pm';
                        if (h > 12) return `${h - 12}pm`;
                        return `${h}am`;
                    };
                    rainHours.push(formatHour(hour));
                }
            }
        });
        
        if (rainHours.length === 0) return '';
        if (rainHours.length <= 3) return ` around ${rainHours.join(', ')}`;
        
        // If many hours, show range
        const firstHour = rainHours[0];
        const lastHour = rainHours[rainHours.length - 1];
        return ` from ${firstHour} to ${lastHour}`;
    }

    // The original day-scoring rules (276607e), shared by the score and its meters.
    // Each fill normalizes the actual point contribution within that rule's range;
    // it is not a weather measurement or a percentage weight in the final score.
    getDayFactors(day) {
        const extremeWind = day.maxHourlyWind > 25;
        const cloudiness = this.getCloudiness(day.weatherCode);
        const temperature = day.tempMax > 30 ? -30 : day.tempMax < 10 ? -25 :
            day.tempMax >= 18 && day.tempMax <= 25 ? 20 : 0;
        const wind = extremeWind ? -100 : day.maxHourlyWind > 15 ?
            -Math.min((day.maxHourlyWind - 15) * 3, 40) :
            day.maxHourlyWind > 10 ? -Math.min(day.maxHourlyWind * 1.5, 15) : 0;
        const rain = day.precipitation > 0.1 ? -60 : day.precipitation > 0 ? -30 : 0;
        const uv = day.uvIndex > 8 ? -15 : day.uvIndex < 3 ? 10 : 0;
        const sunshine = day.sunshine > 25200 ? 10 : 0;
        const clouds = cloudiness === 'clear' ? 5 : cloudiness === 'cloudy' ? -5 : 0;
        return [
            { key: 'temperature', label: 'Temperature', value: `${day.tempMax}°C`, icon: ICONS.hot,
                points: temperature, min: -30, max: 20,
                reason: temperature === -30 ? 'Too hot' : temperature === -25 ? 'Too cold' : temperature === 20 ? 'Perfect temperature' : '' },
            { key: 'wind', label: 'Wind', value: `${day.maxHourlyWind} km/h`, icon: ICONS.wind,
                points: wind, min: -40, max: 0,
                reason: extremeWind ? 'Extreme wind (write-off)' : day.maxHourlyWind > 15 ? 'Windy' : day.maxHourlyWind > 10 ? 'Breezy' : '' },
            { key: 'rain', label: 'Rain', value: `${day.precipitation} mm`, icon: ICONS.drop,
                points: rain, min: -60, max: 0,
                reason: rain === -60 ? 'Rain expected' : rain === -30 ? 'Light rain possible' : '' },
            { key: 'uv', label: 'UV', value: `${day.uvIndex} index`, icon: ICONS.uv,
                points: uv, min: -15, max: 10,
                reason: uv === -15 ? 'High UV' : uv === 10 ? 'Low UV' : '' },
            { key: 'sunshine', label: 'Sunshine', value: `${+(day.sunshine / 3600).toFixed(1)} h`, icon: ICONS.sunHours,
                points: sunshine, min: 0, max: 10, reason: sunshine ? 'Sunny day' : '' },
            { key: 'clouds', label: 'Sky', value: cloudiness === 'clear' ? 'Clear' : cloudiness === 'partly-cloudy' ? 'Partly cloudy' : 'Cloudy', icon: ICONS.cloud,
                points: clouds, min: -5, max: 5, reason: '' }
        ].map(factor => ({ ...factor,
            inactive: extremeWind && factor.key !== 'wind',
            percent: extremeWind ? 0 : Math.max(0, Math.min(100, (factor.points - factor.min) / (factor.max - factor.min) * 100))
        }));
    }

    calculateDayScore(day) {
        const factors = this.getDayFactors(day);
        if (day.maxHourlyWind > 25) {
            day.reasons = ['Extreme wind (write-off)'];
            day.weatherScore = 0;
            day.cappedByWindow = false;
            return 0;
        }
        day.reasons = factors.map(factor => factor.reason).filter(Boolean);
        const weatherScore = Math.min(Math.max(0, 100 + factors.reduce((sum, factor) => sum + factor.points, 0)), 100);
        day.weatherScore = weatherScore;
        if (!day.hourlyData) return weatherScore;
        // The whole-day rules add bonuses on top of 100 and only write a day off at 25 km/h,
        // so on their own they saturate at 100 even when every two-hour window is unskateable.
        // A day can never score higher than its best skate window (6am-8pm, all of today's windows).
        const blocks = this.computeTimeBlocks(day);
        const bestBlock = blocks.length ? Math.max(...blocks.map(b => b.score)) : 0;
        day.bestBlockScore = bestBlock;
        day.cappedByWindow = bestBlock < weatherScore;
        if (bestBlock <= 0) day.reasons = [blocks.every(b => Math.max(...b.winds) > 15) ? 'Too windy all day' : 'No skateable window'];
        return Math.min(weatherScore, bestBlock);
    }

    renderDayQualification(index) {
        const day = this.days[index];
        if (!day) return;
        this.selectedDayIndex = index;
        this.selectedDayDate = day.date.toDateString();
        const title = `${this.dayLabel(index)} · ${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        const factors = this.getDayFactors(day);
        document.getElementById('day-qualification').innerHTML = `
            <div class="qualification-heading">
                <h3 id="qualification-title">Why ${title} scores ${CountUp.num(day.score)}/100</h3>
                <span>${day === this.bestDay ? 'Best day' : 'Selected day'}</span>
            </div>
            ${this.windowSummaryHtml(index)}
            <p class="qualification-help">Fuller bars mean better conditions for the whole day.</p>
            <div class="factor-grid">
                ${factors.map(factor => {
                    const points = `${factor.points > 0 ? '+' : ''}${+factor.points.toFixed(1)} pts`;
                    const impact = factor.inactive ? 'Not applied: extreme wind' : factor.key === 'wind' && day.maxHourlyWind > 25 ? 'Day ruled out' : points;
                    const description = `${factor.label}: ${factor.value}; ${impact}; ${Math.round(factor.percent)} out of 100 for this factor`;
                    return `<div class="day-factor${factor.inactive ? ' inactive' : ''}" data-factor="${factor.key}">
                        <div class="factor-heading"><span>${factor.icon} ${factor.label}</span><strong>${factor.value}</strong></div>
                        <div class="factor-meter" role="meter" aria-label="${escapeHtml(factor.label)} skate conditions" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${+factor.percent.toFixed(1)}" aria-valuetext="${escapeHtml(description)}">
                            <span ${CountUp.fill(factor.percent)}></span>
                        </div>
                        <div class="factor-impact">${impact}</div>
                    </div>`;
                }).join('')}
            </div>
            <p class="qualification-note">Score starts at 100, adds the points above, then caps at 0–100 and never above the day’s best two-hour window. Wind above 25 km/h rules out the day. Bars use each rule’s point range, not a share of the total.</p>`;
        CountUp.run(document.getElementById('day-qualification'));
    }

    // Best time for the selected day, every remaining window's score, and why it can beat the day score.
    windowSummaryHtml(index) {
        const day = this.days[index];
        const win = this.bestWindow(index);
        if (!win) return `<div class="window-summary"><div class="window-best"><span class="window-label">Best time</span><strong>No time left today</strong></div></div>`;
        const dayScore = Math.round(day.score);
        const windowCap = day.bestBlockScore === undefined ? null : Math.round(day.bestBlockScore);
        let why = 'The day score rates the whole day. Each time score rates only that two-hour window: its wind, temperature, UV and rain.';
        if (day.cappedByWindow && windowCap > 0 && !win.none && dayScore === win.score) {
            why = `The day score is capped at the day's best two-hour window, so it is ${dayScore}: ${win.label} scores ${win.score} and no window scores higher.`;
        } else if (day.cappedByWindow && windowCap > 0) {
            why = index === 0 && (win.none || windowCap > win.score)
                ? `The day score is capped at the day's best two-hour window. The best one was earlier today and scored ${windowCap}, so the day scores ${dayScore}.`
                : `The day score is capped at the day's best two-hour window, which scores ${windowCap}, so the day scores ${dayScore}.`;
        } else if (!win.none && win.score - dayScore >= 20) {
            const cause = day.maxHourlyWind > 25 ? `wind peaks at ${Math.round(day.maxHourlyWind)} km/h at the windiest hour, which rules out the whole day`
                : day.reasons && day.reasons.length ? day.reasons.filter(r => !/perfect|low uv|sunny/i.test(r)).join(', ').toLowerCase() || 'conditions elsewhere in the day' : 'conditions elsewhere in the day';
            why = `The day scores ${dayScore} because ${cause}. ${win.label} avoids the worst of it and scores ${win.score} on its own.`;
        } else if (win.none) {
            why = win.reason === 'Too windy all day'
                ? `Every ${index === 0 ? 'remaining ' : ''}window has an hour with wind over 15 km/h, so each scores 0.`
                : `Every ${index === 0 ? 'remaining ' : ''}window has rain or wind over 15 km/h, so each scores 0.`;
            why += dayScore === 0 ? ' The day score is 0.'
                : ` Earlier windows today scored up to ${dayScore}, so the day score is ${dayScore}.`;
        }
        return `<div class="window-summary">
                <div class="window-best"><span class="window-label">Best time</span><strong>${win.none ? win.reason : `${win.label} · ${CountUp.num(win.score)}/100`}</strong><span class="window-vs">Day score ${CountUp.num(dayScore)}/100</span></div>
                <p class="window-why">${escapeHtml(why)}</p>
            </div>`;
    }

    getCloudiness(weatherCode) {
        if ([0, 1].includes(weatherCode)) return 'clear';
        if ([2, 3].includes(weatherCode)) return 'partly-cloudy';
        return 'cloudy';
    }

    getWeatherIcon(weatherCode) {
        const icons = {
            0: ICONS.sun, 1: ICONS.partly, 2: ICONS.partly, 3: ICONS.cloud,
            45: ICONS.fog, 48: ICONS.fog,
            51: ICONS.drizzle, 53: ICONS.drizzle, 55: ICONS.drizzle,
            61: ICONS.rain, 63: ICONS.rain, 65: ICONS.rain,
            71: ICONS.snow, 73: ICONS.snow, 75: ICONS.snow,
            95: ICONS.storm, 96: ICONS.storm, 99: ICONS.storm
        };
        return icons[weatherCode] || ICONS.partly;
    }

    getScoreClass(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        return 'poor';
    }

    updateLocationDisplay() {
        const locationElement = document.getElementById('location-display');
        let locationText = '';
        
        if (this.location.city && this.location.region) {
            locationText = `${this.location.city}, ${this.location.region}`;
        } else if (this.location.city && this.location.country) {
            locationText = `${this.location.city}, ${this.location.country}`;
        } else {
            locationText = `${this.location.lat.toFixed(2)}, ${this.location.lon.toFixed(2)}`;
        }
        
        locationElement.textContent = locationText;
        const pill = document.getElementById('location-pill-text');
        if (pill) {
            pill.textContent = locationText;
            document.getElementById('location-pill').setAttribute('aria-label', `Change location, currently ${locationText}`);
        }
        const input = document.getElementById('location-search');
        if (document.activeElement !== input) input.value = locationText;
        input.dataset.current = locationText;
        
        this.setupLocationSearch();
    }

    showLocationEdit() {
        this.openLocationPanel();
    }

    hideLocationEdit() {
        const input = document.getElementById('location-search');
        input.blur();
        this.closeLocationPanel(false);
    }

    // The location pill opens the search (type-ahead plus the current-location arrow) under it.
    setupLocationPill() {
        const pill = document.getElementById('location-pill');
        const panel = document.getElementById('location-panel');
        if (!pill || !panel || pill.dataset.ready) return;
        pill.dataset.ready = '1';
        pill.onclick = () => (panel.hidden ? this.openLocationPanel() : this.closeLocationPanel());
        document.addEventListener('pointerdown', e => {
            if (!panel.hidden && !panel.contains(e.target) && !pill.contains(e.target) && !e.target.closest('#location-suggestions')) this.closeLocationPanel(false);
        });
        panel.addEventListener('keydown', e => {
            const list = document.getElementById('location-suggestions');
            if (e.key === 'Escape' && (!list || list.hidden || !list.children.length)) { e.preventDefault(); this.closeLocationPanel(); }
        });
    }

    openLocationPanel() {
        const pill = document.getElementById('location-pill');
        const panel = document.getElementById('location-panel');
        const input = document.getElementById('location-search');
        if (panel) { panel.hidden = false; pill.setAttribute('aria-expanded', 'true'); }
        if (input) { input.focus(); input.select(); }
    }

    closeLocationPanel(restoreFocus = true) {
        const pill = document.getElementById('location-pill');
        const panel = document.getElementById('location-panel');
        const note = document.getElementById('locate-note');
        if (!panel || panel.hidden) return;
        if (note && !note.hidden && note.classList.contains('error')) return;
        panel.hidden = true;
        pill.setAttribute('aria-expanded', 'false');
        if (restoreFocus) pill.focus();
    }

    setupLocationSearch() {
        const searchInput = document.getElementById('location-search');
        const edit = document.getElementById('location-edit');
        if (searchInput.dataset.ready) return;
        searchInput.dataset.ready = '1';

        let list = document.getElementById('location-suggestions');
        if (!list) {
            list = document.createElement('ul');
            list.id = 'location-suggestions';
            list.className = 'location-suggestions';
            list.setAttribute('role', 'listbox');
            list.hidden = true;
            edit.appendChild(list);
        }
        searchInput.setAttribute('role', 'combobox');
        searchInput.setAttribute('aria-autocomplete', 'list');
        searchInput.setAttribute('aria-controls', 'location-suggestions');
        searchInput.setAttribute('aria-expanded', 'false');

        this.suggestions = [];
        this.activeSuggestion = -1;
        let timer = null;
        let requestId = 0;

        const close = () => {
            list.hidden = true;
            list.innerHTML = '';
            this.suggestions = [];
            this.activeSuggestion = -1;
            searchInput.setAttribute('aria-expanded', 'false');
            searchInput.removeAttribute('aria-activedescendant');
        };

        const highlight = (index) => {
            const items = list.querySelectorAll('li');
            items.forEach((li, i) => li.setAttribute('aria-selected', i === index ? 'true' : 'false'));
            this.activeSuggestion = index;
            if (items[index]) searchInput.setAttribute('aria-activedescendant', items[index].id);
        };

        const render = (results) => {
            this.suggestions = results;
            list.innerHTML = '';
            if (!results.length) { close(); return; }
            results.forEach((r, i) => {
                const li = document.createElement('li');
                li.id = `location-option-${i}`;
                li.setAttribute('role', 'option');
                const name = document.createElement('span');
                name.className = 'suggestion-name';
                name.textContent = r.name;
                const meta = document.createElement('span');
                meta.className = 'suggestion-meta';
                meta.textContent = [r.admin1, r.country_code].filter(Boolean).join(', ');
                li.append(name, meta);
                li.onmousedown = (e) => { e.preventDefault(); this.selectSuggestion(r); close(); };
                list.appendChild(li);
            });
            list.hidden = false;
            searchInput.setAttribute('aria-expanded', 'true');
            highlight(0);
        };

        searchInput.oninput = () => {
            clearTimeout(timer);
            const q = searchInput.value.trim();
            if (q.length < 2) { close(); return; }
            timer = setTimeout(async () => {
                const id = ++requestId;
                const results = await this.fetchSuggestions(q);
                if (id === requestId && searchInput.value.trim() === q) render(results);
            }, 250);
        };

        searchInput.onfocus = () => searchInput.select();
        searchInput.onblur = () => {
            setTimeout(() => {
                close();
                if (document.activeElement !== searchInput) searchInput.value = searchInput.dataset.current || '';
            }, 200);
        };

        searchInput.onkeydown = (e) => {
            const count = this.suggestions.length;
            if (e.key === 'ArrowDown' && count) {
                e.preventDefault();
                highlight((this.activeSuggestion + 1) % count);
            } else if (e.key === 'ArrowUp' && count) {
                e.preventDefault();
                highlight((this.activeSuggestion - 1 + count) % count);
            } else if (e.key === 'Escape') {
                close();
                this.hideLocationEdit();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const pick = this.suggestions[this.activeSuggestion];
                close();
                if (pick) this.selectSuggestion(pick);
                else this.searchLocation(searchInput.value);
            }
        };
    }

    // Reference point for ranking: the user's current location if known,
    // otherwise the centre of southern Ontario.
    getBiasPoint() {
        if (this.location && isFinite(this.location.lat) && isFinite(this.location.lon)) {
            return { lat: this.location.lat, lon: this.location.lon };
        }
        return { lat: 43.65, lon: -79.38 };
    }

    distanceKm(a, b) {
        const rad = (d) => d * Math.PI / 180;
        const dLat = rad(b.lat - a.lat);
        const dLon = rad(b.lon - a.lon);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
        return 12742 * Math.asin(Math.sqrt(h));
    }

    rankSuggestions(results, query) {
        const origin = this.getBiasPoint();
        const q = query.toLowerCase();
        return results
            .map((r) => {
                const km = this.distanceKm(origin, { lat: r.latitude, lon: r.longitude });
                let score = 0;
                if (r.country_code === 'CA') score += 40;
                if (r.country_code === 'CA' && r.admin1 === 'Ontario') score += 60;
                score -= Math.min(km, 15000) / 150;
                score += Math.log10((r.population || 0) + 1) * 3;
                if (r.name.toLowerCase() === q) score += 15;
                else if (r.name.toLowerCase().startsWith(q)) score += 5;
                return { ...r, _score: score };
            })
            .sort((a, b) => b._score - a._score)
            .slice(0, 6);
    }

    async fetchSuggestions(query) {
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=25&language=en&format=json`;
            const response = await fetch(url);
            if (!response.ok) return [];
            const data = await response.json();
            return this.rankSuggestions(data.results || [], query);
        } catch (error) {
            return [];
        }
    }

    async selectSuggestion(r) {
        const newLocation = {
            lat: r.latitude,
            lon: r.longitude,
            city: r.name,
            region: r.admin1 || '',
            country: r.country || r.country_code || '',
            source: 'manual'
        };
        this.location = newLocation;
        this.saveLocation(newLocation);
        this.hideLocationEdit();
        this.updateLocationDisplay();
        try {
            await this.getWeatherData();
            this.calculateBestDay();
            this.renderForecast();
        } catch (error) {
            this.showError(error.message);
        }
    }

    // Pointer button in the search bar: jump to where the visitor is, asking the browser only when needed.
    async useCurrentLocation() {
        const btn = document.getElementById('locate-btn');
        const note = document.getElementById('locate-note');
        const say = (msg, kind) => {
            if (!note) return;
            clearTimeout(this.locateNoteTimer);
            note.textContent = msg || '';
            note.className = `locate-note${kind ? ' ' + kind : ''}`;
            note.hidden = !msg;
            if (msg && kind === 'error') this.locateNoteTimer = setTimeout(() => { note.hidden = true; }, 7000);
        };
        if (this.locating) return;
        if (!navigator.geolocation) { say('Location isn’t available in this browser. Type a city or town in the search bar instead.', 'error'); return; }
        let state = 'prompt';
        try {
            if (navigator.permissions && navigator.permissions.query) state = (await navigator.permissions.query({ name: 'geolocation' })).state;
        } catch (e) { state = 'prompt'; }
        if (state === 'denied') { say('Location is blocked for this site. Allow it in your browser settings, or type a city or town in the search bar.', 'error'); return; }
        this.locating = true;
        if (btn) { btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true'); }
        if (state !== 'granted') say('Requesting your location…');
        else say('');
        const pos = await new Promise(resolve => navigator.geolocation.getCurrentPosition(
            p => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
            err => resolve({ error: err }),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
        ));
        if (pos.error) {
            this.locating = false;
            if (btn) { btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); }
            say(pos.error.code === 1 ? 'Location is blocked for this site. Allow it in your browser settings, or type a city or town in the search bar.'
                : 'Couldn’t find your location just now. Try again, or type a city or town in the search bar.', 'error');
            return;
        }
        say('');
        this.hideLocationEdit();
        const loc = { lat: pos.lat, lon: pos.lon, source: 'gps' };
        await this.reverseGeocode(loc);
        this.location = loc;
        this.saveLocation(loc);
        this.updateLocationDisplay();
        try {
            await this.getWeatherData();
            this.calculateBestDay();
            this.renderForecast();
        } catch (error) {
            this.showError(error.message);
        }
        this.locating = false;
        if (btn) { btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); }
    }

    async searchLocation(query) {
        if (!query.trim()) return;
        
        try {
            // Use OpenStreetMap Nominatim for free geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}&limit=1&viewbox=-95.2,56.9,-74.3,41.7`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const result = data[0];
                const newLocation = {
                    lat: parseFloat(result.lat),
                    lon: parseFloat(result.lon),
                    city: this.extractCity(result),
                    region: this.extractRegion(result),
                    country: result.display_name.split(',').pop().trim(),
                    source: 'manual'
                };
                
                this.location = newLocation;
                this.saveLocation(newLocation);
                this.hideLocationEdit();
                this.updateLocationDisplay();
                
                // Refresh weather data for new location
                await this.getWeatherData();
                this.calculateBestDay();
                this.renderForecast();
            }
        } catch (error) {
            console.log('Location search failed:', error);
        }
    }

    updateMetaTags() {
        if (!this.bestDay || !this.location) return;
        
        const day = this.bestDay;
        let dayName;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0).toDateString();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0, 0).toDateString();
        
        if (day.date.toDateString() === today) {
            dayName = 'Today';
        } else if (day.date.toDateString() === tomorrow) {
            dayName = 'Tomorrow';
        } else {
            dayName = day.date.toLocaleDateString('en-US', { weekday: 'long' });
        }
        
        const date = day.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        
        // Create location string
        let locationStr = '';
        if (this.location.city && this.location.region) {
            locationStr = `${this.location.city}, ${this.location.region}`;
        } else if (this.location.city && this.location.country) {
            locationStr = `${this.location.city}, ${this.location.country}`;
        } else {
            locationStr = 'your area';
        }
        
        // Get best time if available
        const bestTime = this.bestTimeBlocks && this.bestTimeBlocks.length > 0 
            ? ` at ${this.bestTimeBlocks[0].label}` 
            : '';
        
        // Update page title
        const newTitle = `${dayName} (${date}) is the best skate day in ${locationStr} - best.skatepark.day`;
        document.title = newTitle;
        
        // Create description with conditions
        const temp = Math.round(day.tempMax);
        const wind = Math.round(day.maxHourlyWind);
        const score = Math.round(day.score);
        const conditions = [];
        
        if (day.precipitation <= 0) conditions.push('no rain');
        if (wind <= 10) conditions.push('low winds');
        if (temp >= 18 && temp <= 25) conditions.push('perfect temperature');
        
        const conditionsStr = conditions.length > 0 ? ` with ${conditions.join(', ')}` : '';
        const newDescription = `${dayName} (${date}) is the best day for skateboarding in ${locationStr}${bestTime}${conditionsStr}. Temperature: ${temp}°C, Wind: ${wind}km/h, Score: ${score}/100`;
        
        // Update meta description
        const descriptionMeta = document.querySelector('meta[name="description"]');
        if (descriptionMeta) {
            descriptionMeta.setAttribute('content', newDescription);
        }
        
        // Update Open Graph title and description
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', newTitle);
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', newDescription);
        }
        
        // Update Twitter Card title and description
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', newTitle);
        }
        
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.setAttribute('content', newDescription);
        }
    }

    extractCity(result) {
        const parts = result.display_name.split(',');
        return parts[0].trim();
    }

    extractRegion(result) {
        const parts = result.display_name.split(',');
        // Try to find state/province in the address
        for (let i = 1; i < parts.length - 1; i++) {
            const part = parts[i].trim();
            if (part.length <= 3 && part.match(/^[A-Z]{2,3}$/)) {
                return part;
            }
        }
        return parts[parts.length - 2]?.trim();
    }

    renderForecast() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('forecast').classList.remove('hidden');

        this.updateBestSkateSummary();
        this.renderBestDay();
        this.renderWeatherGrid();
        this.renderSharedNote();
        this.updateMetaTags();
        if (window.SkateSplash) window.SkateSplash.finish();
    }

    updateBestSkateSummary() {
        const summaryElement = document.getElementById('best-skate-summary');
        const day = this.bestDay;
        
        let dayName;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0).toDateString();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 12, 0, 0).toDateString();
        
        if (day.date.toDateString() === today) {
            dayName = 'Today';
        } else if (day.date.toDateString() === tomorrow) {
            dayName = 'Tomorrow';
        } else {
            dayName = day.date.toLocaleDateString('en-US', { weekday: 'long' });
        }
        
        const date = day.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const bestTime = this.bestTimeBlocks && this.bestTimeBlocks.length > 0 ? this.bestTimeBlocks[0].label : 'anytime';
        
        summaryElement.innerHTML = `<span class="muted-text">The Best Day to Skate this week is</span> ${dayName}, ${date} at ${bestTime}`;
    }

    // Headline for the selected day (the best day by default): day, best window, score, conditions.
    renderBestDay(index = this.days.indexOf(this.bestDay)) {
        const bestDayInfo = document.getElementById('best-day-info');
        const day = this.days[index];
        if (!bestDayInfo || !day) return;
        const isBest = day === this.bestDay;
        const win = this.bestWindow(index);
        const when = win && !win.none ? this.longBlockLabel(win.startHour, win.endHour) : win ? win.reason : 'No time left today';
        const name = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : day.date.toLocaleDateString('en-US', { weekday: 'long' });
        const label = document.getElementById('forecast-heading');
        if (label) label.textContent = isBest ? 'Best time to skate this week' : `Best time to skate ${index === 0 ? 'today' : index === 1 ? 'tomorrow' : 'on ' + name}`;
        bestDayInfo.innerHTML = `
            <div class="hl-row">
                <p class="hl-when"><span class="hl-day">${name}</span><span class="hl-time">${when}</span></p>
                <button type="button" class="hl-score" id="hl-factors" aria-label="Skate score ${Math.round(day.score)} out of 100. Show the factors behind it">
                    <span class="hl-num"><b>${CountUp.num(day.score)}</b><small>/100</small></span>
                    <span class="hl-factors">Factors <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
                </button>
            </div>
            <p class="hl-wx"><span class="hl-icon">${this.getWeatherIcon(day.weatherCode)}</span><span class="hl-temp">${Math.round(day.tempMax)}°C</span><span>${this.conditionText(day.weatherCode)}</span><span aria-hidden="true">·</span><span>Wind ${Math.round(day.maxHourlyWind)} km/h</span>${day.precipitation > 0 ? `<span aria-hidden="true">·</span><span>Rain ${day.precipitation} mm</span>` : ''}</p>`;
        bestDayInfo.querySelector('#hl-factors').onclick = e => { this.renderDayQualification(this.selectedDayIndex); Flyouts.open('day-sheet', e.currentTarget); };
        CountUp.run(bestDayInfo);
    }

    conditionText(code) {
        const map = { 0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
            61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow', 80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Snow showers', 95: 'Storms', 96: 'Storms', 99: 'Storms' };
        return map[code] || 'Mixed';
    }

    // "10am to 12pm", "12 to 2pm"
    longBlockLabel(start, end) {
        const f = h => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`;
        return `${f(start)} to ${f(end)}`;
    }

    // Two-hour skate scores for the selected day as a bar chart.
    renderTimeChart() {
        const box = document.getElementById('time-chart');
        if (!box || !this.days) return;
        box.innerHTML = `
            <div class="chart-head"><h3 class="chart-title" id="chart-title"></h3><span class="chart-max" aria-hidden="true">100</span></div>
            <div class="chart-panel" id="chart-panel"></div>`;
    }

    renderChartPanel() {
        const panel = document.getElementById('chart-panel');
        if (!panel) return;
        const index = this.selectedDayIndex;
        const day = this.days[index];
        const blocks = this.computeTimeBlocks(day);
        const win = this.bestWindow(index);
        const nowHour = new Date().getHours();
        const short = h => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? 'am' : 'pm'}`;
        const bars = blocks.map(b => {
            const past = index === 0 && b.endHour <= nowHour;
            const best = win && !win.none && b.startHour === win.startHour;
            const score = Math.round(b.score);
            const label = this.shortBlockLabel(b.startHour, b.endHour);
            const note = past ? ' · past' : best ? ' · best' : score === 0 ? ' · too windy or wet' : '';
            return `<button type="button" class="bar-col${best ? ' best' : ''}${past ? ' past' : ''}${score === 0 ? ' zero' : ''}" data-tip="${label} · ${score}${note}" aria-label="${short(b.startHour)}: ${label}, score ${score}${note.replace(' · ', ', ')}">
                <span class="bar-track"><span class="bar" data-axis="y" ${CountUp.fill(b.score).replace('width:', 'height:')}></span></span><span class="bar-x" aria-hidden="true">${short(b.startHour)}</span></button>`;
        }).join('');
        const name = index === 0 ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'long' });
        panel.setAttribute('role', 'group');
        panel.setAttribute('aria-label', `Skate score for each two-hour window on ${name}`);
        panel.innerHTML = `<div class="chart-bars">${bars}</div><div class="chart-tip" role="status" hidden></div>`;
        const title = document.getElementById('chart-title');
        if (title) title.textContent = `${name}, hour by hour`;
        const tip = panel.querySelector('.chart-tip');
        const show = col => {
            tip.textContent = col.dataset.tip;
            tip.hidden = false;
            const p = panel.getBoundingClientRect(), r = col.getBoundingClientRect();
            const x = Math.min(Math.max(r.left + r.width / 2 - p.left, 48), p.width - 48);
            tip.style.left = `${x}px`;
            panel.querySelectorAll('.bar-col.tip-on').forEach(c => c.classList.remove('tip-on'));
            col.classList.add('tip-on');
        };
        const hide = () => { tip.hidden = true; panel.querySelectorAll('.bar-col.tip-on').forEach(c => c.classList.remove('tip-on')); };
        panel.querySelectorAll('.bar-col').forEach(col => {
            col.onmouseenter = () => show(col);
            col.onfocus = () => show(col);
            col.onclick = () => {
                if (panel.pinned === col && !tip.hidden) { panel.pinned = null; hide(); return; }
                panel.pinned = col;
                show(col);
            };
        });
        panel.querySelector('.chart-bars').onmouseleave = hide;
        panel.onfocusout = e => { if (!panel.contains(e.relatedTarget)) hide(); };
        CountUp.run(panel);
    }

    // One selected day everywhere: the row, the headline, the chart and the factors sheet.
    selectDay(index) {
        if (!this.days || !this.days[index]) return;
        this.selectedDayIndex = index;
        this.selectedDayDate = this.days[index].date.toDateString();
        document.querySelectorAll('.day-select').forEach(button => {
            const selected = +button.dataset.day === index;
            button.setAttribute('aria-pressed', String(selected));
            button.classList.toggle('selected', selected);
        });
        this.renderBestDay(index);
        this.renderChartPanel();
        if (Flyouts.isOpen('day-sheet')) this.renderDayQualification(index);
    }

    renderWeatherGrid() {
        const grid = document.getElementById('weather-grid');

        // Sort days by score to find rankings, but filter heavy rain days from #2 spot
        const sortedDays = [...this.days].sort((a, b) => b.score - a.score);
        let secondBestDay = null;
        for (const day of sortedDays) {
            if (day !== this.bestDay && !this.isHeavyRainDay(day)) {
                secondBestDay = day;
                break;
            }
        }
        if (!secondBestDay && sortedDays.length > 1) secondBestDay = sortedDays[1];

        grid.innerHTML = this.days.map((day, index) => {
            const isBest = day === this.bestDay;
            const isSecondBest = day === secondBestDay && !isBest;
            const shortName = index === 0 ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'short' });
            const longName = day.date.toLocaleDateString('en-US', { weekday: 'long' });
            const win = this.bestWindow(index);
            const windowAria = win && !win.none ? ` Best time ${this.longBlockLabel(win.startHour, win.endHour)}.` : win ? ` ${win.reason}.` : '';
            const cls = `day-card day-select${isBest ? ' best' : isSecondBest ? ' second-best' : ''}${day.score < 30 ? ' no-skate' : ''}`;
            return `<button type="button" class="${cls}" data-day="${index}" aria-pressed="false" aria-controls="chart-panel" aria-label="${index === 0 ? 'Today, ' : ''}${longName} ${day.date.getDate()}${isBest ? ', best day' : isSecondBest ? ', runner-up' : ''}. ${this.conditionText(day.weatherCode)}, ${Math.round(day.tempMax)} degrees. Score ${Math.round(day.score)} out of 100.${windowAria}">
                    <span class="row-day"><span class="row-name">${shortName}</span><span class="row-date">${day.date.getDate()}</span></span>
                    <span class="row-wx">${this.getWeatherIcon(day.weatherCode)}<span>${Math.round(day.tempMax)}°</span></span>
                    <span class="row-bar" aria-hidden="true"><span ${CountUp.fill(day.score)}></span></span>
                    <span class="row-score card-score">${CountUp.num(day.score)}</span>
                </button>`;
        }).join('');
        const entrance = CardEntrance.shouldRun(grid, `${this.location.lat},${this.location.lon}`);
        CountUp.run(grid, entrance ? '.day-card' : null);
        if (entrance) CardEntrance.run(grid);
        else WeatherFx.start(grid.querySelectorAll('.day-card'));
        const rows = [...grid.querySelectorAll('.day-select')];
        rows.forEach(button => {
            button.onclick = () => this.selectDay(+button.dataset.day);
            button.onkeydown = e => {
                const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
                if (!step) return;
                e.preventDefault();
                const next = rows[(rows.indexOf(button) + step + rows.length) % rows.length];
                next.focus();
                this.selectDay(+next.dataset.day);
            };
        });
        // Retain a selection on refresh of the same forecast, reset it for a new location.
        const locationKey = `${this.location.lat},${this.location.lon}`;
        let selected = this.qualificationLocation === locationKey ? this.days.findIndex(day => day.date.toDateString() === this.selectedDayDate) : -1;
        this.qualificationLocation = locationKey;
        if (selected < 0) selected = this.days.indexOf(this.bestDay);
        this.selectedDayIndex = selected;
        this.renderTimeChart();
        this.selectDay(selected);
    }

    // What a shared link asked for, shown above the forecast while its location is on screen.
    renderSharedNote() {
        const note = document.getElementById('shared-note');
        const s = this.shared;
        if (!note) return;
        if (!s || !s.date || (s.location && this.location.source !== 'shared')) { note.hidden = true; return; }
        const index = this.weatherData.daily.time.indexOf(s.date);
        const when = new Date(s.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        const time = s.hour != null && index >= 0 ? ' at ' + this.formatTimeBlock(s.hour, s.hour + 2) : '';
        note.textContent = '';
        const kicker = document.createElement('span');
        kicker.className = 'shared-note-kicker';
        kicker.textContent = s.best ? 'Shared best day' : 'Shared with you';
        const text = document.createElement('span');
        text.className = 'shared-note-text';
        text.textContent = index < 0
            ? `${when} is outside this week's forecast, so here is the current 7 days.`
            : s.best ? `${when}${time} is the best day to skate${s.location && s.location.city ? ' near ' + this.locationLabel() : ''}.`
            : `Skate ${when}${time}${s.park ? ' · ' + s.park + (s.parkCity ? ', ' + s.parkCity : '') : ''}`;
        note.append(kicker, text);
        if (s.park && index >= 0) {
            const map = document.createElement('a');
            map.className = 'shared-note-map';
            map.target = '_blank';
            map.rel = 'noopener';
            map.href = s.plat != null ? `https://www.google.com/maps/search/?api=1&query=${s.plat},${s.plon}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([s.park, s.parkCity].filter(Boolean).join(' '))}`;
            map.innerHTML = `${ICONS.pin} Map`;
            note.append(map);
        }
        note.hidden = false;
        if (!this.sharedNoteShown) {
            this.sharedNoteShown = true;
            const b = note.getBoundingClientRect();
            if (b.top < 64 || b.bottom > window.innerHeight) note.scrollIntoView({ block: 'start', behavior: 'auto' });
        }
    }

    // A link to this app that opens on the shared day, place and park, with its own preview card.
    shareLink(index, { block, park, best } = {}) {
        const q = new URLSearchParams();
        const iso = this.weatherData && this.weatherData.daily.time[index];
        if (iso) q.set('d', iso);
        if (best) q.set('best', '1');
        if (block) q.set('t', String(block.startHour));
        if (park && park.name) {
            q.set('p', park.name);
            if (park.city) q.set('pc', park.city);
            if (park.lat != null && !park.custom) { q.set('plat', String(+(+park.lat).toFixed(5))); q.set('plon', String(+(+park.lon).toFixed(5))); }
        }
        const l = this.location || {};
        if (l.city) q.set('loc', this.locationLabel());
        if (l.lat != null) { q.set('lat', String(+(+l.lat).toFixed(2))); q.set('lon', String(+(+l.lon).toFixed(2))); }
        return `${SITE_URL}share?${q.toString().replace(/\+/g, '%20')}`;
    }

    dayLabel(index) {
        if (index === 0) return 'Today';
        if (index === 1) return 'Tomorrow';
        return this.days[index].date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    locationLabel() {
        const l = this.location || {};
        return l.city ? [l.city, l.region].filter(Boolean).join(', ') : `${(+l.lat).toFixed(2)}, ${(+l.lon).toFixed(2)}`;
    }

    // Time blocks for a day; today's blocks that already ended are excluded.
    shareBlocksFor(index) {
        let blocks = this.computeTimeBlocks(this.days[index]);
        if (index === 0) {
            const h = new Date().getHours();
            blocks = blocks.filter(b => b.endHour > h);
        }
        return blocks;
    }

    // The day's highest-scoring two-hour window (earliest wins ties), same blocks as the share dialog.
    // null when no window is left today; { none: true } when every window scores 0.
    bestWindow(index) {
        const blocks = this.shareBlocksFor(index);
        if (!blocks.length) return null;
        const best = blocks.reduce((b, c) => c.score > b.score ? c : b);
        if (best.score > 0) return { ...best, score: Math.round(best.score), blocks };
        const windy = blocks.every(b => Math.max(...b.winds) > 15);
        return { none: true, blocks, reason: windy ? 'Too windy all day' : 'No skateable window' };
    }

    // Short card label: "6–8pm", "10am–12pm", "12–2pm".
    shortBlockLabel(start, end) {
        const part = (h) => h < 12 ? 'am' : 'pm';
        const num = (h) => h % 12 === 0 ? 12 : h % 12;
        return part(start) === part(end) ? `${num(start)}–${num(end)}${part(end)}` : `${num(start)}${part(start)}–${num(end)}${part(end)}`;
    }

    // Nearby skate parks: bundled Ontario data first, live OpenStreetMap lookups as fallback.
    async findSkateparks(loc) {
        const key = `${loc.lat.toFixed(3)},${loc.lon.toFixed(3)}`;
        this.parkCache = this.parkCache || {};
        if (this.parkCache[key]) return this.parkCache[key];
        const store = 'skateparks:' + key;
        try {
            const c = JSON.parse(localStorage.getItem(store) || 'null');
            if (c && Date.now() - c.t < 7 * 864e5 && c.parks.length) return (this.parkCache[key] = c.parks);
        } catch (e) {}
        const finish = (list, radius) => {
            const seen = new Set();
            const parks = list.map(p => ({ name: p.name, lat: p.lat, lon: p.lon, city: p.city || '', prov: p.prov || '', km: distanceKm(loc, p) }))
                .filter(p => p.km <= radius).sort((a, b) => a.km - b.km)
                .filter(p => { const k = p.name + Math.round(p.km * 2); if (seen.has(k)) return false; seen.add(k); return true; })
                .slice(0, 30);
            return parks;
        };
        let parks = null;
        // The Ontario bounding box also covers Buffalo, Detroit and western Quebec, so trust the region name when known.
        const inBox = loc.lat > 41.6 && loc.lat < 57 && loc.lon > -95.2 && loc.lon < -74.3;
        const inOntario = loc.region ? /^(ontario|on)$/i.test(loc.region.trim()) : inBox;
        if (inOntario) {
            const all = await this.loadOntarioParks();
            if (all) {
                parks = finish(all, 25);
                if (!parks.length) parks = null;
            }
        }
        if (!parks) {
            // Near the Ontario border (e.g. Buffalo, Gatineau) the bundled data can still add parks.
            const nearOntario = loc.lat > 41.1 && loc.lat < 57.5 && loc.lon > -95.9 && loc.lon < -73.6;
            const bundled = nearOntario ? await this.loadOntarioParks() : null;
            const live = await this.liveSkateparks(loc);
            if (live) {
                const place = await this.placeFor(loc);
                live.forEach(p => { if (!p.city) { p.city = place.city; p.prov = place.prov; } });
                parks = finish(dedupeParks([...live, ...(bundled || [])]), 25);
            }
        }
        if (parks) {
            this.parkCache[key] = parks;
            if (parks.length) try { localStorage.setItem(store, JSON.stringify({ t: Date.now(), parks })); } catch (e) {}
        }
        return parks;
    }

    loadOntarioParks() {
        if (!this.ontarioParks) {
            this.ontarioParks = fetch('data/skateparks-on.json?v=' + PARK_DATA_VERSION)
                .then(r => r.ok ? r.json() : null)
                .then(d => Array.isArray(d) ? d.map(p => ({ name: p.n, lat: p.lat, lon: p.lon, city: p.c || '', prov: 'ON' })) : null)
                .catch(() => null);
        }
        return this.ontarioParks;
    }

    // City and 2-letter province/state for a location, reverse geocoded at most once per spot and cached.
    async placeFor(loc) {
        if (loc.city && regionCode(loc.region)) return { city: loc.city, prov: regionCode(loc.region) };
        const key = 'place:' + (+loc.lat).toFixed(2) + ',' + (+loc.lon).toFixed(2);
        try { const c = JSON.parse(localStorage.getItem(key) || 'null'); if (c) return c; } catch (e) {}
        try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&addressdetails=1&lat=${loc.lat}&lon=${loc.lon}`);
            const a = (await r.json()).address || {};
            const place = { city: a.city || a.town || a.village || a.municipality || a.county || loc.city || '', prov: regionCode(a['ISO3166-2-lvl4'] || a.state) };
            try { localStorage.setItem(key, JSON.stringify(place)); } catch (e) {}
            return place;
        } catch (e) { return { city: loc.city || '', prov: regionCode(loc.region) }; }
    }

    // Returns raw { name, lat, lon } parks from OSM, or null when every source failed.
    async liveSkateparks(loc) {
        // Simple GET requests (no custom headers) avoid CORS preflights; send the origin as referrer for OSM usage policy.
        const get = async (url) => {
            const ctrl = new AbortController();
            const t = setTimeout(() => ctrl.abort(), 12000);
            try {
                const r = await fetch(url, { signal: ctrl.signal, referrerPolicy: 'strict-origin-when-cross-origin' });
                return r.ok ? await r.json() : null;
            } catch (e) { return null; } finally { clearTimeout(t); }
        };
        // Many parks are mapped as skateboard pitches rather than leisure=skatepark, so ask for both.
        const around = `(around:25000,${loc.lat},${loc.lon})`;
        const q = encodeURIComponent(`[out:json][timeout:20];(nwr["leisure"="skatepark"]${around};nwr["leisure"="pitch"]["sport"~"(^|;)skateboard(;|$)"]${around};);out center 120;`);
        for (const base of ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter']) {
            const d = await get(`${base}?data=${q}`);
            if (d && Array.isArray(d.elements)) {
                return dedupeParks(d.elements.map(e => {
                    const lat = e.lat ?? (e.center && e.center.lat), lon = e.lon ?? (e.center && e.center.lon);
                    if (lat == null) return null;
                    const tg = e.tags || {};
                    return { name: tg.name || (tg['addr:street'] ? `Skatepark on ${tg['addr:street']}` : 'Skatepark'), lat, lon };
                }).filter(Boolean));
            }
        }
        const dLat = 0.23, dLon = 0.23 / Math.max(0.2, Math.cos(loc.lat * Math.PI / 180));
        const vb = [loc.lon - dLon, loc.lat + dLat, loc.lon + dLon, loc.lat - dLat].map(v => v.toFixed(4)).join(',');
        const found = await Promise.all(['skatepark', 'skate park'].map(term =>
            get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=jsonv2&viewbox=${vb}&bounded=1&limit=30`)));
        if (found.some(Array.isArray)) {
            return dedupeParks(found.filter(Array.isArray).flat()
                .map(p => ({ name: p.name || (p.display_name || 'Skatepark').split(',')[0], lat: +p.lat, lon: +p.lon }))
                .filter(p => isFinite(p.lat) && isFinite(p.lon)));
        }
        return null;
    }

    // Custom parks the user typed in, saved with the place they were added.
    savedParks() {
        try { return JSON.parse(localStorage.getItem('customParks') || '[]'); } catch (e) { return []; }
    }

    setSavedParks(list) {
        try { localStorage.setItem('customParks', JSON.stringify(list)); } catch (e) {}
    }

    ensureShareDialog() {
        let dlg = document.getElementById('share-dialog');
        if (dlg) return dlg;
        dlg = document.createElement('dialog');
        dlg.id = 'share-dialog';
        dlg.className = 'share-dialog';
        dlg.setAttribute('aria-labelledby', 'share-title');
        dlg.innerHTML = `
            <form method="dialog" class="share-form">
                <div class="share-head">
                    <h2 id="share-title" class="share-title">Share</h2>
                    <button type="submit" value="cancel" class="share-close" aria-label="Close">&times;</button>
                </div>
                <p id="share-summary" class="share-summary"></p>
                <label for="share-time" class="share-label">Time</label>
                <select id="share-time" class="share-select"></select>
                <label for="share-park" class="share-label">Skate park <span class="muted-text">(optional)</span></label>
                <div class="park-combo">
                    <input id="share-park" class="share-select park-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="share-park-list" autocomplete="off" autocapitalize="words" enterkeyhint="done" placeholder="None · type to search or add">
                    <button type="button" id="share-park-clear" class="park-clear" aria-label="Clear skate park" hidden>&times;</button>
                    <div id="share-park-list" class="park-list" role="listbox" aria-label="Skate parks" hidden></div>
                </div>
                <p id="share-park-status" class="share-status" aria-live="polite"></p>
                <button type="button" id="share-go" class="btn btn-solid share-go">${ICONS.share} Share</button>
            </form>`;
        document.body.appendChild(dlg);
        dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
        this.setupParkCombo(dlg);
        return dlg;
    }

    // Grouped, accessible combo box for the optional skate park field: Recent picks, then all parks A–Z.
    setupParkCombo(dlg) {
        const input = dlg.querySelector('#share-park');
        const list = dlg.querySelector('#share-park-list');
        const clear = dlg.querySelector('#share-park-clear');
        let items = [], active = -1;
        const combo = this.parkCombo = { selected: null, nearby: [] };
        const opts = () => [...list.querySelectorAll('[role=option]')];

        const savedNear = () => {
            const loc = this.location;
            return this.savedParks().map((p, i) => ({ ...p, prov: p.prov || regionCode(loc.region), idx: i, saved: true, km: p.lat != null ? distanceKm(loc, p) : null }))
                .filter(p => p.km != null && p.km <= 25);
        };
        const setActive = (i) => {
            active = i;
            opts().forEach((li, j) => li.setAttribute('aria-selected', j === i ? 'true' : 'false'));
            const el = opts()[i];
            if (el) { input.setAttribute('aria-activedescendant', el.id); el.scrollIntoView({ block: 'nearest' }); }
            else input.removeAttribute('aria-activedescendant');
        };
        const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); setActive(-1); };
        const row = (p, i) => {
            if (p.add) return `<div role="option" id="park-opt-${i}" class="park-opt park-add" aria-selected="false" data-i="${i}"><span class="park-icon" aria-hidden="true">+</span><span class="park-text"><span class="park-name">Add “${escapeHtml(p.name)}”</span><span class="park-city">Save as a custom park</span></span></div>`;
            const where = [p.city, p.prov].filter(Boolean).join(', ');
            const meta = [where, p.km != null ? p.km.toFixed(1) + ' km' : ''].filter(Boolean).join(' · ');
            return `<div role="option" id="park-opt-${i}" class="park-opt" aria-selected="false" data-i="${i}">` +
                `<span class="park-icon" aria-hidden="true">${PARK_ICON}</span>` +
                `<span class="park-text"><span class="park-name">${escapeHtml(p.name)}${p.saved ? ' <span class="park-saved">saved</span>' : ''}</span><span class="park-city">${escapeHtml(meta)}</span></span>` +
                (p.saved ? `<button type="button" class="park-remove" data-remove="${p.idx}" aria-label="Remove saved park ${escapeHtml(p.name)}" tabindex="-1">&times;</button>` : '') + '</div>';
        };
        const render = () => {
            const text = input.value.trim();
            const t = foldText(text);
            const saved = savedNear();
            const pool = [...saved, ...combo.nearby.filter(p => !saved.some(s => s.name.toLowerCase() === p.name.toLowerCase()))];
            const matches = pool.filter(p => !t || foldText(p.name + ' ' + (p.city || '')).includes(t));
            const picks = parkPicks();
            const recent = matches.map(p => ({ p, at: (picks.find(h => samePark(h, p)) || {}).lastPickedAt || 0 }))
                .filter(x => x.at).sort((a, b) => b.at - a.at).slice(0, 3).map(x => x.p);
            const rest = sortParksAZ(matches.filter(p => !recent.includes(p)));
            const groups = [['Recent', recent], ['All parks', rest]].filter(g => g[1].length);
            items = groups.flatMap(g => g[1]);
            if (text && !pool.some(p => p.name.toLowerCase() === text.toLowerCase())) items.push({ add: true, name: text });
            let n = 0;
            list.innerHTML = groups.map(([label, ps], gi) => `<div role="group" class="park-group" aria-labelledby="park-grp-${gi}"><div role="presentation" id="park-grp-${gi}" class="park-group-label">${label}</div>${ps.map(p => row(p, n++)).join('')}</div>`).join('') +
                (items[n] ? row(items[n], n) : '');
            const open = items.length > 0 && document.activeElement === input;
            list.hidden = !open;
            input.setAttribute('aria-expanded', open ? 'true' : 'false');
            // Let the list use the space below the field without scrolling the page; the list scrolls instead.
            if (open) list.style.maxHeight = Math.max(160, Math.min(360, window.innerHeight - list.getBoundingClientRect().top - 12)) + 'px';
            setActive(-1);
        };
        const choose = (i) => {
            const p = items[i];
            if (!p) return;
            if (p.add) {
                const loc = this.location;
                const all = this.savedParks();
                const saved = { name: p.name, lat: +(+loc.lat).toFixed(5), lon: +(+loc.lon).toFixed(5), city: loc.city || '', prov: regionCode(loc.region) };
                all.push(saved);
                this.setSavedParks(all);
                combo.selected = { name: p.name, custom: true, city: saved.city };
                recordParkPick(saved);
                showToast(`Saved “${p.name}”`);
                this.placeFor(loc).then(pl => { const cur = this.savedParks(); const s = cur.find(x => samePark(x, saved)); if (s && pl.prov) { s.city = s.city || pl.city; s.prov = pl.prov; this.setSavedParks(cur); } });
            } else {
                combo.selected = p.saved ? { name: p.name, custom: true, city: p.city || '' } : p;
                recordParkPick(p);
            }
            input.value = p.name;
            clear.hidden = false;
            close();
        };
        const remove = (idx) => {
            const all = this.savedParks();
            const [gone] = all.splice(idx, 1);
            this.setSavedParks(all);
            if (gone && combo.selected && combo.selected.name === gone.name) { combo.selected = null; input.value = ''; clear.hidden = true; }
            showToast(`Removed “${gone ? gone.name : ''}”`);
            render();
            input.focus();
        };
        combo.render = render;
        combo.reset = () => { combo.selected = null; input.value = ''; clear.hidden = true; close(); };

        input.addEventListener('input', () => { combo.selected = null; clear.hidden = !input.value; render(); });
        input.addEventListener('focus', render);
        input.addEventListener('click', render);
        input.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== input) close(); }, 150));
        input.addEventListener('keydown', (e) => {
            const open = !list.hidden;
            if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) render(); setActive(Math.min(items.length - 1, active + 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(0, active - 1)); }
            else if (e.key === 'Home' && open && active >= 0) { e.preventDefault(); setActive(0); }
            else if (e.key === 'End' && open && active >= 0) { e.preventDefault(); setActive(items.length - 1); }
            else if (e.key === 'Enter') {
                if (open && active >= 0) { e.preventDefault(); choose(active); }
                else if (open && items.length === 1 && input.value.trim()) { e.preventDefault(); choose(0); }
                else if (open) { e.preventDefault(); close(); }
            } else if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); close(); }
            else if (e.key === 'Delete' && open && active >= 0 && items[active].saved) { e.preventDefault(); remove(items[active].idx); }
        });
        list.addEventListener('pointerdown', (e) => e.preventDefault());
        list.addEventListener('click', (e) => {
            const rm = e.target.closest('[data-remove]');
            if (rm) { remove(+rm.dataset.remove); return; }
            const li = e.target.closest('[data-i]');
            if (li) choose(+li.dataset.i);
        });
        clear.addEventListener('click', () => { combo.reset(); input.focus(); });
        // Escape closes the list first, not the whole dialog.
        dlg.addEventListener('cancel', (e) => { if (!list.hidden) { e.preventDefault(); close(); } });
    }

    async openShareDialog(index) {
        const day = this.days[index];
        const dlg = this.ensureShareDialog();
        const name = this.dayLabel(index);
        const date = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dlg.querySelector('#share-title').textContent = `Share ${name}`;
        dlg.querySelector('#share-summary').textContent = `${date} · ${Math.round(day.tempMax)}°C · wind ${Math.round(day.maxHourlyWind)} km/h · day score ${Math.round(day.score)}/100`;

        const timeSel = dlg.querySelector('#share-time');
        const blocks = this.shareBlocksFor(index);
        // Pre-select the day's best time, the same window its card shows.
        let best = 0;
        blocks.forEach((b, i) => { if (b.score > blocks[best].score) best = i; });
        timeSel.innerHTML = blocks.length
            ? blocks.map((b, i) => `<option value="${i}">${b.label} · time score ${Math.round(b.score)}${i === best && b.score > 0 ? ' · best' : ''}</option>`).join('')
            : '<option value="">Anytime</option>';
        if (blocks.length) timeSel.value = String(best);

        const status = dlg.querySelector('#share-park-status');
        const combo = this.parkCombo;
        combo.reset();
        combo.nearby = [];
        status.textContent = 'Finding nearby skate parks…';
        dlg.querySelector('#share-go').onclick = () => this.shareDay(index, blocks[+timeSel.value], combo.selected);
        if (!dlg.open) dlg.showModal();

        const loc = this.location;
        const parks = await this.findSkateparks(loc);
        if (loc !== this.location) return;
        combo.nearby = parks || [];
        status.textContent = parks && parks.length ? `${parks.length} nearby · type to filter or add your own`
            : parks ? 'No skate parks found nearby · type to add your own.' : 'Could not load nearby skate parks · type to add your own.';
        if (document.activeElement === dlg.querySelector('#share-park')) combo.render();
    }

    async shareDay(index, block, park) {
        const day = this.days[index];
        const name = this.dayLabel(index);
        const date = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const lines = [
            `Skate ${name.toLowerCase() === 'today' || name.toLowerCase() === 'tomorrow' ? name.toLowerCase() : 'on ' + name}, ${date}${block ? ' at ' + block.label : ''}${park ? ' — ' + park.name : ''}`,
            `${Math.round(day.tempMax)}°C, wind ${Math.round(day.maxHourlyWind)} km/h, ${day.precipitation > 0 ? day.precipitation + 'mm rain' : 'no rain'}, score ${Math.round(day.score)}/100 (${this.locationLabel()})`
        ];
        if (park && park.lat != null && !park.custom) lines.push(`Map: https://www.google.com/maps/search/?api=1&query=${park.lat},${park.lon}`);
        else if (park) lines.push(`Map: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([park.name, park.city || this.location.city].filter(Boolean).join(' '))}`);
        await this.shareText({ title: 'best.skatepark.day', text: lines.join('\n'), url: this.shareLink(index, { block, park }) });
        const dlg = document.getElementById('share-dialog');
        if (dlg && dlg.open) dlg.close();
    }

    sharePage() {
        if (!this.bestDay) return this.shareText({ title: 'best.skatepark.day', text: 'Find the best day to skate this week', url: SITE_URL });
        const i = this.days.indexOf(this.bestDay);
        const date = this.bestDay.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        const time = this.bestTimeBlocks && this.bestTimeBlocks[0] ? ' at ' + this.bestTimeBlocks[0].label : '';
        const block = this.bestTimeBlocks && this.bestTimeBlocks[0];
        this.shareText({ title: 'best.skatepark.day', text: `Best day to skate this week near ${this.locationLabel()}: ${this.dayLabel(i)}, ${date}${time} (${Math.round(this.bestDay.tempMax)}°C, score ${Math.round(this.bestDay.score)}/100)`, url: this.shareLink(i, { block, best: true }) });
    }

    async shareText(data) {
        if (navigator.share) {
            try { await navigator.share(data); return; } catch (error) { if (error && error.name === 'AbortError') return; }
        }
        const full = `${data.text}\n${data.url}`;
        try {
            await navigator.clipboard.writeText(full);
            showToast('Copied to clipboard');
        } catch (error) {
            const ta = document.createElement('textarea');
            ta.value = full; document.body.appendChild(ta); ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e) {}
            ta.remove();
            showToast(ok ? 'Copied to clipboard' : 'Could not copy');
        }
    }

    showError(message) {
        if (window.SkateSplash) window.SkateSplash.finish();
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error-message').textContent = message;
        document.getElementById('error').classList.remove('hidden');
        
        document.getElementById('retry-btn').onclick = () => {
            this.retryWithLocationRequest();
        };
    }

    async retryWithLocationRequest() {
        document.getElementById('error').classList.add('hidden');
        document.getElementById('loading').classList.remove('hidden');
        
        try {
            this.location = null;
            this.weatherData = null;
            await this.getLocation();
            await this.getWeatherData();
            this.calculateBestDay();
            this.renderForecast();
        } catch (error) {
            this.showError(error.message);
        }
    }
}

const SITE_URL = 'https://best.skatepark.day/';

// Reads a /share link: d=YYYY-MM-DD, t=start hour, p/pc/plat/plon=park, loc/lat/lon=forecast location, best=1.
// Open-Meteo sometimes leaves a new connection hanging; give up on it after a few seconds and try again.
async function fetchWithRetry(url, waits = [7000, 9000, 15000]) {
    let last;
    for (const ms of waits) {
        const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
        const timer = ctrl ? setTimeout(() => ctrl.abort(), ms) : null;
        try {
            const r = await fetch(url, ctrl ? { signal: ctrl.signal } : undefined);
            if (r.ok || r.status < 500) return r;
            last = new Error(`HTTP ${r.status}`);
        } catch (e) { last = e; }
        finally { if (timer) clearTimeout(timer); }
    }
    throw last;
}

function readSharedLink(search) {
    let q;
    try { q = new URLSearchParams(search || ''); } catch (e) { return null; }
    const text = (k, max) => (q.get(k) || '').replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
    const num = (k, lim) => { const v = q.get(k); return v != null && /^-?\d{1,3}(\.\d+)?$/.test(v) && Math.abs(+v) <= lim ? +v : null; };
    const d = q.get('d');
    const date = /^\d{4}-\d{2}-\d{2}$/.test(d || '') && !isNaN(new Date(d + 'T12:00:00')) ? d : null;
    const t = q.get('t');
    const lat = num('lat', 90), lon = num('lon', 180);
    const park = q.get('best') === '1' ? '' : text('p', 80);
    const s = {
        date,
        hour: date && /^\d{1,2}$/.test(t || '') && +t <= 22 ? +t : null,
        best: !!date && q.get('best') === '1',
        park,
        parkCity: park ? text('pc', 60) : '',
        plat: park ? num('plat', 90) : null,
        plon: park ? num('plon', 180) : null,
        location: null,
    };
    if (s.plat == null || s.plon == null) s.plat = s.plon = null;
    if (lat != null && lon != null) {
        const label = text('loc', 60);
        const cut = label.lastIndexOf(',');
        s.location = { lat, lon, city: cut > 0 ? label.slice(0, cut).trim() : label, region: cut > 0 ? label.slice(cut + 1).trim() : '', country: '', source: 'shared' };
    }
    return s.date || s.location ? s : null;
}
const PARK_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9c3 0 4 2 4 5h10c0-3 1-5 4-5"/><path d="M5 17h14"/><circle cx="8" cy="19.5" r="1.3"/><circle cx="16" cy="19.5" r="1.3"/></svg>';

const REGION_CODES = {
    'alberta': 'AB', 'british columbia': 'BC', 'manitoba': 'MB', 'new brunswick': 'NB', 'newfoundland and labrador': 'NL', 'nova scotia': 'NS',
    'northwest territories': 'NT', 'nunavut': 'NU', 'ontario': 'ON', 'prince edward island': 'PE', 'quebec': 'QC', 'québec': 'QC', 'saskatchewan': 'SK', 'yukon': 'YT',
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'district of columbia': 'DC', 'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD', 'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN',
    'mississippi': 'MS', 'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM',
    'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI',
    'south carolina': 'SC', 'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA',
    'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
};
// "Ontario", "ON" or an ISO code like "CA-ON" / "US-NY" -> "ON" / "NY"; '' when unknown.
function regionCode(region) {
    if (!region) return '';
    const r = String(region).trim();
    const iso = r.match(/^(?:CA|US)-([A-Z]{2})$/i);
    if (iso) return iso[1].toUpperCase();
    if (/^[A-Za-z]{2}$/.test(r) && Object.values(REGION_CODES).includes(r.toUpperCase())) return r.toUpperCase();
    return REGION_CODES[r.toLowerCase()] || '';
}

// Case- and accent-insensitive text for matching and sorting.
function foldText(s) { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
const genericParkName = (n) => !n || /^skate ?park( on .*)?$/i.test(n.trim());
// Named parks A–Z, then unnamed ones by city and distance.
function sortParksAZ(list) {
    const cmp = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' });
    return [...list].sort((a, b) => (genericParkName(a.name) - genericParkName(b.name)) ||
        cmp(foldText(a.name), foldText(b.name)) || cmp(foldText(a.city), foldText(b.city)) || ((a.km ?? 0) - (b.km ?? 0)));
}

// Pick history: [{ id, name, lat, lon, lastPickedAt }], most recent first.
const parkId = (p) => `${foldText(p.name)}|${p.lat != null ? (+p.lat).toFixed(3) : ''}|${p.lon != null ? (+p.lon).toFixed(3) : ''}`;
const samePark = (a, b) => (a.id || parkId(a)) === parkId(b);
function parkPicks() { try { return JSON.parse(localStorage.getItem('parkPicks') || '[]'); } catch (e) { return []; } }
function recordParkPick(p) {
    const id = parkId(p);
    const list = parkPicks().filter(h => h.id !== id);
    list.unshift({ id, name: p.name, lat: p.lat ?? null, lon: p.lon ?? null, lastPickedAt: Date.now() });
    try { localStorage.setItem('parkPicks', JSON.stringify(list.slice(0, 50))); } catch (e) {}
}

// Merges parks within ~50 m of each other, keeping the most specific name.
function dedupeParks(list) {
    const generic = (n) => !n || /^skate ?park( on .*)?$/i.test(n);
    const out = [];
    for (const p of list) {
        const dup = out.find(q => distanceKm(p, q) < 0.05);
        if (!dup) out.push({ ...p });
        else if (generic(dup.name) && !generic(p.name)) dup.name = p.name;
    }
    return out;
}

const PARK_DATA_VERSION = '2026110302';

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Scores count up from 0 and their bars fill with them, after the splash and once each group is on screen.
// Markup keeps the real value: numbers have a hidden copy for screen readers, bars keep their real width.
const CountUp = {
    DURATION: 1500,
    STAGGER: 70,
    GROUP: '.day-card, .day-factor, .qualification-heading, .window-summary, #best-day-info',
    STAGGERED: '.day-card, .day-factor',
    pending: new Set(),
    observer: null,

    // A whole-number score that animates; screen readers always get the real value.
    num(value) {
        const n = Math.round(value);
        return `<span class="count" data-count="${n}" aria-hidden="true" style="min-width:${String(n).length}ch">${n}</span><span class="visually-hidden">${n}</span>`;
    },

    // Style attribute for a bar that fills to `percent`.
    fill(percent) {
        const v = +(+percent).toFixed(2);
        return `data-fill="${v}" style="width:${v}%"`;
    },

    reduced() {
        return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    elements(root) {
        return [...root.querySelectorAll('[data-count], [data-fill]')];
    },

    paint(el, ratio) {
        if (el.dataset.count !== undefined) el.textContent = ratio >= 1 ? el.dataset.count : String(Math.round(+el.dataset.count * ratio));
        else el.style[el.dataset.axis === 'y' ? 'height' : 'width'] = ratio >= 1 ? `${el.dataset.fill}%` : `${+el.dataset.fill * ratio}%`;
    },

    // Reset everything new under `root` to 0, then animate each group when the splash is gone and it scrolls into view.
    // `hold`: groups matching it are reset but wait for someone else to call animate() (the card entrance).
    run(root, hold) {
        if (!root || typeof document === 'undefined') return;
        const els = this.elements(root);
        if (!els.length || this.reduced() || typeof requestAnimationFrame !== 'function') { els.forEach(el => this.paint(el, 1)); return; }
        const groups = new Map();
        els.forEach(el => {
            this.paint(el, 0);
            const group = el.closest(this.GROUP) || el;
            if (!groups.has(group)) groups.set(group, []);
            groups.get(group).push(el);
        });
        if (hold) groups.forEach((list, group) => { if (group.matches && group.matches(hold)) { group.countUpList = list; groups.delete(group); } });
        const start = () => groups.forEach((list, group) => this.watch(group, list));
        const splash = window.SkateSplash;
        if (splash && typeof splash.whenGone === 'function') splash.whenGone(start);
        else start();
    },

    watch(group, list) {
        if (!group.isConnected) return;
        group.countUpList = list;
        if (typeof IntersectionObserver !== 'function') return this.animate(group);
        if (!this.observer) {
            this.observer = new IntersectionObserver(entries => entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                this.observer.unobserve(entry.target);
                this.pending.delete(entry.target);
                this.animate(entry.target);
            }), { rootMargin: '0px 0px -8% 0px' });
        }
        this.pending.forEach(g => { if (!g.isConnected) { this.observer.unobserve(g); this.pending.delete(g); } });
        this.pending.add(group);
        this.observer.observe(group);
    },

    animate(group, noStagger) {
        const list = (group.countUpList || []).filter(el => el.isConnected);
        group.countUpList = null;
        if (!list.length) return;
        if (document.hidden) { list.forEach(el => this.paint(el, 1)); return; }
        let delay = 0;
        if (!noStagger && group.matches && group.matches(this.STAGGERED) && group.parentElement) {
            delay = Math.min([...group.parentElement.children].indexOf(group), 8) * this.STAGGER;
        }
        let t0 = null;
        const step = now => {
            if (t0 === null) t0 = now + delay;
            const p = Math.max(0, Math.min(1, (now - t0) / this.DURATION));
            const eased = p >= 1 ? 1 : 1 - Math.pow(1 - p, 3);
            list.forEach(el => { if (el.isConnected) this.paint(el, eased); });
            if (p < 1 && list.some(el => el.isConnected)) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }
};

// Off-canvas panels (menu, about/FAQ, day factors): one shared blurred backdrop, focus trap, scroll lock.
// Calendar feeds built by the deploy workflow: cal/<slug>.ics per park, listed in cal/index.json.
// The popover offers the feed for the shared park, or the nearest park to the forecast location.
const CalendarFeed = {
    init(app) {
        if (typeof document === 'undefined') return;
        this.app = app;
        this.btn = document.getElementById('cal-toggle');
        this.pop = document.getElementById('cal-pop');
        if (!this.btn || !this.pop) return;
        this.btn.onclick = () => (this.pop.hidden ? this.open() : this.close());
        document.addEventListener('click', e => {
            if (!this.pop.hidden && !this.pop.contains(e.target) && !this.btn.contains(e.target)) this.close(false);
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && !this.pop.hidden) { e.stopPropagation(); this.close(); } }, true);
    },

    feeds() {
        if (!this.list) {
            this.list = fetch('cal/index.json', { cache: 'no-cache' })
                .then(r => (r.ok ? r.json() : null))
                .then(d => (d && Array.isArray(d.feeds) ? d.feeds : []))
                .catch(() => []);
        }
        return this.list;
    },

    async open() {
        if (Flyouts.isOpen('site-menu')) Flyouts.close(false);
        this.pop.hidden = false;
        this.btn.setAttribute('aria-expanded', 'true');
        await this.update();
        const first = this.pop.querySelector('.cal-btn:not([hidden])');
        if (first && !this.pop.hidden) first.focus();
    },

    close(restoreFocus = true) {
        this.pop.hidden = true;
        this.btn.setAttribute('aria-expanded', 'false');
        if (restoreFocus) (this.btn.offsetParent ? this.btn : document.getElementById('menu-toggle')).focus();
    },

    async update() {
        const park = document.getElementById('cal-park');
        const note = document.getElementById('cal-note');
        const sub = document.getElementById('cal-subscribe');
        const dl = document.getElementById('cal-download');
        const feeds = await this.feeds();
        const app = this.app || {};
        const shared = app.shared && app.shared.plat != null && (!app.location || app.location.source === 'shared') ? app.shared : null;
        const from = shared ? { lat: shared.plat, lon: shared.plon } : app.location;
        if (!feeds.length || !from) {
            park.textContent = feeds.length ? 'Pick a location first.' : 'Calendar feeds aren\'t available right now.';
            note.hidden = true;
            sub.hidden = dl.hidden = true;
            return;
        }
        let feed = null, km = Infinity;
        for (const f of feeds) {
            const d = distanceKm(from, f);
            if (d < km) { km = d; feed = f; }
        }
        const place = shared ? [shared.park, shared.parkCity].filter(Boolean).join(', ') : app.locationLabel();
        park.textContent = feed.name;
        const exact = km < 0.3;
        note.hidden = exact;
        note.textContent = exact ? '' : `No feed for ${place} itself, so this is the nearest park's feed (${km < 10 ? km.toFixed(1) : Math.round(km)} km away).`;
        const path = `cal/${feed.slug}.ics`;
        sub.href = `webcal://${location.host}/${path}`;
        dl.href = path;
        dl.setAttribute('download', `${feed.slug}.ics`);
        sub.hidden = dl.hidden = false;
        this.feed = feed;
    }
};

const Flyouts = {
    current: null,
    opener: null,

    init() {
        if (this.ready || typeof document === 'undefined') return;
        this.ready = true;
        const backdrop = document.getElementById('flyout-backdrop');
        if (backdrop) backdrop.onclick = () => this.close();
        const toggle = document.getElementById('menu-toggle');
        if (toggle) toggle.onclick = () => (this.isOpen('site-menu') ? this.close() : this.open('site-menu', toggle));
        document.querySelectorAll('.flyout [data-close]').forEach(b => { b.addEventListener('click', () => this.close()); });
        document.querySelectorAll('#site-menu a').forEach(a => a.addEventListener('click', e => {
            const info = a.dataset.info;
            if (info) { e.preventDefault(); this.open('info-panel', toggle, info); return; }
            if (a.dataset.menu === 'forecast') { e.preventDefault(); this.close(); return; }
            this.close(false);
        }));
        // /#about-heading or /#faq-heading (linked from the city pages) opens the info panel there.
        const hash = location.hash.slice(1);
        if (hash === 'about-heading' || hash === 'faq-heading') setTimeout(() => this.open('info-panel', toggle, hash), 0);
        document.addEventListener('keydown', e => {
            if (!this.current) return;
            if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
            if (e.key !== 'Tab') return;
            const items = [...this.current.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null || el === document.activeElement);
            if (!items.length) return;
            const first = items[0], last = items[items.length - 1];
            if (e.shiftKey && (document.activeElement === first || !this.current.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && (document.activeElement === last || !this.current.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
        });
    },

    isOpen(id) { return !!this.current && this.current.id === id; },

    open(id, opener, anchorId) {
        const panel = document.getElementById(id);
        if (!panel) return;
        if (this.current && this.current !== panel) this.close(false, true);
        const backdrop = document.getElementById('flyout-backdrop');
        this.opener = opener || document.activeElement;
        this.current = panel;
        panel.inert = false;
        panel.removeAttribute('inert');
        if (backdrop) { backdrop.hidden = false; void backdrop.offsetWidth; backdrop.classList.add('open'); }
        panel.classList.add('open');
        document.documentElement.classList.add('flyout-lock');
        const toggle = document.getElementById('menu-toggle');
        if (toggle) { toggle.setAttribute('aria-expanded', String(id === 'site-menu')); document.querySelector('.site-header').classList.toggle('menu-open', id === 'site-menu'); }
        const scroller = panel.querySelector('.flyout-scroll');
        if (scroller) scroller.scrollTop = 0;
        if (anchorId && scroller) { const t = document.getElementById(anchorId); if (t) scroller.scrollTop = t.offsetTop - scroller.offsetTop - 12; }
        const focusTarget = panel.querySelector('.flyout-close');
        setTimeout(() => focusTarget && focusTarget.focus({ preventScroll: true }), 30);
    },

    close(restoreFocus = true, switching = false) {
        const panel = this.current;
        if (!panel) return;
        panel.classList.remove('open');
        panel.inert = true;
        panel.setAttribute('inert', '');
        this.current = null;
        const toggle = document.getElementById('menu-toggle');
        if (toggle) { toggle.setAttribute('aria-expanded', 'false'); document.querySelector('.site-header').classList.remove('menu-open'); }
        if (switching) return;
        const backdrop = document.getElementById('flyout-backdrop');
        if (backdrop) { backdrop.classList.remove('open'); setTimeout(() => { if (!this.current) backdrop.hidden = true; }, 260); }
        document.documentElement.classList.remove('flyout-lock');
        if (restoreFocus && this.opener && this.opener.focus) this.opener.focus({ preventScroll: true });
    }
};

// Card weather effects run only after a card lands, and pause off screen or in a hidden tab.
const WeatherFx = {
    observer: null,
    start(cards) { [...cards].forEach(c => c.classList.add('wx-on')); },
    watch(grid) {
        if (typeof IntersectionObserver !== 'function' || !grid) return;
        if (this.observer) this.observer.disconnect();
        this.observer = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle('wx-paused', !e.isIntersecting)));
        this.observer.observe(grid);
        if (!this.vis) {
            this.vis = true;
            document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('doc-hidden', document.hidden));
        }
    }
};

// The seven day cards drop in one after another once the grid is on screen (after the splash), each card's
// scores count up as it lands, then the BEST card gets a pop and the runner-up a glow, in that order.
// Runs for the first forecast and each new location; a same-place refresh just counts up.
const CardEntrance = {
    STAGGER: 110,
    DROP: 600,
    BEST: 800,
    GAP: 120,
    RUNNER: 1000,
    lastKey: null,
    timers: [],
    observer: null,

    shouldRun(grid, key) {
        const changed = key !== this.lastKey;
        this.lastKey = key;
        this.cancel(grid);
        return changed && !CountUp.reduced() && typeof requestAnimationFrame === 'function' && typeof document !== 'undefined';
    },

    cancel(grid) {
        this.timers.forEach(clearTimeout);
        this.timers = [];
        if (this.observer) { this.observer.disconnect(); this.observer = null; }
        if (grid) grid.classList.remove('cards-waiting');
    },

    later(fn, ms) { this.timers.push(setTimeout(fn, ms)); },

    run(grid) {
        grid.classList.add('cards-waiting');
        const go = () => {
            if (!grid.isConnected) return;
            if (typeof IntersectionObserver !== 'function') return this.play(grid);
            this.observer = new IntersectionObserver(entries => {
                if (!entries.some(e => e.isIntersecting)) return;
                this.observer.disconnect(); this.observer = null;
                this.play(grid);
            }, { rootMargin: '0px 0px -12% 0px' });
            this.observer.observe(grid);
        };
        const splash = window.SkateSplash;
        if (splash && typeof splash.whenGone === 'function') splash.whenGone(go);
        else go();
    },

    play(grid) {
        const cards = [...grid.querySelectorAll('.day-card')];
        if (!grid.isConnected || !cards.length) return;
        if (document.hidden) { this.finish(grid, cards); return; }
        cards.forEach((card, i) => {
            this.later(() => card.classList.add('card-drop'), i * this.STAGGER);
            this.later(() => {
                card.classList.remove('card-drop');
                card.classList.add('card-landed');
                CountUp.animate(card, true);
                WeatherFx.start([card]);
            }, i * this.STAGGER + this.DROP);
        });
        const allLanded = (cards.length - 1) * this.STAGGER + this.DROP;
        this.later(() => {
            grid.classList.remove('cards-waiting');
            cards.forEach(c => c.classList.remove('card-landed'));
            const best = grid.querySelector('.day-card.best');
            if (best) best.classList.add('hl-best');
            const runnerAt = best ? this.BEST + this.GAP : 0;
            this.later(() => {
                if (best) best.classList.remove('hl-best');
                const runner = grid.querySelector('.day-card.second-best');
                if (!runner) return;
                runner.classList.add('hl-runner');
                this.later(() => runner.classList.remove('hl-runner'), this.RUNNER);
            }, runnerAt);
        }, allLanded);
    },

    // Hidden tab: no motion, show the cards and their final scores.
    finish(grid, cards) {
        grid.classList.remove('cards-waiting');
        WeatherFx.start(cards);
        cards.forEach(card => {
            (card.countUpList || []).forEach(el => CountUp.paint(el, 1));
            card.countUpList = null;
        });
    }
};

function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite');
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => t.classList.remove('show'), 2200);
}

const DEFAULT_LOCATION = { lat: 43.6532, lon: -79.3832, city: 'Toronto', region: 'ON', country: 'Canada', source: 'default' };
const FORECAST_MAX_AGE = 30 * 60 * 1000;

function distanceKm(a, b) {
    const R = 6371, toRad = (d) => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}

document.addEventListener('DOMContentLoaded', () => {
    new SkateParkDay();
});
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
    cold: '<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 15v2"/><path d="M18 7h3M19.5 5.5v3"/></svg>',
};

class SkateParkDay {
    constructor() {
        this.location = null;
        this.weatherData = null;
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
        try {
            await this.getLocation();
            await this.getWeatherData();
            this.calculateBestDay();
            this.renderForecast();
        } catch (error) {
            this.showError(error.message);
        }
    }

    async getLocation() {
        return new Promise((resolve, reject) => {
            // Check for saved location first
            const savedLocation = this.getSavedLocation();
            if (savedLocation) {
                this.location = savedLocation;
                resolve();
                return;
            }

            if (!navigator.geolocation) {
                this.getLocationFromIP().then(resolve).catch(reject);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.location = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        source: 'gps'
                    };
                    resolve();
                },
                (error) => {
                    this.getLocationFromIP().then(resolve).catch(reject);
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        });
    }

    async getLocationFromIP() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            if (data.latitude && data.longitude) {
                this.location = {
                    lat: data.latitude,
                    lon: data.longitude,
                    city: data.city,
                    region: data.region,
                    country: data.country_name,
                    source: 'ip'
                };
                return;
            }
        } catch (error) {
            console.log('Primary IP service failed, trying fallback');
        }
        
        // Fallback to a default location (San Francisco) if IP location fails
        this.location = {
            lat: 37.7749,
            lon: -122.4194,
            city: 'San Francisco',
            region: 'CA',
            country: 'United States',
            source: 'default'
        };
    }

    async getWeatherData() {
        if (!this.location) {
            throw new Error('Location not available');
        }

        try {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log('Using timezone:', userTimezone, 'for location:', this.location.lat, this.location.lon);
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${this.location.lat}&longitude=${this.location.lon}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_gusts_10m_max,precipitation_sum,weather_code,uv_index_max,sunshine_duration&hourly=wind_speed_10m,temperature_2m,uv_index,precipitation,weather_code&timezone=${encodeURIComponent(userTimezone)}&forecast_days=7`
            );
            
            if (!response.ok) {
                throw new Error('Weather data unavailable');
            }
            
            this.weatherData = await response.json();
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
            this.bestDay = lowRainDays.reduce((best, current) => 
                current.score > best.score ? current : best
            );
        } else {
            // If all days have significant rain, pick the least rainy one
            this.bestDay = this.days.reduce((best, current) => 
                current.score > best.score ? current : best
            );
        }
        
        console.log('Best day selected:', this.bestDay.date.toDateString(), 'Score:', this.bestDay.score, 'Rain:', this.bestDay.precipitation + 'mm');
        
        // Calculate best time blocks for the best day
        this.calculateBestTimeBlocks();
    }
    
    calculateBestTimeBlocks() {
        if (!this.bestDay || !this.bestDay.hourlyData) return;
        
        const hourly = this.bestDay.hourlyData;
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
        
        // Sort by score and take top 3
        this.bestTimeBlocks = timeBlocks
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
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

    calculateDayScore(day) {
        let score = 100;
        day.reasons = [];

        // Only treat wind above 25km/h as a complete write-off
        if (day.maxHourlyWind > 25) {
            score = 0;
            day.reasons.push('Extreme wind (write-off)');
            return score;
        }

        if (day.tempMax > 30) {
            score -= 30;
            day.reasons.push('Too hot');
        } else if (day.tempMax < 10) {
            score -= 25;
            day.reasons.push('Too cold');
        } else if (day.tempMax >= 18 && day.tempMax <= 25) {
            score += 20;
            day.reasons.push('Perfect temperature');
        }

        // More gradual wind penalties
        if (day.maxHourlyWind > 15) {
            const windPenalty = Math.min((day.maxHourlyWind - 15) * 3, 40);
            score -= windPenalty;
            day.reasons.push('Windy');
        } else if (day.maxHourlyWind > 10) {
            const windPenalty = Math.min(day.maxHourlyWind * 1.5, 15);
            score -= windPenalty;
            day.reasons.push('Breezy');
        }

        if (day.precipitation > 0.1) {
            score -= 60;
            day.reasons.push('Rain expected');
        } else if (day.precipitation > 0) {
            score -= 30;
            day.reasons.push('Light rain possible');
        }

        if (day.uvIndex > 8) {
            score -= 15;
            day.reasons.push('High UV');
        } else if (day.uvIndex < 3) {
            score += 10;
            day.reasons.push('Low UV');
        }

        if (day.sunshine > 25200) { // 7+ hours
            score += 10;
            day.reasons.push('Sunny day');
        }

        const cloudiness = this.getCloudiness(day.weatherCode);
        if (cloudiness === 'clear') {
            score += 5;
        } else if (cloudiness === 'cloudy') {
            score -= 5;
        }

        return Math.min(Math.max(0, score), 100);
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
        locationElement.insertAdjacentHTML("afterbegin", ICONS.pin + " ");
        locationElement.classList.remove('hidden');
        
        // Add click handler for location editing
        locationElement.onclick = () => this.showLocationEdit();
        
        this.setupLocationSearch();
    }

    showLocationEdit() {
        document.getElementById('location-display').style.display = 'none';
        document.getElementById('location-edit').style.display = 'block';
        document.getElementById('location-search').focus();
    }

    hideLocationEdit() {
        document.getElementById('location-display').style.display = 'block';
        document.getElementById('location-edit').style.display = 'none';
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

        searchInput.onblur = () => {
            setTimeout(() => { close(); this.hideLocationEdit(); }, 200);
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
        document.getElementById('location-search').value = '';
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
        this.updateMetaTags();
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

    renderBestDay() {
        const bestDayInfo = document.getElementById('best-day-info');
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
        
        const dayOfWeek = day.date.toLocaleDateString('en-US', { weekday: 'short' });
        const date = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const fullDate = `${dayOfWeek} ${date}`;
        
        // Calculate progress percentages
        const windPercent = Math.min((day.maxHourlyWind / 25) * 100, 100);
        const uvPercent = Math.min((day.uvIndex / 11) * 100, 100);
        const sunPercent = Math.min((day.sunshine / 43200) * 100, 100);
        const scorePercent = day.score;
        
        const timeBlocksHtml = this.bestTimeBlocks && this.bestTimeBlocks.length > 0 
            ? `<div style="margin-top: 12px;">
                <div style="font-size: 0.8rem; margin-bottom: 6px; opacity: 0.9;">${ICONS.clock} Best times:</div>
                <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
                    ${this.bestTimeBlocks.map((block, index) => {
                        const scorePercent = block.score;
                        return `
                        <div class="time-block ${index === 0 ? 'best' : ''}" style="padding: 4px 8px; font-size: 0.7rem;">
                            ${block.label}
                            <div class="time-block-score" style="margin-top: 2px;">
                                <div class="metric-icon" style="font-size: 0.6rem; width: 10px;">${ICONS.target}</div>
                                <div class="metric-bar" style="height: 2px;">
                                    <div class="metric-fill score" style="width: ${scorePercent}%"></div>
                                </div>
                                <div class="metric-value" style="font-size: 0.6rem; min-width: 20px;">${Math.round(block.score)}</div>
                            </div>
                        </div>
                    `;
                    }).join('')}
                </div>
            </div>`
            : '';
        
        bestDayInfo.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div>
                    <div style="font-size: 1rem; font-weight: 700;">${dayName}</div>
                    <div style="font-size: 0.8rem; opacity: 0.8;">${fullDate}</div>
                </div>
                <div style="font-size: 1.8rem;">${this.getWeatherIcon(day.weatherCode)}</div>
                <div style="text-align: right;">
                    <div style="font-size: 1.1rem; font-weight: 700;">${Math.round(day.tempMax)}°C</div>
                    <div style="font-size: 0.7rem; opacity: 0.8;">Score: ${Math.round(day.score)}/100</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <div class="metric" style="font-size: 0.7rem;">
                    <div class="metric-icon" style="font-size: 0.8rem; width: 14px;">${ICONS.wind}</div>
                    <div class="metric-bar" style="height: 3px;">
                        <div class="metric-fill wind" style="width: ${windPercent}%"></div>
                    </div>
                    <div class="metric-value" style="font-size: 0.65rem; min-width: 28px;">${Math.round(day.maxHourlyWind)}</div>
                </div>
                
                <div class="metric" style="font-size: 0.7rem;">
                    <div class="metric-icon" style="font-size: 0.8rem; width: 14px;">${ICONS.uv}</div>
                    <div class="metric-bar" style="height: 3px;">
                        <div class="metric-fill uv" style="width: ${uvPercent}%"></div>
                    </div>
                    <div class="metric-value" style="font-size: 0.65rem; min-width: 28px;">${Math.round(day.uvIndex)}</div>
                </div>
                
                <div class="metric" style="font-size: 0.7rem;">
                    <div class="metric-icon" style="font-size: 0.8rem; width: 14px;">${ICONS.sunHours}</div>
                    <div class="metric-bar" style="height: 3px;">
                        <div class="metric-fill sun" style="width: ${sunPercent}%"></div>
                    </div>
                    <div class="metric-value" style="font-size: 0.65rem; min-width: 28px;">${Math.round(day.sunshine / 3600)}h</div>
                </div>
                
                <div class="metric" style="font-size: 0.7rem;">
                    <div class="metric-icon" style="font-size: 0.8rem; width: 14px;">${ICONS.target}</div>
                    <div class="metric-bar" style="height: 3px;">
                        <div class="metric-fill score" style="width: ${scorePercent}%"></div>
                    </div>
                    <div class="metric-value" style="font-size: 0.65rem; min-width: 28px;">${Math.round(day.score)}</div>
                </div>
            </div>
            
            ${day.precipitation > 0 ? `<div style="font-size: 0.7rem; color: var(--muted); margin-bottom: 8px; text-align: center;">${ICONS.drop} ${day.precipitation}mm rain expected${this.getRainTiming(day)}</div>` : ''}
            
            ${timeBlocksHtml}
        `;
    }

    renderWeatherGrid() {
        const grid = document.getElementById('weather-grid');
        
        // Sort days by score to find rankings, but filter heavy rain days from #2 spot
        const sortedDays = [...this.days].sort((a, b) => b.score - a.score);
        
        // Find second best day, excluding heavy rain days
        let secondBestDay = null;
        for (const day of sortedDays) {
            if (day !== this.bestDay && !this.isHeavyRainDay(day)) {
                secondBestDay = day;
                break;
            }
        }
        
        // If no suitable second day found, just use the actual second highest score
        if (!secondBestDay && sortedDays.length > 1) {
            secondBestDay = sortedDays[1];
        }
        
        grid.innerHTML = this.days.map((day, index) => {
            let dayName;
            if (index === 0) {
                dayName = 'Today';
            } else if (index === 1) {
                dayName = 'Tomorrow';
            } else {
                dayName = day.date.toLocaleDateString('en-US', { weekday: 'long' });
            }
            
            const dayOfWeek = day.date.toLocaleDateString('en-US', { weekday: 'short' });
            const date = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const fullDate = `${dayOfWeek} ${date}`;
            
            const isBest = day === this.bestDay;
            const isSecondBest = day === secondBestDay && !isBest;
            const isNoSkate = day.maxHourlyWind > 15 || day.score < 30;
            
            let cardClass = 'day-card';
            let medalHtml = '';
            
            if (isBest) {
                cardClass += ' best';
                medalHtml = '<div class="day-card-medal gold"></div>';
            } else if (isSecondBest) {
                cardClass += ' second-best';
                medalHtml = '<div class="day-card-medal silver"></div>';
            } else if (isNoSkate) {
                cardClass += ' no-skate';
            }
            
            // Calculate progress percentages
            const windPercent = Math.min((day.maxHourlyWind / 25) * 100, 100);
            const uvPercent = Math.min((day.uvIndex / 11) * 100, 100);
            const sunPercent = Math.min((day.sunshine / 43200) * 100, 100); // 12 hours max
            const scorePercent = day.score;
            
            return `
                <div class="${cardClass}">
                    ${medalHtml}
                    <div class="day-name">${dayName}</div>
                    <div class="day-date">${fullDate}</div>
                    <div class="weather-icon">${this.getWeatherIcon(day.weatherCode)}</div>
                    <div class="temp">${Math.round(day.tempMax)}°C</div>
                    
                    <div class="metrics">
                        <div class="metric">
                            <div class="metric-icon">${ICONS.wind}</div>
                            <div class="metric-bar">
                                <div class="metric-fill wind" style="width: ${windPercent}%"></div>
                            </div>
                            <div class="metric-value">${Math.round(day.maxHourlyWind)}</div>
                        </div>
                        
                        <div class="metric">
                            <div class="metric-icon">${ICONS.uv}</div>
                            <div class="metric-bar">
                                <div class="metric-fill uv" style="width: ${uvPercent}%"></div>
                            </div>
                            <div class="metric-value">${Math.round(day.uvIndex)}</div>
                        </div>
                        
                        <div class="metric">
                            <div class="metric-icon">${ICONS.sunHours}</div>
                            <div class="metric-bar">
                                <div class="metric-fill sun" style="width: ${sunPercent}%"></div>
                            </div>
                            <div class="metric-value">${Math.round(day.sunshine / 3600)}h</div>
                        </div>
                        
                        <div class="metric">
                            <div class="metric-icon">${ICONS.target}</div>
                            <div class="metric-bar">
                                <div class="metric-fill score" style="width: ${scorePercent}%"></div>
                            </div>
                            <div class="metric-value">${Math.round(day.score)}</div>
                        </div>
                    </div>
                    
                    ${day.precipitation > 0 ? `<div style="font-size: 0.7rem; color: var(--muted); margin-top: 8px;">${ICONS.drop} ${day.precipitation}mm${this.getRainTiming(day)}</div>` : 
                      (!isBest && !isSecondBest && this.getMainIssue(day)) ? `<div style="font-size: 0.7rem; color: var(--muted); margin-top: 8px;">${this.getMainIssue(day)}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    showError(message) {
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

document.addEventListener('DOMContentLoaded', () => {
    new SkateParkDay();
});
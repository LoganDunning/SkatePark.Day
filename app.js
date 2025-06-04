class SkateParkDay {
    constructor() {
        this.location = null;
        this.weatherData = null;
        this.init();
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
                    // Silently fall back to IP location
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
                    country: data.country_name,
                    source: 'ip'
                };
            } else {
                throw new Error('Could not determine location');
            }
        } catch (error) {
            throw new Error('Unable to get location data');
        }
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
        
        if (day.maxHourlyWind > 25) return '💨 Extreme winds';
        if (day.maxHourlyWind > 15) return '💨 High winds';
        if (day.tempMax > 30) return '🥵 Over 30°C heat';
        if (day.tempMax < 10) return '🥶 Too cold';
        if (day.uvIndex > 8) return '☀️ High UV levels';
        
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
            0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
            45: '🌫️', 48: '🌫️',
            51: '🌦️', 53: '🌦️', 55: '🌦️',
            61: '🌧️', 63: '🌧️', 65: '🌧️',
            71: '🌨️', 73: '🌨️', 75: '🌨️',
            95: '⛈️', 96: '⛈️', 99: '⛈️'
        };
        return icons[weatherCode] || '🌤️';
    }

    getScoreClass(score) {
        if (score >= 80) return 'excellent';
        if (score >= 60) return 'good';
        return 'poor';
    }

    updateLocationDisplay() {
        // Location info is now hidden
        // const locationElement = document.getElementById('location-name');
        // let locationText = '';
        
        // if (this.location.city && this.location.country) {
        //     locationText = `${this.location.city}, ${this.location.country}`;
        // } else {
        //     locationText = `${this.location.lat.toFixed(2)}, ${this.location.lon.toFixed(2)}`;
        // }
        
        // locationElement.textContent = locationText;
        // document.getElementById('location-info').classList.remove('hidden');
    }

    renderForecast() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('forecast').classList.remove('hidden');

        this.updateBestSkateSummary();
        this.renderBestDay();
        this.renderWeatherGrid();
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
                <div style="font-size: 0.8rem; margin-bottom: 6px; opacity: 0.9;">⏰ Best times:</div>
                <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;">
                    ${this.bestTimeBlocks.map((block, index) => {
                        const scorePercent = block.score;
                        return `
                        <div class="time-block ${index === 0 ? 'best' : ''}" style="padding: 4px 8px; font-size: 0.7rem;">
                            ${block.label}
                            <div class="time-block-score" style="margin-top: 2px;">
                                <div class="metric-icon" style="font-size: 0.6rem; width: 10px;">🎯</div>
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
                    <div class="metric-icon" style="font-size: 0.8rem; width: 14px;">💨</div>
                    <div class="metric-bar" style="height: 3px;">
                        <div class="metric-fill wind" style="width: ${windPercent}%"></div>
                    </div>
                    <div class="metric-value" style="font-size: 0.65rem; min-width: 28px;">${Math.round(day.maxHourlyWind)}</div>
                </div>
                
                <div class="metric" style="font-size: 0.7rem;">
                    <div class="metric-icon" style="font-size: 0.8rem; width: 14px;">☀️</div>
                    <div class="metric-bar" style="height: 3px;">
                        <div class="metric-fill uv" style="width: ${uvPercent}%"></div>
                    </div>
                    <div class="metric-value" style="font-size: 0.65rem; min-width: 28px;">${Math.round(day.uvIndex)}</div>
                </div>
                
                <div class="metric" style="font-size: 0.7rem;">
                    <div class="metric-icon" style="font-size: 0.8rem; width: 14px;">🌞</div>
                    <div class="metric-bar" style="height: 3px;">
                        <div class="metric-fill sun" style="width: ${sunPercent}%"></div>
                    </div>
                    <div class="metric-value" style="font-size: 0.65rem; min-width: 28px;">${Math.round(day.sunshine / 3600)}h</div>
                </div>
                
                <div class="metric" style="font-size: 0.7rem;">
                    <div class="metric-icon" style="font-size: 0.8rem; width: 14px;">🎯</div>
                    <div class="metric-bar" style="height: 3px;">
                        <div class="metric-fill score" style="width: ${scorePercent}%"></div>
                    </div>
                    <div class="metric-value" style="font-size: 0.65rem; min-width: 28px;">${Math.round(day.score)}</div>
                </div>
            </div>
            
            ${day.precipitation > 0 ? `<div style="font-size: 0.7rem; color: rgba(224,230,237,0.7); margin-bottom: 8px; text-align: center;">💧 ${day.precipitation}mm rain expected${this.getRainTiming(day)}</div>` : ''}
            
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
                            <div class="metric-icon">💨</div>
                            <div class="metric-bar">
                                <div class="metric-fill wind" style="width: ${windPercent}%"></div>
                            </div>
                            <div class="metric-value">${Math.round(day.maxHourlyWind)}</div>
                        </div>
                        
                        <div class="metric">
                            <div class="metric-icon">☀️</div>
                            <div class="metric-bar">
                                <div class="metric-fill uv" style="width: ${uvPercent}%"></div>
                            </div>
                            <div class="metric-value">${Math.round(day.uvIndex)}</div>
                        </div>
                        
                        <div class="metric">
                            <div class="metric-icon">🌞</div>
                            <div class="metric-bar">
                                <div class="metric-fill sun" style="width: ${sunPercent}%"></div>
                            </div>
                            <div class="metric-value">${Math.round(day.sunshine / 3600)}h</div>
                        </div>
                        
                        <div class="metric">
                            <div class="metric-icon">🎯</div>
                            <div class="metric-bar">
                                <div class="metric-fill score" style="width: ${scorePercent}%"></div>
                            </div>
                            <div class="metric-value">${Math.round(day.score)}</div>
                        </div>
                    </div>
                    
                    ${day.precipitation > 0 ? `<div style="font-size: 0.7rem; color: rgba(255,255,255,0.7); margin-top: 8px;">💧 ${day.precipitation}mm${this.getRainTiming(day)}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    showError(message) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error-message').textContent = message;
        document.getElementById('error').classList.remove('hidden');
        
        document.getElementById('retry-btn').onclick = () => {
            location.reload();
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SkateParkDay();
});
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SkatePark.Day is a single page HTML web application with zero dependencies that determines the best day for skateboarding based on weather conditions.

## Application Functionality

The application:
- Requests and detects user location (with fallback to IP-based or approximate location if denied)
- Shows a seven day weather forecast
- Calculates which of the next seven days is the optimal "skate park day"

## Skate Park Day Formula

The application prioritizes weather conditions as follows:

**Priority 1 & 2 (Equal importance):**
- Temperature
- Wind speed

**Priority 3:**
- Sun and UV levels

**Ideal conditions:**
- Warm temperature (not over 30°C)
- Low wind speed (hourly wind data is important - above 15km/h is a write-off)
- Low UV
- Low clouds
- No rain
- Lots of sun (secondary to wind conditions)

## Technical Requirements

- Single page HTML application
- Zero dependencies
- Uses geolocation API with IP-based fallback
- Weather API integration for 7-day forecasting
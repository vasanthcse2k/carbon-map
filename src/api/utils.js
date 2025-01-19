// utils.js

/**
 * Maps carbon intensity forecast to a corresponding color.
 * @param {number} forecast - The forecast intensity value.
 * @returns {string} - The hex color code representing the intensity level.
 */
export const getIntensityColor = (forecast) => {
    if (forecast <= 50) return '#00FF00';      // Very Low - Green
    if (forecast <= 100) return '#88FF00';     // Low - Light Green
    if (forecast <= 200) return '#FFFF00';     // Moderate - Yellow
    if (forecast <= 300) return '#FF8800';     // High - Orange
    return '#FF0000';                          // Very High - Red
  };
  
/**
 * File: lib/icons.ts
 * Purpose: Configures FontAwesome icons for the application.
 * Responsibilities:
 *   - Import and configure FontAwesome icon libraries
 *   - Set up icon library for global use
 * Key Concepts:
 *   - FontAwesome library configuration
 *   - Icon importing and optimization
 * Dependencies:
 *   - @fortawesome/fontawesome-svg-core
 *   - FontAwesome icon packages
 * How It Fits:
 *   - Provides centralized icon configuration used throughout the app
 */

import { library } from "@fortawesome/fontawesome-svg-core";

// Import icon packs you want to use
import { fas } from "@fortawesome/free-solid-svg-icons"; // Solid icons
import { far } from "@fortawesome/free-regular-svg-icons"; // Regular icons
import { fab } from "@fortawesome/free-brands-svg-icons"; // Brand icons

// Add icons to the library
// This makes them available globally without individual imports
library.add(fas, far, fab);

// You can also import specific icons if you prefer tree-shaking:
// import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'
// library.add(faUser, faEnvelope)

# Kitchen Screen

The kitchen display system component for managing and tracking food preparation orders.

## Features
- Real-time order updates via RTI Connext DDS
- Kitchen-specific order management interface
- Integration with the central order system

## Setup
1. Install dependencies:
```bash
npm install
```
2. Start the development environment:
```bash
# Start both server and application
npm run start:all

# Or start individually:
npm run start:server  # Starts DDS server
npm run start:app     # Starts Electron app
```

## Building
```bash
# Build for current platform
npm run build

# Platform specific builds
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```
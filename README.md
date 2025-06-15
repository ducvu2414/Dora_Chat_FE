# Dora Chat Frontend

A modern chat application built with React, Vite, and Tailwind CSS.

## Features

- Real-time chat with file, image, and video sharing
- Group channels and friend management
- User profile with avatar and banner upload
- Multi-step signup and password reset flows
- Google Maps integration for location sharing
- Modern UI with Tailwind CSS and shadcn/ui components

## Technologies

- React + Vite
- Tailwind CSS
- Redux Toolkit
- Axios
- Socket.IO Client
- simple-peer, peerjs
- @react-google-maps/api
- @cyntler/react-doc-viewer, react-pdf
- react-toastify, lucide-react, FontAwesome, react-icons

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/dora-chat-fe.git
   cd Dora_Chat_FE
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Copy environment variables:
   ```sh
   cp .env.development .env.local
   # Edit .env.local as needed
   ```

### Running the App

Start the development server:
```sh
npm run dev
# or
yarn dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Building for Production

```sh
npm run build
# or
yarn build
```

### Linting

```sh
npm run lint
# or
yarn lint
```

## Project Structure

```
src/
  api/           # API clients
  app/           # App-level setup
  assets/        # Images and static assets
  components/    # Reusable UI components
  features/      # Feature-based modules (chat, user, etc.)
  lib/           # Utilities and helpers
  page/          # Page components
  routes/        # App routes
  utils/         # Utility functions
```

## License

MIT

---

For more details, see the code and comments in each file.

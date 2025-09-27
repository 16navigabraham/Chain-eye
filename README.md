# ⛓️ ChainEye: AI-Powered Crypto Address Analysis

ChainEye is a web application that provides a comprehensive, AI-powered analysis of any cryptocurrency address. Uncover transaction history, token holdings, NFT collections, and potential risks in one clear, modern dashboard.

This project is built to demonstrate the integration of generative AI into a modern web stack, using Google's Genkit to power risk analysis and a helpful chatbot.

![ChainEye Screenshot](https://storage.googleapis.com/spec-public-images/chaineye-screenshot.png)

## ✨ Key Features

- **🤖 AI-Powered Risk Summary**: Leverages a Genkit AI flow to analyze on-chain data and provide a "Low", "Medium", or "High" risk assessment.
- **📊 Comprehensive Dashboard**: A central hub to view key wallet metrics at a glance.
- **💸 Transaction History**: A detailed, paginated log of all incoming and outgoing transactions.
- **🪙 Token Holdings**: A list of all ERC20 tokens held by the address, including balances and logos.
- **🖼️ NFT Gallery**: A visual collection of all ERC721 (NFT) tokens owned by the address.
- **📜 Contract Interactions**: A summary of the smart contracts the address has most frequently interacted with.
- **💬 AI Chatbot**: An integrated assistant to answer questions about the current analysis or general crypto topics.
- **🔗 Multi-Chain Support**: Easily switch between supported blockchains like Ethereum, Base, Polygon, and more.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) with the Google AI Plugin
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **On-Chain Data**: [Etherscan API](https://etherscan.io/apis)

## 🚀 Getting Started

To run the project locally, you will need to have Node.js and npm installed.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

This project requires API keys for Etherscan and the Google AI (Gemini) models.

1.  Create a new file named `.env` in the root of your project.
2.  Add the following variables to your `.env` file:

    ```env
    # Get your key from https://etherscan.io/myapikey
    ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"

    # Get your key from Google AI Studio: https://aistudio.google.com/app/apikey
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

    **Important**: Ensure your Gemini API key is enabled for the "Gemini API".

### 4. Run the Development Server

You can now run the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run genkit:dev`: Starts the Genkit development UI.
- `npm run build`: Creates a production build of the application.
- `npm start`: Starts the production server.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

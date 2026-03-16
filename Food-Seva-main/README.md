# Food Seva

## Overview
**Food Seva** is a platform dedicated to reducing food wastage by connecting surplus food donors with NGOs and individuals in need. By leveraging advanced technologies like OpenCV and real-time tracking, we ensure that food reaches the right people efficiently and effectively.

## Features
### 🔍 AI-Powered Food Quality Detection
- Implemented **OpenCV on 25,000 images** to classify food as **rotten or fresh**.
- Achieved **86% accuracy** using a dataset of **7-8K images** for testing.

### 📍 Real-Time Food Tracking
- NGOs can track food deliveries **live on a map** with **estimated arrival times**, just like **Swiggy/Zomato**.
- Ensures transparency and timely food distribution.

### 🎁 User Bonus Points System
- Donors earn **bonus points** based on the quantity and frequency of donations.
- Points are **stored in a digital wallet** and can be redeemed for rewards.

### 🤖 AI-Powered Chatbot
- A **smart chatbot** to assist users with donation-related queries, food tracking, and platform navigation.
- Uses **Generative AI models** to provide accurate and dynamic responses.

### 📊 Interactive Dashboard
- Provides insights into **donations, impact statistics, and user activity**.
- Displays food waste reduction progress and contribution history.

### ✅ FSSAI Compliance & Food Safety Standards
- Ensures all donated food meets **FSSAI (Food Safety and Standards Authority of India) guidelines**.
- Provides certification for food quality, making donations safer and more reliable.

### 📞 Essential Pages
- **About Us**: Mission and vision of Food Seva.
- **Contact Us**: Get in touch with the team.
- **Dashboard**: Personalized experience for donors and NGOs.

## Tech Stack
- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js , Flask
- **Database**: MongoDB
- **Machine Learning**: OpenCV for food quality analysis ( 25K images dataset used to train model )
- **Maps & Tracking**: Google Maps API for real-time food tracking
- **Generative AI**: 
  - **Hugging Face** for NLP models and chatbot enhancements
  - **LangChain** for AI-driven automation and decision-making
  -  **LLMs** for providing responses through query embedding
- **Chatbot**: NLP-powered assistant to guide users and answer donation-related queries
- **Blockchain**: Alchemy , Solidity , Hardhat , ethers.js
  - **Alchemy** for providing RPC url for Ethereum - Sapolia testnet
  - **Solidity** for creation of smart contracts
  -  **Hardhat** for deployment of smart contracts
  -  **ethers.js** for connecting javascript to Ethereum blockchain

## How to Run
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Chaitu-Boss/Food-Seva.git
cd Food-Seva
```
### 2️⃣ Install Dependencies
- Navigate to the `frontend/` folder and run:
```bash
npm install
```
### 3️⃣ Start the Development Server
```bash
npm run dev
```
### 4️⃣ Node Backend Setup
- Navigate to the `backend/` folder and run:
```bash
npm install
node server.js
```
### 5️⃣ Flask Backend Setup
- Navigate to the `flask/` folder and run:
```bash
pip install -r requirements.txt
python main.py
```


## Future Enhancements
- **Integration with Food Safety Authorities** for certification of donated food.
- **AI-powered demand prediction** to optimize food distribution.
- **Blockchain-based donation tracking** for increased transparency.
- **Enhanced AI automation** to further optimize donation logistics and user interactions.

## Contributing
We welcome contributions! Feel free to fork this repository and submit pull requests.

## Video Link
Video Link : https://drive.google.com/drive/folders/12EhYZRyeSeD1QZw37jC8Ic1BnwGostc9?usp=sharing

---
🚀 **Join us in the fight against food wastage!**

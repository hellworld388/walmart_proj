# 🛒 Walmart Customer Shopping Platform with AI-Powered Assistant

A comprehensive e-commerce platform featuring **Google Gemini AI** integration for intelligent shopping recommendations, sustainable product suggestions, and personalized customer experiences.

## 🚀 **Key Features**

### 🤖 **AI-Powered Shopping Assistant (Google Gemini)**

- **Natural Language Understanding**: Chat with the AI using natural language
- **Intelligent Recommendations**: Get personalized product suggestions based on context
- **Recipe-Based Shopping**: "Make me pancakes with 200 rupees budget"
- **Post-Activity Nutrition**: "I need snacks after football practice"
- **Clothing Recommendations**: "Blue trousers size 32 under 500 rupees"
- **Health-Focused Shopping**: "Healthy protein snacks for muscle building"
- **Budget Optimization**: AI considers your budget and suggests alternatives
- **Sustainability Scoring**: Prioritize eco-friendly products

### 🛍️ **Shopping Features**

- **Product Catalog**: 100+ products across 15+ categories
- **Smart Cart Management**: Add/remove items with quantity control
- **Order History**: Track past purchases and delivery status
- **Sustainable Alternatives**: AI suggests eco-friendly product swaps
- **Real-time Inventory**: Live stock updates from warehouses

### 🌱 **Sustainability Focus**

- **Recyclability Index**: Every product rated for environmental impact
- **Eco-Friendly Alternatives**: AI suggests sustainable product swaps
- **Green Shopping**: Filter and prioritize sustainable options
- **Environmental Impact Tracking**: See your shopping's eco-footprint

## 🏗️ **Architecture**

```
Frontend (React) ←→ Backend (Node.js/Express) ←→ Database (PostgreSQL)
       ↓                    ↓                        ↓
   AI Chatbot ←→ Gemini AI Service ←→ Product Recommendations
```

## 🛠️ **Technology Stack**

### **Frontend**

- **React.js** - Modern UI components
- **CSS3** - Responsive design and animations
- **Axios** - HTTP client for API communication

### **Backend**

- **Node.js** - Server runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **Google Gemini AI** - Natural language processing and recommendations

### **AI Integration**

- **@google/generative-ai** - Official Gemini API client
- **Intent Recognition** - Understands user shopping needs
- **Context Awareness** - Remembers conversation context
- **Personalized Responses** - Tailored recommendations

## 📦 **Installation & Setup**

### **Prerequisites**

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Google Gemini API Key

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd walmart_proj-main
```

### **2. Backend Setup**

```bash
cd customer_backend

# Install dependencies
npm install

# Set up environment variables
cp config.env .env
# Edit .env with your database and API credentials:
# GEMINI_API_KEY=your_gemini_api_key
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=walmart_customer
# DB_USER=postgres
# DB_PASSWORD=your_password

# Set up database
cd ../db_setup
# Run setup.bat (Windows) or setup.sh (Linux/Mac)
# Or manually execute schema.sql and data.sql

# Start backend server
cd ../customer_backend
npm start
```

### **3. Frontend Setup**

```bash
cd customer_frontend

# Install dependencies
npm install

# Start development server
npm start
```

### **4. Get Google Gemini API Key**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

## 🗄️ **Database Schema**

### **Core Tables**

- `customers` - User accounts and preferences
- `products` - Product catalog with sustainability data
- `cart` - Shopping cart items
- `orders` - Order history and status
- `warehouse_inventory` - Stock levels and sustainability scores

### **AI-Enhanced Features**

- **Intent Recognition**: Understands shopping contexts
- **Recommendation Engine**: Suggests products based on AI analysis
- **Sustainability Scoring**: Environmental impact metrics

## 🤖 **AI Capabilities**

### **Natural Language Queries**

```
User: "I need snacks after football practice"
AI: Recommends protein bars, energy drinks, and recovery snacks

User: "Make me pancakes with 200 rupees budget"
AI: Suggests flour, eggs, milk, and butter within budget

User: "Blue trousers size 32 under 500 rupees"
AI: Finds clothing matching color, size, and budget

User: "Healthy protein snacks for muscle building"
AI: Recommends protein-rich, nutritious options
```

### **AI Features**

- **Intent Classification**: Recipe, clothing, health, post-activity, general
- **Parameter Extraction**: Budget, size, color, dietary restrictions
- **Context Understanding**: Remembers conversation history
- **Personalized Responses**: Tailored to user preferences
- **Fallback Handling**: Graceful degradation if AI service unavailable

## 🎯 **Usage Examples**

### **Recipe Shopping**

```
User: "I want to make pasta for dinner"
AI Response: "Great choice! For a delicious pasta dinner, I recommend:
- Durum Wheat Pasta (₹45) - High-quality Italian pasta
- Extra Virgin Olive Oil (₹120) - Perfect for cooking
- Fresh Tomatoes (₹30) - For authentic sauce
- Basil Leaves (₹25) - Fresh herb garnish

Total Cost: ₹220
Sustainability Score: 85%
These ingredients will make 4 servings of authentic Italian pasta!"
```

### **Post-Activity Nutrition**

```
User: "Need energy after gym workout"
AI Response: "Perfect timing! Here are great post-workout options:
- Protein Powder (₹800) - Muscle recovery
- Greek Yogurt (₹60) - Natural protein source
- Bananas (₹40) - Potassium for muscle function
- Almonds (₹150) - Healthy fats and protein

Total Cost: ₹1050
Focus: High protein for muscle recovery and energy restoration"
```

### **Clothing Recommendations**

```
User: "Casual blue shirt under 300 rupees"
AI Response: "Found some great casual blue shirts for you:
- Cotton Blue T-Shirt (₹180) - Comfortable and breathable
- Denim Blue Shirt (₹250) - Classic casual style
- Light Blue Polo (₹280) - Smart casual option

Total Cost: ₹280
Style: Casual and versatile for everyday wear"
```

## 🔧 **API Endpoints**

### **AI Chatbot**

- `POST /chatbot/recommend` - Get AI-powered recommendations
- `GET /chatbot/recipes` - Available recipe templates

### **Shopping**

- `GET /products` - Product catalog
- `POST /cart/:customerId` - Add to cart
- `GET /cart/:customerId` - View cart
- `POST /orders` - Place order
- `GET /orders/:customerId` - Order history

### **Authentication**

- `POST /auth/login` - Customer login
- `POST /auth/register` - Customer registration

## 🌟 **Advanced Features**

### **AI-Powered Insights**

- **Budget Optimization**: Suggests alternatives within budget
- **Sustainability Scoring**: Environmental impact analysis
- **Nutritional Guidance**: Health-focused recommendations
- **Style Matching**: Fashion and personal care suggestions

### **Smart Recommendations**

- **Context Awareness**: Understands shopping situations
- **Personalization**: Learns from user preferences
- **Cross-Category Suggestions**: Complementary products
- **Seasonal Recommendations**: Time-appropriate suggestions

## 🚀 **Deployment**

### **Production Setup**

1. Set up PostgreSQL database
2. Configure environment variables
3. Install PM2 for process management
4. Set up reverse proxy (Nginx)
5. Configure SSL certificates

### **Environment Variables**

```env
# Database
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=walmart_customer
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Server
PORT=4000
NODE_ENV=production

# AI Services
GEMINI_API_KEY=your_gemini_api_key
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For issues and questions:

1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔮 **Future Enhancements**

- **Voice Integration**: Speech-to-text for hands-free shopping
- **Image Recognition**: Product search by photos
- **Predictive Analytics**: Anticipate shopping needs
- **Multi-language Support**: International market expansion
- **AR Shopping**: Virtual try-on for clothing
- **Social Shopping**: Share recommendations with friends

---

**Built with ❤️ using Google Gemini AI for intelligent shopping experiences**

const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.chat = null;
  }

  // Initialize chat session
  initializeChat() {
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are an intelligent shopping assistant for a sustainable e-commerce platform. You help customers find products based on their needs, preferences, and budget. You understand natural language queries and provide personalized recommendations. Always respond with valid JSON when requested.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand. I'm an AI shopping assistant that helps customers find sustainable products. I can understand natural language queries about recipes, clothing, health products, post-activity nutrition, and general shopping needs. I'll provide personalized recommendations based on context, budget, and sustainability preferences. I will always return valid JSON when requested.",
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });
  }

  // Helper function to safely parse JSON from Gemini response
  safeJsonParse(text) {
    try {
      // Try to find JSON in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, throw error
      throw new Error("No JSON found in response");
    } catch (error) {
      console.error("JSON parsing error:", error);
      console.error("Raw text:", text);
      
      // Return a fallback structure
      return {
        intent: "general_shopping",
        context: "General shopping request",
        parameters: {
          budget: null,
          category: null,
          sustainability_priority: false
        },
        confidence: 0.5
      };
    }
  }

  // Analyze user intent and extract parameters using Gemini
  async analyzeUserIntent(userMessage) {
    try {
      if (!this.chat) {
        this.initializeChat();
      }

      const prompt = `
Analyze this user message and extract shopping intent and parameters.

User Message: "${userMessage}"

Respond with ONLY a valid JSON object in this exact format:
{
  "intent": "recipe|clothing|health|post_activity|general_shopping",
  "context": "brief description of the context",
  "parameters": {
    "budget": null,
    "category": "specific product category if mentioned",
    "size": "clothing size if mentioned",
    "color": "color preference if mentioned",
    "activity": "activity type if post-activity context",
    "health_goal": "health goal if mentioned",
    "dietary_restrictions": [],
    "sustainability_priority": false,
    "recipe_name": "recipe name if cooking intent",
    "style": "casual|formal|sporty if clothing context"
  },
  "confidence": 0.95
}

IMPORTANT: Return ONLY the JSON object, no additional text or formatting.`;

      // FIXED: Use the correct format for sending messages
      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.safeJsonParse(text);
      
    } catch (error) {
      console.error("Gemini AI Intent Analysis Error:", error);
      
      // Return fallback intent analysis
      return {
        intent: "general_shopping",
        context: "General shopping request",
        parameters: {
          budget: null,
          category: null,
          sustainability_priority: false
        },
        confidence: 0.3
      };
    }
  }

  // Get intelligent product recommendations using Gemini
  async getIntelligentRecommendations(
    userMessage,
    availableProducts,
    budget,
    sustainabilityPriority
  ) {
    try {
      if (!this.chat) {
        this.initializeChat();
      }

      // Limit products to avoid token limits
      const productList = availableProducts
        .slice(0, 30)
        .map((p) => ({
          id: p.product_id,
          name: p.name,
          category: p.category,
          price: parseFloat(p.price) || 0,
          sustainability: parseFloat(p.recyclability_index) || 0,
          stock: parseInt(p.stock) || 0,
        }));

      const prompt = `
User request: "${userMessage}"
Budget: ${budget ? `₹${budget}` : "No specific budget"}
Sustainability Priority: ${sustainabilityPriority ? "Yes" : "No"}

Available Products:
${JSON.stringify(productList, null, 2)}

Select the best products for this user request and respond with ONLY a valid JSON object:
{
  "recommendations": [
    { "product_id": 1, "reason": "explanation why this product fits" }
  ],
  "total_cost": 150.50,
  "reasoning": "Brief explanation of the selection logic",
  "sustainability_score": 0.85,
  "budget_optimization": "How budget was considered"
}

Rules:
- Only recommend products with stock > 0
- Consider budget constraints if provided
- Prioritize sustainability if requested
- Maximum 5 recommendations
- Ensure total_cost is a number

IMPORTANT: Return ONLY the JSON object, no additional text.`;

      // FIXED: Use the correct format for sending messages
      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
      
      const aiResponse = this.safeJsonParse(text);
      
      // Ensure we have valid structure
      if (!aiResponse.recommendations) {
        aiResponse.recommendations = [];
      }
      
      // Map recommended products back to full product objects
      const recommendedProducts = aiResponse.recommendations
        .map((rec) => {
          const product = availableProducts.find(
            (p) => p.product_id === rec.product_id
          );
          return product ? { ...product, reason: rec.reason } : null;
        })
        .filter(Boolean);

      return {
        products: recommendedProducts,
        totalCost: parseFloat(aiResponse.total_cost) || 0,
        reasoning: aiResponse.reasoning || "AI recommendation based on your request",
        sustainabilityScore: parseFloat(aiResponse.sustainability_score) || 0.5,
        budgetOptimization: aiResponse.budget_optimization || "Budget considered in selection",
        alternativeSuggestions: aiResponse.alternative_suggestions || null,
      };
      
    } catch (error) {
      console.error("Gemini Recommendation Error:", error);
      
      // Return fallback recommendations
      const fallbackProducts = availableProducts
        .filter(p => parseInt(p.stock) > 0)
        .slice(0, 3)
        .map(p => ({ ...p, reason: "Fallback recommendation" }));
      
      const fallbackCost = fallbackProducts.reduce((sum, p) => sum + parseFloat(p.price), 0);
      
      return {
        products: fallbackProducts,
        totalCost: fallbackCost,
        reasoning: "Fallback recommendations due to AI service issue",
        sustainabilityScore: 0.5,
        budgetOptimization: "Basic filtering applied",
        alternativeSuggestions: null,
      };
    }
  }

  // Generate personalized response using Gemini
  async generatePersonalizedResponse(userMessage, recommendations, intent) {
    try {
      if (!this.chat) {
        this.initializeChat();
      }

      const prompt = `
Generate a friendly, helpful response for this shopping recommendation.

User Message: "${userMessage}"
Intent: ${intent}
Recommended Products: ${recommendations.products.map(p => `${p.name} (₹${p.price})`).join(", ")}
Total Cost: ₹${recommendations.totalCost}

Write a natural, conversational response (2-3 sentences) that:
1. Acknowledges the user's request
2. Briefly explains why these products were chosen
3. Mentions the total cost
4. Is friendly and helpful

Do not use any special formatting or JSON. Just return plain text.`;

      // FIXED: Use the correct format for sending messages
      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      return response.text().trim();
      
    } catch (error) {
      console.error("Gemini Response Generation Error:", error);
      
      // Return fallback response
      const productNames = recommendations.products.map(p => p.name).join(", ");
      return `I found some great products for you: ${productNames}. The total comes to ₹${recommendations.totalCost}. These items should work well for your needs!`;
    }
  }

  // Reset chat session
  resetChat() {
    this.chat = null;
  }
}

module.exports = new AIService();
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const aiService = require("./services/aiService");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Products endpoint
app.get("/products", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.product_id, 
        p.name, 
        p.category, 
        p.image_url, 
        p.recyclability_index, 
        p.weight, 
        p.dimensions, 
        p.current_score, 
        p.price,
        COALESCE(SUM(wi.current_stock), 0) AS stock
      FROM products p
      LEFT JOIN warehouse_inventory wi ON p.product_id = wi.product_id
      GROUP BY p.product_id, p.name, p.category, p.image_url, p.recyclability_index, p.weight, p.dimensions, p.current_score, p.price
      ORDER BY p.product_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI-Powered Chatbot endpoint with Gemini Integration
app.post("/chatbot/recommend", async (req, res) => {
  try {
    const { message, budget, sustainability_priority } = req.body;

    console.log("🤖 AI Processing:", {
      message,
      budget,
      sustainability_priority,
    });

    // Use Gemini AI to analyze user intent
    const aiAnalysis = await aiService.analyzeUserIntent(message);
    console.log("🎯 AI Intent Analysis:", aiAnalysis);

    // Get all available products for AI processing
    const allProducts = await db.query(`
      SELECT 
        p.product_id, 
        p.name, 
        p.category, 
        p.image_url, 
        p.recyclability_index, 
        p.price,
        p.weight,
        p.dimensions,
        COALESCE(SUM(wi.current_stock), 0) AS stock,
        AVG(wi.sustainability_score) as avg_sustainability
      FROM products p
      LEFT JOIN warehouse_inventory wi ON p.product_id = wi.product_id
      GROUP BY p.product_id, p.name, p.category, p.image_url, p.recyclability_index, p.price, p.weight, p.dimensions
      HAVING COALESCE(SUM(wi.current_stock), 0) > 0
      ORDER BY p.recyclability_index DESC, p.price ASC
    `);

    // Use Gemini AI to get intelligent recommendations
    const recommendations = await aiService.getIntelligentRecommendations(
      message,
      allProducts.rows,
      budget || aiAnalysis.parameters.budget,
      sustainability_priority || aiAnalysis.parameters.sustainability_priority
    );

    console.log("💡 AI Recommendations:", recommendations);

    // Generate personalized response using Gemini
    const personalizedResponse = await aiService.generatePersonalizedResponse(
      message,
      recommendations,
      aiAnalysis.intent
    );

    res.json({
      success: true,
      intent: aiAnalysis.intent,
      context: aiAnalysis.context,
      confidence: aiAnalysis.confidence,
      recommendations: recommendations.products,
      totalCost: recommendations.totalCost.toFixed(2),
      averageSustainability: recommendations.sustainabilityScore.toFixed(2),
      reasoning: recommendations.reasoning,
      budgetOptimization: recommendations.budgetOptimization,
      alternativeSuggestions: recommendations.alternativeSuggestions,
      message: personalizedResponse,
    });
  } catch (err) {
    console.error("🤖 Gemini AI Error:", err);
    res.status(500).json({
      error: err.message,
      fallback: "Using fallback recommendations due to AI service issue",
    });
  }
});

// AI Intent Recognition Function
// Legacy rule-based functions removed - Now using Gemini AI for intelligent intent recognition

// AI Recommendation Functions
async function getRecipeRecommendations(
  recipe,
  products,
  budget,
  sustainabilityPriority
) {
  const ingredientCategories = recipe.ingredients;
  const relevantProducts = products.filter((p) =>
    ingredientCategories.includes(p.category)
  );

  return processRecommendations(
    relevantProducts,
    budget,
    sustainabilityPriority,
    3
  );
}

async function getPostActivitySnacks(
  products,
  activity,
  budget,
  sustainabilityPriority
) {
  // AI logic for post-activity nutrition
  const nutritionMap = {
    football: ["protein", "energy", "hydration"],
    gym: ["protein", "recovery"],
    tennis: ["energy", "hydration"],
    run: ["energy", "hydration"],
    exercise: ["protein", "energy"],
  };

  const nutritionNeeds = nutritionMap[activity] || ["energy", "protein"];
  const relevantProducts = products.filter(
    (p) =>
      ["snacks", "beverages", "dairy", "fruit"].includes(p.category) ||
      p.name.toLowerCase().includes("protein") ||
      p.name.toLowerCase().includes("energy")
  );

  return processRecommendations(
    relevantProducts,
    budget,
    sustainabilityPriority,
    4
  );
}

async function getClothingRecommendations(
  products,
  clothingType,
  size,
  color,
  budget,
  sustainabilityPriority
) {
  // Filter clothing products based on type, color, and other attributes
  let relevantProducts = products.filter((p) => p.category === "clothing");

  // Filter by clothing type if specified
  if (clothingType && clothingType !== "clothes") {
    relevantProducts = relevantProducts.filter((p) =>
      p.name.toLowerCase().includes(clothingType.toLowerCase())
    );
  }

  // Filter by color if specified
  if (color && color !== "any") {
    relevantProducts = relevantProducts.filter((p) =>
      p.name.toLowerCase().includes(color.toLowerCase())
    );
  }

  // If no clothing products found, include personal care items
  if (relevantProducts.length === 0) {
    relevantProducts = products.filter((p) =>
      ["clothing", "personal_care"].includes(p.category)
    );
  }

  return processRecommendations(
    relevantProducts,
    budget,
    sustainabilityPriority,
    4
  );
}

async function getHealthRecommendations(
  products,
  healthGoal,
  dietaryRestrictions,
  budget,
  sustainabilityPriority
) {
  const relevantProducts = products.filter(
    (p) =>
      ["dairy", "fruit", "vegetable", "snacks", "beverages"].includes(
        p.category
      ) ||
      p.name.toLowerCase().includes("organic") ||
      p.name.toLowerCase().includes("natural")
  );

  return processRecommendations(
    relevantProducts,
    budget,
    sustainabilityPriority,
    4
  );
}

async function getGeneralRecommendations(
  products,
  category,
  context,
  budget,
  sustainabilityPriority
) {
  let relevantProducts = products;

  if (category) {
    relevantProducts = products.filter((p) => p.category === category);
  }

  return processRecommendations(
    relevantProducts,
    budget,
    sustainabilityPriority,
    5
  );
}

async function getSmartRecommendations(
  products,
  message,
  budget,
  sustainabilityPriority
) {
  // AI-powered general recommendation based on message content
  const keywords = message.toLowerCase().split(" ");
  const relevantProducts = products.filter((p) =>
    keywords.some(
      (keyword) =>
        p.name.toLowerCase().includes(keyword) || p.category.includes(keyword)
    )
  );

  return processRecommendations(
    relevantProducts.length > 0 ? relevantProducts : products,
    budget,
    sustainabilityPriority,
    4
  );
}

// AI Processing Function
function processRecommendations(
  products,
  budget,
  sustainabilityPriority,
  maxItems
) {
  let filteredProducts = [...products];

  // Apply sustainability priority
  if (sustainabilityPriority) {
    filteredProducts.sort(
      (a, b) => b.recyclability_index - a.recyclability_index
    );
  }

  // Apply budget constraints
  if (budget) {
    const avgBudgetPerItem = budget / maxItems;
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= avgBudgetPerItem * 1.5
    );
  }

  // Select best products
  const selectedProducts = filteredProducts.slice(0, maxItems);
  const totalCost = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const avgSustainability =
    selectedProducts.reduce((sum, p) => sum + p.recyclability_index, 0) /
    selectedProducts.length;

  return {
    products: selectedProducts,
    totalCost,
    avgSustainability,
  };
}

// Helper Functions for AI Analysis
function getRecipeDetails(recipeName) {
  const recipes = {
    pancake: {
      ingredients: ["flour", "eggs", "milk", "butter", "sugar", "baking"],
      description: "Classic fluffy pancakes",
    },
    pasta: {
      ingredients: ["flour", "eggs", "salt", "oil"],
      description: "Homemade pasta",
    },
    curry: {
      ingredients: ["rice", "vegetable", "spice", "oil", "salt"],
      description: "Traditional Indian curry",
    },
    bread: {
      ingredients: ["flour", "salt", "sugar", "oil"],
      description: "Fresh homemade bread",
    },
    cake: {
      ingredients: ["flour", "eggs", "sugar", "butter", "milk", "baking"],
      description: "Delicious cake",
    },
    soup: {
      ingredients: ["vegetable", "salt", "oil", "spice"],
      description: "Hearty vegetable soup",
    },
    salad: {
      ingredients: ["vegetable", "oil", "salt"],
      description: "Fresh garden salad",
    },
    smoothie: {
      ingredients: ["fruit", "milk"],
      description: "Healthy fruit smoothie",
    },
  };
  return (
    recipes[recipeName] || {
      ingredients: ["flour", "salt"],
      description: recipeName,
    }
  );
}

function getNutritionFocus(message) {
  if (message.includes("protein")) return "High Protein";
  if (message.includes("energy")) return "Energy Boost";
  if (message.includes("recovery")) return "Recovery";
  return "Balanced Nutrition";
}

function extractSize(message) {
  const sizeMatch = message.match(/(\d+)\s*(?:inch|cm|size)/i);
  return sizeMatch ? sizeMatch[1] : "standard";
}

function extractColor(message) {
  const colors = [
    "red",
    "blue",
    "green",
    "black",
    "white",
    "brown",
    "gray",
    "yellow",
    "pink",
    "purple",
  ];
  const colorMatch = colors.find((color) => message.includes(color));
  return colorMatch || "any";
}

function extractStyle(message) {
  if (message.includes("casual")) return "Casual";
  if (message.includes("formal")) return "Formal";
  if (message.includes("sport")) return "Sporty";
  return "Versatile";
}

function extractHealthGoal(message) {
  if (message.includes("weight loss")) return "Weight Loss";
  if (message.includes("muscle")) return "Muscle Building";
  if (message.includes("energy")) return "Energy Boost";
  if (message.includes("immunity")) return "Immunity";
  return "General Health";
}

function extractDietaryRestrictions(message) {
  const restrictions = [];
  if (message.includes("vegetarian")) restrictions.push("vegetarian");
  if (message.includes("vegan")) restrictions.push("vegan");
  if (message.includes("gluten")) restrictions.push("gluten-free");
  return restrictions;
}

function extractCategory(message) {
  const categories = [
    "snacks",
    "beverages",
    "dairy",
    "fruit",
    "vegetable",
    "spice",
    "oil",
    "flour",
  ];
  const categoryMatch = categories.find((cat) => message.includes(cat));
  return categoryMatch || null;
}

function extractContext(message) {
  if (message.includes("gift")) return "Gift";
  if (message.includes("party")) return "Party";
  if (message.includes("daily")) return "Daily Use";
  return "General";
}

// Get available recipes
app.get("/chatbot/recipes", async (req, res) => {
  const recipes = {
    pancake: "Classic fluffy pancakes",
    pasta: "Homemade pasta",
    curry: "Traditional Indian curry",
    bread: "Fresh homemade bread",
    cake: "Delicious cake",
    soup: "Hearty vegetable soup",
    salad: "Fresh garden salad",
    smoothie: "Healthy fruit smoothie",
  };

  res.json({ recipes });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Customer backend running at http://localhost:${PORT}`);
});

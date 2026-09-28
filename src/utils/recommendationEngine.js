/**
 * Static Client-Side PDP Product Recommendation Engine
 * 
 * Generates deterministic, highly relevant, and diverse product recommendations
 * powered entirely by static JSON product data.
 * 
 * Features:
 * - Deterministic relevance scoring (Subcategory, Category, Tags, Price, Explicit Links)
 * - 0 External APIs or Network Requests
 * - Zero Duplication across recommendation sections
 * - Subcategory diversity filtering to avoid uniform repetitive results
 * - Graceful Fallbacks for incomplete metadata
 */

export const DEFAULT_SCORING_WEIGHTS = {
  EXPLICIT_RECOMMENDATION: 40,  // Candidate is listed in currentProduct.recommendedProducts
  SAME_SUBCATEGORY: 30,         // Exact same subCategory match
  SAME_CATEGORY: 15,            // Same main category match
  TAG_MATCH: 5,                 // Per matching tag (max 25 pts)
  PRICE_PROXIMITY: 10           // Price within ±35% range
};

/**
 * Calculates a deterministic relevance score for a candidate product relative to currentProduct.
 */
export function calculateRelevanceScore(currentProduct, candidate, weights = DEFAULT_SCORING_WEIGHTS) {
  if (!currentProduct || !candidate || currentProduct.id === candidate.id) {
    return -1;
  }

  let score = 0;

  // 1. Explicit complementary link defined in static JSON
  if (Array.isArray(currentProduct.recommendedProducts) && currentProduct.recommendedProducts.includes(candidate.id)) {
    score += weights.EXPLICIT_RECOMMENDATION;
  }

  // 2. Same subcategory match (strong similarity)
  if (currentProduct.subCategory && candidate.subCategory && 
      currentProduct.subCategory.toLowerCase() === candidate.subCategory.toLowerCase()) {
    score += weights.SAME_SUBCATEGORY;
  }

  // 3. Same main category match
  if (currentProduct.category && candidate.category && 
      currentProduct.category.toLowerCase() === candidate.category.toLowerCase()) {
    score += weights.SAME_CATEGORY;
  }

  // 4. Shared tags overlap
  const currentTags = new Set((currentProduct.tags || []).map(t => t.toLowerCase()));
  const candidateTags = (candidate.tags || []).map(t => t.toLowerCase());
  let tagMatches = 0;
  for (const tag of candidateTags) {
    if (currentTags.has(tag)) {
      tagMatches++;
    }
  }
  score += Math.min(tagMatches * weights.TAG_MATCH, 25);

  // 5. Price Proximity (within ±35%)
  const curPrice = currentProduct.price || 100;
  const candPrice = candidate.price || 100;
  const priceRatio = Math.abs(curPrice - candPrice) / curPrice;
  if (priceRatio <= 0.35) {
    score += weights.PRICE_PROXIMITY;
  }

  return score;
}

/**
 * Generates structured, deduplicated recommendation groups for the PDP view.
 * 
 * @param {Object} currentProduct The product currently displayed on the PDP
 * @param {Array} allProducts The complete catalog array from productsData.json
 * @param {Object} options Configuration weights and options
 * @returns {Object} { frequentlyBoughtTogether, youMayAlsoLike, exploreMore }
 */
export function getPDPRecommendations(currentProduct, allProducts = [], options = {}) {
  if (!currentProduct || !Array.isArray(allProducts) || allProducts.length === 0) {
    return {
      frequentlyBoughtTogether: [],
      youMayAlsoLike: [],
      exploreMore: []
    };
  }

  const weights = { ...DEFAULT_SCORING_WEIGHTS, ...options.weights };

  // Calculate scores for all candidate products (excluding current product)
  const scoredCandidates = allProducts
    .filter(p => p && p.id !== currentProduct.id)
    .map(p => ({
      product: p,
      score: calculateRelevanceScore(currentProduct, p, weights)
    }))
    // Deterministic sorting: highest score first, tied scores sorted alphabetically by ID
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.product.id.localeCompare(b.product.id);
    });

  // Global set to track used product IDs and guarantee 0 cross-section duplicates on PDP
  const usedProductIds = new Set([currentProduct.id]);

  // --- SECTION 1: Frequently Bought Together (Complementary Pairs) ---
  const frequentlyBoughtTogether = [];

  // First pick explicit recommendations if available
  if (Array.isArray(currentProduct.recommendedProducts)) {
    for (const recId of currentProduct.recommendedProducts) {
      if (frequentlyBoughtTogether.length >= 2) break;
      const candidate = scoredCandidates.find(c => c.product.id === recId && !usedProductIds.has(c.product.id));
      if (candidate) {
        frequentlyBoughtTogether.push(candidate.product);
        usedProductIds.add(candidate.product.id);
      }
    }
  }

  // Fallback to top scored candidates if explicit items were fewer than 2
  if (frequentlyBoughtTogether.length < 2) {
    for (const item of scoredCandidates) {
      if (frequentlyBoughtTogether.length >= 2) break;
      if (!usedProductIds.has(item.product.id) && item.score > 15) {
        frequentlyBoughtTogether.push(item.product);
        usedProductIds.add(item.product.id);
      }
    }
  }

  // --- SECTION 2: You May Also Like (High Relevance + Subcategory Diversity) ---
  const youMayAlsoLike = [];
  const subCategoryCounts = {};

  for (const item of scoredCandidates) {
    if (youMayAlsoLike.length >= 4) break;
    const p = item.product;
    if (usedProductIds.has(p.id)) continue;

    // Apply diversity rule: max 2 products per subcategory to ensure variety
    const subCat = (p.subCategory || 'general').toLowerCase();
    if ((subCategoryCounts[subCat] || 0) >= 2) continue;

    youMayAlsoLike.push(p);
    usedProductIds.add(p.id);
    subCategoryCounts[subCat] = (subCategoryCounts[subCat] || 0) + 1;
  }

  // --- SECTION 3: Explore More (Broader Category & Catalog Discovery) ---
  const exploreMore = [];

  // First pick remaining products from the same main category
  for (const item of scoredCandidates) {
    if (exploreMore.length >= 4) break;
    const p = item.product;
    if (usedProductIds.has(p.id)) continue;

    if (p.category && currentProduct.category && 
        p.category.toLowerCase() === currentProduct.category.toLowerCase()) {
      exploreMore.push(p);
      usedProductIds.add(p.id);
    }
  }

  // Fallback: fill exploreMore from remaining candidates across the catalog if needed
  if (exploreMore.length < 4) {
    for (const item of scoredCandidates) {
      if (exploreMore.length >= 4) break;
      const p = item.product;
      if (!usedProductIds.has(p.id)) {
        exploreMore.push(p);
        usedProductIds.add(p.id);
      }
    }
  }

  return {
    frequentlyBoughtTogether,
    youMayAlsoLike,
    exploreMore
  };
}

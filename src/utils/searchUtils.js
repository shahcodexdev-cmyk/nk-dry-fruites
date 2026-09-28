/**
 * Smart Multilingual & Tag-Based Search Helper
 * Matches user search queries in English and Hindi/Hinglish transliterated names,
 * categories, subcategories, tags, keywords, subtitles, and descriptions.
 */
export function matchesSmartSearch(product, queryStr) {
  if (!product) return false;
  if (!queryStr || !queryStr.trim()) return true;

  const query = queryStr.toLowerCase().trim();
  const searchWords = query.split(/\s+/).filter(Boolean);

  // Combine all searchable text fields including rich product tags
  const searchableText = [
    product.name,
    product.category,
    product.subCategory,
    product.subtitle,
    product.description,
    ...(product.tags || []),
    ...(product.searchKeywords || []),
    ...(product.highlights || [])
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Return true if EVERY word typed by user matches somewhere in the product metadata or tags
  return searchWords.every(word => searchableText.includes(word));
}

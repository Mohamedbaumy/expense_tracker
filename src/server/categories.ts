import { createCategory, getCategories } from "./transactions";

// Default categories for the expense tracker
export const DEFAULT_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Gas & Fuel",
  "Insurance",
  "Rent/Mortgage",
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other Income",
  "Other Expense"
];

export const setupDefaultCategories = async (): Promise<void> => {
  try {
    const existingCategories = await getCategories();
    
    // Only create categories that don't already exist
    const categoriesToCreate = DEFAULT_CATEGORIES.filter(
      defaultCategory => !existingCategories.some(
        existing => existing.title.toLowerCase() === defaultCategory.toLowerCase()
      )
    );
    
    // Create missing categories
    for (const categoryTitle of categoriesToCreate) {
      try {
        await createCategory({ title: categoryTitle });
        console.log(`Created category: ${categoryTitle}`);
      } catch (error) {
        console.warn(`Failed to create category ${categoryTitle}:`, error);
        // Continue with other categories even if one fails
      }
    }
    
    console.log(`Setup completed. Created ${categoriesToCreate.length} new categories.`);
  } catch (error) {
    console.error("Error setting up default categories:", error);
    throw error;
  }
};

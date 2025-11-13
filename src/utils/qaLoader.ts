interface QA {
  id: number;
  question: string;
  answer: string;
}

// Function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to load and get random questions
export const getRandomQuestions = async (sectionId: string): Promise<QA[]> => {
  try {
    // Dynamic import of JSON file
    const module = await import(`@/data/qa/${sectionId}.json`);
    const allQuestions: QA[] = module.default;
    
    // Shuffle and take first 10
    const shuffled = shuffleArray(allQuestions);
    return shuffled.slice(0, 10);
  } catch (error) {
    console.error(`Error loading questions for section ${sectionId}:`, error);
    return [];
  }
};

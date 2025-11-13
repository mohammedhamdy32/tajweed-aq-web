export const loadSectionContent = async (sectionId: string): Promise<string> => {
  try {
    const response = await fetch(`/content/sections/${sectionId}.html`);
    if (!response.ok) {
      throw new Error(`Failed to load content for section ${sectionId}`);
    }
    const html = await response.text();
    return html;
  } catch (error) {
    console.error(`Error loading content for section ${sectionId}:`, error);
    return '<div class="tajweed-content"><p>لم يتم العثور على محتوى الشرح لهذا القسم.</p></div>';
  }
};
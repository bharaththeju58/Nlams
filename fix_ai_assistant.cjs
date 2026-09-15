const fs = require('fs');

let content = fs.readFileSync('src/components/AIAssistant.tsx', 'utf8');

const target = `      if (!response.ok) throw new Error('API Error');
      const data = await response.json();`;

const replacement = `      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
            throw new Error("You are not authorized to use the NLAMS AI Assistant.");
        }
        throw new Error(data.details || "I was unable to search the NLAMS records. Please try again.");
      }`;

content = content.replace(target, replacement);

const errorHandlingTarget = `    } catch (error: any) {
      console.error('Chat error Details:', error.message || error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('ai.error', 'Gemini service is temporarily unavailable. Please try again. ' + (error.message || ''))
      };`;

const errorHandlingReplacement = `    } catch (error: any) {
      console.error('Chat error Details:', error.message || error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('ai.error', error.message || 'I was unable to search the NLAMS records. Please try again.')
      };`;

content = content.replace(errorHandlingTarget, errorHandlingReplacement);

fs.writeFileSync('src/components/AIAssistant.tsx', content);

import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { PostState, GeneratedPostContent, ArticleState, GeneratedArticle, InfographicState, GeneratedInfographic, ConversionState, ConversionResult, PostFormat, MessageTemplateState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to validate API Key availability
const checkApiKey = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }
};

const commonSafetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export const generatePostText = async (state: PostState): Promise<GeneratedPostContent> => {
  checkApiKey();

  let prompt = '';
  let parts: any[] = [];

  // LOGIC FOR MULTIMODAL (VISION)
  if (state.uploadedImage) {
      // Extract base64 data (remove header "data:image/png;base64,")
      const base64Data = state.uploadedImage.split(',')[1];
      const mimeType = state.uploadedImage.split(';')[0].split(':')[1];

      parts.push({
          inlineData: {
              data: base64Data,
              mimeType: mimeType
          }
      });

      prompt = `
        Analise esta imagem médica/clínica. Você é o Dr. Carlos Franciozi, cirurgião de joelho renomado.
        Crie uma legenda para o Instagram baseada EXATAMENTE no que está na imagem e no tópico "${state.topic}".
        
        Categoria: ${state.category}
        Tom de voz: ${state.tone}
        Formato: ${state.format}
        
        A legenda deve explicar a imagem de forma educativa, profissional e conectar com a patologia.
        Se for um Raio-X/Ressonância, explique o que estamos vendo de forma simples.
      `;
  } else {
      prompt = `
        Você é o Dr. Carlos Franciozi, especialista em Cirurgia de Joelho. Crie um post para o Instagram.
        
        Categoria: ${state.category}
        Tópico: ${state.topic}
        Tom de voz: ${state.tone}
        Formato: ${state.format}
        Instruções: ${state.customInstructions || "Nenhuma"}

        Estilo "Seu Joelho":
        - Autoridade técnica, mas linguagem acessível.
        - Foco em qualidade de vida e retorno ao esporte.
        - Se for STORY: Texto curto, direto, enquetes sugeridas.
        - Se for FEED: Legenda estruturada (Gancho -> Conteúdo -> CTA).
      `;
  }

  // Add the text prompt instruction
  prompt += `
    Gere um objeto JSON com:
    1. 'headline': Título curto e impactante (máx 6 palavras).
    2. 'caption': A legenda do post.
    3. 'hashtags': 15 hashtags focadas em ortopedia.
    4. 'imagePromptDescription': ${state.uploadedImage ? '"USE_UPLOADED_IMAGE"' : 'Descrição visual detalhada para gerar imagem (Blue & Gold style, medical high-end).'}
  `;

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: parts }, // Correct format for multimodal
    config: {
      responseMimeType: "application/json",
      safetySettings: commonSafetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          caption: { type: Type.STRING },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          imagePromptDescription: { type: Type.STRING }
        },
        required: ["headline", "caption", "hashtags", "imagePromptDescription"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Não foi possível gerar o texto.");

  return JSON.parse(text) as GeneratedPostContent;
};

// NEW: SMART REFINE FUNCTION
export const refinePostCaption = async (currentCaption: string, instruction: string): Promise<string> => {
    checkApiKey();
    const prompt = `
        Refine a seguinte legenda de post médico de acordo com a instrução.
        Mantenha a formatação.

        Legenda Atual: "${currentCaption}"
        
        Instrução de Refinamento: "${instruction}" (Ex: Mais curto, Mais empático, Adicionar emojis, Traduzir termos técnicos).

        Retorne APENAS o novo texto da legenda, sem JSON.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { safetySettings: commonSafetySettings }
    });

    return response.text || currentCaption;
};

// NEW: GENERATE APPOINTMENT MESSAGE
export const generateAppointmentMessage = async (state: MessageTemplateState): Promise<string> => {
    checkApiKey();
    
    const typeMap: Record<string, string> = {
        'first_visit': 'Primeira Consulta',
        'return': 'Retorno',
        'post_op': 'Avaliação Pós-Operatória',
        'infiltration': 'Infiltração / Viscossuplementação'
    };

    const prompt = `
        Atue como a Secretária Virtual do Dr. Carlos Franciozi (Seu Joelho).
        Escreva uma mensagem de confirmação/aviso para enviar via WhatsApp ao paciente.
        
        Paciente: ${state.appointment.patientName}
        Tipo de Consulta: ${typeMap[state.appointment.type] || state.appointment.type}
        Data: ${state.appointment.date} às ${state.appointment.time}
        Tom de voz: ${state.tone}
        Nota Extra: ${state.customNote || "Nenhuma"}

        INFORMAÇÕES REAIS DO CONSULTÓRIO (Use SEMPRE que for confirmar local):
        Local: Hospital Israelita Albert Einstein
        Endereço: Av. Albert Einstein, 627 - Pavilhão Vicky e Joseph Safra - Bloco A1 - Sala 113 - Morumbi, São Paulo - SP.
        Site: seujoelho.com

        Diretrizes:
        1. Se for 'Primeira Consulta', envie o endereço completo e peça para chegar 15min antes.
        2. Se for 'Retorno', seja mais breve.
        3. Use emojis moderados (🏥, 📅, ✅).
        4. Finalize com "Equipe Dr. Carlos Franciozi".

        Retorne APENAS o texto da mensagem.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { safetySettings: commonSafetySettings }
    });

    return response.text || "Olá, aqui é do consultório do Dr. Carlos. Gostaria de confirmar sua consulta no Einstein.";
};


export const generateSEOArticle = async (state: ArticleState): Promise<GeneratedArticle> => {
  checkApiKey();

  const prompt = `
    Você é um redator médico especialista em SEO (Search Engine Optimization) para Ortopedia.
    Escreva um artigo completo para o blog de um cirurgião.
    
    Tópico: ${state.topic}
    Palavras-chave alvo: ${state.keywords || "Sugira as melhores para este tópico"}
    Público-alvo: ${state.audience}
    Extensão aproximada: ${state.length}
    Tom de voz: ${state.tone}

    Diretrizes de SEO e Estrutura:
    1. O conteúdo deve ser original, ético e seguir as normas do CFM (Conselho Federal de Medicina).
    2. Use tags HTML para estruturar o texto (<h2>, <h3>, <p>, <ul>, <li>, <strong>). NÃO use tags <html>, <head> ou <body>. Apenas o conteúdo do artigo.
    3. Estruture com: Introdução (com a dor do paciente), Causas, Sintomas, Diagnóstico, Tratamentos (Conservador vs Cirúrgico) e Conclusão.
    4. Otimize para leitura escaneável (parágrafos curtos, bullet points).
    
    Gere um JSON contendo:
    - 'title': Um título H1 otimizado para SEO (ex: "Dor no Joelho: 5 Causas Comuns e Como Tratar").
    - 'slug': URL amigável sugerida (ex: dor-no-joelho-causas-tratamento).
    - 'metaDescription': Descrição para o Google (máx 160 caracteres) altamente clicável.
    - 'contentHtml': O corpo do artigo em HTML.
    - 'seoSuggestions': Um array de strings com dicas para o médico (ex: "Linkar internamente para a página de Cirurgia de Joelho", "Adicionar vídeo do YouTube sobre alongamento").
    - 'keywordsUsed': Lista das palavras-chave principais que foram inseridas no texto.
    - 'wordCount': Estimativa do número de palavras.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      safetySettings: commonSafetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          slug: { type: Type.STRING },
          metaDescription: { type: Type.STRING },
          contentHtml: { type: Type.STRING },
          seoSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywordsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
          wordCount: { type: Type.INTEGER }
        },
        required: ["title", "slug", "metaDescription", "contentHtml", "seoSuggestions", "keywordsUsed", "wordCount"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Não foi possível gerar o artigo.");

  return JSON.parse(text) as GeneratedArticle;
};

export const generateInfographicContent = async (state: InfographicState): Promise<GeneratedInfographic> => {
  checkApiKey();

  const prompt = `
    Crie o conteúdo completo para uma LANDING PAGE / INFOGRÁFICO INTERATIVO médico sobre o diagnóstico abaixo.
    O conteúdo deve ser rico, educativo e visualmente estruturado.
    
    Diagnóstico: ${state.diagnosis}
    Perfil do Paciente: ${state.patientProfile}
    Tom: ${state.tone}
    Notas: ${state.notes}

    Estrutura Exigida (JSON):
    1. Hero: Título impactante e subtítulo explicativo. Prompt para imagem de capa (anatomia artística).
    2. Anatomy: Explicação breve da anatomia afetada. Prompt para imagem "clean" de osso/músculo. 3 a 4 pontos anatômicos com coordenadas X/Y aproximadas (0-100%) para hotspots.
    3. Mechanism: 3 passos de como a lesão ocorre (causa). Ícones sugeridos (Google Material Symbols names).
    4. Symptoms: 4 principais sintomas (cards). Ícones sugeridos.
    5. Treatment: Comparação entre tratamento Conservador vs Cirúrgico. Prós/Contras de cada.
    6. Rehab: 4 fases da recuperação com metas claras.

    Idioma: Português do Brasil.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      safetySettings: commonSafetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          heroTitle: { type: Type.STRING },
          heroSubtitle: { type: Type.STRING },
          heroImagePrompt: { type: Type.STRING },
          anatomy: {
             type: Type.OBJECT,
             properties: {
                 intro: { type: Type.STRING },
                 imagePrompt: { type: Type.STRING },
                 points: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             label: { type: Type.STRING },
                             text: { type: Type.STRING },
                             x: { type: Type.NUMBER },
                             y: { type: Type.NUMBER }
                         }
                     }
                 }
             }
          },
          mechanism: {
             type: Type.OBJECT,
             properties: {
                 title: { type: Type.STRING },
                 intro: { type: Type.STRING },
                 steps: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             title: { type: Type.STRING },
                             description: { type: Type.STRING },
                             iconName: { type: Type.STRING }
                         }
                     }
                 }
             }
          },
          symptoms: {
             type: Type.OBJECT,
             properties: {
                 intro: { type: Type.STRING },
                 items: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             title: { type: Type.STRING },
                             description: { type: Type.STRING },
                             iconName: { type: Type.STRING }
                         }
                     }
                 }
             }
          },
          treatment: {
             type: Type.OBJECT,
             properties: {
                 intro: { type: Type.STRING },
                 options: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             type: { type: Type.STRING, enum: ['conservador', 'cirurgico'] },
                             title: { type: Type.STRING },
                             description: { type: Type.STRING },
                             pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                             cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                             indication: { type: Type.STRING }
                         }
                     }
                 }
             }
          },
          rehab: {
             type: Type.OBJECT,
             properties: {
                 intro: { type: Type.STRING },
                 phases: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             phase: { type: Type.STRING },
                             title: { type: Type.STRING },
                             items: { type: Type.ARRAY, items: { type: Type.STRING } }
                         }
                     }
                 }
             }
          },
          footerText: { type: Type.STRING }
        },
        required: ["topic", "heroTitle", "heroSubtitle", "heroImagePrompt", "anatomy", "mechanism", "symptoms", "treatment", "rehab", "footerText"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Não foi possível gerar o infográfico.");

  return JSON.parse(text) as GeneratedInfographic;
};

export const generateConversionContent = async (state: ConversionState): Promise<ConversionResult> => {
  checkApiKey();

  const prompt = `
    Atue como o Dr. Carlos Franciozi (Cirurgião de Joelho e Especialista em Marketing Médico).
    Crie conteúdo para "QUEBRAR OBJEÇÕES" de pacientes com ${state.pathology}.
    
    Patologia: ${state.pathology}
    Objeção do Paciente: ${state.objection}
    Formato desejado: ${state.format === 'REELS' ? 'Roteiro de Reels (Vídeo Curto)' : 'Artigo de Blog Profundo (Fundo de Funil)'}
    
    ESTRATÉGIA PSICOLÓGICA:
    1. Validar a dor (Empatia).
    2. Reenquadrar (Autoridade).
    3. Prova/Lógica (Ciência/Tecnologia).
    4. Chamada para Ação (CTA).

    SE FOR 'REELS':
    Gere um JSON com:
    - 'title': Título do vídeo.
    - 'script': Array de objetos { time: '0-5s', visual: '...', audio: '...', textOverlay: '...' }.
      O roteiro deve ser dinâmico.
    - 'caption': Legenda curta para o Instagram.
    - 'CTA': Frase final de impacto.

    SE FOR 'DEEP_ARTICLE':
    Gere um JSON com:
    - 'title': Título altamente persuasivo.
    - 'articleContent': Texto completo em HTML (h2, p, ul, strong). 
       Deve ser denso, tratar de medos profundos.
    - 'CTA': Chamada para agendamento.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', 
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      safetySettings: commonSafetySettings,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          format: { type: Type.STRING, enum: ['REELS', 'DEEP_ARTICLE'] },
          title: { type: Type.STRING },
          articleContent: { type: Type.STRING },
          script: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                visual: { type: Type.STRING },
                audio: { type: Type.STRING },
                textOverlay: { type: Type.STRING }
              }
            }
          },
          caption: { type: Type.STRING },
          CTA: { type: Type.STRING }
        },
        required: ["format", "title", "CTA"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Não foi possível gerar o conteúdo de conversão.");

  const result = JSON.parse(text) as ConversionResult;
  result.format = state.format; 
  return result;
};

export const generatePostImage = async (promptDescription: string, format: PostFormat): Promise<string> => {
  checkApiKey();

  if (!promptDescription || promptDescription.trim() === '') {
      throw new Error("Prompt vazio.");
  }

  // Choose Aspect Ratio based on Format
  const aspectRatio = format === PostFormat.STORY ? "9:16" : "1:1";

  const enhancedPrompt = `
    Professional Medical illustration: ${promptDescription}.
    Style: Premium, High quality, photorealistic, clinical, orthopedics.
    Colors: Navy Blue, Gold/Bronze, White. High contrast.
    No text, no labels, no gore, no blood.
    Lighting: Studio lighting, clean shadows.
  `;

  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio, 
          },
          safetySettings: commonSafetySettings
        }
      });

      let base64String: string | null = null;
      
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
          for (const part of candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                  base64String = part.inlineData.data;
                  break;
              }
          }
      }

      if (!base64String) {
        throw new Error("Modelo não retornou imagem.");
      }

      return `data:image/png;base64,${base64String}`;
  } catch (error) {
      console.error("Erro na geração de imagem:", error);
      throw error;
  }
};
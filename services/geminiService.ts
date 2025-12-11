import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAdDescription = async (carName: string, price: string, features: string): Promise<string> => {
  if (!apiKey) {
    return "API Anahtarı bulunamadı. Lütfen yapılandırmayı kontrol edin.";
  }

  try {
    const prompt = `
      Sen Car Parking Multiplayer (CPM) oyunu için uzman bir araba satıcısısın.
      Aşağıdaki bilgilere göre bu araba için dikkat çekici, heyecan verici ve kısa bir satış ilanı açıklaması yaz.
      
      Araba Modeli: ${carName}
      Fiyat: ${price}
      Ekstra Özellikler: ${features}
      
      Lütfen şunlara dikkat et:
      1. Oyuncuların ilgisini çekecek terimler kullan (Örn: Drift ayarı, Chrome kaplama, 1695HP, Full çizim vb.).
      2. Samimi ve iddialı bir dil kullan.
      3. Türkçe yaz.
      4. Maksimum 3 cümle olsun.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Açıklama oluşturulamadı.";
  } catch (error) {
    console.error("Gemini AI Hatası:", error);
    return "Yapay zeka şu an meşgul, lütfen açıklamayı kendiniz yazın.";
  }
};

import { GoogleGenAI } from "@google/genai";

export type TAIParsedData = {
  name?: string;
  phone?: string;
  address?: string;
  quantity?: number;
  codAmount?: number;
  [key: string]: any;
};





const ai = new GoogleGenAI({});

// export const parseCustomerInfoWithGemini = async (rawText: string): Promise<TAIParsedData> => {
//   const prompt = `You are an expert data extractor. Extract ONLY the following fields from the text and return a valid JSON object (no explanation, no markdown, no extra text):\n\n{\n  \\"name\\": string,  \n  \\"phone\\": string,  \n  \\"address\\": string,  \n  \\"quantity\\": number, \n  \\"codAmount\\": number , \n  \\"note\\": string  \n}\n\nIf any field is missing, use null or 0.\n\nExample output:\n{\\"name\\":\\"রহিম\\",\\"phone\\":\\"01712345678\\",\\"address\\":\\"ঢাকা, মিরপুর\\",\\"quantity\\":2,\\"codAmount\\":1500, \\"node\\":call me please}\n\nText: \\"${rawText}\\"`;
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });
//   let aiData: TAIParsedData = {};
//   try {
//     aiData = JSON.parse(response.text as any);
//     return aiData;
//   } catch (jsonErr) {
//     console.error('Raw AI output (response.text):', response.text);
//     throw new Error('Gemini AI output is not valid JSON.');
//   }
// }




export const parseCustomerInfoWithGemini = async (rawText: string): Promise<TAIParsedData> => {
  const prompt = `You are an expert data extractor. Extract ONLY the following fields from the text and return a valid JSON object (no explanation, no markdown, no extra text):

{
  "name": string,
  "phone": string,
  "alternativePhone": string,
  "address": string,
  "quantity": number,
  "codAmount": number,
  "invoice": string,
  "itemDescription": string,
  "recipientEmail": string,
  "weight": number,
  "note": string
}

If any field is missing, use null or 0. If there are two phone numbers, set the second number as a string in alternativePhone. If only one, set alternativePhone as null or empty string.

Example output:
{
  "name":"রহিম",
  "phone":"01712345678",
  "alternativePhone":"01812345678",
  "address":"ঢাকা, মিরপুর",
  "quantity":2,
  "codAmount":1500,
  "invoice":"INV123",
  "itemDescription":"T-shirt",
  "recipientEmail":"test@email.com",
  "weight":1.5,
  "note":"call me please"
}

Text: "${rawText}"`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  let aiData: TAIParsedData = {};
  try {
    aiData = JSON.parse(response.text as any);
    return aiData;
  } catch (jsonErr) {
    console.error('Raw AI output (response.text):', response.text);
    throw new Error('Gemini AI output is not valid JSON.');
  }
}

export const basicParseCustomerInfo = (rawText: string): TAIParsedData => {
  const data: TAIParsedData = {
    name: 'N/A',
    phone: 'N/A',
    address: 'N/A',
    quantity: 0,
    codAmount: 0,
  };

  // ফোন নম্বর (বাংলাদেশ ফরম্যাট)
  const phoneMatch = rawText.match(/01[3-9]\\d{8}/);
  if (phoneMatch) {
    data.phone = phoneMatch[0];
  }

  // পরিমাণ (quantity)
  const qtyMatch = rawText.match(/পরিমাণ[:\\s]*([0-9]+)/);
  if (qtyMatch) data.quantity = parseInt(qtyMatch[1]);

  // টাকা (codAmount)
  const amountMatch = rawText.match(/টাকা[:\\s]*([0-9]+)/);
  if (amountMatch) data.codAmount = parseInt(amountMatch[1]);

  // নাম
  // Extract name until the word 'ফোন', a newline, or end of string
  const nameMatch = rawText.match(/নাম[:\s]*([\s\S]*?)(?=ফোন|\n|$)/);
  if (nameMatch) data.name = nameMatch[1].trim();

  // ঠিকানা
  const addrMatch = rawText.match(/ঠিকানা[:\\s]*([^\d]+)/);
  if (addrMatch) {
    // যদি শেষে "পরিমাণ" বা "টাকা" থাকে, remove করে দাও
    data.address = addrMatch[1].replace(/পরিমাণ.*/g, '').replace(/টাকা.*/g, '').trim();
  }

  return data;
};
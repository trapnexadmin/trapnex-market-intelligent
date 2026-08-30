export interface AIClassifiedEvent {
  sentiment: number;
  materiality: number;
  marketImpact: number;
  risk: number;
  category: string;
  rationale: string;
}

const clamp=(n:number)=>Math.max(0,Math.min(100,n));

export async function classifyWithGoogleAI(input:{
  headline:string;
  summary:string|null;
}):Promise<AIClassifiedEvent|null>{
  const apiKey=process.env.GOOGLE_AI_STUDIO_API_KEY;
  if(!apiKey) return null;

  const prompt=`Classify this financial news item as JSON only:
headline: ${input.headline}
summary: ${input.summary ?? ""}
Fields: sentiment(0-100), materiality(0-100), marketImpact(0-100), risk(0-100), category, rationale.
Do not add markdown.`;

  const response=await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        contents:[{parts:[{text:prompt}]}],
        generationConfig:{temperature:0,responseMimeType:"application/json"},
      }),
      cache:"no-store",
    },
  );

  if(!response.ok) return null;
  const data=await response.json();
  const text=data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if(typeof text!=="string") return null;

  try{
    const parsed=JSON.parse(text);
    return {
      sentiment:clamp(Number(parsed.sentiment)),
      materiality:clamp(Number(parsed.materiality)),
      marketImpact:clamp(Number(parsed.marketImpact)),
      risk:clamp(Number(parsed.risk)),
      category:String(parsed.category ?? "OTHER"),
      rationale:String(parsed.rationale ?? ""),
    };
  }catch{
    return null;
  }
}

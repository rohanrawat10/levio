import axios from "axios";

export const askAi = async(messages)=>{
    try{
if(!messages || !Array.isArray(messages) || messages.length === 0)
{
    throw new Error("Message is array is Empty");
}    
const response = await axios.post(`https://openrouter.ai/api/v1/chat/completions`,{
    model:"openai/gpt-4o-mini",
    messages:messages
},
{
   headers:{
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    'Content-Type':'aplication/json'
  },
}
);
        const content = response?.data?.choices?.[0]?.message?.content;
        if(!content || !content.trim()){
            throw new Error("AI returned empty response.")
        }
        return content;
    }
    catch(err){
         console.log("Open Router Error:",err.response?.data || err.message);
         throw new Error("Open Router Error");
    }
}
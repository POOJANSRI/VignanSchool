// Inline error capture — replaces the deleted lib/error-capture.jsx
let _lastCapturedError = null;
if (typeof process !== "undefined") {
  process.on("uncaughtException", (err) => { _lastCapturedError = err; });
  process.on("unhandledRejection", (err) => { _lastCapturedError = err instanceof Error ? err : new Error(String(err)); });
}
function consumeLastCapturedError() {
  const err = _lastCapturedError;
  _lastCapturedError = null;
  return err;
}
import { renderErrorPage } from "./lib/error-page.jsx";
import twilio from "twilio";
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let model = null;

function getGeminiModel() {
  if (!model) {
    // Safely get API key in Vite environments
    const apiKey = (typeof process !== "undefined" ? process.env?.GEMINI_API_KEY : "") || "";
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  return model;
}

async function handleTwilioWebhook(request) {
  const formData = await request.formData();
  const speechResult = formData.get("SpeechResult");
  const twiml = new twilio.twiml.VoiceResponse();
  
  if (!speechResult) {
    const gather = twiml.gather({
      input: ["speech"],
      action: "/api/call",
      method: "POST",
      language: "en-US",
      timeout: 4,
    });
    gather.say(
      { voice: "Polly.Amy" }, 
      "Hello! This is Vignan School's Parent Voice AI. We are calling to gather your feedback on your child's recent academic term. How has your experience been so far?"
    );
    twiml.say({ voice: "Polly.Amy" }, "We didn't receive any input. Goodbye!");
  } else {
    try {
      const prompt = `You are a polite, helpful AI assistant calling on behalf of Vignan School in Hyderabad. 
The parent just said: "${speechResult}"
Respond naturally and briefly as if in a phone conversation (max 2 sentences). 
If their response is brief or unclear, ask a gentle follow-up question.
If they seem done or have provided full feedback, thank them for their time, let them know we will act on it, and say goodbye.
Do not use emojis, markdown formatting, or asterisks.`;
      
      const m = getGeminiModel();
      const result = await m.generateContent(prompt);
      let textResponse = result.response.text().trim();
      textResponse = textResponse.replace(/[*#]/g, '');

      const isGoodbye = textResponse.toLowerCase().includes("goodbye") || textResponse.toLowerCase().includes("bye");

      if (isGoodbye) {
          twiml.say({ voice: "Polly.Amy" }, textResponse);
          twiml.hangup();
      } else {
          const gather = twiml.gather({
              input: ["speech"],
              action: "/api/call",
              method: "POST",
              language: "en-US",
              timeout: 4,
          });
          gather.say({ voice: "Polly.Amy" }, textResponse);
          twiml.say({ voice: "Polly.Amy" }, "We didn't hear anything. Goodbye.");
      }
    } catch (e) {
      console.error("Gemini Error:", e);
      twiml.say({ voice: "Polly.Amy" }, "I'm sorry, I'm having trouble connecting to my system. A staff member will call you back later. Goodbye.");
    }
  }

  return new Response(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}

let serverEntryPromise;

async function getServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then((m) => m.default ?? m);
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response) {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body) {
  try {
    const payload = JSON.parse(body);
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      if (url.pathname === '/api/call' && request.method === 'POST') {
        return await handleTwilioWebhook(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

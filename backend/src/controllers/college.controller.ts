import { RequestHandler } from "express";
import { collection } from "../index";
import { structuredGeminiModel } from "../utils/gemini";
import { lostOnCampus_response_schema } from "../schema/gemini.schema";
import { navigatorPrompt } from "../prompts/navigator.prompt";
import { v4 as uuidv4 } from "uuid";
import { ChatSession } from "@google/generative-ai";

interface ActiveChats {
  [chatId: string]: ChatSession;
}

let activeChats: ActiveChats = {};

export const lostOnCampusController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { user_corrdinate, chat_id, user_message } = req.body;
    let chat_instance;
    let new_chat_id = null;

    const locations = await collection.find({}).toArray();

    if (!chat_id) {
      const model = structuredGeminiModel(
        lostOnCampus_response_schema,
        navigatorPrompt(user_corrdinate, user_message, locations)
      );
      chat_instance = model.startChat({});
      new_chat_id = uuidv4();
      activeChats[new_chat_id] = chat_instance;
      console.log(`New chat instance created with ID: ${new_chat_id}`);
    } else {
      chat_instance = activeChats[chat_id];
      console.log(`Using existing chat instance with ID: ${chat_id}`);
    }

    if (!chat_instance) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (typeof chat_instance.sendMessage !== "function") {
      res.status(500).json({ message: "Chat instance is not valid" });
      return;
    }

    const result = await chat_instance.sendMessage(user_message);

    const response =
      result?.response?.candidates?.[0]?.content?.parts[0]?.text ?? null;

    if (!response) {
      res.status(500).json({ message: "Empty response from model" });
      return;
    }

    try {
      const parsedResponse = JSON.parse(response);
      res.status(200).json({ parsedResponse, chat_id: new_chat_id || chat_id });
      return;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      res.status(200).json({
        response,
        chat_id: new_chat_id || chat_id,
        parsingError: "Could not parse response as JSON",
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

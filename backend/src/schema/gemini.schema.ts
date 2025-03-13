import { SchemaType } from "@google/generative-ai";

export const lostOnCampus_response_schema = {
  description:
    "Schema for LostOnCampus, including user location, agent message, and final destination coordinates.",
  type: SchemaType.OBJECT,
  properties: {
    agent_message: {
      type: SchemaType.STRING,
      description:
        "The message from the agent providing navigation or clarification.",
    },
    final_query: {
      type: SchemaType.STRING,
      description:
        "The user's final resolved query, like the specific location they want to reach.",
    },
    final_coordinates: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.NUMBER },
      description:
        "The coordinates of the final destination in [longitude, latitude] format.",
    },
  },
  required: ["agent_message", "final_query", "final_coordinates"],
};

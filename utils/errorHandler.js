import { logger } from "./logger";

export const errorHandler = {
  handle: (error: any, interaction: any) => {
    try {
      // Log the error
      logger.error("Error occurred:", error);
      // Send a generic error message to the user
      interaction.reply({
        content: "An error occurred. Please try again later.",
        ephemeral: true,
      });
    } catch (err) {
      // Log any errors that occur during error handling
      logger.error("Error while handling error:", err);
    }
  },
};
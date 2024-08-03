import { logger } from "./logger";

export const utils = {
  validatePlayQuery: (query: string) => {
    // You can add more validation rules here based on your requirements
    if (!query || query.trim() === "") {
      logger.warn("Invalid play query: Empty query");
      return null;
    }
    return query.trim();
  },

  validateSearchQuery: (query: string) => {
    // You can add more validation rules here based on your requirements
    if (!query || query.trim() === "") {
      logger.warn("Invalid search query: Empty query");
      return null;
    }
    return query.trim();
  },
};
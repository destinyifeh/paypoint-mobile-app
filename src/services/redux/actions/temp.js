import { ADD_ARTICLE } from '../../../constants/action-types/temp'

export function addArticle(payload) {
  return { 
    type: ADD_ARTICLE, 
    payload
  }
};

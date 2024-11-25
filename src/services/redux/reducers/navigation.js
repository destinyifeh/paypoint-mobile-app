import { 
  HIDE_NAVIGATOR, 
  NAVIGATE_TO, 
  SHOW_NAVIGATOR,
  UPDATE_CURRENT_PATHNAME, 
  UPDATE_LAST_SCENE_CAPTURE,
  UPDATE_SCENE 
} from '../../../constants/action-types/navigation'


const initialState = {
  history: [],
  isNavigatorVisible: false,
  lastSceneCapture: null,
  pathName: '',
  pendingUrl: null,
  scene: 'dashboard'
};

export default function navigationReducer(state = initialState, action) {
  switch(action.type) {
    case NAVIGATE_TO:
      return {
        ...state,
        pendingUrl: action.pendingUrl
      }

    case SHOW_NAVIGATOR:
      return {
        ...state,
        isNavigatorVisible: true
      }

    case HIDE_NAVIGATOR:
      return {
        ...state,
        isNavigatorVisible: false
      }

    case UPDATE_CURRENT_PATHNAME: 
      return {
        ...state,
        pathName: action.pathName,
        history: [...state.history, action.pathName]
      }

    case UPDATE_LAST_SCENE_CAPTURE:
      return {
        ...state,
        lastSceneCapture: action.path
      }

    case UPDATE_SCENE:
      return {
        ...state,
        scene: action.scene
      }

    default: 
      return state;
  }
};

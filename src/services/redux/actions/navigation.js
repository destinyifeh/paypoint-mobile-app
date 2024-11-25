import { 
  HIDE_NAVIGATOR,
  NAVIGATE_TO, 
  SHOW_NAVIGATOR,
  UPDATE_CURRENT_PATHNAME, 
  UPDATE_LAST_SCENE_CAPTURE,
  UPDATE_SCENE 
} from '../../../constants/action-types/navigation'

export function hideNavigator() {
  return {
    type: HIDE_NAVIGATOR
  }
}

export function navigateTo(pendingUrl) {
  return {
    type: NAVIGATE_TO,
    pendingUrl
  }
}

export function showNavigator() {
  return {
    type: SHOW_NAVIGATOR
  }
}

export function updateCurrentPathName(pathName) {
  return {
    type: UPDATE_CURRENT_PATHNAME,
    pathName
  }
}

export function updateScene(scene) {
  return { 
    type: UPDATE_SCENE, 
    scene
  }
};

export function updateLastSceneCapture(path) {
  return { 
    type: UPDATE_LAST_SCENE_CAPTURE, 
    path
  }
};

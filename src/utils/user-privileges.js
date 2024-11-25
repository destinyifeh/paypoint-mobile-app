import { USER } from "../constants"
import { loadData } from "./storage"



export async function doesUserBelongToDomain(domainType, user=null) {
  const user_ = user ? user : JSON.parse(await loadData(USER) || '{}');
  return user_.domainType.toUpperCase() === domainType.toUpperCase();
}

export async function doesUserHavePermission(permission, user=null) {
  const user_ = user ? user : JSON.parse(await loadData(USER) || '{}');
  const userPermissions = user_.permissions?.map(({name}) => name);
  console.log({user_, userPermissions})
  return userPermissions?.includes(permission);
}

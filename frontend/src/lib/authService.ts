import {createAuth0Client} from "@auth0/auth0-spa-js";
import { user, isAuthenticated, popupOpen } from "./store";
import config from "./auth_config";

async function createClient() {
  let auth0Client = await createAuth0Client({
    domain: config.domain,
    clientId: config.clientId
  });

  return auth0Client;
}

async function loginWithPopup(client: any, options: any) {
  popupOpen.set(true);
  try {
    await client.loginWithPopup(options);

    user.set(await client.getUser());
    isAuthenticated.set(true);
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  } finally {
    popupOpen.set(false);
  }
}

async function loginWithRedirect(client: any, options: any) {
  try {
    await client.loginWithRedirect(options);
    user.set(await client.getUser());
    isAuthenticated.set(true);
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
  }
}

function logout(client: any) {
  return client.logout();
}

const auth = {
  createClient,
  loginWithPopup,
  logout,
  loginWithRedirect
};

export default auth;
import SockJS from "sockjs-client";
import { endsWith } from "lodash";

import {
  ConnectMessage,
  CurrentMessage,
  LoginResponse,
  Message,
  Settings,
} from "./types";

export class Config {
  baseURL?: string;
  apiKey?: string;
  
  constructor(baseURL?: string, apiKey?: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }
  
  valid(): boolean {
    console.log("baseURL: " + this.baseURL);
    console.log("apiKey: " + this.apiKey);
    return this.baseURL != undefined && this.apiKey != undefined;
  }
  
  setBaseURL(baseURL: string): Config {
    this.baseURL = baseURL;
    return this;
  }
  setAPIKey(apiKey: string): Config {
    this.apiKey = apiKey;
    return this;
  }
}

export class Client {
  config: Config;
  loggedIn: boolean = false;
  session: string = "";
  sock?: WebSocket;
  
  onConnectMesssage?: (message: ConnectMessage) => void;
  onCurrentMessage?: (message: CurrentMessage) => void;
  
  constructor(config: Config) {
    let url = config.baseURL!;
    if (endsWith(url, "/")) {
      console.log(url);
      url += "/";
    }
    console.log(url);
    this.config = config.setBaseURL(url);
  }
  
  async login(): Promise<LoginResponse | void> {
    console.log("Logging in...");
    try {
      const response = await this.request<LoginResponse>("POST", "/api/login", {
        passive: true,
      });
      this.loggedIn = true;
      this.session = response.session;
      return response;
    } catch (err: any) {
      console.log("not Logged in");
      console.error(err);
      throw err;
    }
  }
  
  startSockJSClient(): void {
    this.sock = new SockJS(this.config.baseURL + "/sockjs", undefined, {});
    this.sock.onopen = () => {
      console.log("Connected to websocket");
      this.login().then((response) => {
        this.sock!.send(
          JSON.stringify({ auth: `${response!.name}:${response!.session}` })
          );
        });
      };
      this.sock!.addEventListener("message", (ev: MessageEvent<Message>) => {
        if (ev.data.connected !== undefined) {
          if (this.onConnectMesssage !== undefined) {
            this.onConnectMesssage(ev.data.connected);
          }
        } else if (ev.data.current !== undefined) {
          if (this.onCurrentMessage !== undefined) {
            this.onCurrentMessage(ev.data.current);
          }
        } else {
          console.log("Unknown message type");
        }
      });
    }

    getSettings(): Promise<Settings> {
      return this.get("/api/settings");
    }
    
    getPrinterState(): Promise<CurrentMessage> {
      return this.get<CurrentMessage>("/api/printer");
    }
    
    get<T>(path: string): Promise<T> {
      return this.request<T>("GET", path);
    }
    
    async request<T>(method: string, path: string, data?: any): Promise<T> {
      const headers = {
        Authorization: "Bearer " + this.config.apiKey,
        "Content-Type": "application/json",
      };
      return fetch(this.config.baseURL + path, {
        method: method,
        headers: headers,
        body: data ? JSON.stringify(data) : undefined,
      }).then((resp) => {
        console.log(resp);
        // if (resp.status != 200) {
        //     throw new Error("blah")
        // }
        return resp.json() as Promise<T>;
      });
    }
  }
  
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
    }

    interface Request {
      user?: User;
    }
    // export interface Request {
    //   user?: {
    //     id: string;
    //     email: string;
    //   };
    //   testeChatGPT?: string;
    // }
  }
}

export {};

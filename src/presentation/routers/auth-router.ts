import { Router, Request, Response } from "express";

import { AuthUseCase } from "@/domain/interfaces/use-cases/auth-use-case";
import passport from "passport";

export default function AuthRouter(
  authUseCase: AuthUseCase
) {
  const router = Router();

  router.get("/google",
    passport.authenticate('google', {
      scope: ['email', 'profile'],
    }));


  router.get("/google/redirect", passport.authenticate('google'), async (req: Request, res: Response) => {
    // @ts-ignore
    const authResponse = await authUseCase.login(req.user?.id, req.user?.displayName, req.user?.emails[0]?.value);
    res.send(authResponse);
  });

  router.get("/users", async (_req: Request, res: Response) => {
    const allUsers = await authUseCase.getAllUsers();
    res.send(allUsers);
  })

  router.post("/create", async (req: Request, res: Response) => {
    const createdUser = await authUseCase.createUser(req.body.name, req.body.email);
    res.send(createdUser);
  });

  return router;
}

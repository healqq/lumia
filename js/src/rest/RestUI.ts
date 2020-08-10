import GameStateManager, { GameState } from "../GameStateManager";
import { SET_FIELD_STATE_COMMAND_NAME } from "../SetFieldStateCommand";
import express, { Express } from 'express';
import { Server } from "http";

class RestUI {

  private express: Express;
  private server?: Server;
  private gameStateManager: GameStateManager;

  constructor() {
    this.gameStateManager = new GameStateManager();
    this.express = this.createServer();
  }

  public async startServer(): Promise<void> {
    console.log('starting server');
    this.server = await new Promise((resolve) => {
      this.express.listen(80, () => {
        resolve();
      });

    });
    console.log('server is ready');
  }

  private createServer() {
    const app = express();
    app.use(express.json());
    // request logger
    app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.url}`);
      console.log(req.body);
      next();
    });
    app.post('/action', (req, res) => {
      // dummy validation
      if (!req.body.index && typeof req.body.index !== 'number')  {
        res.status(400);
        res.send({ message: '"index" is required' });
        return;
      }

      // business logic validation
      // game should be running
      if (this.gameStateManager.getState().gameState !== GameState.IN_PROGRESS)  {
        res.status(400);
        res.send({ message: 'Game is not started' });
        return;
      }

      this.gameStateManager.fireAction({
        name: SET_FIELD_STATE_COMMAND_NAME,
        params: {
          fieldIndex: req.body.index,
        }
      });

      res.send({
        isFinished: this.gameStateManager.isGameFinished(),
        state: this.gameStateManager.getState()
      });
    });

    app.post('/restart', (req, res) => {
      this.gameStateManager.restart();
      res.send(this.gameStateManager.getState());
    });

    return app;
  }
}

export default RestUI;

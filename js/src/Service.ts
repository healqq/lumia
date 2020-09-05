interface GridStateResponse {
  gameState: number;
  field: {
    layout: number[];
    state: number[];
    isFinished: boolean;
    size: number;
    length: number;
  }
}
class Service {
  private url: string = 'http://localhost';

  private async checkError(result: Response) {
    if (result.status !== 200) {
      throw new Error(JSON.stringify(await result.json()));
    }
  }

  public async sendAction(index: number): Promise<
  { state: GridStateResponse, isFinished: boolean }> {
    console.log(index);
    const result = await fetch(
      `${this.url}/action`,
      {
        method: 'POST',
        body: JSON.stringify({
          index,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    await this.checkError(result);
    return result.json();
  }

  public async sendRestart(): Promise<GridStateResponse> {
    const result = await fetch(
      `${this.url}/restart`,
      {
        method: 'POST',
      }
    );
    await this.checkError(result);
    return result.json();
  }
}

export default new Service();

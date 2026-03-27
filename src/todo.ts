
export class Todo {
  // 定義與原生端對等的通知回呼
  public onNotify?: (eventName: string, data: Record<string, any>) => void;

  async echo(value: string): Promise<string> {
    const result = `${value} from web`;
    console.log("[Todo]", `Echo called with: ${result}`);
    
    const data = {
      time: new Date().toLocaleTimeString(),
      status: 'success'
    };

    if (this.onNotify) {
      this.onNotify('updateTime', data);
    }

    return result;
  }
  
}

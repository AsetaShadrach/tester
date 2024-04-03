import { Injectable } from '@nestjs/common';
import { TimeAggregations } from './services/timeAggregation';

@Injectable()
export class AppService {
  constructor(
    // Add INject repo to allow TC id fetch
    private readonly timeAggregations: TimeAggregations,
  ){}
  getHello(): string {
    return 'Hello World!';
  }

  async getReqRespTimeDiff(response:any){
    return await this.timeAggregations.getReqRespTimeDiff(response);
  }

  async getAverageMethodCount(responseArray:any){
    return await this.timeAggregations.getAverageMethodCount(responseArray);
  }

  async getExecutionTimesPerTest(responseArray:any){
    return await this.timeAggregations.getExecutionTimesPerTest(responseArray);
  }

  async getAvgExecutionTimes(responseArray:any){
    return await this.timeAggregations.getAvgExecutionTimes(responseArray);
  }

  async getAvgExecutionTimesPerMethod(responseArray:any){
    return await this.timeAggregations.getAvgExecutionTimesPerMethod(responseArray);
  }

  async compareVsTimeTresholds(parentId:any){
    return await this.timeAggregations.compareVsTimeTresholds(parentId);
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/getReqRespTimeDiff') 
  async getReqRespTimeDiff(@Body() responseData:any){
    return await this.appService.getReqRespTimeDiff(responseData);
  }

  @Post('/getAverageMethodCount') 
  async getAverageMethodCount(@Body() responseBody:any){
    return await this.appService.getAverageMethodCount(responseBody.responseArray);
  }

  @Post('/getExecutionTimesPerTest') 
  async getExecutionTimesPerTest(@Body() responseBody:any){
    return await this.appService.getExecutionTimesPerTest(responseBody.responseArray);
  }


  @Post('/getAvgExecutionTimes') 
  async getAvgExecutionTimes(@Body() responseBody:any){
    return await this.appService.getAvgExecutionTimes(responseBody.responseArray);
  }

  @Post('/getAvgExecutionTimesPerMethod') 
  async getAvgExecutionTimesPerMethod(@Body() responseBody:any){
    return await this.appService.getAvgExecutionTimesPerMethod(responseBody.responseArray);
  }

  @Post('compareVsTimeTresholds') 
  async compareVsTimeTresholds(@Body() body:any){
    return await this.appService.compareVsTimeTresholds(body.parentId);
  }
}

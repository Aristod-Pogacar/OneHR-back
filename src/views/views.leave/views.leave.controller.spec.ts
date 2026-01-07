import { Test, TestingModule } from '@nestjs/testing';
import { ViewsLeaveController } from './views.leave.controller';

describe('ViewsLeaveController', () => {
  let controller: ViewsLeaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewsLeaveController],
    }).compile();

    controller = module.get<ViewsLeaveController>(ViewsLeaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

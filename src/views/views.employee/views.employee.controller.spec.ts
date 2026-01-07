import { Test, TestingModule } from '@nestjs/testing';
import { ViewsEmployeeController } from './views.employee.controller';

describe('ViewsEmployeeController', () => {
  let controller: ViewsEmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewsEmployeeController],
    }).compile();

    controller = module.get<ViewsEmployeeController>(ViewsEmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

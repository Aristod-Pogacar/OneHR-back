import { Test, TestingModule } from '@nestjs/testing';
import { ViewsDashboardController } from './views.dashboard.controller';

describe('ViewsDashboardController', () => {
  let controller: ViewsDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewsDashboardController],
    }).compile();

    controller = module.get<ViewsDashboardController>(ViewsDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

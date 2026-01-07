import { Test, TestingModule } from '@nestjs/testing';
import { ViewsSystemConfigController } from './views.system.config.controller';

describe('ViewsSystemConfigController', () => {
  let controller: ViewsSystemConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewsSystemConfigController],
    }).compile();

    controller = module.get<ViewsSystemConfigController>(ViewsSystemConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

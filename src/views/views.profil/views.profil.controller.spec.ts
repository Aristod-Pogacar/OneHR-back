import { Test, TestingModule } from '@nestjs/testing';
import { ViewsProfilController } from './views.profil.controller';

describe('ViewsProfilController', () => {
  let controller: ViewsProfilController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViewsProfilController],
    }).compile();

    controller = module.get<ViewsProfilController>(ViewsProfilController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ViewsProfilService } from './views.profil.service';

describe('ViewsProfilService', () => {
  let service: ViewsProfilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewsProfilService],
    }).compile();

    service = module.get<ViewsProfilService>(ViewsProfilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Shop } from 'src/modules/shops/schemas/shop.schema';
import { ShopsRepo } from 'src/modules/shops/shops.repo';
import { User } from 'src/modules/users/schemas/user.scheme';
import { UsersRepo } from 'src/modules/users/users.repo';
import { SHOP_SAMPLES } from './sample/shop.samples';
import { USER_SAMPLES } from './sample/user.samples';

@Injectable()
export class DatabasesService implements OnModuleInit {

    private readonly logger = new Logger(DatabasesService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly shopsRepo: ShopsRepo,
        private readonly usersRepo: UsersRepo,
    ) { }

    async onModuleInit() {
        this.logger.log('>>> STARTING ON MODULE INIT...');
        const isInit = this.configService.get<boolean>('SHOULD_INIT');
        if (isInit) {
            await this.initSamples(Shop.name, this.shopsRepo, SHOP_SAMPLES());
            await this.initSamples(User.name, this.usersRepo, await USER_SAMPLES(this.configService));
            //await this.initSamples('CATEGORY', this.typesRepo, CATEGORY_SAMPLES());
        }
    }

    async initSamples<T>(
        nameModules: string,
        repo: {
            count: () => Promise<number>;
            insertMany: (data: T[]) => Promise<void>;
        },
        data: T[],
    ): Promise<void> {
        const count = await repo.count();
        if (count === 0) {
            await repo.insertMany(data); // bulk create
            this.logger.log(`>>> THE ${nameModules.toUpperCase()} SAMPLES HAS INITIALIZED`);
        }
    }

}

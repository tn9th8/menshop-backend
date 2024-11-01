import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RolesRepository } from 'src/modules/roles/roles.repository';
import { Role } from 'src/modules/roles/schemas/role.schema';
import { Shop } from 'src/modules/shops/schemas/shop.schema';
import { ShopsRepository } from 'src/modules/shops/shops.repository';
import { UserKey } from 'src/modules/user-keys/schemas/user-keys.schema';
import { UserKeysRepository } from 'src/modules/user-keys/user-keys.repository';
import { User } from 'src/modules/users/schemas/user.schema';
import { UsersRepository } from 'src/modules/users/users.repository';
import { ROLE_SAMPLES } from './sample/role.samples';
import { SHOP_SAMPLES } from './sample/shop.samples';
import { USER_KEYS_SAMPLES } from './sample/user-keys.samples';
import { USER_SAMPLES } from './sample/user.samples';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name);
    constructor(
        private readonly configService: ConfigService,
        private readonly shopsRepo: ShopsRepository,
        private readonly rolesRepo: RolesRepository,
        private readonly usersRepo: UsersRepository,
        private readonly userKeysRepo: UserKeysRepository,
    ) { }

    async onModuleInit() {
        this.logger.log('>>> STARTING ON MODULE INIT...');
        const isInit = this.configService.get<boolean>('SHOULD_INIT');
        if (isInit) {
            await this.initSamples(Role.name, this.rolesRepo, ROLE_SAMPLES());
            await this.initSamples(User.name, this.usersRepo, await USER_SAMPLES(this.configService));
            await this.initSamples(UserKey.name, this.userKeysRepo, USER_KEYS_SAMPLES());
            await this.initSamples(Shop.name, this.shopsRepo, SHOP_SAMPLES());
        }
    }

    async initSamples<T>(
        module: string,
        repository: {
            count: () => Promise<number>;
            insertMany: (data: T[]) => Promise<void>;
        },
        data: T[],
    ): Promise<void> {
        const count = await repository.count();
        if (count === 0) {
            await repository.insertMany(data); // bulk create
            this.logger.log(`>>> THE ${module.toUpperCase()} SAMPLES HAS INITIALIZED`);
        }
    }

}
